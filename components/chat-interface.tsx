"use client"

import { useState, useRef, useEffect } from "react"
import { MessageList } from "@/components/message-list"
import { MessageInput } from "@/components/message-input"
import { ModelSelector } from "@/components/model-selector"
import { ChatWelcome } from "@/components/chat-welcome"
import { sendChatMessage, getChatModels } from "@/app/actions/chat"
import { useChatStream } from "@/hooks/use-chat-stream"
import { Trash2, Download, Zap, MessageSquare } from "lucide-react"
import { useTheme } from "@/contexts/themeContext"
import type { ChatMessage } from "@/lib/chat-api"
import type { DashboardUser } from "@/types/dashboard-user"

interface ChatInterfaceProps {
  user: DashboardUser
}

export function ChatInterface({ user }: ChatInterfaceProps) {
  const { isDark } = useTheme()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content: "You are a helpful AI assistant. Be concise and helpful in your responses.",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("deepseek/deepseek-v3-0324")
  const [models, setModels] = useState<Array<{ id: string; name: string }>>([])
  const [streamingEnabled, setStreamingEnabled] = useState(true)
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { streamMessage, isStreaming } = useChatStream()

  const bg        = isDark ? "#0a0a0c" : "#f5f5f3"
  const surface   = isDark ? "#111114" : "#ffffff"
  const border    = isDark ? "#232329" : "#e0e0de"
  const borderSub = isDark ? "#1c1c22" : "#e8e8e6"
  const text      = isDark ? "#f0f0f2" : "#111113"
  const textMuted = isDark ? "#6b6b78" : "#888890"

  useEffect(() => { getChatModels().then(setModels) }, [])
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, currentStreamingMessage])

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading || isStreaming) return
    const userMessage: ChatMessage = { role: "user", content }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setIsLoading(true)
    setCurrentStreamingMessage("")

    try {
      if (streamingEnabled) {
        await streamMessage(
          updatedMessages, selectedModel,
          (chunk: string) => setCurrentStreamingMessage(prev => prev + chunk),
          (fullMessage: string) => {
            setMessages([...updatedMessages, { role: "assistant", content: fullMessage }])
            setCurrentStreamingMessage("")
          },
          (error: string) => {
            setMessages([...updatedMessages, { role: "assistant", content: `Error: ${error}` }])
            setCurrentStreamingMessage("")
          },
        )
      } else {
        const response = await sendChatMessage(updatedMessages)
        setMessages([...updatedMessages, {
          role: "assistant",
          content: response.success ? (response.message ?? "No response generated") : `Error: ${response.error}`,
        }])
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      setMessages([...updatedMessages, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }])
      setCurrentStreamingMessage("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([{
      role: "system",
      content: "You are a helpful AI assistant. Be concise and helpful in your responses.",
    }])
  }

  const handleExportChat = () => {
    const chatData = {
      timestamp: new Date().toISOString(),
      model: selectedModel,
      messages: messages.filter(m => m.role !== "system"),
    }
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chat-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const visibleMessages = messages.filter(m => m.role !== "system")
  const hasMessages = visibleMessages.length > 0

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative", overflow: "hidden", background: bg }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "25%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 15%, transparent), transparent 70%)",
          filter: "blur(40px)", opacity: 0.6,
          animation: "pulse 4s ease-in-out infinite",
        }} />
        <style>{`@keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:0.3} }`}</style>
      </div>

      {/* Header */}
      {hasMessages && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: `1px solid ${borderSub}`,
          background: surface,
          position: "relative", zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: text, margin: 0 }}>AI Chat</h2>
            <ModelSelector
              models={models}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              disabled={isLoading || isStreaming}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Streaming toggle */}
            <button
              onClick={() => setStreamingEnabled(!streamingEnabled)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 10px", borderRadius: 8, border: "none",
                background: "transparent", cursor: "pointer",
                color: streamingEnabled ? "var(--color-success)" : textMuted,
                fontSize: 13, fontWeight: 500,
                transition: "color 0.15s",
              }}
            >
              {streamingEnabled
                ? <Zap style={{ width: 14, height: 14 }} />
                : <MessageSquare style={{ width: 14, height: 14 }} />
              }
              {streamingEnabled ? "Streaming" : "Standard"}
            </button>
            <button
              onClick={handleExportChat}
              disabled={visibleMessages.length === 0}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 10px", borderRadius: 8, border: "none",
                background: "transparent", cursor: "pointer",
                color: textMuted, fontSize: 13, fontWeight: 500,
                opacity: visibleMessages.length === 0 ? 0.4 : 1,
              }}
            >
              <Download style={{ width: 14, height: 14 }} />
              Export
            </button>
            <button
              onClick={handleClearChat}
              disabled={visibleMessages.length === 0}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 10px", borderRadius: 8, border: "none",
                background: "transparent", cursor: "pointer",
                color: textMuted, fontSize: 13, fontWeight: 500,
                opacity: visibleMessages.length === 0 ? 0.4 : 1,
              }}
            >
              <Trash2 style={{ width: 14, height: 14 }} />
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative", zIndex: 10 }}>
        {!hasMessages ? (
          <ChatWelcome
            user={user}
            onSuggestion={handleSendMessage}
            onSendMessage={handleSendMessage}
            disabled={isLoading || isStreaming}
          />
        ) : (
          <>
            <div style={{ height: "100%", overflowY: "auto", padding: "20px 16px" }}>
              <div style={{ maxWidth: 720, margin: "0 auto" }}>
                <MessageList
                  messages={visibleMessages}
                  isLoading={isLoading || isStreaming}
                  streamingMessage={currentStreamingMessage}
                />
                <div ref={messagesEndRef} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Input */}
      <div style={{
        position: "relative", zIndex: 10,
        borderTop: hasMessages ? `1px solid ${border}` : "none",
        background: surface,
      }}>
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isLoading || isStreaming}
        />
      </div>
    </div>
  )
}