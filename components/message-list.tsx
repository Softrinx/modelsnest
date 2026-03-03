"use client"

import { LoadingMessage } from "@/components/loading-message"
import { StreamingMessage } from "@/components/streaming-message"
import type { ChatMessage as ChatMessageType } from "@/lib/chat-api"
import { ChatMessage } from "@/components/chat-message"

interface MessageListProps {
  messages: ChatMessageType[]
  isLoading?: boolean
  streamingMessage?: string
}

export function MessageList({ messages, isLoading, streamingMessage }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#8C5CF7] via-[#C85CFA] to-[#5567F7] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl">🤖</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Start a conversation</h3>
          <p className="text-[#A0A0A8] max-w-md leading-relaxed">
            Ask me anything! I'm here to help with questions, coding, writing, analysis, and more.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
      
      {isLoading && <LoadingMessage />}
      
      {streamingMessage && <StreamingMessage content={streamingMessage} />}
    </div>
  )
}
