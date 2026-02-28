import type { NextRequest } from "next/server"
import { NovitaAI } from "@/lib/chat-api"
import { requireAuth } from "@/lib/auth"
import { getActiveProviderApiKey } from "@/lib/admin-api-keys"

export async function POST(request: NextRequest) {
  try {
    // Ensure user is authenticated
    await requireAuth()

    const { messages, model } = await request.json()

    // Get API key from environment variables
    const apiKey = (await getActiveProviderApiKey("novita")) || process.env.NOVITA_API_KEY
    if (!apiKey) {
      return new Response("No active Novita key found in admin_api_keys and NOVITA_API_KEY is not set", {
        status: 500,
      })
    }

    const client = new NovitaAI(apiKey)

    // Create streaming response
    const stream = await client.createStreamingChatCompletion({
      model: model || "deepseek/deepseek-v3-0324",
      messages,
      max_tokens: 4000,
      temperature: 0.7,
      stream: true,
    })

    // Create a readable stream for the response
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader()

        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              controller.close()
              break
            }

            // Decode the chunk
            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split("\n")

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim()

                if (data === "[DONE]") {
                  controller.close()
                  return
                }

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content

                  if (content) {
                    // Send the content chunk to the client
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                  }
                } catch (parseError) {
                  // Skip invalid JSON lines
                  continue
                }
              }
            }
          }
        } catch (error) {
          console.error("Streaming error:", error)
          controller.error(error)
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
    return new Response("Internal server error", { status: 500 })
  }
}
