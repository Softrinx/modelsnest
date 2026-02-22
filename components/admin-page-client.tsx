"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/themeContext"
import {
  Users, DollarSign, Activity, TrendingUp, ArrowUpRight,
  ArrowDownRight, Sparkles, Clock, CreditCard
} from "lucide-react"

interface AdminStats {
  totalUsers: number
  totalRevenue: number
  totalUsageCost: number
}

export function AdminPageClient({ initialStats }: { initialStats: AdminStats }) {
  const { isDark } = useTheme()
  const [stats, setStats] = useState(initialStats)

  const margin = stats.totalRevenue > 0
    ? (((stats.totalRevenue - stats.totalUsageCost) / stats.totalRevenue) * 100).toFixed(1)
    : "0.0"

  const profit = stats.totalRevenue - stats.totalUsageCost

  const bg        = isDark ? "#0d0d10" : "#f8f8f6"
  const surface   = isDark ? "#111114" : "#ffffff"
  const border    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const text      = isDark ? "#f4f4f5" : "#09090b"
  const textMuted = isDark ? "#71717a" : "#71717a"
  const textSub   = isDark ? "#52525b" : "#a1a1aa"

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      sub: "Registered accounts",
      color: "#6366f1",
      trend: null,
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      sub: "All-time collected",
      color: "#10b981",
      trend: profit > 0 ? "up" : null,
    },
    {
      label: "Usage Cost",
      value: `$${stats.totalUsageCost.toFixed(2)}`,
      icon: Activity,
      sub: "All-time API spend",
      color: "#f59e0b",
      trend: null,
    },
    {
      label: "Gross Margin",
      value: `${margin}%`,
      icon: TrendingUp,
      sub: "Revenue minus costs",
      color: profit > 0 ? "#10b981" : "#ef4444",
      trend: profit > 0 ? "up" : "down",
    },
  ]

  return (
    <div style={{ minHeight: "100vh", background: bg }}>

      {/* ── PAGE HEADER ── */}
      <div style={{
        padding: "40px 48px 36px",
        borderBottom: `1px solid ${border}`,
        background: isDark ? "linear-gradient(160deg,#0d0d10,#111118)" : surface,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle,${isDark?"rgba(239,68,68,0.04)":"rgba(239,68,68,0.02)"} 1px,transparent 1px)`,
          backgroundSize: "28px 28px" }} />
        <div style={{ position: "absolute", top: -100, left: "20%", width: 600, height: 400, borderRadius: "50%",
          background: isDark ? "radial-gradient(ellipse,rgba(239,68,68,0.12) 0%,transparent 70%)" : "transparent", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1400 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  background: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)",
                  color: "#ef4444",
                  border: `1px solid ${isDark ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.25)"}`,
                  borderRadius: 6,
                  boxShadow: "0 0 12px rgba(239,68,68,0.15)",
                }}>
                  Admin Portal
                </span>
              </div>
              <h1 style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: text,
                marginBottom: 8,
              }}>
                Overview
              </h1>
              <p style={{ fontSize: 14, color: textMuted, maxWidth: 480 }}>
                Real-time system metrics, revenue analytics, and user statistics at a glance.
              </p>
            </div>

            {/* Live indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: surface, border: `1px solid ${border}`, borderRadius: 10 }}>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 12px rgba(16,185,129,0.6)" }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: text }}>Live Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ padding: "32px 48px", maxWidth: 1400 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 1, background: border, marginBottom: 32 }}>
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              style={{
                padding: "28px 24px",
                background: surface,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top row: icon + trend */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${card.color}18`,
                    border: `1px solid ${card.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 16px ${card.color}20`,
                  }}
                >
                  <card.icon size={20} style={{ color: card.color }} strokeWidth={2} />
                </motion.div>
                {card.trend && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", borderRadius: 6 }}>
                    {card.trend === "up" ? (
                      <ArrowUpRight size={14} style={{ color: "#10b981" }} />
                    ) : (
                      <ArrowDownRight size={14} style={{ color: "#ef4444" }} />
                    )}
                    <span style={{ fontSize: 11, fontWeight: 700, color: card.trend === "up" ? "#10b981" : "#ef4444" }}>
                      {card.trend === "up" ? "Positive" : "Negative"}
                    </span>
                  </div>
                )}
              </div>

              {/* Value */}
              <div style={{ marginBottom: 8 }}>
                <span style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: text,
                  fontFamily: "monospace",
                }}>
                  {card.value}
                </span>
              </div>

              {/* Label + sub */}
              <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 4 }}>
                {card.label}
              </div>
              <div style={{ fontSize: 12, color: textSub }}>
                {card.sub}
              </div>

              {/* Subtle corner glow */}
              {i === 0 && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 140,
                  height: 140,
                  background: `radial-gradient(circle at top right, ${card.color}08, transparent 70%)`,
                  pointerEvents: "none",
                }} />
              )}
            </motion.div>
          ))}
        </div>

        {/* ── TWO COLUMN BREAKDOWN ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 1, background: border }}>

          {/* Revenue vs Cost */}
          <div style={{ padding: "32px 28px", background: surface }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <Sparkles size={16} style={{ color: "#10b981" }} />
              <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted }}>
                Revenue vs Cost
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { label: "Revenue", value: stats.totalRevenue, color: "#10b981" },
                { label: "Cost",    value: stats.totalUsageCost, color: "#f59e0b" },
                { label: "Profit",  value: profit, color: profit > 0 ? "#6366f1" : "#ef4444" },
              ].map((row) => {
                const pct = stats.totalRevenue > 0 ? Math.min(100, (row.value / stats.totalRevenue) * 100) : 0
                return (
                  <div key={row.label}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: text }}>{row.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 900, fontFamily: "monospace", color: row.color }}>
                        ${row.value.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ height: 6, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", borderRadius: 3, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ height: "100%", background: row.color, borderRadius: 3 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Key Metrics Table */}
          <div style={{ padding: "32px 28px", background: surface }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <CreditCard size={16} style={{ color: "#6366f1" }} />
              <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted }}>
                Key Metrics
              </h3>
            </div>

            <div style={{ border: `1px solid ${border}`, borderRadius: 10, overflow: "hidden" }}>
              {[
                { label: "Revenue per user",  value: stats.totalUsers > 0 ? `$${(stats.totalRevenue / stats.totalUsers).toFixed(2)}` : "—" },
                { label: "Cost per user",     value: stats.totalUsers > 0 ? `$${(stats.totalUsageCost / stats.totalUsers).toFixed(2)}` : "—" },
                { label: "Gross margin",      value: `${margin}%` },
                { label: "Net profit",        value: `$${profit.toFixed(2)}` },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    borderBottom: i < arr.length - 1 ? `1px solid ${border}` : "none",
                    background: i % 2 === 0 ? "transparent" : isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                  }}
                >
                  <span style={{ fontSize: 13, color: textMuted }}>{row.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "monospace", color: text }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div style={{ marginTop: 32, padding: "28px", background: surface, border: `1px solid ${border}`, borderRadius: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Clock size={16} style={{ color: "#8b5cf6" }} />
            <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: textMuted }}>
              Quick Actions
            </h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { label: "View Users", href: "/admin/users", color: "#6366f1" },
              { label: "View Invoices", href: "/admin/invoices", color: "#10b981" },
              { label: "View Transactions", href: "/admin/transactions", color: "#f59e0b" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px 20px",
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                  border: `1px solid ${border}`,
                  borderRadius: 10,
                  color: text,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${action.color}18`
                  e.currentTarget.style.borderColor = `${action.color}40`
                  e.currentTarget.style.color = action.color
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"
                  e.currentTarget.style.borderColor = border
                  e.currentTarget.style.color = text
                }}
              >
                {action.label}
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}