import type { NextRequest } from "next/server"
import { ModelslabAI } from "@/lib/chat-api"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", code: "UNAUTHORIZED" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body", code: "INVALID_BODY" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const { messages, model } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "messages array is required", code: "MISSING_MESSAGES" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const apiKey = process.env.NOVITA_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Server misconfiguration", code: "NOVITA_API_KEY_MISSING" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const client = new ModelslabAI(apiKey)

    let stream: ReadableStream<Uint8Array>
    try {
      stream = await client.createStreamingChatCompletion({
        model: model || "deepseek/deepseek-v3-0324",
        messages,
        max_tokens: 4000,
        temperature: 0.7,
        stream: true,
      })
    } catch (streamInitError) {
      console.error("Stream init failed:", streamInitError)
      return new Response(
        JSON.stringify({
          error: "Failed to connect to AI provider",
          code: "STREAM_INIT_FAILED",
          detail: streamInitError instanceof Error ? streamInitError.message : String(streamInitError),
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      )
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader()
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
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                  )
                }
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
      },
    })
  } catch (error) {
    console.error("Chat stream API error:", error)
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Unexpected error occurred",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}