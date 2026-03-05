"use client"

import { Sparkles } from "lucide-react"
import { useTheme } from "@/contexts/themeContext"

interface StreamingMessageProps {
  content: string
}

export function StreamingMessage({ content }: StreamingMessageProps) {
  const { isDark } = useTheme()

  const surface   = isDark ? "#111114" : "#ffffff"
  const border    = isDark ? "#232329" : "#e0e0de"
  const text      = isDark ? "#f0f0f2" : "#111113"
  const textMuted = isDark ? "#6b6b78" : "#888890"

  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "flex-start" }}>
      {/* AI avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 8px color-mix(in srgb, var(--color-primary) 30%, transparent)",
      }}>
        <Sparkles style={{ width: 16, height: 16, color: "#fff" }} />
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: "80%" }}>
        <div style={{
          padding: "10px 14px",
          borderRadius: "4px 16px 16px 16px",
          background: surface,
          border: `1px solid ${border}`,
          boxShadow: isDark
            ? "0 1px 8px rgba(0,0,0,0.35)"
            : "0 1px 6px rgba(0,0,0,0.07)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: textMuted, marginBottom: 6 }}>
            AI Assistant
          </div>
          <div style={{
            color: text,
            fontSize: 14,
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}>
            {content}
            {/* Blinking cursor */}
            <span style={{
              display: "inline-block",
              width: 2,
              height: 14,
              marginLeft: 3,
              borderRadius: 2,
              background: "linear-gradient(to bottom, var(--color-primary), var(--color-accent))",
              verticalAlign: "middle",
              animation: "cursorBlink 0.9s ease-in-out infinite",
            }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}