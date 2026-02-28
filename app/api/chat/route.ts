import { NextRequest, NextResponse } from "next/server"
import { NovitaAI } from "@/lib/chat-api"
import { verifyApiToken } from "@/app/actions/api-tokens"
import { createAdminClient } from "@/lib/supabase/server"
import { getActiveProviderApiKey } from "@/lib/admin-api-keys"

const PRICE_PER_1K_TOKENS_USD = 0.001

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
          message: "Expected a JSON object with model and messages",
        },
        { status: 400 },
      )
    }

    const { model, messages, max_tokens, temperature } = body as {
      model?: string
      messages?: Array<{ role: string; content: string }>
      max_tokens?: number
      temperature?: number
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        {
          error: "Missing messages",
          code: "MISSING_MESSAGES",
          message: "Provide a non-empty messages array",
        },
        { status: 400 },
      )
    }

    const apiKey = (await getActiveProviderApiKey("novita")) || process.env.NOVITA_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Server misconfiguration",
          code: "NOVITA_API_KEY_MISSING",
          message: "No active Novita key found in admin_api_keys and NOVITA_API_KEY is not set",
        },
        { status: 500 },
      )
    }

    const adminSupabase = await createAdminClient()
    const userId = tokenInfo.user_id

    const requestedModelSlug =
      typeof model === "string" && model.trim().length > 0
        ? model.trim()
        : "deepseek/deepseek-v3-0324"

    let pricePer1kTokensUsd = PRICE_PER_1K_TOKENS_USD
    let pricingMeta:
      | {
          slug: string
          input_price: number
          output_price: number
          price_unit: string
        }
      | null = null

    const { data: catalogModel, error: catalogError } = await adminSupabase
      .from("ai_models")
      .select("id, slug, status, is_active")
      .eq("slug", requestedModelSlug)
      .maybeSingle()

    if (catalogError) {
      console.error("Error loading model from catalog:", catalogError)
    }

    if (catalogModel) {
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

      if (pricingError) {
        console.error("Error loading model pricing:", pricingError)
      } else if (pricingRow && pricingRow.price_unit === "1K tokens" && pricingRow.currency === "USD") {
        const inputPrice = Number(pricingRow.input_price ?? 0)
        const outputPrice = Number(pricingRow.output_price ?? 0)
        const maxPrice = Math.max(inputPrice, outputPrice, 0)

        if (Number.isFinite(maxPrice) && maxPrice > 0) {
          pricePer1kTokensUsd = maxPrice
          pricingMeta = {
            slug: catalogModel.slug,
            input_price: inputPrice,
            output_price: outputPrice,
            price_unit: pricingRow.price_unit,
          }
        }
      }
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

    const client = new NovitaAI(apiKey)

    const completion = await client.createChatCompletion({
      model: requestedModelSlug,
      messages: messages as any,
      max_tokens,
      temperature,
      stream: false,
    })

    const usage = completion.usage
    const totalTokens = Number(usage?.total_tokens ?? 0)
    const cost =
      totalTokens > 0
        ? (totalTokens / 1000) * pricePer1kTokensUsd
        : pricePer1kTokensUsd

    const { data: freshCreditsRow, error: freshCreditsError } = await adminSupabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle()

    if (freshCreditsError) {
      console.error("Error re-checking user credits:", freshCreditsError)
      return NextResponse.json(
        {
          error: "Failed to verify credits",
          code: "CREDITS_RECHECK_FAILED",
          message: "Could not verify your current credit balance",
        },
        { status: 500 },
      )
    }

    const freshBalance = Number.parseFloat(String(freshCreditsRow?.balance ?? 0))

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
      description: `Chat API usage - model ${completion.model}`,
      status: "completed",
      metadata: {
        source: "api",
        token_id: tokenInfo.id,
        response_id: completion.id,
        total_tokens: totalTokens,
        prompt_tokens: usage?.prompt_tokens ?? null,
        completion_tokens: usage?.completion_tokens ?? null,
        price_per_1k_tokens_usd: PRICE_PER_1K_TOKENS_USD,
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
      service_type: "chat",
      tokens_used: totalTokens || null,
      cost,
      model_used: completion.model,
      request_id: completion.id,
    })

    if (usageLogError) {
      console.error("Error recording usage log:", usageLogError)
    }

    return NextResponse.json({
      ...completion,
      billing: {
        cost_usd: cost,
        price_per_1k_tokens_usd: pricePer1kTokensUsd,
        ...(pricingMeta
          ? {
              catalog_pricing: pricingMeta,
            }
          : {}),
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
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

