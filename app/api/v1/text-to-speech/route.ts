import { NextRequest, NextResponse } from "next/server"
import { verifyApiToken } from "@/app/actions/api-tokens"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error: "Missing or invalid Authorization header",
          code: "MISSING_AUTH_HEADER",
          message: 'Use Authorization: Bearer ptr_your_api_token',
        },
        { status: 401 },
      )
    }

    const apiToken = authHeader.split(" ")[1]
    const tokenInfo = await verifyApiToken(apiToken)

    if (!tokenInfo) {
      return NextResponse.json(
        {
          error: "Invalid API token",
          code: "INVALID_TOKEN",
          message: "The provided API token is invalid, expired, or inactive",
        },
        { status: 401 },
      )
    }

    const body = await request.json().catch(() => null)

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          error: "Invalid request body",
          code: "INVALID_BODY",
          message: "Expected a JSON body with model and text",
        },
        { status: 400 },
      )
    }

    const { model, text, characters } = body as {
      model?: string
      text?: string
      characters?: number
    }

    if (!model || typeof model !== "string" || model.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Missing model",
          code: "MISSING_MODEL",
          message: "Provide a model slug in the 'model' field",
        },
        { status: 400 },
      )
    }

    const requestedModelSlug = model.trim()
    const adminSupabase = await createAdminClient()
    const userId = tokenInfo.user_id

    const { data: catalogModel, error: catalogError } = await adminSupabase
      .from("ai_models")
      .select("id, slug, status, is_active")
      .eq("slug", requestedModelSlug)
      .maybeSingle()

    if (catalogError) {
      console.error("Error loading model from catalog:", catalogError)
    }

    if (!catalogModel) {
      return NextResponse.json(
        {
          error: "Unknown model",
          code: "MODEL_NOT_FOUND",
          message: `The requested model "${requestedModelSlug}" does not exist in the catalog.`,
        },
        { status: 400 },
      )
    }

    if (catalogModel.status !== "active" || catalogModel.is_active === false) {
      return NextResponse.json(
        {
          error: "Model is not available",
          code: "MODEL_UNAVAILABLE",
          message: `The requested model "${requestedModelSlug}" is currently ${catalogModel.status}.`,
        },
        { status: 400 },
      )
    }

    const { data: pricingRow, error: pricingError } = await adminSupabase
      .from("ai_model_pricing")
      .select("input_price, output_price, price_unit, currency")
      .eq("model_id", catalogModel.id)
      .maybeSingle()

    if (pricingError || !pricingRow) {
      console.error("Error loading model pricing:", pricingError)
      return NextResponse.json(
        {
          error: "Pricing unavailable",
          code: "PRICING_MISSING",
          message: "Pricing information for this model is not configured.",
        },
        { status: 500 },
      )
    }

    if (pricingRow.currency !== "USD" || pricingRow.price_unit !== "character") {
      return NextResponse.json(
        {
          error: "Unsupported pricing unit",
          code: "UNSUPPORTED_UNIT",
          message: "Text-to-speech endpoint expects models priced per character in USD.",
        },
        { status: 500 },
      )
    }

    const textLength =
      typeof text === "string" && text.length > 0
        ? text.length
        : typeof characters === "number" && Number.isFinite(characters) && characters > 0
          ? characters
          : NaN

    if (!Number.isFinite(textLength) || textLength <= 0) {
      return NextResponse.json(
        {
          error: "Missing or invalid text/characters",
          code: "INVALID_CHARACTERS",
          message: "Provide 'text' or a positive 'characters' count so we can bill correctly.",
        },
        { status: 400 },
      )
    }

    const perCharacter = Math.max(
      Number(pricingRow.input_price ?? 0),
      Number(pricingRow.output_price ?? 0),
      0,
    )

    if (!Number.isFinite(perCharacter) || perCharacter <= 0) {
      return NextResponse.json(
        {
          error: "Invalid pricing configuration",
          code: "INVALID_PRICING",
          message: "Model pricing is not configured with a positive per-character rate.",
        },
        { status: 500 },
      )
    }

    const { data: creditsRow, error: creditsError } = await adminSupabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle()

    if (creditsError) {
      console.error("Error fetching user credits:", creditsError)
      return NextResponse.json(
        {
          error: "Failed to check credits",
          code: "CREDITS_LOOKUP_FAILED",
          message: "Could not verify your current credit balance",
        },
        { status: 500 },
      )
    }

    const currentBalance = Number.parseFloat(String(creditsRow?.balance ?? 0))

    if (!Number.isFinite(currentBalance) || currentBalance <= 0) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          code: "INSUFFICIENT_CREDITS",
          message: "Your balance is 0. Please top up credits to use the API.",
          current_balance: 0,
        },
        { status: 402 },
      )
    }

    const cost = textLength * perCharacter

    if (!Number.isFinite(cost) || cost <= 0) {
      return NextResponse.json(
        {
          error: "Invalid cost calculation",
          code: "INVALID_COST",
          message: "Calculated cost for this request is not valid.",
        },
        { status: 500 },
      )
    }

    const freshBalanceRow = await adminSupabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle()

    if (freshBalanceRow.error) {
      console.error("Error re-checking user credits:", freshBalanceRow.error)
      return NextResponse.json(
        {
          error: "Failed to verify credits",
          code: "CREDITS_RECHECK_FAILED",
          message: "Could not verify your current credit balance",
        },
        { status: 500 },
      )
    }

    const freshBalance = Number.parseFloat(String(freshBalanceRow.data?.balance ?? 0))

    if (!Number.isFinite(freshBalance) || freshBalance < cost) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          code: "INSUFFICIENT_CREDITS",
          message: "Your credit balance is too low to cover this request.",
          current_balance: freshBalance,
          required: cost,
        },
        { status: 402 },
      )
    }

    const { error: txError } = await adminSupabase.from("credit_transactions").insert({
      user_id: userId,
      type: "usage",
      amount: cost,
      description: `Text-to-speech usage - model ${requestedModelSlug}`,
      status: "completed",
      metadata: {
        source: "api",
        token_id: tokenInfo.id,
        model_slug: requestedModelSlug,
        characters_billed: textLength,
        price_per_character_usd: perCharacter,
      },
    })

    if (txError) {
      console.error("Error recording credit transaction:", txError)
      return NextResponse.json(
        {
          error: "Failed to record usage transaction",
          code: "USAGE_TRANSACTION_FAILED",
          message: "Your request could not be billed correctly. No credits were deducted.",
        },
        { status: 500 },
      )
    }

    const { error: usageLogError } = await adminSupabase.from("usage_logs").insert({
      user_id: userId,
      service_type: "text_to_speech",
      tokens_used: null,
      cost,
      model_used: requestedModelSlug,
      request_id: null,
    })

    if (usageLogError) {
      console.error("Error recording usage log:", usageLogError)
    }

    return NextResponse.json({
      success: true,
      message: "Text-to-speech request accepted (provider integration not yet implemented).",
      billing: {
        cost_usd: cost,
        price_per_character_usd: perCharacter,
      },
    })
  } catch (error) {
    console.error("Text-to-speech API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred while processing your request",
      },
      { status: 500 },
    )
  }
}

