"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/themeContext"
import { useSidebar } from "@/components/dashboard-layout-controller"
import { getUserTokens, getUserIntegrations } from "@/app/actions/api-tokens"
import { generateUserId } from "@/lib/api-utils"
import { ApiTokensList } from "@/components/api-tokens-list"
import { CreateTokenDialog } from "@/components/create-token-dialog"
import { UserIdSection } from "@/components/user-id-section"
import { IntegrationsSection } from "@/components/integrations-section"
import Link from "next/link"
import { Key, ExternalLink, Terminal, ChevronRight, Zap, Plug, Activity } from "lucide-react"
import type { DashboardUser } from "@/types/dashboard-user"

interface ApiTokensMainProps { user: DashboardUser }

function Section({
  title, icon: Icon, color, border, surface, text, muted, isDark, action, children,
}: {
  title: string; icon: any; color: string; border: string; surface: string
  text: string; muted: string; isDark: boolean; action?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div style={{ border: `1px solid ${border}` }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "13px 20px", borderBottom: `1px solid ${border}`,
        background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6, flexShrink: 0,
            background: `color-mix(in srgb, ${color} 12%, transparent)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon size={13} style={{ color }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: text }}>{title}</span>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div style={{ padding: "20px 20px", background: surface }}>
        {children}
      </div>
    </div>
  )
}

export function ApiTokensMain({ user }: ApiTokensMainProps) {
  const { isDark } = useTheme()
  const { sidebarWidth } = useSidebar()
  const [tokens, setTokens]             = useState<any[]>([])
  const [integrations, setIntegrations] = useState<any[]>([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    Promise.all([getUserTokens(), getUserIntegrations()])
      .then(([t, i]) => { setTokens(t.data ?? []); setIntegrations(i.data ?? []) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const userId  = generateUserId(user.email, user.id)
  const bg      = isDark ? "#0d0d10" : "#f8f8f6"
  const surface = isDark ? "#111114" : "#ffffff"
  const border  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const text    = isDark ? "#f4f4f5" : "#09090b"
  const muted   = isDark ? "#52525b" : "#a1a1aa"
  const subtext = isDark ? "#71717a" : "#71717a"

  if (loading) return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ width: 34, height: 34, borderRadius: "50%", border: `3px solid ${border}`, borderTopColor: "var(--color-primary)", margin: "0 auto 14px" }}
        />
        <span style={{ fontSize: 13, color: muted }}>Loading API tokens…</span>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column" }}>

      {/* ── HEADER ── */}
      <div style={{
        padding: "40px 48px 32px", borderBottom: `1px solid ${border}`,
        background: isDark ? "linear-gradient(160deg,#0d0d10,#111118)" : surface,
        position: "relative", overflow: "hidden",
      }}>
        {/* Grid texture */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle,${isDark ? "rgba(99,102,241,0.05)" : "rgba(99,102,241,0.02)"} 1px,transparent 1px)`,
          backgroundSize: "28px 28px" }} />
        {/* Glow */}
        <div style={{ position: "absolute", top: -60, right: 100, width: 400, height: 280, borderRadius: "50%",
          background: isDark ? "radial-gradient(ellipse,rgba(99,102,241,0.08) 0%,transparent 70%)" : "transparent",
          pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--color-primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 14px color-mix(in srgb,var(--color-primary) 40%,transparent)" }}>
                  <Key size={16} style={{ color: "#fff" }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-primary)" }}>
                  Modelsnest API
                </span>
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.04em", color: text, marginBottom: 8, lineHeight: 1 }}>
                API Tokens
              </h1>
              <p style={{ fontSize: 14, color: subtext, maxWidth: 460, lineHeight: 1.7 }}>
                Manage your API access tokens and third-party integrations.{" "}
                <span style={{ color: "#ef4444", fontWeight: 600 }}>Keep your tokens secret.</span>
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 1, background: border, flexShrink: 0 }}>
              {[
                { n: tokens.length.toString(), l: "Tokens" },
                { n: integrations.length.toString(), l: "Integrations" },
                { n: "99.9%", l: "Uptime" },
              ].map(s => (
                <div key={s.l} style={{ padding: "14px 20px", background: surface }}>
                  <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "monospace", color: text, letterSpacing: "-0.04em" }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: muted }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action row */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <CreateTokenDialog />
            <Link href="/docs/api" style={{ textDecoration: "none" }}>
              <button
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "0 16px", height: 38,
                  background: "transparent", border: `1px solid ${border}`, color: muted,
                  fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = text; e.currentTarget.style.borderColor = "var(--color-primary)" }}
                onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.borderColor = border }}
              >
                <ExternalLink size={13} /> API Reference <ChevronRight size={12} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, padding: "36px 48px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* User ID */}
        <Section title="Your User ID" icon={Activity} color="#10b981"
          border={border} surface={surface} text={text} muted={muted} isDark={isDark}>
          <UserIdSection userId={userId} />
        </Section>

        {/* Personal Tokens */}
        <Section
          title="Personal API Tokens" icon={Key} color="var(--color-primary)"
          border={border} surface={surface} text={text} muted={muted} isDark={isDark}
          action={tokens.length > 0 ? <CreateTokenDialog /> : undefined}
        >
          {tokens.length > 0 ? (
            <>
              <p style={{ fontSize: 12, color: muted, marginBottom: 16 }}>
                Default API token created on signup. Regenerate any time.
              </p>
              <ApiTokensList tokens={tokens} />
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Key size={32} style={{ color: muted, margin: "0 auto 12px", display: "block" }} />
              <p style={{ fontSize: 14, color: muted, marginBottom: 16 }}>No API tokens yet</p>
              <CreateTokenDialog />
            </div>
          )}
        </Section>

        {/* Deduction API */}
        <Section title="Token Deduction API" icon={Terminal} color="#06b6d4"
          border={border} surface={surface} text={text} muted={muted} isDark={isDark}>
          <p style={{ fontSize: 13, color: subtext, lineHeight: 1.7, marginBottom: 16 }}>
            Programmatically deduct credits via API. Each successful request deducts{" "}
            <span style={{ color: text, fontWeight: 700, fontFamily: "monospace" }}>$1.00 USD</span> from your balance.
          </p>

          {/* Code block */}
          <div style={{ border: `1px solid ${border}`, overflow: "hidden", marginBottom: 16 }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 14px", background: isDark ? "#0a0a0d" : "#f0f0ee",
              borderBottom: `1px solid ${border}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Terminal size={11} style={{ color: "#06b6d4" }} />
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#06b6d4" }}>cURL</span>
              </div>
              <span style={{ fontSize: 10, fontFamily: "monospace", color: muted }}>POST /api/deduct-credits</span>
            </div>
            <div style={{ padding: "14px 16px", background: isDark ? "#080809" : "#fafaf9", overflowX: "auto" }}>
              <pre style={{ margin: 0, fontSize: 12, fontFamily: "monospace", lineHeight: "22px", color: isDark ? "#c9c9d4" : "#1c1917" }}>
{`curl -X POST ${typeof window !== "undefined" ? window.location.origin : "https://modelsnest.com"}/api/deduct-credits \\
  -H "Authorization: Bearer ptr_YOUR_API_TOKEN"`}
              </pre>
            </div>
          </div>

          {/* Status dots */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {[
              { dot: "#10b981", label: "200 OK — Success" },
              { dot: "#ef4444", label: "402 — Insufficient Funds" },
              { dot: "#f59e0b", label: "401 — Invalid Token" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />
                <span style={{ fontSize: 12, fontFamily: "monospace", color: muted }}>{s.label}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Applications */}
        <Section title="Applications with Access" icon={Plug} color="#8b5cf6"
          border={border} surface={surface} text={text} muted={muted} isDark={isDark}>
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <Plug size={28} style={{ color: muted, margin: "0 auto 10px", display: "block" }} />
            <p style={{ fontSize: 13, color: muted }}>No connected third-party apps</p>
          </div>
        </Section>

        {/* Integrations */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-accent)" }} />
            <span style={{ fontSize: 16, fontWeight: 800, color: text, letterSpacing: "-0.03em" }}>
              Connected Third-party Accounts
            </span>
          </div>
          <Section title="Account-level Integrations" icon={Zap} color="var(--color-accent)"
            border={border} surface={surface} text={text} muted={muted} isDark={isDark}>
            <IntegrationsSection integrations={integrations} />
          </Section>
        </div>

      </div>
    </div>
  )
}