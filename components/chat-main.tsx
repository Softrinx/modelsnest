"use client"

import { ChatInterface } from "@/components/chat-interface"
import type { DashboardUser } from "@/types/dashboard-user"

interface ChatMainProps {
  user: DashboardUser
}

export function ChatMain({ user }: ChatMainProps) {
  return (
    <div className="flex-1 flex flex-col bg-gray-950/50">
      <ChatInterface user={user} />
    </div>
  )
}
