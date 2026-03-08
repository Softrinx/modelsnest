import { NextRequest, NextResponse } from "next/server"
import { ModelslabAI } from "@/lib/chat-api"
import { verifyApiToken } from "@/app/actions/api-tokens"
import { createAdminClient } from "@/lib/supabase/server"
import { getActiveProviderApiKey } from "@/lib/admin-api-keys"

const PRICE_PER_1K_TOKENS_USD = 0.001

export async function POST(request: NextRequest) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error: {
            message: "Missing or invalid Authorization header. Use: Authorization: Bearer ptr_your_api_token",
            type: "invalid_request_error",
            code: "MISSING_AUTH_HEADER",
          },
        },
        { status: 401 },
      )
    }

    const apiToken = authHeader.split(" ")[1]
    const tokenInfo = await verifyApiToken(apiToken)

    if (!tokenInfo) {
      return NextResponse.json(
        {
          error: {
            message: "The provided API token is invalid, expired, or inactive.",
            type: "invalid_request_error",
            code: "INVALID_TOKEN",
          },
        },
        { status: 401 },
      )
    }

    // ── Parse body ────────────────────────────────────────────────────────────
    const body = await request.json().catch(() => null)

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          error: {
            message: "Invalid request body. Expected a JSON object.",
            type: "invalid_request_error",
            code: "INVALID_BODY",
          },
        },
        { status: 400 },
      )
    }

    const {
      model,
      messages,
      max_tokens,
      temperature,
      stream = false,
      top_p,
      frequency_penalty,
      presence_penalty,
      stop,
    } = body as {
      model?: string
      messages?: Array<{ role: "user" | "system" | "assistant"; content: string }>
      max_tokens?: number
      temperature?: number
      stream?: boolean
      top_p?: number
      frequency_penalty?: number
      presence_penalty?: number
      stop?: string | string[]
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        {
          error: {
            message: "You must provide a messages array with at least one message.",
            type: "invalid_request_error",
            code: "MISSING_MESSAGES",
          },
        },
        { status: 400 },
      )
    }

    // ── Resolve provider API key ──────────────────────────────────────────────
    const providerApiKey =
      (await getActiveProviderApiKey("novita")) ||
      process.env.NOVITA_API_KEY ||
      (await getActiveProviderApiKey("models_lab")) ||
      process.env.MODELSLAB_API_KEY

    if (!providerApiKey) {
      return NextResponse.json(
        {
          error: {
            message: "Server misconfiguration: no provider API key found.",
            type: "server_error",
            code: "PROVIDER_API_KEY_MISSING",
          },
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

    // ── Model catalog check ───────────────────────────────────────────────────
    let pricePer1kTokensUsd = PRICE_PER_1K_TOKENS_USD
    let pricingMeta: {
      slug: string
      input_price: number
      output_price: number
      price_unit: string
    } | null = null

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
            error: {
              message: `The requested model "${requestedModelSlug}" is currently ${catalogModel.status}.`,
              type: "invalid_request_error",
              code: "MODEL_UNAVAILABLE",
            },
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

    // ── Credits check ─────────────────────────────────────────────────────────
    const { data: creditsRow, error: creditsError } = await adminSupabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle()

    if (creditsError) {
      console.error("Error fetching user credits:", creditsError)
      return NextResponse.json(
        {
          error: {
            message: "Could not verify your current credit balance.",
            type: "server_error",
            code: "CREDITS_LOOKUP_FAILED",
          },
        },
        { status: 500 },
      )
    }

    const currentBalance = Number.parseFloat(String(creditsRow?.balance ?? 0))

    if (!Number.isFinite(currentBalance) || currentBalance <= 0) {
      return NextResponse.json(
        {
          error: {
            message: "Insufficient credits. Please top up to continue using the API.",
            type: "insufficient_quota",
            code: "INSUFFICIENT_CREDITS",
            current_balance: 0,
          },
        },
        { status: 402 },
      )
    }

    const client = new ModelslabAI(providerApiKey)

    // ── Streaming response ────────────────────────────────────────────────────
    if (stream) {
      let streamInstance: ReadableStream<Uint8Array>
      try {
        streamInstance = await client.createStreamingChatCompletion({
          model: requestedModelSlug,
          messages,
          max_tokens: max_tokens ?? 4000,
          temperature: temperature ?? 0.7,
          stream: true,
          ...(top_p !== undefined && { top_p }),
          ...(frequency_penalty !== undefined && { frequency_penalty }),
          ...(presence_penalty !== undefined && { presence_penalty }),
          ...(stop !== undefined && { stop }),
        })
      } catch (streamInitError) {
        console.error("Stream init failed:", streamInitError)
        return NextResponse.json(
          {
            error: {
              message: "Failed to connect to AI provider.",
              type: "server_error",
              code: "STREAM_INIT_FAILED",
              detail: streamInitError instanceof Error ? streamInitError.message : String(streamInitError),
            },
          },
          { status: 502 },
        )
      }

      const encoder = new TextEncoder()
      const decoder = new TextDecoder()

      const readableStream = new ReadableStream({
        async start(controller) {
          const reader = streamInstance.getReader()
          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"))
                controller.close()
                break
              }

              const chunk = decoder.decode(value, { stream: true })
              const lines = chunk.split("\n")

              for (const line of lines) {
                if (!line.startsWith("data: ")) continue
                const data = line.slice(6).trim()

                if (data === "[DONE]") {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"))
                  controller.close()
                  return
                }

                try {
                  const parsed = JSON.parse(data)
                  // Forward the full OpenAI-compatible chunk as-is
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(parsed)}\n\n`))
                } catch {
                  // skip malformed lines
                }
              }
            }
          } catch (err) {
            console.error("Stream read error:", err)
            controller.error(err)
          }
        },
      })

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
        },
      })
    }

    // ── Non-streaming response ────────────────────────────────────────────────
    const completion = await client.createChatCompletion({
      model: requestedModelSlug,
      messages: messages as any,
      max_tokens,
      temperature,
      stream: false,
      ...(top_p !== undefined && { top_p }),
      ...(frequency_penalty !== undefined && { frequency_penalty }),
      ...(presence_penalty !== undefined && { presence_penalty }),
      ...(stop !== undefined && { stop }),
    })

    const usage = completion.usage
    const totalTokens = Number(usage?.total_tokens ?? 0)
    const cost =
      totalTokens > 0
        ? (totalTokens / 1000) * pricePer1kTokensUsd
        : pricePer1kTokensUsd

    // ── Re-check balance before billing ──────────────────────────────────────
    const { data: freshCreditsRow, error: freshCreditsError } = await adminSupabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle()

    if (freshCreditsError) {
      console.error("Error re-checking user credits:", freshCreditsError)
      return NextResponse.json(
        {
          error: {
            message: "Could not verify your current credit balance.",
            type: "server_error",
            code: "CREDITS_RECHECK_FAILED",
          },
        },
        { status: 500 },
      )
    }

    const freshBalance = Number.parseFloat(String(freshCreditsRow?.balance ?? 0))

    if (!Number.isFinite(freshBalance) || freshBalance < cost) {
      return NextResponse.json(
        {
          error: {
            message: "Insufficient credits to cover this request.",
            type: "insufficient_quota",
            code: "INSUFFICIENT_CREDITS",
            current_balance: freshBalance,
            required: cost,
          },
        },
        { status: 402 },
      )
    }

    // ── Deduct credits ────────────────────────────────────────────────────────
    const { error: deductError } = await adminSupabase
      .from("user_credits")
      .update({ balance: freshBalance - cost })
      .eq("user_id", userId)

    if (deductError) {
      console.error("Error deducting credits:", deductError)
    }

    // ── Record transaction ────────────────────────────────────────────────────
    const { error: txError } = await adminSupabase.from("credit_transactions").insert({
      user_id: userId,
      type: "usage",
      amount: cost,
      description: `Completions API - model ${completion.model}`,
      status: "completed",
      metadata: {
        source: "api_v1_completions",
        token_id: tokenInfo.id,
        response_id: completion.id,
        total_tokens: totalTokens,
        prompt_tokens: usage?.prompt_tokens ?? null,
        completion_tokens: usage?.completion_tokens ?? null,
        price_per_1k_tokens_usd: pricePer1kTokensUsd,
      },
    })

    if (txError) {
      console.error("Error recording credit transaction:", txError)
    }

    // ── Record usage log ──────────────────────────────────────────────────────
    await adminSupabase.from("usage_logs").insert({
      user_id: userId,
      service_type: "chat",
      tokens_used: totalTokens || null,
      cost,
      model_used: completion.model,
      request_id: completion.id,
    })

    // ── Return OpenAI-compatible response ─────────────────────────────────────
    return NextResponse.json({
      id: completion.id,
      object: "chat.completion",
      created: completion.created ?? Math.floor(Date.now() / 1000),
      model: completion.model,
      choices: completion.choices,
      usage: completion.usage,
      // Modelsnest billing metadata
      billing: {
        cost_usd: cost,
        credits_remaining: freshBalance - cost,
        price_per_1k_tokens_usd: pricePer1kTokensUsd,
        ...(pricingMeta ? { catalog_pricing: pricingMeta } : {}),
      },
    })
  } catch (error) {
    console.error("Completions API error:", error)
    return NextResponse.json(
      {
        error: {
          message: "An unexpected error occurred while processing your request.",
          type: "server_error",
          code: "INTERNAL_ERROR",
        },
      },
      { status: 500 },
    )
  }
}

// ── OPTIONS for CORS ──────────────────────────────────────────────────────────
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}