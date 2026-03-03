"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Check, Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import type { ChatMessage as ChatMessageType } from "@/lib/chat-api"

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === "user"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"} group`}>
      {!isUser && (
        <div className="w-10 h-10 bg-gradient-to-br from-[#8C5CF7] to-[#3B1F82] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? "order-first" : ""}`}>
        <Card className="p-3 shadow-sm bg-transparent border-[#2D2D32]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-semibold mb-2 ${isUser ? "text-[#8C5CF7]" : "text-[#A0A0A8]"}`}>
                {isUser ? "You" : "AI Assistant"}
              </div>

              {isUser ? (
                <div className="text-white whitespace-pre-wrap leading-relaxed text-sm">
                  {message.content}
                </div>
              ) : (
                <div className="text-white leading-relaxed text-sm prose prose-invert prose-sm max-w-none
                  prose-p:my-1.5 prose-p:leading-relaxed
                  prose-headings:text-white prose-headings:font-bold prose-headings:mt-3 prose-headings:mb-1.5
                  prose-h1:text-base prose-h2:text-sm prose-h3:text-sm
                  prose-strong:text-white prose-strong:font-semibold
                  prose-em:text-[#c4c4cc]
                  prose-code:text-[#e879f9] prose-code:bg-[#1e1e28] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
                  prose-pre:bg-[#13131a] prose-pre:border prose-pre:border-[#2D2D32] prose-pre:rounded-lg prose-pre:p-3 prose-pre:my-2 prose-pre:overflow-x-auto
                  prose-ul:my-1.5 prose-ul:pl-4 prose-ol:my-1.5 prose-ol:pl-4
                  prose-li:my-0.5 prose-li:leading-relaxed
                  prose-blockquote:border-l-2 prose-blockquote:border-[#8C5CF7] prose-blockquote:pl-3 prose-blockquote:text-[#A0A0A8] prose-blockquote:my-2
                  prose-hr:border-[#2D2D32] prose-hr:my-3
                  prose-a:text-[#8C5CF7] prose-a:no-underline hover:prose-a:underline
                ">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 text-[#8C8C96] hover:text-white hover:bg-[#2D2D32] flex-shrink-0"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
        </Card>
      </div>

      {isUser && (
        <div className="w-10 h-10 bg-gradient-to-br from-[#4ADE80] to-[#22C55E] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  )
}