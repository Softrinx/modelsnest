"use client"

import { useState, useRef, useEffect } from "react"
import { MessageList } from "@/components/message-list"
import { MessageInput } from "@/components/message-input"
import { ChatWelcome } from "@/components/chat-welcome"
import { sendChatMessage, getChatModels } from "@/app/actions/chat"
import { useChatStream } from "@/hooks/use-chat-stream"
import type { ChatMessage } from "@/lib/chat-api"
import { Button } from "@/components/ui/button"
import { Settings, User, Plus } from "lucide-react"
import Link from "next/link"
import type { DashboardUser } from "@/types/dashboard-user"

interface DashboardChatInterfaceProps {
  user: DashboardUser
  sidebarCollapsed?: boolean
}

interface UserCredits {
  balance: number
  total_spent: number
  total_topped_up: number
}

export function DashboardChatInterface({ user, sidebarCollapsed = false }: DashboardChatInterfaceProps) {
  const [credits, setCredits] = useState<UserCredits | null>(null)
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

  // Fetch user credits
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const creditsRes = await fetch("/api/user/credits")
        if (creditsRes.ok) {
          const creditsData = await creditsRes.json()
          if (creditsData.success) {
            setCredits(creditsData.credits)
          }
        }
      } catch (error) {
        console.error("Failed to fetch user credits:", error)
      }
    }

    fetchCredits()
  }, [])

  const refreshCredits = async () => {
    try {
      const creditsRes = await fetch("/api/user/credits")
      if (creditsRes.ok) {
        const creditsData = await creditsRes.json()
        if (creditsData.success) {
          setCredits(creditsData.credits)
        }
      }
    } catch (error) {
      console.error("Failed to refresh user credits:", error)
    }
  }

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

  const visibleMessages = messages.filter((m) => m.role !== "system")
  const hasMessages = visibleMessages.length > 0

  const handleSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#0D0D0F] via-[#121214] to-[#1A1B1F] relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(140,92,247,0.3)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Header with Profile Avatar */}
        <div className="flex items-center justify-between p-4 border-b border-[#2D2D32] bg-[#1A1B1F]/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/settings">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8C5CF7] to-[#3B1F82] rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200">
                <span className="text-white font-semibold text-lg">{user.name?.[0]?.toUpperCase() || 'U'}</span>
              </div>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-white">{user.name || 'User'}</h1>
              <p className="text-sm text-[#A0A0A8]">{user.email}</p>
            </div>
          </div>
          
          {/* Credits Display and Add Credit Button */}
          <div className="flex items-center gap-3">
            {credits && (
              <div 
                className="hidden md:flex items-center gap-2 px-3 py-2 bg-[#1A1B1F] border border-[#2D2D32] rounded-lg cursor-pointer hover:bg-[#2D2D32] transition-colors duration-200"
                onClick={refreshCredits}
                title="Click to refresh"
              >
                <div className="w-2 h-2 bg-[#00ff88] rounded-full"></div>
                <span className="text-sm text-[#A0A0A8]">
                  ${credits.balance.toFixed(2)} available
                </span>
              </div>
            )}
            
            {/* <Link href="/dashboard/billing">
              <Button variant="outline" size="sm" className="border-[#8C5CF7]/30 text-[#8C5CF7] hover:bg-[#8C5CF7]/10 hover:border-[#8C5CF7]/50">
                <Plus className="w-4 h-4 mr-2" />
                Add Credit
              </Button>
            </Link> */}
            
            <Button variant="ghost" size="sm" className="text-[#A0A0A8] hover:text-white hover:bg-[#2D2D32]">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-[#A0A0A8] hover:text-white hover:bg-[#2D2D32]">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!hasMessages ? (
          <ChatWelcome
            user={user}
            onSuggestion={handleSuggestion}
            onSendMessage={handleSendMessage}
            disabled={isLoading || isStreaming}
          />
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Messages Container - with bottom spacing for floating input */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 sm:py-3 pb-40 min-h-0">
              <MessageList
                messages={visibleMessages}
                isLoading={isLoading || isStreaming}
                streamingMessage={currentStreamingMessage}
              />
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Floating Chat Input - Always at bottom, outside chat container */}
      {hasMessages && (
        <div 
          className="fixed bottom-0 p-4 z-50 transition-all duration-300 ease-in-out" 
          style={{ 
            left: sidebarCollapsed ? '70px' : '250px',
            right: '0px'
          }}
        >
          <MessageInput 
            onSendMessage={handleSendMessage} 
            disabled={isLoading || isStreaming}
            placeholder="Continue the conversation..."
            className="bg-transparent border-transparent focus:border-transparent focus:ring-0"
          />
        </div>
      )}
    </div>
  )
}
