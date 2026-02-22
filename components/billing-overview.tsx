"use client"

import { DollarSign, TrendingUp, CreditCard, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useTheme } from "@/contexts/themeContext"

interface BillingOverviewProps {
  billingData: {
    credits?: { balance: number; total_spent: number; total_topped_up: number }
    transactions?: Array<{
      id: string
      type: string
      amount: number
      description: string
      created_at: string
      status?: string
    }>
    monthlyUsage?: Array<{ month: string; amount: number }>
  } | null
}

export function BillingOverview({ billingData }: BillingOverviewProps) {
  const { isDark } = useTheme()

  const bg     = isDark ? "#0D0D0F" : "#f8f8f6"
  const card   = isDark ? "#1A1B1F" : "#ffffff"
  const border = isDark ? "#202126" : "#e2e2e0"
  const text   = isDark ? "#ffffff" : "#0a0a0b"
  const muted  = isDark ? "#71717a" : "#71717a"
  const subtle = isDark ? "#52525b" : "#a1a1aa"

  const credits = billingData?.credits ?? { balance: 0, total_spent: 0, total_topped_up: 0 }
  const safe = {
    balance:        typeof credits.balance        === "number" ? credits.balance        : 0,
    total_spent:    typeof credits.total_spent    === "number" ? credits.total_spent    : 0,
    total_topped_up: typeof credits.total_topped_up === "number" ? credits.total_topped_up : 0,
  }

  const transactions = billingData?.transactions ?? []
  const usagePercent = safe.total_topped_up > 0
    ? Math.min(100, (safe.total_spent / safe.total_topped_up) * 100)
    : 0

  const estimatedCalls = Math.floor(safe.balance / 0.001)

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

  const statCards = [
    {
      label: "Current Balance",
      value: fmt(safe.balance),
      sub: `~${estimatedCalls.toLocaleString()} API calls remaining`,
      icon: DollarSign,
      color: "#10b981",
      trend: null,
    },
    {
      label: "Total Spent",
      value: fmt(safe.total_spent),
      sub: "All-time usage",
      icon: TrendingUp,
      color: "#ef4444",
      trend: null,
    },
    {
      label: "Total Deposited",
      value: fmt(safe.total_topped_up),
      sub: "All-time top-ups",
      icon: CreditCard,
      color: "#6366f1",
      trend: null,
    },
    {
      label: "Avg Cost / Call",
      value: "$0.001",
      sub: "Per 1K tokens",
      icon: Zap,
      color: "#f59e0b",
      trend: null,
    },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Stat cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 1, background: border,
        border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden",
      }}>
        {statCards.map(s => (
          <div key={s.label} style={{ background: card, padding: "20px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                background: `${s.color}18`, border: `1px solid ${s.color}28` }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: text, letterSpacing: "-0.04em", fontFamily: "monospace", marginBottom: 4 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: subtle }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Balance usage bar */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: text }}>Credit utilisation</div>
            <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>
              {fmt(safe.total_spent)} spent of {fmt(safe.total_topped_up)} deposited
            </div>
          </div>
          <span style={{ fontSize: 20, fontWeight: 900, fontFamily: "monospace", color: usagePercent > 80 ? "#ef4444" : "#10b981", letterSpacing: "-0.04em" }}>
            {usagePercent.toFixed(1)}%
          </span>
        </div>
        {/* Track */}
        <div style={{ height: 6, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", borderRadius: 6, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 6, width: `${usagePercent}%`,
            background: usagePercent > 80
              ? "linear-gradient(90deg, #f59e0b, #ef4444)"
              : "linear-gradient(90deg, #6366f1, #10b981)",
            transition: "width 0.6s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 10, color: subtle }}>$0</span>
          <span style={{ fontSize: 10, color: subtle }}>{fmt(safe.total_topped_up)}</span>
        </div>
      </div>

      {/* Recent transactions */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: text }}>Recent transactions</div>
          <span style={{ fontSize: 11, color: "var(--color-primary)", fontWeight: 600, cursor: "pointer" }}>View all →</span>
        </div>

        {transactions.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 13, color: muted }}>No transactions yet</div>
            <div style={{ fontSize: 11, color: subtle, marginTop: 4 }}>Your billing history will appear here</div>
          </div>
        ) : (
          <div>
            {transactions.slice(0, 8).map((tx, i) => {
              const isCredit = tx.type === "topup" || tx.amount > 0
              return (
                <div key={tx.id ?? i}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px",
                    borderBottom: i < transactions.slice(0,8).length - 1 ? `1px solid ${border}` : "none",
                  }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    background: isCredit ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                    border: `1px solid ${isCredit ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                  }}>
                    {isCredit
                      ? <ArrowDownRight className="w-3.5 h-3.5" style={{ color: "#10b981" }} />
                      : <ArrowUpRight   className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {tx.description ?? (isCredit ? "Credit deposit" : "API usage")}
                    </div>
                    <div style={{ fontSize: 11, color: subtle, marginTop: 2 }}>
                      {tx.created_at ? new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace",
                      color: isCredit ? "#10b981" : "#ef4444" }}>
                      {isCredit ? "+" : "-"}{fmt(Math.abs(tx.amount))}
                    </div>
                    {tx.status && (
                      <div style={{ fontSize: 10, color: subtle, marginTop: 2, textTransform: "capitalize" }}>{tx.status}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pricing reference */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: text }}>Pricing reference</div>
          <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>Pay-as-you-go — no subscriptions</div>
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 1, background: border,
        }}>
          {[
            { model: "GPT-4 Turbo",       price: "$0.01",   per: "/ 1K tokens", color: "#6366f1" },
            { model: "Claude 3.5 Sonnet", price: "$0.003",  per: "/ 1K tokens", color: "#8b5cf6" },
            { model: "Gemini Pro",         price: "$0.001",  per: "/ 1K tokens", color: "#f59e0b" },
            { model: "Llama 3.1 405B",    price: "$0.0008", per: "/ 1K tokens", color: "#10b981" },
            { model: "DALL-E 3",           price: "$0.04",   per: "/ image",     color: "#ec4899" },
            { model: "Whisper v3",         price: "$0.006",  per: "/ minute",    color: "#06b6d4" },
          ].map(p => (
            <div key={p.model} style={{ background: card, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: text, marginBottom: 4 }}>{p.model}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <span style={{ fontSize: 16, fontWeight: 900, fontFamily: "monospace", color: p.color, letterSpacing: "-0.04em" }}>{p.price}</span>
                <span style={{ fontSize: 10, color: subtle }}>{p.per}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}