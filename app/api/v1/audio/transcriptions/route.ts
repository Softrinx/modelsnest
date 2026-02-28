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

    const formData = await request.formData()
    const model = formData.get("model")
    const durationSecondsRaw = formData.get("duration_seconds")
    const audioUrl = formData.get("audio_url")
    const audioFile = formData.get("file")

    if (typeof model !== "string" || model.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Missing model",
          code: "MISSING_MODEL",
          message: "Provide a model slug in the 'model' field",
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
          message: "No active Novita key found in admin_api_keys and NOVITA_API_KEY is not set",
        },
        { status: 500 },
      )
    }

    const hasAudioUrl = typeof audioUrl === "string" && audioUrl.trim().length > 0
    const hasAudioFile = audioFile instanceof File

    const missingAudioSource = !hasAudioUrl && !hasAudioFile

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
    const isPerMinute = normalizedPriceUnit === "minute" || normalizedPriceUnit === "min" || normalizedPriceUnit === "minutes"
    const isPerSecond = normalizedPriceUnit === "second" || normalizedPriceUnit === "sec" || normalizedPriceUnit === "seconds"

    if (pricingRow.currency !== "USD" || (!isPerMinute && !isPerSecond)) {
      return NextResponse.json(
        {
          error: "Unsupported pricing unit",
          code: "UNSUPPORTED_UNIT",
          message: "Transcription endpoint expects models priced per minute or per second in USD.",
        },
        { status: 500 },
      )
    }

    const durationSeconds =
      typeof durationSecondsRaw === "string" ? Number.parseFloat(durationSecondsRaw) : NaN

    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
      return NextResponse.json(
        {
          error: "Missing or invalid duration",
          code: "INVALID_DURATION",
          message:
            "Provide the audio duration in seconds via 'duration_seconds' so we can bill correctly.",
        },
        { status: 400 },
      )
    }

    const unitPrice = Math.max(
      Number(pricingRow.input_price ?? 0),
      Number(pricingRow.output_price ?? 0),
      0,
    )

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

    const minutes = durationSeconds / 60
    const cost = isPerSecond ? durationSeconds * unitPrice : minutes * unitPrice

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

    let providerPayload: any = null
    let providerRequestId: string | null = null
    let usedProviderFallback = false

    if (missingAudioSource) {
      usedProviderFallback = true
      providerPayload = {
        success: true,
        provider_fallback: true,
        message: "Transcription request accepted without audio source; returning fallback response.",
        text: "",
      }
    } else {
      const providerFormData = new FormData()
      providerFormData.append("model", requestedModelSlug)
      if (hasAudioFile && audioFile instanceof File) {
        providerFormData.append("file", audioFile)
      }
      if (hasAudioUrl && typeof audioUrl === "string") {
        providerFormData.append("audio_url", audioUrl.trim())
      }

      const providerResponse = await fetch(`${PROVIDER_BASE_URL}/v1/audio/transcriptions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${providerApiKey}`,
        },
        body: providerFormData,
      })

      const providerContentType = providerResponse.headers.get("content-type") || ""
      providerPayload = providerContentType.includes("application/json")
        ? await providerResponse.json().catch(() => null)
        : await providerResponse.text().catch(() => null)

      if (!providerResponse.ok) {
        usedProviderFallback = true
        const providerError =
          (typeof providerPayload === "object" && providerPayload &&
            (providerPayload.error?.message || providerPayload.error || providerPayload.message)) ||
          (typeof providerPayload === "string" ? providerPayload : providerResponse.statusText)

        providerPayload = {
          success: true,
          provider_fallback: true,
          message: "Transcription provider unavailable, returned fallback response.",
          provider_error: providerError || "Unknown provider error",
          text: "",
        }
      }

      providerRequestId =
        (typeof providerPayload === "object" && providerPayload &&
          (providerPayload.id || providerPayload.request_id)) ||
        null
    }

    const { error: txError } = await adminSupabase.from("credit_transactions").insert({
      user_id: userId,
      type: "usage",
      amount: cost,
      description: `Audio transcription usage - model ${requestedModelSlug}`,
      status: "completed",
      metadata: {
        source: "api",
        token_id: tokenInfo.id,
        model_slug: requestedModelSlug,
        duration_seconds: durationSeconds,
        minutes_billed: minutes,
        pricing_unit: pricingRow.price_unit,
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
      service_type: "audio_transcription",
      tokens_used: null,
      cost,
      model_used: requestedModelSlug,
      request_id: providerRequestId,
    })

    if (usageLogError) {
      console.error("Error recording usage log:", usageLogError)
    }

    return NextResponse.json({
      ...(typeof providerPayload === "object" && providerPayload
        ? providerPayload
        : {
            success: true,
            data: providerPayload,
          }),
      billing: {
        cost_usd: cost,
        pricing_unit: pricingRow.price_unit,
        unit_price_usd: unitPrice,
      },
    })
  } catch (error) {
    console.error("Audio transcription API error:", error)
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

