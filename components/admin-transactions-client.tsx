"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/themeContext"
import { AdminTransaction } from "@/app/actions/admin"
import {
  Search, Filter, ChevronDown, ChevronLeft, ChevronRight,
  X, AlertCircle, ArrowUpRight, ArrowDownLeft, RefreshCw,
  TrendingUp, DollarSign, Activity, Clock
} from "lucide-react"

interface Props { transactions: AdminTransaction[] }

function TypeBadge({ type }: { type: AdminTransaction["type"] }) {
  const cfg: Record<string, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
    topup:  { bg: "rgba(16,185,129,0.12)",  color: "#10b981", label: "Top-up",  icon: <ArrowUpRight size={11} /> },
    usage:  { bg: "rgba(239,68,68,0.12)",   color: "#ef4444", label: "Usage",   icon: <ArrowDownLeft size={11} /> },
    refund: { bg: "rgba(99,102,241,0.12)",  color: "#6366f1", label: "Refund",  icon: <RefreshCw size={11} /> },
  }
  const c = cfg[type] ?? { bg: "rgba(113,113,122,0.12)", color: "#71717a", label: type, icon: null }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 4, fontSize: 11, fontWeight: 700, background: c.bg, color: c.color, border: `1px solid ${c.color}30`, textTransform: "capitalize" }}>
      {c.icon}{c.label}
    </span>
  )
}

function StatusDot({ status }: { status: AdminTransaction["status"] }) {
  const cfg: Record<string, { color: string; label: string }> = {
    completed: { color: "#10b981", label: "Completed" },
    pending:   { color: "#f59e0b", label: "Pending" },
    failed:    { color: "#ef4444", label: "Failed" },
    cancelled: { color: "#71717a", label: "Cancelled" },
  }
  const c = cfg[status] ?? cfg.completed
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: c.color, fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, flexShrink: 0, boxShadow: `0 0 6px ${c.color}80` }} />
      {c.label}
    </span>
  )
}

export function AdminTransactionsClient({ transactions }: Props) {
  const { isDark } = useTheme()
  const [search, setSearch]         = useState("")
  const [typeFilter, setTypeFilter] = useState<"all"|"topup"|"usage"|"refund">("all")
  const [statusFilter, setStatus]   = useState<"all"|"completed"|"pending"|"failed"|"cancelled">("all")
  const [page, setPage]             = useState(1)
  const [perPage, setPerPage]       = useState(20)
  const [showFilters, setShowFilters] = useState(false)

  const bg        = isDark ? "#0d0d10" : "#f8f8f6"
  const surface   = isDark ? "#111114" : "#ffffff"
  const border    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const text      = isDark ? "#f4f4f5" : "#09090b"
  const textMuted = isDark ? "#71717a" : "#71717a"
  const textSub   = isDark ? "#52525b" : "#a1a1aa"
  const rowHover  = isDark ? "rgba(255,255,255,0.018)" : "rgba(0,0,0,0.02)"

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  const fmtTime = (d: string) => new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

  const summary = useMemo(() => ({
    volume:  transactions.filter(t => t.status === "completed").reduce((a, t) => a + t.amount, 0),
    topups:  transactions.filter(t => t.type === "topup"  && t.status === "completed").reduce((a, t) => a + t.amount, 0),
    usage:   transactions.filter(t => t.type === "usage"  && t.status === "completed").reduce((a, t) => a + t.amount, 0),
    count:   transactions.length,
  }), [transactions])

  const filtered = useMemo(() => transactions.filter(t => {
    const q = search.toLowerCase()
    const matchQ = !q || t.user_name?.toLowerCase().includes(q) || t.user_email?.toLowerCase().includes(q) || (t.reference_id ?? "").toLowerCase().includes(q)
    return matchQ && (typeFilter === "all" || t.type === typeFilter) && (statusFilter === "all" || t.status === statusFilter)
  }), [transactions, search, typeFilter, statusFilter])

  const totalPages = Math.ceil(filtered.length / perPage)
  const start      = (page - 1) * perPage
  const paginated  = filtered.slice(start, start + perPage)
  const reset      = () => setPage(1)
  const hasFilters = typeFilter !== "all" || statusFilter !== "all" || !!search
  const clearAll   = () => { setTypeFilter("all"); setStatus("all"); setSearch(""); reset() }

  const summaryCards = [
    { label: "Total Transactions", value: summary.count.toLocaleString(), icon: Activity,   color: "#6366f1", sub: "All time" },
    { label: "Total Volume",       value: fmt(summary.volume),            icon: DollarSign, color: "#10b981", sub: "Completed only" },
    { label: "Top-up Revenue",     value: fmt(summary.topups),            icon: TrendingUp, color: "#f59e0b", sub: "Completed top-ups" },
    { label: "Usage Billed",       value: fmt(summary.usage),             icon: ArrowDownLeft, color: "#ef4444", sub: "Completed usage" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: bg }}>

      {/* PAGE HEADER */}
      <div style={{ padding: "40px 48px 36px", borderBottom: `1px solid ${border}`, background: isDark ? "linear-gradient(160deg,#0d0d10,#111118)" : surface, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `radial-gradient(circle,${isDark ? "rgba(99,102,241,0.04)" : "rgba(99,102,241,0.02)"} 1px,transparent 1px)`, backgroundSize: "28px 28px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1400 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Activity size={16} style={{ color: "#6366f1" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted }}>Finance</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: text, marginBottom: 8 }}>Transactions</h1>
              <p style={{ fontSize: 14, color: textMuted, maxWidth: 480 }}>All platform transactions — top-ups, usage charges, and refunds.</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: surface, border: `1px solid ${border}`, borderRadius: 4 }}>
              <Clock size={14} style={{ color: textSub }} />
              <span style={{ fontSize: 13, color: textMuted }}>{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "32px 48px", maxWidth: 1400 }}>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 1, background: border, marginBottom: 28 }}>
          {summaryCards.map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ padding: "22px 20px", background: surface }}>
              <div style={{ width: 38, height: 38, borderRadius: 4, background: `${c.color}18`, border: `1px solid ${c.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <c.icon size={17} style={{ color: c.color }} />
              </div>
              <div style={{ fontSize: "clamp(1.3rem,2.2vw,1.8rem)", fontWeight: 900, letterSpacing: "-0.03em", color: text, fontFamily: "monospace", marginBottom: 4 }}>{c.value}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: text, marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: textSub }}>{c.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Search + filters */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            <div style={{ position: "relative", flex: "1 1 280px" }}>
              <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: textSub, pointerEvents: "none" }} />
              <input type="text" placeholder="Search name, email or reference..." value={search}
                onChange={e => { setSearch(e.target.value); reset() }}
                style={{ width: "100%", padding: "10px 14px 10px 40px", background: surface, border: `1px solid ${border}`, borderRadius: 4, fontSize: 13, color: text, outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.currentTarget.style.borderColor = "#6366f1"}
                onBlur={e => e.currentTarget.style.borderColor = border}
              />
            </div>
            <button onClick={() => setShowFilters(v => !v)} style={{
              display: "flex", alignItems: "center", gap: 7, padding: "10px 16px",
              background: showFilters ? "rgba(99,102,241,0.1)" : surface,
              border: `1px solid ${showFilters ? "rgba(99,102,241,0.4)" : border}`,
              borderRadius: 4, color: showFilters ? "#6366f1" : text, fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              <Filter size={14} />Filters
              {hasFilters && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }} />}
              <ChevronDown size={14} style={{ transform: showFilters ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} style={{ overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10, padding: 14, background: surface, border: `1px solid ${border}`, borderRadius: 4, marginBottom: 10 }}>
                  {[
                    { label: "Type",    val: typeFilter,   set: (v: any) => { setTypeFilter(v); reset() },  opts: [["all","All Types"],["topup","Top-up"],["usage","Usage"],["refund","Refund"]] },
                    { label: "Status",  val: statusFilter, set: (v: any) => { setStatus(v); reset() },      opts: [["all","All Status"],["completed","Completed"],["pending","Pending"],["failed","Failed"],["cancelled","Cancelled"]] },
                    { label: "Per page",val: perPage,      set: (v: any) => { setPerPage(Number(v)); reset() }, opts: [[10,"10"],[20,"20"],[50,"50"],[100,"100"]] },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, marginBottom: 6 }}>{f.label}</label>
                      <select value={f.val} onChange={e => f.set(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${border}`, borderRadius: 4, color: text, fontSize: 13, cursor: "pointer" }}>
                        {f.opts.map(([v, l]) => <option key={String(v)} value={v}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: textMuted }}>
            <span>Showing <strong style={{ color: text }}>{paginated.length > 0 ? start + 1 : 0}</strong>–<strong style={{ color: text }}>{Math.min(start + perPage, filtered.length)}</strong> of <strong style={{ color: text }}>{filtered.length}</strong></span>
            {hasFilters && (
              <button onClick={clearAll} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "transparent", border: `1px solid ${border}`, borderRadius: 4, color: textMuted, fontSize: 11, cursor: "pointer" }}>
                <X size={12} />Clear
              </button>
            )}
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div style={{ display: "none" }} className="lg:block">
          <div style={{ background: surface, border: `1px solid ${border}`, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)", borderBottom: `1px solid ${border}` }}>
                    {["Date & Time", "User", "Type", "Amount", "Status", "Method", "Reference"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: "56px 24px", textAlign: "center", color: textSub }}>
                        <AlertCircle size={26} style={{ margin: "0 auto 10px", opacity: 0.35, display: "block" }} />
                        <div style={{ fontSize: 13 }}>No transactions found</div>
                      </td>
                    </tr>
                  ) : paginated.map((t, i) => {
                    const amtColor = t.type === "topup" ? "#10b981" : t.type === "refund" ? "#6366f1" : "#ef4444"
                    const amtPrefix = t.type === "topup" || t.type === "refund" ? "+" : "−"
                    return (
                      <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                        style={{ borderBottom: `1px solid ${border}`, transition: "background 0.1s" }}
                        onMouseEnter={e => e.currentTarget.style.background = rowHover}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{fmtDate(t.created_at)}</div>
                          <div style={{ fontSize: 11, color: textSub }}>{fmtTime(t.created_at)}</div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{t.user_name || "N/A"}</div>
                          <div style={{ fontSize: 11, color: textSub }}>{t.user_email}</div>
                        </td>
                        <td style={{ padding: "14px 16px" }}><TypeBadge type={t.type} /></td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "monospace", color: amtColor }}>{amtPrefix}{fmt(t.amount)}</span>
                        </td>
                        <td style={{ padding: "14px 16px" }}><StatusDot status={t.status} /></td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: textMuted }}>{t.payment_method || "—"}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: 11, fontFamily: "monospace", color: textMuted, background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", padding: "3px 7px", borderRadius: 3 }}>
                            {t.reference_id ? `...${t.reference_id.slice(-8)}` : "—"}
                          </span>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MOBILE CARDS */}
        <div style={{ display: "block" }} className="lg:hidden">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {paginated.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", background: surface, border: `1px solid ${border}`, color: textSub }}>
                <AlertCircle size={26} style={{ margin: "0 auto 10px", opacity: 0.35, display: "block" }} />
                <div style={{ fontSize: 13 }}>No transactions found</div>
              </div>
            ) : paginated.map((t, i) => {
              const amtColor = t.type === "topup" ? "#10b981" : t.type === "refund" ? "#6366f1" : "#ef4444"
              const amtPrefix = t.type === "topup" || t.type === "refund" ? "+" : "−"
              return (
                <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  style={{ padding: 16, background: surface, border: `1px solid ${border}`, borderLeft: `3px solid ${amtColor}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{t.user_name || "N/A"}</div>
                      <div style={{ fontSize: 11, color: textSub }}>{t.user_email}</div>
                    </div>
                    <span style={{ fontSize: 17, fontWeight: 900, fontFamily: "monospace", color: amtColor }}>{amtPrefix}{fmt(t.amount)}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    <TypeBadge type={t.type} />
                    <StatusDot status={t.status} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid ${border}` }}>
                    <span style={{ fontSize: 11, color: textSub }}>{fmtDate(t.created_at)} · {fmtTime(t.created_at)}</span>
                    {t.reference_id && <span style={{ fontSize: 10, fontFamily: "monospace", color: textSub }}>...{t.reference_id.slice(-8)}</span>}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, padding: "13px 16px", background: surface, border: `1px solid ${border}` }}>
            <span style={{ fontSize: 12, color: textMuted }}>Page <strong style={{ color: text }}>{page}</strong> of <strong style={{ color: text }}>{totalPages}</strong></span>
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { label: "Prev", icon: ChevronLeft, action: () => setPage(p => Math.max(1, p - 1)), disabled: page === 1 },
                { label: "Next", icon: ChevronRight, action: () => setPage(p => Math.min(totalPages, p + 1)), disabled: page === totalPages },
              ].map(btn => (
                <button key={btn.label} onClick={btn.action} disabled={btn.disabled} style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 13px", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${border}`, borderRadius: 4, color: text, fontSize: 12, fontWeight: 600, cursor: btn.disabled ? "not-allowed" : "pointer", opacity: btn.disabled ? 0.4 : 1 }}>
                  {btn.label === "Prev" && <btn.icon size={14} />}{btn.label}{btn.label === "Next" && <btn.icon size={14} />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}