import { NextRequest, NextResponse } from "next/server"
import { verifyApiToken } from "@/app/actions/api-tokens"
import { createAdminClient } from "@/lib/supabase/server"
import { getActiveProviderApiKey } from "@/lib/admin-api-keys"
import { checkRateLimit } from "@/lib/rate-limit"

const NOVITA_BASE_URL = process.env.NOVITA_BASE_URL || "https://api.novita.ai/v3"
const DEFAULT_TEXT_TO_VIDEO_MODEL_SLUG = "wan-t2v"
const DEFAULT_IMAGE_TO_VIDEO_MODEL_SLUG = "wan-i2v"
const DEFAULT_PRICE_PER_SECOND_USD = 0.001

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
          message: "Expected a JSON body with model and duration_seconds",
        },
        { status: 400 },
      )
    }

    const { model, duration_seconds } = body as {
      model?: string
      duration_seconds?: number
      prompt?: string
    }

    const providerApiKey =
      (await getActiveProviderApiKey("novita")) ||
      process.env.NOVITA_API_KEY ||
      (await getActiveProviderApiKey("models_lab")) ||
      process.env.MODELSLAB_API_KEY
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

    const imageUrl =
      typeof body.image_url === "string" && body.image_url.trim().length > 0
        ? body.image_url.trim()
        : null

    const requestedModelSlug =
      typeof model === "string" && model.trim().length > 0
        ? model.trim()
        : imageUrl
          ? DEFAULT_IMAGE_TO_VIDEO_MODEL_SLUG
          : DEFAULT_TEXT_TO_VIDEO_MODEL_SLUG
    const adminSupabase = await createAdminClient()
    const userId = tokenInfo.user_id

    const rateLimit = await checkRateLimit(userId, "video")
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          code: "RATE_LIMIT_EXCEEDED",
          message: rateLimit.reason || "Too many requests",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter ?? 60),
            ...(typeof rateLimit.limit === "number" ? { "X-RateLimit-Limit": String(rateLimit.limit) } : {}),
            ...(typeof rateLimit.remaining === "number" ? { "X-RateLimit-Remaining": String(rateLimit.remaining) } : {}),
            ...(rateLimit.resetAt ? { "X-RateLimit-Reset": rateLimit.resetAt.toISOString() } : {}),
          },
        },
      )
    }

    let catalogModelId: string | null = null
    let effectiveModelSlug = imageUrl ? DEFAULT_IMAGE_TO_VIDEO_MODEL_SLUG : DEFAULT_TEXT_TO_VIDEO_MODEL_SLUG
    let perSecond = DEFAULT_PRICE_PER_SECOND_USD

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

      catalogModelId = catalogModel.id
      effectiveModelSlug = catalogModel.slug || requestedModelSlug

      const { data: pricingRow, error: pricingError } = await adminSupabase
        .from("ai_model_pricing")
        .select("input_price, output_price, price_unit, currency")
        .eq("model_id", catalogModel.id)
        .maybeSingle()

      if (pricingError) {
        console.error("Error loading model pricing:", pricingError)
      } else if (pricingRow && pricingRow.currency === "USD" && pricingRow.price_unit === "second") {
        const catalogPerSecond = Math.max(
          Number(pricingRow.input_price ?? 0),
          Number(pricingRow.output_price ?? 0),
          0,
        )
        if (Number.isFinite(catalogPerSecond) && catalogPerSecond > 0) {
          perSecond = catalogPerSecond
        }
      }
    }

    const durationSeconds =
      typeof duration_seconds === "number" && Number.isFinite(duration_seconds) && duration_seconds > 0
        ? duration_seconds
        : NaN

    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
      return NextResponse.json(
        {
          error: "Missing or invalid duration_seconds",
          code: "INVALID_DURATION",
          message: "Provide the video duration in seconds via 'duration_seconds' so we can bill correctly.",
        },
        { status: 400 },
      )
    }

    if (!Number.isFinite(perSecond) || perSecond <= 0) {
      return NextResponse.json(
        {
          error: "Invalid pricing configuration",
          code: "INVALID_PRICING",
          message: "Model pricing is not configured with a positive per-second rate.",
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

    const cost = durationSeconds * perSecond

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

    const resolvedModelPath = effectiveModelSlug.startsWith("async/")
      ? effectiveModelSlug
      : `async/${effectiveModelSlug}`

    const providerPayload = imageUrl
      ? {
          ...body,
          seed: body.seed ?? 12345,
          steps: body.steps ?? 30,
          width: body.width ?? 832,
          height: body.height ?? 480,
          prompt: body.prompt,
          fast_mode: body.fast_mode ?? false,
          image_url: imageUrl,
          watermark: body.watermark ?? false,
          flow_shift: body.flow_shift ?? 1,
          guidance_scale: body.guidance_scale ?? 5,
          enable_safety_checker: body.enable_safety_checker ?? true,
        }
      : {
          ...body,
          seed: body.seed ?? 12345,
          steps: body.steps ?? 30,
          width: body.width ?? 1280,
          height: body.height ?? 720,
          prompt: body.prompt,
          fast_mode: body.fast_mode ?? false,
          watermark: body.watermark ?? false,
          flow_shift: body.flow_shift ?? 5,
          guidance_scale: body.guidance_scale ?? 5,
          negative_prompt: body.negative_prompt ?? "blurry, low quality, distorted, watermark, text",
          enable_safety_checker: body.enable_safety_checker ?? false,
        }

    const providerResponse = await fetch(`${NOVITA_BASE_URL}/${resolvedModelPath.replace(/^\/+/, "")}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerApiKey}`,
      },
      body: JSON.stringify(providerPayload),
    })

    const providerContentType = providerResponse.headers.get("content-type") || ""
    const providerResponsePayload = providerContentType.includes("application/json")
      ? await providerResponse.json().catch(() => null)
      : await providerResponse.text().catch(() => null)

    let providerPayloadNormalized = providerResponsePayload
    let usedProviderFallback = false

    if (!providerResponse.ok) {
      const providerError =
        (typeof providerResponsePayload === "object" && providerResponsePayload &&
          (providerResponsePayload.error?.message || providerResponsePayload.error || providerResponsePayload.message)) ||
        (typeof providerResponsePayload === "string" ? providerResponsePayload : providerResponse.statusText)

      usedProviderFallback = true
      providerPayloadNormalized = {
        success: true,
        provider_fallback: true,
        message: "Video provider unavailable, returned fallback response.",
        provider_error: providerError || "Unknown provider error",
        status: "accepted",
      }
    }

    const providerRequestId =
      (typeof providerPayloadNormalized === "object" && providerPayloadNormalized &&
        (providerPayloadNormalized.id || providerPayloadNormalized.request_id)) ||
      null

    const { error: txError } = await adminSupabase.from("credit_transactions").insert({
      user_id: userId,
      type: "usage",
      amount: cost,
      description: `Video generation usage - model ${requestedModelSlug}`,
      status: "completed",
      metadata: {
        source: "api",
        token_id: tokenInfo.id,
        model_slug: effectiveModelSlug,
        catalog_model_id: catalogModelId,
        duration_seconds: durationSeconds,
        price_per_second_usd: perSecond,
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
      service_type: "video_generation",
      endpoint: "video",
      tokens_used: null,
      cost,
      cost_usd: cost,
      model_used: effectiveModelSlug,
      request_id: providerRequestId,
    })

    if (usageLogError) {
      console.error("Error recording usage log:", usageLogError)
    }

    return NextResponse.json({
      ...(typeof providerPayloadNormalized === "object" && providerPayloadNormalized
        ? providerPayloadNormalized
        : {
            success: true,
            data: providerPayloadNormalized,
          }),
      billing: {
        cost_usd: cost,
        price_per_second_usd: perSecond,
      },
    })
  } catch (error) {
    console.error("Video generation API error:", error)
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

