"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/themeContext"
import { AdminUser, AdminTransaction } from "@/app/actions/admin"
import {
  Users, DollarSign, TrendingUp, TrendingDown, Activity,
  ArrowUpRight, ArrowDownLeft, RefreshCw, BarChart2, PieChart,
  Calendar, Zap
} from "lucide-react"

interface Props {
  users: AdminUser[]
  transactions: AdminTransaction[]
}

// Simple bar chart using divs
function BarChart({ data, color, height = 120 }: { data: { label: string; value: number }[]; color: string; height?: number }) {
  const max = Math.max(...data.map(d => d.value), 1)
  const { isDark } = useTheme()
  const textSub = isDark ? "#52525b" : "#a1a1aa"
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height, paddingBottom: 20, position: "relative" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.value / max) * (height - 24)}px` }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
            style={{
              width: "100%", background: d.value === 0 ? "transparent" : `${color}`,
              minHeight: d.value > 0 ? 2 : 0,
              position: "relative",
            }}
            title={`${d.label}: ${d.value}`}
          >
            <div style={{ position: "absolute", bottom: "calc(100% + 2px)", left: "50%", transform: "translateX(-50%)",
              fontSize: 9, color: textSub, whiteSpace: "nowrap" }}>
              {d.value > 0 ? d.value : ""}
            </div>
          </motion.div>
          <div style={{ fontSize: 9, color: textSub, marginTop: 4, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", maxWidth: "100%" }}>{d.label}</div>
        </div>
      ))}
    </div>
  )
}

// Horizontal bar
function HBar({ label, value, max, color, fmt }: { label: string; value: number; max: number; color: string; fmt: (n: number) => string }) {
  const { isDark } = useTheme()
  const text    = isDark ? "#f4f4f5" : "#09090b"
  const textSub = isDark ? "#52525b" : "#a1a1aa"
  const border  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const pct     = max > 0 ? (value / max) * 100 : 0
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: text, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color }}>{fmt(value)}</span>
      </div>
      <div style={{ height: 5, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ height: "100%", background: color }} />
      </div>
    </div>
  )
}

export function AdminAnalyticsClient({ users, transactions }: Props) {
  const { isDark } = useTheme()

  const bg        = isDark ? "#0d0d10" : "#f8f8f6"
  const surface   = isDark ? "#111114" : "#ffffff"
  const border    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const text      = isDark ? "#f4f4f5" : "#09090b"
  const textMuted = isDark ? "#71717a" : "#71717a"
  const textSub   = isDark ? "#52525b" : "#a1a1aa"

  const fmt  = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
  const fmtN = (n: number) => new Intl.NumberFormat("en-US").format(n)

  // ── Computed analytics ────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const completed = transactions.filter(t => t.status === "completed")
    const topups    = completed.filter(t => t.type === "topup")
    const usage     = completed.filter(t => t.type === "usage")
    const refunds   = completed.filter(t => t.type === "refund")

    const totalRevenue    = topups.reduce((a, t) => a + t.amount, 0)
    const totalUsage      = usage.reduce((a, t) => a + t.amount, 0)
    const totalRefunds    = refunds.reduce((a, t) => a + t.amount, 0)
    const netRevenue      = totalRevenue - totalRefunds
    const grossMargin     = totalRevenue > 0 ? ((netRevenue - totalUsage) / totalRevenue) * 100 : 0
    const avgTopup        = topups.length > 0 ? totalRevenue / topups.length : 0
    const avgUsagePerUser = users.length > 0 ? totalUsage / users.length : 0

    const activeUsers     = users.filter(u => !u.is_suspended).length
    const suspendedUsers  = users.filter(u => u.is_suspended).length
    const adminUsers      = users.filter(u => u.role === "admin").length
    const totalBalance    = users.reduce((a, u) => a + (u.balance ?? 0), 0)
    const avgBalance      = users.length > 0 ? totalBalance / users.length : 0

    // Users joined by month (last 6 months)
    const now   = new Date()
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      return { label: d.toLocaleString("default", { month: "short" }), year: d.getFullYear(), month: d.getMonth() }
    })
    const usersByMonth = months.map(m => ({
      label: m.label,
      value: users.filter(u => {
        const d = new Date(u.created_at)
        return d.getFullYear() === m.year && d.getMonth() === m.month
      }).length,
    }))

    // Revenue by month (last 6 months)
    const revenueByMonth = months.map(m => ({
      label: m.label,
      value: Math.round(topups.filter(t => {
        const d = new Date(t.created_at)
        return d.getFullYear() === m.year && d.getMonth() === m.month
      }).reduce((a, t) => a + t.amount, 0)),
    }))

    // Transaction breakdown
    const txByType = [
      { label: "Top-ups",  value: topups.length,   amount: totalRevenue,  color: "#10b981" },
      { label: "Usage",    value: usage.length,     amount: totalUsage,    color: "#ef4444" },
      { label: "Refunds",  value: refunds.length,   amount: totalRefunds,  color: "#6366f1" },
    ]

    // Status breakdown
    const txByStatus = [
      { label: "Completed", value: transactions.filter(t => t.status === "completed").length, color: "#10b981" },
      { label: "Pending",   value: transactions.filter(t => t.status === "pending").length,   color: "#f59e0b" },
      { label: "Failed",    value: transactions.filter(t => t.status === "failed").length,    color: "#ef4444" },
      { label: "Cancelled", value: transactions.filter(t => t.status === "cancelled").length, color: "#71717a" },
    ]

    // Top users by spend
    const userSpend = users.map(u => ({
      name: u.name || u.email,
      email: u.email,
      spend: completed.filter(t => t.user_email === u.email && t.type === "usage").reduce((a, t) => a + t.amount, 0),
      topups: completed.filter(t => t.user_email === u.email && t.type === "topup").reduce((a, t) => a + t.amount, 0),
    })).sort((a, b) => b.topups - a.topups).slice(0, 5)

    return {
      totalRevenue, totalUsage, totalRefunds, netRevenue, grossMargin,
      avgTopup, avgUsagePerUser, activeUsers, suspendedUsers, adminUsers,
      totalBalance, avgBalance, usersByMonth, revenueByMonth,
      txByType, txByStatus, userSpend,
      totalTx: transactions.length, completedTx: completed.length,
    }
  }, [users, transactions])

  const kpiCards = [
    { label: "Total Revenue",   value: fmt(stats.totalRevenue),   icon: DollarSign,  color: "#10b981", sub: "Completed top-ups" },
    { label: "Net Revenue",     value: fmt(stats.netRevenue),     icon: TrendingUp,  color: "#6366f1", sub: "After refunds" },
    { label: "Gross Margin",    value: `${stats.grossMargin.toFixed(1)}%`, icon: BarChart2,  color: stats.grossMargin >= 0 ? "#10b981" : "#ef4444", sub: "Rev minus cost" },
    { label: "Total Users",     value: fmtN(users.length),        icon: Users,       color: "#8b5cf6", sub: `${stats.activeUsers} active` },
    { label: "Total Spend",     value: fmt(stats.totalUsage),     icon: Zap,         color: "#f59e0b", sub: "API usage billed" },
    { label: "Avg Top-up",      value: fmt(stats.avgTopup),       icon: ArrowUpRight,color: "#10b981", sub: "Per transaction" },
    { label: "Avg Balance",     value: fmt(stats.avgBalance),     icon: Activity,    color: "#6366f1", sub: "Across all users" },
    { label: "Transactions",    value: fmtN(stats.totalTx),       icon: RefreshCw,   color: "#f59e0b", sub: `${stats.completedTx} completed` },
  ]

  return (
    <div style={{ minHeight: "100vh", background: bg }}>

      {/* PAGE HEADER */}
      <div style={{ padding: "40px 48px 36px", borderBottom: `1px solid ${border}`, background: isDark ? "linear-gradient(160deg,#0d0d10,#111118)" : surface, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `radial-gradient(circle,${isDark ? "rgba(99,102,241,0.04)" : "rgba(99,102,241,0.02)"} 1px,transparent 1px)`, backgroundSize: "28px 28px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1400 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <BarChart2 size={16} style={{ color: "#6366f1" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted }}>Admin</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: text, marginBottom: 8 }}>Analytics</h1>
          <p style={{ fontSize: 14, color: textMuted, maxWidth: 520 }}>Platform-wide metrics, revenue trends, and user insights.</p>
        </div>
      </div>

      <div style={{ padding: "32px 48px", maxWidth: 1400 }}>

        {/* KPI CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 1, background: border, marginBottom: 28 }}>
          {kpiCards.map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              style={{ padding: "22px 20px", background: surface }}>
              <div style={{ width: 38, height: 38, borderRadius: 4, background: `${c.color}18`, border: `1px solid ${c.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <c.icon size={17} style={{ color: c.color }} />
              </div>
              <div style={{ fontSize: "clamp(1.2rem,2vw,1.7rem)", fontWeight: 900, letterSpacing: "-0.03em", color: c.color, fontFamily: "monospace", marginBottom: 4 }}>{c.value}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: text, marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: textSub }}>{c.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* CHARTS ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 1, background: border, marginBottom: 28 }}>

          {/* User growth chart */}
          <div style={{ background: surface, padding: "24px 24px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 20 }}>
              <Users size={14} style={{ color: "#8b5cf6" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted }}>New Users — Last 6 Months</span>
            </div>
            <BarChart data={stats.usersByMonth} color="#8b5cf6" height={130} />
          </div>

          {/* Revenue chart */}
          <div style={{ background: surface, padding: "24px 24px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 20 }}>
              <DollarSign size={14} style={{ color: "#10b981" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted }}>Revenue ($) — Last 6 Months</span>
            </div>
            <BarChart data={stats.revenueByMonth} color="#10b981" height={130} />
          </div>
        </div>

        {/* BREAKDOWN ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 1, background: border, marginBottom: 28 }}>

          {/* Transaction type breakdown */}
          <div style={{ background: surface, padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 20 }}>
              <PieChart size={14} style={{ color: "#f59e0b" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted }}>Transaction Types</span>
            </div>
            {stats.txByType.map(t => (
              <HBar key={t.label} label={`${t.label} (${t.value})`} value={t.amount} max={stats.totalRevenue || 1} color={t.color} fmt={fmt} />
            ))}
          </div>

          {/* Transaction status breakdown */}
          <div style={{ background: surface, padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 20 }}>
              <Activity size={14} style={{ color: "#6366f1" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted }}>Transaction Status</span>
            </div>
            {stats.txByStatus.map(s => (
              <HBar key={s.label} label={s.label} value={s.value} max={stats.totalTx || 1} color={s.color} fmt={fmtN} />
            ))}
          </div>

          {/* User breakdown */}
          <div style={{ background: surface, padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 20 }}>
              <Users size={14} style={{ color: "#8b5cf6" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted }}>User Breakdown</span>
            </div>
            {[
              { label: "Active users",    value: stats.activeUsers,    color: "#10b981" },
              { label: "Suspended users", value: stats.suspendedUsers, color: "#f59e0b" },
              { label: "Admin accounts",  value: stats.adminUsers,     color: "#8b5cf6" },
            ].map(r => (
              <HBar key={r.label} label={r.label} value={r.value} max={users.length || 1} color={r.color} fmt={fmtN} />
            ))}

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: textMuted }}>Total platform balance</span>
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: text }}>{fmt(stats.totalBalance)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: textMuted }}>Avg balance per user</span>
                <span style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: text }}>{fmt(stats.avgBalance)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TOP USERS TABLE */}
        <div style={{ background: surface, border: `1px solid ${border}` }}>
          <div style={{ padding: "18px 22px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={14} style={{ color: "#10b981" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted }}>Top 5 Users by Revenue</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", borderBottom: `1px solid ${border}` }}>
                  {["#", "User", "Total Top-ups", "Total Spend", "Net"].map(h => (
                    <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.userSpend.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: "32px", textAlign: "center", color: textSub, fontSize: 13 }}>No data</td></tr>
                ) : stats.userSpend.map((u, i) => (
                  <motion.tr key={u.email} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    style={{ borderBottom: `1px solid ${border}`, transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.018)" : "rgba(0,0,0,0.018)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 800, color: textSub }}>#{i + 1}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: textSub }}>{u.email}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#10b981" }}>{fmt(u.topups)}</td>
                    <td style={{ padding: "14px 16px", fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#ef4444" }}>{fmt(u.spend)}</td>
                    <td style={{ padding: "14px 16px", fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: u.topups - u.spend >= 0 ? "#6366f1" : "#ef4444" }}>
                      {fmt(u.topups - u.spend)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}