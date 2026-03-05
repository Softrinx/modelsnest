"use client"

import { useTheme } from "@/contexts/themeContext"
import { LoadingMessage } from "@/components/loading-message"
import { StreamingMessage } from "@/components/streaming-message"
import { ChatMessage } from "@/components/chat-message"
import { Sparkles } from "lucide-react"
import type { ChatMessage as ChatMessageType } from "@/lib/chat-api"

interface MessageListProps {
  messages: ChatMessageType[]
  isLoading?: boolean
  streamingMessage?: string
}

export function MessageList({ messages, isLoading, streamingMessage }: MessageListProps) {
  const { isDark } = useTheme()
  const text      = isDark ? "#f0f0f2" : "#111113"
  const textMuted = isDark ? "#6b6b78" : "#888890"

  if (messages.length === 0) {
    return (
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        justifyContent: "center", padding: 32,
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: "0 auto 20px",
            background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px color-mix(in srgb, var(--color-primary) 35%, transparent)",
          }}>
            <Sparkles style={{ width: 32, height: 32, color: "#fff" }} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: text, margin: "0 0 10px" }}>
            Start a conversation
          </h3>
          <p style={{ color: textMuted, maxWidth: 340, lineHeight: 1.6, margin: 0, fontSize: 14 }}>
            Ask me anything! I'm here to help with questions, coding, writing, analysis, and more.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
      {isLoading && <LoadingMessage />}
      {streamingMessage && <StreamingMessage content={streamingMessage} />}
    </div>
  )
}