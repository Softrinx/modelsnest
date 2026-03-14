"use client"

import { useTheme } from "@/contexts/themeContext"
import { AdminTransaction } from "@/app/actions/admin"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Printer, CheckCircle, Clock, XCircle, AlertCircle, RefreshCw, ArrowUpRight, ArrowDownLeft } from "lucide-react"

export function InvoiceDetailClient({ transaction: t }: { transaction: AdminTransaction }) {
  const { isDark } = useTheme()

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)
  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

  const invoiceNum = t.reference_id ? t.reference_id.slice(-12).toUpperCase() : t.id.slice(-8).toUpperCase()

  const statusConfig: Record<string, { color: string; label: string }> = {
    completed: { color: "#16a34a", label: "PAID"      },
    pending:   { color: "#d97706", label: "PENDING"   },
    failed:    { color: "#dc2626", label: "FAILED"    },
    cancelled: { color: "#6b7280", label: "CANCELLED" },
  }
  const sc = statusConfig[t.status] ?? statusConfig.completed

  const typeConfig: Record<string, { label: string; prefix: string }> = {
    topup:  { label: "Balance Top-up",   prefix: "+" },
    usage:  { label: "API Usage Charge", prefix: "−" },
    refund: { label: "Refund",           prefix: "+" },
  }
  const tc = typeConfig[t.type] ?? { label: t.type, prefix: "" }

  return (
    <>
      <style>{`
  @media print {
    body * { visibility: hidden; }
    .invoice-print-root, .invoice-print-root * { visibility: visible; }
    .invoice-print-root { position: absolute; left: 0; top: 0; width: 100%; }
    .no-print { display: none !important; }
    .invoice-card { box-shadow: none !important; }
  body { background: white !important; margin: 0 !important; padding: 0 !important; }
.invoice-print-root > div { background: white !important; padding: 0 !important; }
  }
  .invoice-print-root { display: block; }
`}</style>

      <div className="invoice-print-root">
        <div
          style={{
            minHeight: "100vh",
            background: isDark ? "#0d0d10" : "#f4f4f2",
            padding: "32px 48px",
          }}
        >
          {/* Controls */}
          <div
            className="no-print"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 28,
              maxWidth: 860,
            }}
          >
            <Link
              href="/admin/invoices"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "9px 16px",
                background: isDark ? "#18181c" : "#fff",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}`,
                color: isDark ? "#f4f4f5" : "#09090b",
                fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}
            >
              <ArrowLeft size={15} /> Back to Invoices
            </Link>

            <button
              onClick={() => window.print()}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "9px 18px",
                background: "#8b5cf6", border: "none",
                color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}
            >
              <Printer size={15} /> Print Invoice
            </button>
          </div>

          {/* Invoice Card — always white */}
          <motion.div
            className="invoice-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "#ffffff",
              maxWidth: 860,
              boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
            }}
          >
            {/* Header — Logo + Status */}
            <div style={{ padding: "40px 48px 32px", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Image
                  src="/logolight.png"
                  alt="Modelsnest"
                  width={140}
                  height={44}
                  style={{ objectFit: "contain" }}
                  priority
                />
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "0.05em", color: sc.color, marginBottom: 8 }}>
                    {sc.label}
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>Invoice #{invoiceNum}</div>
                </div>
              </div>
            </div>

            {/* Invoiced To + Pay To */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "32px 48px", borderBottom: "1px solid #e5e7eb", gap: 32 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: 10 }}>
                  Invoiced To
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#09090b", marginBottom: 4 }}>{t.user_name || "N/A"}</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>{t.user_email}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: 10 }}>
                  Pay To
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#09090b", marginBottom: 4 }}>Modelsnest</div>
                <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.9 }}>
                  Kimathi Rd, P.O Box 302<br />
                  Nanyuki, Laikipia 10400<br />
                  Kenya<br />
                  Modelsnest3@gmail.com
                </div>
              </div>
            </div>

            {/* Invoice Date + Payment Method */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "24px 48px", borderBottom: "1px solid #e5e7eb", gap: 32 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: 8 }}>
                  Invoice Date
                </div>
                <div style={{ fontSize: 14, color: "#09090b" }}>{fmtDate(t.created_at)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b7280", marginBottom: 8 }}>
                  Payment Method
                </div>
                <div style={{ fontSize: 14, color: "#09090b" }}>{t.payment_method || "—"}</div>
              </div>
            </div>

            {/* Invoice Items */}
            <div style={{ padding: "32px 48px", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#09090b", marginBottom: 12 }}>Invoice Items</div>
              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e5e7eb" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    <th style={{ padding: "10px 16px", fontSize: 12, fontWeight: 700, color: "#374151", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                      Description
                    </th>
                    <th style={{ padding: "10px 16px", fontSize: 12, fontWeight: 700, color: "#374151", textAlign: "right", borderBottom: "1px solid #e5e7eb" }}>
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#09090b", borderBottom: "1px solid #e5e7eb" }}>
                      {tc.label}
                      {t.description && (
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{t.description}</div>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#09090b", textAlign: "right", fontFamily: "monospace", borderBottom: "1px solid #e5e7eb" }}>
                      {fmt(t.amount)} USD
                    </td>
                  </tr>
                  <tr style={{ background: "#f9fafb" }}>
                    <td style={{ padding: "10px 16px", fontSize: 13, color: "#6b7280", textAlign: "right" }}>Sub Total</td>
                    <td style={{ padding: "10px 16px", fontSize: 13, color: "#09090b", textAlign: "right", fontFamily: "monospace" }}>{fmt(t.amount)} USD</td>
                  </tr>
                  <tr style={{ background: "#f9fafb" }}>
                    <td style={{ padding: "10px 16px", fontSize: 13, color: "#6b7280", textAlign: "right" }}>Credit</td>
                    <td style={{ padding: "10px 16px", fontSize: 13, color: "#09090b", textAlign: "right", fontFamily: "monospace" }}>$0.00 USD</td>
                  </tr>
                  <tr style={{ background: "#f9fafb" }}>
                    <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 700, color: "#09090b", textAlign: "right" }}>Total</td>
                    <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 700, color: "#09090b", textAlign: "right", fontFamily: "monospace" }}>{fmt(t.amount)} USD</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Transaction Table */}
            <div style={{ padding: "32px 48px", borderBottom: "1px solid #e5e7eb" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e5e7eb" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["Transaction Date", "Gateway", "Transaction ID", "Amount"].map((h, i) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 16px", fontSize: 12, fontWeight: 700, color: "#374151",
                          textAlign: i === 0 ? "left" : "right",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#09090b", borderBottom: "1px solid #e5e7eb" }}>
                      {fmtDate(t.created_at)}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#09090b", textAlign: "right", borderBottom: "1px solid #e5e7eb" }}>
                      {t.payment_method || "—"}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#09090b", textAlign: "right", fontFamily: "monospace", borderBottom: "1px solid #e5e7eb" }}>
                      {t.reference_id ? `...${t.reference_id.slice(-16)}` : "—"}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#09090b", textAlign: "right", fontFamily: "monospace", borderBottom: "1px solid #e5e7eb" }}>
                      {fmt(t.amount)} USD
                    </td>
                  </tr>
                  <tr style={{ background: "#f9fafb" }}>
                    <td colSpan={3} style={{ padding: "10px 16px", fontSize: 13, fontWeight: 700, color: "#09090b", textAlign: "right" }}>
                      Balance
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 700, color: "#09090b", textAlign: "right", fontFamily: "monospace" }}>
                      $0.00 USD
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div style={{ padding: "24px 48px", textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "#9ca3af" }}>
                Thank you for your business. Questions? Contact us at Modelsnest3@gmail.com
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}