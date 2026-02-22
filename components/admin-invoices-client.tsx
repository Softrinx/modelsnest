"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/themeContext"
import { AdminTransaction } from "@/app/actions/admin"
import Link from "next/link"
import {
  Receipt, Search, Filter, ChevronDown, ChevronLeft, ChevronRight,
  X, AlertCircle, ArrowUpRight, ArrowDownLeft, RefreshCw, Eye,
  TrendingUp, DollarSign, FileText, Clock
} from "lucide-react"

interface AdminInvoicesClientProps {
  transactions: AdminTransaction[]
}

function TypeBadge({ type, isDark, border }: { type: AdminTransaction["type"]; isDark: boolean; border: string }) {
  const cfg: Record<string, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
    topup:  { bg: "rgba(16,185,129,0.12)",  color: "#10b981", label: "Top-up",  icon: <ArrowUpRight size={11} /> },
    usage:  { bg: "rgba(239,68,68,0.12)",   color: "#ef4444", label: "Usage",   icon: <ArrowDownLeft size={11} /> },
    refund: { bg: "rgba(99,102,241,0.12)",  color: "#6366f1", label: "Refund",  icon: <RefreshCw size={11} /> },
  }
  const c = cfg[type] ?? { bg: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", color: "#71717a", label: type, icon: null }
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 9px", borderRadius: 6, fontSize: 11, fontWeight: 700,
      background: c.bg, color: c.color, border: `1px solid ${c.color}30`, textTransform: "capitalize",
    }}>
      {c.icon}{c.label}
    </span>
  )
}

function StatusBadge({ status }: { status: AdminTransaction["status"] }) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    completed: { bg: "rgba(16,185,129,0.12)",  color: "#10b981", label: "Completed" },
    pending:   { bg: "rgba(245,158,11,0.12)",  color: "#f59e0b", label: "Pending" },
    failed:    { bg: "rgba(239,68,68,0.12)",   color: "#ef4444", label: "Failed" },
    cancelled: { bg: "rgba(113,113,122,0.12)", color: "#71717a", label: "Cancelled" },
  }
  const c = cfg[status] ?? cfg.completed
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 9px", borderRadius: 6, fontSize: 11, fontWeight: 700,
      background: c.bg, color: c.color, border: `1px solid ${c.color}30`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.color, display: "inline-block" }} />
      {c.label}
    </span>
  )
}

export function AdminInvoicesClient({ transactions }: AdminInvoicesClientProps) {
  const { isDark } = useTheme()
  const [searchQuery, setSearchQuery]   = useState("")
  const [typeFilter, setTypeFilter]     = useState<"all" | "topup" | "usage" | "refund">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending" | "failed" | "cancelled">("all")
  const [currentPage, setCurrentPage]   = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [showFilters, setShowFilters]   = useState(false)

  const bg        = isDark ? "#0d0d10" : "#f8f8f6"
  const surface   = isDark ? "#111114" : "#ffffff"
  const border    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const text      = isDark ? "#f4f4f5" : "#09090b"
  const textMuted = isDark ? "#71717a" : "#71717a"
  const textSub   = isDark ? "#52525b" : "#a1a1aa"

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  const fmtTime = (d: string) => new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

  const summary = useMemo(() => {
    const topups  = transactions.filter(t => t.type === "topup"  && t.status === "completed").reduce((a, t) => a + t.amount, 0)
    const usage   = transactions.filter(t => t.type === "usage"  && t.status === "completed").reduce((a, t) => a + t.amount, 0)
    const refunds = transactions.filter(t => t.type === "refund" && t.status === "completed").reduce((a, t) => a + t.amount, 0)
    return { topups, usage, refunds, count: transactions.length }
  }, [transactions])

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const q = searchQuery.toLowerCase()
      const matchSearch = !q || t.user_name?.toLowerCase().includes(q) || t.user_email?.toLowerCase().includes(q) || t.reference_id?.toLowerCase().includes(q)
      const matchType   = typeFilter   === "all" || t.type   === typeFilter
      const matchStatus = statusFilter === "all" || t.status === statusFilter
      return matchSearch && matchType && matchStatus
    })
  }, [transactions, searchQuery, typeFilter, statusFilter])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginated  = filtered.slice(startIndex, startIndex + itemsPerPage)
  const resetPage  = () => setCurrentPage(1)
  const hasFilters = typeFilter !== "all" || statusFilter !== "all" || !!searchQuery
  const clearFilters = () => { setTypeFilter("all"); setStatusFilter("all"); setSearchQuery(""); resetPage() }

  const summaryCards = [
    { label: "Total Transactions", value: summary.count.toLocaleString(), icon: FileText,   color: "#6366f1", sub: "All time" },
    { label: "Total Collected",    value: fmt(summary.topups),            icon: DollarSign, color: "#10b981", sub: "Completed top-ups" },
    { label: "Total Usage",        value: fmt(summary.usage),             icon: TrendingUp, color: "#f59e0b", sub: "Completed usage" },
    { label: "Total Refunds",      value: fmt(summary.refunds),           icon: RefreshCw,  color: "#8b5cf6", sub: "Completed refunds" },
  ]

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
          backgroundImage: `radial-gradient(circle,${isDark ? "rgba(16,185,129,0.04)" : "rgba(16,185,129,0.02)"} 1px,transparent 1px)`,
          backgroundSize: "28px 28px" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1400 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Receipt size={16} style={{ color: "#10b981" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted }}>
              Finance
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: text, marginBottom: 8 }}>
                Invoices
              </h1>
              <p style={{ fontSize: 14, color: textMuted, maxWidth: 480 }}>
                Complete transaction history, invoices, and receipts across all users.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: surface, border: `1px solid ${border}`, borderRadius: 10 }}>
              <Clock size={14} style={{ color: textSub }} />
              <span style={{ fontSize: 13, color: textMuted }}>
                {filtered.length} record{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "32px 48px", maxWidth: 1400 }}>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 1, background: border, marginBottom: 32 }}>
          {summaryCards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ padding: "24px 20px", background: surface, position: "relative", overflow: "hidden" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${card.color}18`, border: `1px solid ${card.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <card.icon size={18} style={{ color: card.color }} />
              </div>
              <div style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 900, letterSpacing: "-0.03em", color: text, fontFamily: "monospace", marginBottom: 4 }}>
                {card.value}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: text, marginBottom: 2 }}>{card.label}</div>
              <div style={{ fontSize: 11, color: textSub }}>{card.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Search + Filters */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <div style={{ position: "relative", flex: "1 1 300px" }}>
              <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: textSub, pointerEvents: "none" }} />
              <input
                type="text"
                placeholder="Search by name, email or reference..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); resetPage() }}
                style={{
                  width: "100%", padding: "11px 14px 11px 42px",
                  background: surface, border: `1px solid ${border}`, borderRadius: 10,
                  fontSize: 14, color: text, outline: "none", transition: "border-color 0.15s",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#10b981"}
                onBlur={e => e.currentTarget.style.borderColor = border}
              />
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "11px 18px",
                background: showFilters ? "rgba(16,185,129,0.1)" : surface,
                border: `1px solid ${showFilters ? "rgba(16,185,129,0.4)" : border}`,
                borderRadius: 10, color: showFilters ? "#10b981" : text,
                fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              }}
            >
              <Filter size={15} />
              Filters
              {hasFilters && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />}
              <ChevronDown size={15} style={{ transform: showFilters ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, padding: 16, background: surface, border: `1px solid ${border}`, borderRadius: 10, marginBottom: 12 }}>
                  {[
                    { label: "Type",     value: typeFilter,   setter: (v: any) => { setTypeFilter(v);   resetPage() }, options: [["all","All Types"],["topup","Top-up"],["usage","Usage"],["refund","Refund"]] },
                    { label: "Status",   value: statusFilter, setter: (v: any) => { setStatusFilter(v); resetPage() }, options: [["all","All Status"],["completed","Completed"],["pending","Pending"],["failed","Failed"],["cancelled","Cancelled"]] },
                    { label: "Per page", value: itemsPerPage, setter: (v: any) => { setItemsPerPage(Number(v)); resetPage() }, options: [[10,"10"],[20,"20"],[50,"50"],[100,"100"]] },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: textMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>{f.label}</label>
                      <select value={f.value} onChange={e => f.setter(e.target.value)}
                        style={{ width: "100%", padding: "9px 12px", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${border}`, borderRadius: 8, color: text, fontSize: 13, cursor: "pointer" }}>
                        {f.options.map(([v, l]) => <option key={String(v)} value={v}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: textMuted }}>
            <span>
              Showing <strong style={{ color: text }}>{paginated.length > 0 ? startIndex + 1 : 0}</strong>–<strong style={{ color: text }}>{Math.min(startIndex + itemsPerPage, filtered.length)}</strong> of <strong style={{ color: text }}>{filtered.length}</strong>
            </span>
            {hasFilters && (
              <button onClick={clearFilters} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 11px", background: "transparent", border: `1px solid ${border}`, borderRadius: 7, color: textMuted, fontSize: 12, cursor: "pointer" }}>
                <X size={13} />Clear filters
              </button>
            )}
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div style={{ display: "none" }} className="lg:block">
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", borderBottom: `1px solid ${border}` }}>
                    {["Date", "User", "Type", "Amount", "Status", "Reference", "Action"].map(h => (
                      <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: textMuted, whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: "56px 24px", textAlign: "center", color: textSub }}>
                        <AlertCircle size={28} style={{ margin: "0 auto 10px", opacity: 0.4, display: "block" }} />
                        <div style={{ fontSize: 14 }}>No transactions found</div>
                      </td>
                    </tr>
                  ) : paginated.map((t, i) => (
                    <motion.tr key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }}
                      style={{ borderBottom: `1px solid ${border}`, transition: "background 0.12s" }}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.018)" : "rgba(0,0,0,0.018)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "15px 16px" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{fmtDate(t.created_at)}</div>
                        <div style={{ fontSize: 11, color: textSub }}>{fmtTime(t.created_at)}</div>
                      </td>
                      <td style={{ padding: "15px 16px" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{t.user_name || "N/A"}</div>
                        <div style={{ fontSize: 11, color: textSub }}>{t.user_email}</div>
                      </td>
                      <td style={{ padding: "15px 16px" }}><TypeBadge type={t.type} isDark={isDark} border={border} /></td>
                      <td style={{ padding: "15px 16px" }}>
                        <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "monospace", color: t.type === "topup" ? "#10b981" : t.type === "refund" ? "#6366f1" : "#ef4444" }}>
                          {t.type === "topup" ? "+" : "−"}{fmt(t.amount)}
                        </span>
                      </td>
                      <td style={{ padding: "15px 16px" }}><StatusBadge status={t.status} /></td>
                      <td style={{ padding: "15px 16px" }}>
                        <span style={{ fontSize: 11, fontFamily: "monospace", color: textMuted, background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", padding: "3px 8px", borderRadius: 5 }}>
                          {t.reference_id ? `...${t.reference_id.slice(-10)}` : "N/A"}
                        </span>
                      </td>
                      <td style={{ padding: "15px 16px" }}>
                        <Link href={`/admin/invoices/${t.id}`} style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "7px 14px", background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                          border: `1px solid ${border}`, borderRadius: 8,
                          color: text, fontSize: 12, fontWeight: 600, textDecoration: "none", transition: "all 0.12s",
                        }}
                          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(16,185,129,0.1)"; el.style.borderColor = "rgba(16,185,129,0.4)"; el.style.color = "#10b981" }}
                          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"; el.style.borderColor = border; el.style.color = text }}
                        >
                          <Eye size={13} />View
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MOBILE CARDS */}
        <div style={{ display: "block" }} className="lg:hidden">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {paginated.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", background: surface, border: `1px solid ${border}`, borderRadius: 12, color: textSub }}>
                <AlertCircle size={28} style={{ margin: "0 auto 10px", opacity: 0.4, display: "block" }} />
                <div style={{ fontSize: 14 }}>No transactions found</div>
              </div>
            ) : paginated.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                style={{ padding: 18, background: surface, border: `1px solid ${border}`, borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{t.user_name || "N/A"}</div>
                    <div style={{ fontSize: 12, color: textSub }}>{t.user_email}</div>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 900, fontFamily: "monospace", color: t.type === "topup" ? "#10b981" : t.type === "refund" ? "#6366f1" : "#ef4444" }}>
                    {t.type === "topup" ? "+" : "−"}{fmt(t.amount)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                  <TypeBadge type={t.type} isDark={isDark} border={border} />
                  <StatusBadge status={t.status} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${border}` }}>
                  <div>
                    <div style={{ fontSize: 11, color: textSub }}>{fmtDate(t.created_at)} · {fmtTime(t.created_at)}</div>
                    {t.reference_id && <div style={{ fontSize: 10, fontFamily: "monospace", color: textSub, marginTop: 2 }}>ref: ...{t.reference_id.slice(-10)}</div>}
                  </div>
                  <Link href={`/admin/invoices/${t.id}`} style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 14px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
                    borderRadius: 8, color: "#10b981", fontSize: 12, fontWeight: 600, textDecoration: "none",
                  }}>
                    <Receipt size={13} />Invoice
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, padding: "14px 18px", background: surface, border: `1px solid ${border}`, borderRadius: 10 }}>
            <div style={{ fontSize: 13, color: textMuted }}>
              Page <strong style={{ color: text }}>{currentPage}</strong> of <strong style={{ color: text }}>{totalPages}</strong>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${border}`, borderRadius: 8, color: text, fontSize: 13, fontWeight: 600, cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.4 : 1 }}>
                <ChevronLeft size={15} />Previous
              </button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 14px", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${border}`, borderRadius: 8, color: text, fontSize: 13, fontWeight: 600, cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.4 : 1 }}>
                Next<ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}