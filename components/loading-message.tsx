"use client"

import { Sparkles } from "lucide-react"
import { useTheme } from "@/contexts/themeContext"

export function LoadingMessage() {
  const { isDark } = useTheme()

  const surface   = isDark ? "#111114" : "#ffffff"
  const border    = isDark ? "#232329" : "#e0e0de"
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
          <div style={{ fontSize: 11, fontWeight: 600, color: textMuted, marginBottom: 8 }}>
            AI Assistant
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 5 }}>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: i === 0
                      ? "var(--color-primary)"
                      : i === 1
                      ? "var(--color-accent)"
                      : "color-mix(in srgb, var(--color-primary) 60%, var(--color-secondary))",
                    animation: "loadingPulse 1.2s ease-in-out infinite",
                    animationDelay: i === 0 ? "-0.3s" : i === 1 ? "-0.15s" : "0s",
                  }}
                />
              ))}
            </div>
            <span style={{ color: textMuted, fontSize: 12, fontWeight: 500 }}>Thinking…</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loadingPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }
      `}</style>
    </div>
  )
}