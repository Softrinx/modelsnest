"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Send, Zap, Brain, Code, MessageSquare, Lightbulb, Target, TrendingUp, Users, Shield, Globe, Rocket, Star, Heart, ArrowRight, Search, Flame, FileText, Cpu, Paperclip } from "lucide-react"
import { OutsoorLogo } from "@/components/outsoor-logo"
import type { DashboardUser } from "@/types/dashboard-user"

interface ChatWelcomeProps {
  user: DashboardUser
  onSuggestion: (suggestion: string) => void
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function ChatWelcome({ user, onSuggestion, onSendMessage, disabled = false }: ChatWelcomeProps) {
  const [message, setMessage] = useState("")

  const quickActions = [
    {
      title: "Think Bigger",
      icon: <Sparkles className="w-4 h-4" />,
      prompt: "Help me think beyond conventional boundaries and explore innovative solutions"
    },
    {
      title: "Deep Search",
      icon: <Search className="w-4 h-4" />,
      prompt: "Perform a comprehensive analysis and deep dive into this topic"
    },
    {
      title: "Brainstorm Mode",
      icon: <Lightbulb className="w-4 h-4" />,
      prompt: "Generate creative ideas and brainstorm multiple approaches"
    },
    {
      title: "Quick Fire",
      icon: <Flame className="w-4 h-4" />,
      prompt: "Give me rapid, concise insights and quick solutions"
    },
    {
      title: "Insight Generator",
      icon: <FileText className="w-4 h-4" />,
      prompt: "Analyze this and provide key insights and actionable recommendations"
    }
  ]

  const features = [
    {
      icon: <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Limitless Cognitive Power",
      description: "Get bold, original insights that push boundaries and unlock new possibilities, all in real-time."
    },
    {
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Zero-Lag, Full Awareness",
      description: "Receive instant, context-sensitive responses that adjust seamlessly to your needs and workflow."
    },
    {
      icon: <Target className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Intuition Meets Intelligence",
      description: "Enjoy human-like, intuitive interactions with AI that processes ideas and thinks faster than any human."
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 sm:p-8 text-center">
      {/* Header Section */}
      <div className="mb-8 sm:mb-12 space-y-4 sm:space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <OutsoorLogo size="xl" />
        </div>

        {/* Title */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#5567F7] to-[#8C5CF7] bg-clip-text text-transparent">
              Hey {user.name ?? "there"}!
            </span>
                            <span className="text-white ml-2 sm:ml-3">How can I help?</span>
          </h1>
          <p className="text-sm sm:text-base text-[#A0A0A8] max-w-lg sm:max-w-2xl mx-auto leading-relaxed px-4">
            Enterprise-Grade Custom Models, Zero Infrastructure Hassle
          </p>
        </div>
      </div>

      {/* Central Chat Input Area */}
      <div className="w-full max-w-2xl sm:max-w-4xl mb-8 sm:mb-16 px-4">
        <form onSubmit={handleSubmit} className="relative">
          {/* Main Input Field */}
          <div className="bg-[#1A1B1F] border border-[#202126] rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-[#A0A0A8] hover:text-white hover:bg-[#202126] p-1.5 sm:p-2 rounded-xl transition-all duration-200"
              >
                <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <div className="flex-1">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Anything..."
                  className="w-full bg-transparent border-none text-white placeholder-[#8C8C96] text-base sm:text-lg font-medium focus:outline-none focus:ring-0"
                  disabled={disabled}
                />
              </div>
              <Button
                type="submit"
                disabled={!message.trim() || disabled}
                className="bg-gradient-to-r from-[#8C5CF7] to-[#3B1F82] hover:from-[#7C4CF7] hover:to-[#2B0F72] text-white p-2 sm:p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                size="sm"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onSuggestion(action.prompt)}
                  disabled={disabled}
                  className="bg-[#202126] text-[#A0A0A8] hover:text-white hover:bg-[#8C5CF7]/20 border border-[#202126] hover:border-[#8C5CF7]/40 transition-all duration-200 rounded-xl px-2 sm:px-4 py-1.5 sm:py-2 h-auto text-xs sm:text-sm"
                >
                  <span className="mr-1 sm:mr-2 text-[#8C5CF7]">{action.icon}</span>
                  {action.title}
                </Button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl sm:max-w-6xl px-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[#1A1B1F] border border-[#202126] rounded-2xl p-4 sm:p-6 text-left hover:border-[#8C5CF7]/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-[#5567F7] to-[#8C5CF7] text-white group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">{feature.title}</h3>
            </div>
            <p className="text-[#A0A0A8] leading-relaxed text-sm sm:text-base">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
