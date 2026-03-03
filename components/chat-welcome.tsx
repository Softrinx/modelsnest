"use client"

import { Zap, Cpu, Search, Lightbulb, Flame, FileText, Target, Sparkles } from "lucide-react"
import { ModelsnestLogo } from "@/components/Modelsnest-logo"
import { useTheme } from "@/contexts/themeContext"
import type { DashboardUser } from "@/types/dashboard-user"

interface ChatWelcomeProps {
  user: DashboardUser
  onSuggestion: (suggestion: string) => void
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function ChatWelcome({ user, onSuggestion, disabled = false }: ChatWelcomeProps) {
  const { isDark } = useTheme()

  // Match exact tokens from DashboardChatInterface
  const bg      = isDark ? "#0a0a0c" : "#f5f5f3"
  const card    = isDark ? "#111114" : "#ffffff"
  const border  = isDark ? "#232329" : "#e0e0de"
  const text    = isDark ? "#f0f0f2" : "#111113"
  const muted   = isDark ? "#6b6b78" : "#888890"
  const chipBg  = isDark ? "#18181c" : "#f0f0ee"
  const chipText = isDark ? "#6b6b78" : "#888890"

  const quickActions = [
    { title: "Think Bigger",      icon: <Sparkles  className="w-3.5 h-3.5" />, prompt: "Help me think beyond conventional boundaries and explore innovative solutions" },
    { title: "Deep Search",       icon: <Search    className="w-3.5 h-3.5" />, prompt: "Perform a comprehensive analysis and deep dive into this topic" },
    { title: "Brainstorm Mode",   icon: <Lightbulb className="w-3.5 h-3.5" />, prompt: "Generate creative ideas and brainstorm multiple approaches" },
    { title: "Quick Fire",        icon: <Flame     className="w-3.5 h-3.5" />, prompt: "Give me rapid, concise insights and quick solutions" },
    { title: "Insight Generator", icon: <FileText  className="w-3.5 h-3.5" />, prompt: "Analyze this and provide key insights and actionable recommendations" },
  ]

  const features = [
    { icon: <Cpu    className="w-5 h-5" />, title: "Limitless Cognitive Power",    description: "Get bold, original insights that push boundaries and unlock new possibilities, all in real-time." },
    { icon: <Zap    className="w-5 h-5" />, title: "Zero-Lag, Full Awareness",     description: "Receive instant, context-sensitive responses that adjust seamlessly to your needs and workflow." },
    { icon: <Target className="w-5 h-5" />, title: "Intuition Meets Intelligence", description: "Enjoy human-like, intuitive interactions with AI that processes ideas and thinks faster than any human." },
  ]

  return (
    <div style={{
      minHeight: "100%",
      background: bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 16px 180px", // bottom padding so floating input doesn't overlap
      textAlign: "center",
    }}>

      {/* Logo */}
      <div style={{ marginBottom: 20 }}>
        <ModelsnestLogo size="xl" />
      </div>

      {/* Headline */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.04em", marginBottom: 10 }}>
          <span style={{ background: "linear-gradient(90deg, #5567F7, #8C5CF7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Hey {user.name ?? "there"}!
          </span>
          {" "}
          <span style={{ color: text }}>How can I help?</span>
        </h1>
        <p style={{ fontSize: 14, color: muted, maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
          Enterprise-Grade Custom Models, Zero Infrastructure Hassle
        </p>
      </div>

      {/* Quick action chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 680, marginBottom: 48 }}>
        {quickActions.map(action => (
          <button
            key={action.title}
            type="button"
            onClick={() => onSuggestion(action.prompt)}
            disabled={disabled}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", fontSize: 12, fontWeight: 600,
              background: chipBg, color: chipText,
              border: `1px solid ${border}`, borderRadius: 8,
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "color-mix(in srgb, var(--color-primary) 12%, transparent)"
              e.currentTarget.style.borderColor = "color-mix(in srgb, var(--color-primary) 40%, transparent)"
              e.currentTarget.style.color = "var(--color-primary)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = chipBg
              e.currentTarget.style.borderColor = border
              e.currentTarget.style.color = chipText
            }}
          >
            <span style={{ color: "var(--color-primary)" }}>{action.icon}</span>
            {action.title}
          </button>
        ))}
      </div>

      {/* Feature cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 1,
        width: "100%",
        maxWidth: 860,
        background: border,
        border: `1px solid ${border}`,
        borderRadius: 16,
        overflow: "hidden",
      }}>
        {features.map(f => (
          <div
            key={f.title}
            style={{ background: card, padding: "20px", textAlign: "left", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "#fafaf8"}
            onMouseLeave={e => e.currentTarget.style.background = card}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10, marginBottom: 12,
              background: "linear-gradient(135deg, #5567F7, #8C5CF7)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
            }}>
              {f.icon}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 12, color: muted, lineHeight: 1.7 }}>{f.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}