export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface ChatCompletionRequest {
  model: string
  messages: ChatMessage[]
  max_tokens?: number
  temperature?: number
  stream?: boolean
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: { role: string; content: string }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class ModelslabAI {
  private apiKey: string
  private baseUrl = "https://api.novita.ai/v3/openai"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const response = await fetch(this.baseUrl + "/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.apiKey,
      },
      body: JSON.stringify({
        model: request.model || "deepseek/deepseek-v3-0324",
        messages: request.messages,
        max_tokens: request.max_tokens || 4000,
        temperature: request.temperature || 0.7,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error("API request failed: " + response.statusText + " - " + errText)
    }

    return response.json()
  }

  async createStreamingChatCompletion(request: ChatCompletionRequest): Promise<ReadableStream> {
    const response = await fetch(this.baseUrl + "/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.apiKey,
      },
      body: JSON.stringify({
        ...request,
        stream: true,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error("API request failed: " + response.statusText + " - " + errText)
    }

    return response.body!
  }
}

export const NovitaAI = ModelslabAI