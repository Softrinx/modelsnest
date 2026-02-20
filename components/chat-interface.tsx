"use client"

import { useState, useRef, useEffect } from "react"
import { MessageList } from "@/components/message-list"
import { MessageInput } from "@/components/message-input"
import { ModelSelector } from "@/components/model-selector"
import { ChatWelcome } from "@/components/chat-welcome"
import { sendChatMessage, getChatModels } from "@/app/actions/chat"
import { useChatStream } from "@/hooks/use-chat-stream"
import { Button } from "@/components/ui/button"
import { Trash2, Download, Zap, MessageSquare } from "lucide-react"
import type { ChatMessage } from "@/lib/chat-api"
import type { DashboardUser } from "@/types/dashboard-user"

interface ChatInterfaceProps {
  user: DashboardUser
}

export function ChatInterface({ user }: ChatInterfaceProps) {
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

  useEffect(() => {
    // Load available models
    getChatModels().then(setModels)
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
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
        // Use streaming
        await streamMessage(
          updatedMessages,
          selectedModel,
          (chunk: string) => {
            setCurrentStreamingMessage((prev) => prev + chunk)
          },
          (fullMessage: string) => {
            const assistantMessage: ChatMessage = {
              role: "assistant",
              content: fullMessage,
            }
            setMessages([...updatedMessages, assistantMessage])
            setCurrentStreamingMessage("")
          },
          (error: string) => {
            const errorMessage: ChatMessage = {
              role: "assistant",
              content: `Error: ${error}`,
            }
            setMessages([...updatedMessages, errorMessage])
            setCurrentStreamingMessage("")
          },
        )
      } else {
        // Use regular API call
        const response = await sendChatMessage(updatedMessages)

        if (response.success) {
          const assistantMessage: ChatMessage = {
            role: "assistant",
            content: response.message ?? "No response generated",
          }
          setMessages([...updatedMessages, assistantMessage])
        } else {
          const errorMessage: ChatMessage = {
            role: "assistant",
            content: `Error: ${response.error}`,
          }
          setMessages([...updatedMessages, errorMessage])
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      }
      setMessages([...updatedMessages, errorMessage])
      setCurrentStreamingMessage("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        role: "system",
        content: "You are a helpful AI assistant. Be concise and helpful in your responses.",
      },
    ])
  }

  const handleExportChat = () => {
    const chatData = {
      timestamp: new Date().toISOString(),
      model: selectedModel,
      messages: messages.filter((m) => m.role !== "system"),
    }

    const blob = new Blob([JSON.stringify(chatData, null, 2)], {
      type: "application/json",
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chat-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const visibleMessages = messages.filter((m) => m.role !== "system")
  const hasMessages = visibleMessages.length > 0

  const handleSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20 animate-pulse">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#00ff88] via-[#0080ff] to-[#ff0040] blur-3xl"></div>
        </div>
      </div>

      {hasMessages && (
        <div className="flex items-center justify-between p-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-white">AI Chat</h2>
            <ModelSelector
              models={models}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              disabled={isLoading || isStreaming}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStreamingEnabled(!streamingEnabled)}
              className={`${streamingEnabled ? "text-[#00ff88]" : "text-gray-400"} hover:text-white`}
            >
              {streamingEnabled ? <Zap className="w-4 h-4 mr-2" /> : <MessageSquare className="w-4 h-4 mr-2" />}
              {streamingEnabled ? "Streaming" : "Standard"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportChat}
              disabled={visibleMessages.length === 0}
              className="text-gray-400 hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              disabled={visibleMessages.length === 0}
              className="text-gray-400 hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden relative z-10">
        {!hasMessages ? (
          <ChatWelcome
            user={user}
            onSuggestion={handleSuggestion}
            onSendMessage={handleSendMessage}
            disabled={isLoading || isStreaming}
          />
        ) : (
          <>
            <MessageList
              messages={visibleMessages}
              isLoading={isLoading || isStreaming}
              streamingMessage={currentStreamingMessage}
            />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className={`relative z-10 ${hasMessages ? "border-t border-white/10" : ""}`}>
        <MessageInput onSendMessage={handleSendMessage} disabled={isLoading || isStreaming} />
      </div>
    </div>
  )
}
