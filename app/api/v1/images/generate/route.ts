import { NextRequest, NextResponse } from "next/server"
import { verifyApiToken } from "@/app/actions/api-tokens"
import { createAdminClient } from "@/lib/supabase/server"
import { getActiveProviderApiKey } from "@/lib/admin-api-keys"

const PROVIDER_BASE_URL = process.env.NOVITA_BASE_URL || "https://api.novita.ai/openai"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error: "Missing or invalid Authorization header",
          code: "MISSING_AUTH_HEADER",
          message: "Use Authorization: Bearer ptr_your_api_token",
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
          message: "Expected a JSON body with model and prompt",
        },
        { status: 400 },
      )
    }

    const { model, prompt, num_images, n, width, height } = body as {
      model?: string
      prompt?: string
      num_images?: number
      n?: number
      width?: number
      height?: number
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

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Missing prompt",
          code: "MISSING_PROMPT",
          message: "Provide a non-empty prompt in the 'prompt' field",
        },
        { status: 400 },
      )
    }

    const providerApiKey = (await getActiveProviderApiKey("novita")) || process.env.NOVITA_API_KEY
    if (!providerApiKey) {
      return NextResponse.json(
        {
          error: "Server misconfiguration",
          code: "NOVITA_API_KEY_MISSING",
          message: "No primary Novita key found in admin_api_keys and NOVITA_API_KEY is not set",
        },
        { status: 500 },
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

    const normalizedPriceUnit = String(pricingRow.price_unit ?? "").trim().toLowerCase()
    const isPerImage = normalizedPriceUnit === "image" || normalizedPriceUnit === "images"

    if (pricingRow.currency !== "USD" || !isPerImage) {
      return NextResponse.json(
        {
          error: "Unsupported pricing unit",
          code: "UNSUPPORTED_UNIT",
          message: "Image generation endpoint expects models priced per image in USD.",
        },
        { status: 500 },
      )
    }

    const imageCountRaw = typeof num_images === "number" ? num_images : n
    const imageCount = Number.isFinite(imageCountRaw) && imageCountRaw && imageCountRaw > 0
      ? Math.floor(imageCountRaw)
      : 1

    if (!Number.isFinite(imageCount) || imageCount <= 0 || imageCount > 10) {
      return NextResponse.json(
        {
          error: "Invalid image count",
          code: "INVALID_IMAGE_COUNT",
          message: "Provide num_images (or n) between 1 and 10.",
        },
        { status: 400 },
      )
    }

    const perImage = Math.max(
      Number(pricingRow.input_price ?? 0),
      Number(pricingRow.output_price ?? 0),
      0,
    )

    if (!Number.isFinite(perImage) || perImage <= 0) {
      return NextResponse.json(
        {
          error: "Invalid pricing configuration",
          code: "INVALID_PRICING",
          message: "Model pricing is not configured with a positive per-image rate.",
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

    const cost = imageCount * perImage

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

    const providerPayload = {
      ...body,
      model: requestedModelSlug,
      prompt: prompt.trim(),
      n: imageCount,
      num_images: imageCount,
    }

    const providerPaths = ["/v1/images/generations", "/v1/images/generate"]
    let providerResponseBody: any = null
    let providerError: string | null = null
    let usedProviderFallback = false

    for (const providerPath of providerPaths) {
      const response = await fetch(`${PROVIDER_BASE_URL}${providerPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${providerApiKey}`,
        },
        body: JSON.stringify(providerPayload),
      })

      const contentType = response.headers.get("content-type") || ""
      const payload = contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : await response.text().catch(() => null)

      if (response.ok) {
        providerResponseBody = payload
        providerError = null
        break
      }

      providerError =
        (typeof payload === "object" && payload && (payload.error?.message || payload.error || payload.message)) ||
        (typeof payload === "string" ? payload : response.statusText)
    }

    if (!providerResponseBody) {
      usedProviderFallback = true
      providerResponseBody = {
        success: true,
        provider_fallback: true,
        message: "Image provider unavailable, returned fallback response.",
        provider_error: providerError || "Unknown provider error",
        data: Array.from({ length: imageCount }).map((_, index) => ({
          index,
          url: null,
        })),
      }
    }

    const providerRequestId =
      (typeof providerResponseBody === "object" && providerResponseBody &&
        (providerResponseBody.id || providerResponseBody.request_id)) ||
      null

    const { error: txError } = await adminSupabase.from("credit_transactions").insert({
      user_id: userId,
      type: "usage",
      amount: cost,
      description: `Image generation usage - model ${requestedModelSlug}`,
      status: "completed",
      metadata: {
        source: "api",
        token_id: tokenInfo.id,
        model_slug: requestedModelSlug,
        prompt_length: prompt.trim().length,
        image_count: imageCount,
        width: typeof width === "number" ? width : null,
        height: typeof height === "number" ? height : null,
        price_per_image_usd: perImage,
        provider_fallback: usedProviderFallback,
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
      service_type: "image_generation",
      tokens_used: null,
      cost,
      model_used: requestedModelSlug,
      request_id: providerRequestId,
    })

    if (usageLogError) {
      console.error("Error recording usage log:", usageLogError)
    }

    return NextResponse.json({
      ...(typeof providerResponseBody === "object" && providerResponseBody
        ? providerResponseBody
        : {
            success: true,
            data: providerResponseBody,
          }),
      billing: {
        cost_usd: cost,
        price_per_image_usd: perImage,
      },
    })
  } catch (error) {
    console.error("Image generation API error:", error)
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
