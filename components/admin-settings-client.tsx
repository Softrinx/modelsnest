"use client"

import { useState } from "react"
import { useTheme } from "@/contexts/themeContext"
import { logoutUser } from "@/app/actions/settings"
import { Sun, Moon, Globe, LogOut, RefreshCw, Palette, Shield, ChevronRight } from "lucide-react"

export function AdminSettingsClient() {
  const { isDark, setMode } = useTheme()
  const [loadingLogout, setLoadingLogout] = useState(false)

  const bg        = isDark ? "#0d0d10" : "#f8f8f6"
  const surface   = isDark ? "#111114" : "#ffffff"
  const border    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const text      = isDark ? "#f4f4f5" : "#09090b"
  const textMuted = isDark ? "#71717a" : "#71717a"
  const textSub   = isDark ? "#52525b" : "#a1a1aa"

  const themes = [
    { mode: "dark",  label: "Dark",  icon: Moon, preview: "#0d0d10", previewCard: "#111114", previewBorder: "rgba(255,255,255,0.07)" },
    { mode: "light", label: "Light", icon: Sun,  preview: "#f8f8f6", previewCard: "#ffffff", previewBorder: "rgba(0,0,0,0.08)" },
  ]

  const currentMode = isDark ? "dark" : "light"

  return (
    <div style={{ minHeight: "100vh", background: bg }}>

      {/* PAGE HEADER */}
      <div style={{
        padding: "40px 48px 36px",
        borderBottom: `1px solid ${border}`,
        background: isDark ? "linear-gradient(160deg,#0d0d10,#111118)" : surface,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle,${isDark ? "rgba(139,92,246,0.04)" : "rgba(139,92,246,0.02)"} 1px,transparent 1px)`,
          backgroundSize: "28px 28px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Palette size={16} style={{ color: "#8b5cf6" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted }}>Admin</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: text, marginBottom: 8 }}>
                Settings
              </h1>
              <p style={{ fontSize: 14, color: textMuted }}>
                Appearance preferences for your admin session.
              </p>
            </div>

            {/* Sign out */}
            <button
              onClick={async () => { setLoadingLogout(true); await logoutUser() }}
              disabled={loadingLogout}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 18px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#ef4444", fontSize: 13, fontWeight: 700,
                cursor: loadingLogout ? "not-allowed" : "pointer",
                opacity: loadingLogout ? 0.7 : 1, borderRadius: 0,
              }}
            >
              {loadingLogout ? <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> : <LogOut size={14} />}
              {loadingLogout ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "32px 48px", maxWidth: 800 }}>

        {/* Admin notice */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 18px", marginBottom: 28,
          background: isDark ? "rgba(239,68,68,0.06)" : "rgba(239,68,68,0.04)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderLeft: "3px solid #ef4444",
        }}>
          <Shield size={15} style={{ color: "#ef4444", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 2 }}>Admin account</div>
            <div style={{ fontSize: 11, color: textMuted }}>
              Admin accounts don't have personal profiles. Manage users and system settings from the relevant admin pages.
            </div>
          </div>
        </div>

        {/* Theme section */}
        <div style={{ background: surface, border: `1px solid ${border}` }}>

          {/* Section header */}
          <div style={{ padding: "18px 22px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <Palette size={15} style={{ color: textMuted }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted }}>Appearance</span>
          </div>

          <div style={{ padding: "22px" }}>

            {/* Theme tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: border, marginBottom: 1 }}>
              {themes.map(t => {
                const active = currentMode === t.mode
                return (
                  <button key={t.mode} onClick={() => setMode(t.mode as any)}
                    style={{
                      background: surface, padding: "20px", border: "none",
                      cursor: "pointer", textAlign: "left", position: "relative",
                      outline: active ? "2px solid #8b5cf6" : "none",
                      outlineOffset: -2, transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = surface}
                  >
                    {/* Preview window */}
                    <div style={{
                      width: "100%", height: 80, marginBottom: 14,
                      background: t.preview, border: `1px solid ${t.previewBorder}`,
                      display: "flex", flexDirection: "column", gap: 6,
                      padding: "10px", boxSizing: "border-box",
                    }}>
                      {/* fake sidebar */}
                      <div style={{ display: "flex", gap: 6, height: "100%" }}>
                        <div style={{ width: 28, background: t.previewCard, border: `1px solid ${t.previewBorder}`, flexShrink: 0 }} />
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                          <div style={{ height: 10, background: t.previewCard, border: `1px solid ${t.previewBorder}` }} />
                          <div style={{ height: 6, width: "70%", background: t.previewBorder }} />
                          <div style={{ height: 6, width: "50%", background: t.previewBorder }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <t.icon size={14} style={{ color: active ? "#8b5cf6" : textMuted }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: active ? "#8b5cf6" : text }}>{t.label}</span>
                      </div>
                      {active && (
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                          color: "#8b5cf6", background: "rgba(139,92,246,0.12)",
                          border: "1px solid rgba(139,92,246,0.3)", padding: "2px 7px" }}>
                          Active
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* System option */}
            <button onClick={() => setMode("system")} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "14px 18px",
              background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
              border: `1px solid ${border}`, cursor: "pointer",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Globe size={15} style={{ color: textMuted }} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: text }}>System default</div>
                  <div style={{ fontSize: 11, color: textSub, marginTop: 2 }}>Follows your OS dark/light preference automatically</div>
                </div>
              </div>
              <ChevronRight size={15} style={{ color: textSub }} />
            </button>
          </div>
        </div>

        {/* Info footer */}
        <div style={{ marginTop: 16, padding: "12px 16px", background: "transparent", border: `1px solid ${border}` }}>
          <p style={{ fontSize: 11, color: textSub, margin: 0 }}>
            Theme preference is saved per browser session. Changes apply instantly across all admin pages.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}