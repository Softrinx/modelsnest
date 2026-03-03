"use server"

import { ModelslabAI, type ChatMessage } from "@/lib/chat-api"
import { createClient } from "@/lib/supabase/server"

async function requireAuth() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) throw new Error("Unauthorized")
  return data.user
}

export async function sendChatMessage(messages: ChatMessage[]) {
  try {
    await requireAuth()

    const apiKey = process.env.NOVITA_API_KEY
    if (!apiKey) throw new Error("NOVITA_API_KEY environment variable is not set")

    const client = new ModelslabAI(apiKey)

    const response = await client.createChatCompletion({
      model: "deepseek/deepseek-v3-0324",
      messages,
      max_tokens: 4000,
      temperature: 0.7,
    })

    return {
      success: true,
      message: response.choices[0]?.message?.content ?? "No response generated",
      usage: response.usage,
    }
  } catch (error) {
    console.error("Chat API error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getChatModels() {
  return [
    { id: "deepseek/deepseek-v3-0324", name: "DeepSeek V3" },
    { id: "meta-llama/llama-3.1-8b-instruct", name: "Llama 3.1 8B" },
    { id: "mistralai/mistral-7b-instruct", name: "Mistral 7B" },
  ]
}