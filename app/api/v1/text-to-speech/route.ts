import { NextRequest, NextResponse } from "next/server"
import { verifyApiToken } from "@/app/actions/api-tokens"
import { createAdminClient } from "@/lib/supabase/server"
import { getActiveProviderApiKey } from "@/lib/admin-api-keys"
import { checkRateLimit } from "@/lib/rate-limit"

const NOVITA_BASE_URL = process.env.NOVITA_BASE_URL || "https://api.novita.ai/v3"
const DEFAULT_TTS_MODEL_SLUG = "minimax-speech-2.8-turbo"
const DEFAULT_PRICE_PER_1K_CHARS_USD = 0.001

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
      voice?: string
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

    const requestedModelSlug =
      typeof model === "string" && model.trim().length > 0
        ? model.trim()
        : DEFAULT_TTS_MODEL_SLUG
    const adminSupabase = await createAdminClient()
    const userId = tokenInfo.user_id

    const rateLimit = await checkRateLimit(userId, "tts")
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
    let effectiveModelSlug = DEFAULT_TTS_MODEL_SLUG
    let pricingUnit = "1k characters"
    let isPer1kCharacters = true
    let unitPrice = DEFAULT_PRICE_PER_1K_CHARS_USD

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
      } else if (pricingRow) {
        const normalizedPriceUnit = String(pricingRow.price_unit ?? "").trim().toLowerCase()
        const isPerCharacter =
          normalizedPriceUnit === "character" ||
          normalizedPriceUnit === "char" ||
          normalizedPriceUnit === "characters"
        const isPer1kCharsFromCatalog =
          normalizedPriceUnit === "1k chars" ||
          normalizedPriceUnit === "1k char" ||
          normalizedPriceUnit === "1k characters" ||
          normalizedPriceUnit === "1000 chars" ||
          normalizedPriceUnit === "1000 characters"

        if (pricingRow.currency === "USD" && (isPerCharacter || isPer1kCharsFromCatalog)) {
          pricingUnit = pricingRow.price_unit
          isPer1kCharacters = isPer1kCharsFromCatalog
          const catalogUnitPrice = Math.max(
            Number(pricingRow.input_price ?? 0),
            Number(pricingRow.output_price ?? 0),
            0,
          )
          if (Number.isFinite(catalogUnitPrice) && catalogUnitPrice > 0) {
            unitPrice = catalogUnitPrice
          }
        }
      }
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

    if (typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Missing text",
          code: "MISSING_TEXT",
          message: "Provide non-empty 'text' to synthesize speech.",
        },
        { status: 400 },
      )
    }

    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      return NextResponse.json(
        {
          error: "Invalid pricing configuration",
          code: "INVALID_PRICING",
          message: "Model pricing is not configured with a positive rate.",
        },
        { status: 500 },
      )
    }

    const cost = isPer1kCharacters ? (textLength / 1000) * unitPrice : textLength * unitPrice

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

    const providerPayload = {
      ...body,
      text,
      text_file_id: body.text_file_id ?? 0,
      voice_modify: body.voice_modify ?? {
        pitch: -100,
        timbre: -100,
        intensity: -100,
      },
      audio_setting: body.audio_setting ?? {
        format: "mp3",
        bitrate: 128000,
        channel: 2,
        audio_sample_rate: 32000,
      },
      voice_setting: body.voice_setting ?? {
        vol: 1,
        pitch: 0,
        speed: 1,
        voice_id: "English_Graceful_Lady",
      },
      aigc_watermark: body.aigc_watermark ?? false,
      language_boost: body.language_boost ?? "English",
      continuous_sound: body.continuous_sound ?? true,
    }

    const response = await fetch(`${NOVITA_BASE_URL}/${resolvedModelPath.replace(/^\/+/, "")}`, {
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

    let providerResponseBody: any = null
    let providerError: string | null = null
    let usedProviderFallback = false

    if (response.ok) {
      providerResponseBody = payload
      providerError = null
    } else {
      providerError =
        (typeof payload === "object" && payload && (payload.error?.message || payload.error || payload.message)) ||
        (typeof payload === "string" ? payload : response.statusText)
    }

    if (!providerResponseBody) {
      usedProviderFallback = true
      providerResponseBody = {
        success: true,
        provider_fallback: true,
        message: "Text-to-speech provider unavailable, returned fallback response.",
        provider_error: providerError || "Unknown provider error",
        audio_url: null,
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
      description: `Text-to-speech usage - model ${requestedModelSlug}`,
      status: "completed",
      metadata: {
        source: "api",
        token_id: tokenInfo.id,
        model_slug: effectiveModelSlug,
        catalog_model_id: catalogModelId,
        characters_billed: textLength,
        pricing_unit: pricingUnit,
        unit_price_usd: unitPrice,
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
      service_type: "text_to_speech",
      endpoint: "tts",
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
      ...(typeof providerResponseBody === "object" && providerResponseBody
        ? providerResponseBody
        : {
            success: true,
            data: providerResponseBody,
          }),
      billing: {
        cost_usd: cost,
        pricing_unit: pricingUnit,
        unit_price_usd: unitPrice,
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

