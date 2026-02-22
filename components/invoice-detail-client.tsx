"use client"

import { useTheme } from "@/contexts/themeContext"
import { AdminTransaction } from "@/app/actions/admin"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Printer, Receipt, CheckCircle, Clock, XCircle, AlertCircle, RefreshCw, ArrowUpRight, ArrowDownLeft } from "lucide-react"

export function InvoiceDetailClient({ transaction: t }: { transaction: AdminTransaction }) {
  const { isDark } = useTheme()

  const bg        = isDark ? "#0d0d10" : "#f8f8f6"
  const surface   = isDark ? "#111114" : "#ffffff"
  const border    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const text      = isDark ? "#f4f4f5" : "#09090b"
  const textMuted = isDark ? "#71717a" : "#71717a"
  const textSub   = isDark ? "#52525b" : "#a1a1aa"

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
  const fmtFull = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })

  const invoiceNum = t.reference_id ? t.reference_id.slice(-12).toUpperCase() : t.id.slice(-8).toUpperCase()

  const statusConfig: Record<string, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
    completed: { color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "Completed", icon: <CheckCircle size={14} /> },
    pending:   { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Pending",   icon: <Clock size={14} /> },
    failed:    { color: "#ef4444", bg: "rgba(239,68,68,0.12)",  label: "Failed",    icon: <XCircle size={14} /> },
    cancelled: { color: "#71717a", bg: "rgba(113,113,122,0.12)", label: "Cancelled", icon: <AlertCircle size={14} /> },
  }
  const sc = statusConfig[t.status] ?? statusConfig.completed

  const typeConfig: Record<string, { color: string; label: string; prefix: string; icon: React.ReactNode }> = {
    topup:  { color: "#10b981", label: "Balance Top-up",   prefix: "+", icon: <ArrowUpRight size={14} /> },
    usage:  { color: "#ef4444", label: "API Usage Charge", prefix: "−", icon: <ArrowDownLeft size={14} /> },
    refund: { color: "#6366f1", label: "Refund",           prefix: "+", icon: <RefreshCw size={14} /> },
  }
  const tc = typeConfig[t.type] ?? { color: "#71717a", label: t.type, prefix: "", icon: null }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .invoice-card { background: white !important; border: 1px solid #e5e7eb !important; box-shadow: none !important; max-width: 100% !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: bg, padding: "32px 48px" }}>

        {/* Controls */}
        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, maxWidth: 900 }}>
          <Link href="/admin/invoices" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "9px 16px", background: surface, border: `1px solid ${border}`,
            borderRadius: 8, color: text, fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = border}
          >
            <ArrowLeft size={15} />Back to Invoices
          </Link>

          <button onClick={() => window.print()} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "9px 18px", background: "#8b5cf6", border: "none",
            borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "opacity 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <Printer size={15} />Print Invoice
          </button>
        </div>

        {/* Invoice Card */}
        <motion.div
          className="invoice-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            background: surface,
            borderRadius: 4,
            overflow: "hidden",
            maxWidth: 900,
            boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.5)" : "0 8px 40px rgba(0,0,0,0.1)",
            borderTop: `3px solid ${tc.color}`,
          }}
        >
          {/* Header */}
          <div style={{ padding: "36px 40px 28px", borderBottom: `1px solid ${border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 }}>
              {/* Brand */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 6, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Receipt size={17} style={{ color: "#8b5cf6" }} />
                  </div>
                  <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-0.03em", color: text }}>Modelsnest</span>
                </div>
                <p style={{ fontSize: 12, color: textSub, lineHeight: 1.9 }}>
                  123 AI Street, Suite 400<br />
                  Innoville, CA 90210<br />
                  contact@modelsnest.com
                </p>
              </div>

              {/* Invoice number + status */}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.04em", color: text, marginBottom: 4 }}>INVOICE</div>
                <div style={{ fontSize: 13, color: textMuted, fontFamily: "monospace", marginBottom: 14 }}>#{invoiceNum}</div>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 12px", borderRadius: 4,
                  background: sc.bg, color: sc.color, border: `1px solid ${sc.color}40`,
                  fontSize: 12, fontWeight: 700,
                }}>
                  {sc.icon}{sc.label}
                </span>
              </div>
            </div>
          </div>

          {/* Billed To + Invoice Details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: `1px solid ${border}` }}>
            <div style={{ padding: "26px 40px", borderRight: `1px solid ${border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted, marginBottom: 12 }}>Billed To</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: text, marginBottom: 4 }}>{t.user_name || "N/A"}</div>
              <div style={{ fontSize: 13, color: textMuted }}>{t.user_email}</div>
            </div>

            <div style={{ padding: "26px 40px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted, marginBottom: 12 }}>Invoice Details</div>
              {[
                { label: "Issue Date",     value: fmtFull(t.created_at),                                     mono: false },
                { label: "Payment Method", value: t.payment_method || "—",                                   mono: false },
                { label: "Reference",      value: t.reference_id ? `...${t.reference_id.slice(-12)}` : "—",  mono: true  },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: textMuted, flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: text, fontFamily: row.mono ? "monospace" : "inherit", textAlign: "right" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Line Items */}
          <div style={{ padding: "28px 40px", borderBottom: `1px solid ${border}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted, marginBottom: 16 }}>Items</div>

            {/* Table */}
            <div style={{ border: `1px solid ${border}`, borderRadius: 4, overflow: "hidden" }}>
              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 120px", padding: "10px 18px", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", borderBottom: `1px solid ${border}` }}>
                {["Description", "Qty", "Amount"].map((h, i) => (
                  <div key={h} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: textMuted, textAlign: i === 0 ? "left" : "right" }}>{h}</div>
                ))}
              </div>

              {/* Item */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 120px", padding: "18px 18px", borderBottom: `1px solid ${border}` }}>
                <div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 4, background: `${tc.color}15`, color: tc.color, fontSize: 12, fontWeight: 700 }}>
                    {tc.icon}{tc.label}
                  </span>
                  {t.description && <div style={{ fontSize: 12, color: textSub, fontStyle: "italic", marginTop: 6 }}>Note: {t.description}</div>}
                </div>
                <div style={{ fontSize: 14, color: textMuted, textAlign: "right" }}>1</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: text, fontFamily: "monospace", textAlign: "right" }}>{fmt(t.amount)}</div>
              </div>

              {/* Subtotal rows */}
              <div style={{ padding: "16px 18px" }}>
                {[{ label: "Subtotal", value: fmt(t.amount) }, { label: "Tax / Fees", value: "$0.00" }].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: textMuted }}>{row.label}</span>
                    <span style={{ fontSize: 13, color: textMuted, fontFamily: "monospace" }}>{row.value}</span>
                  </div>
                ))}
                {/* Total */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: `1px solid ${border}`, paddingBottom: 2 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: text }}>Total</span>
                  <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em", fontFamily: "monospace", color: tc.color }}>
                    {tc.prefix}{fmt(t.amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "20px 40px", textAlign: "center", borderTop: `1px solid ${border}` }}>
            <p style={{ fontSize: 12, color: textSub }}>
              Thank you for your business! · Questions? Contact us at contact@modelsnest.com
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}