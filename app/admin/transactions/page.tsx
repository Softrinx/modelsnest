import { getTransactions, AdminTransaction } from "@/app/actions/admin"
import Link from "next/link"
import { ArrowUpCircle, ArrowDownCircle, RefreshCw, Receipt } from "lucide-react"

export const dynamic = "force-dynamic"

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  })

function TypeBadge({ type }: { type: AdminTransaction["type"] }) {
  const map: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    topup:  { label: "Top-up", color: "var(--color-success)",         icon: <ArrowUpCircle className="w-3 h-3" /> },
    usage:  { label: "Usage",  color: "var(--color-danger, #EF4444)", icon: <ArrowDownCircle className="w-3 h-3" /> },
    refund: { label: "Refund", color: "var(--color-secondary)",       icon: <RefreshCw className="w-3 h-3" /> },
  }
  const cfg = map[type] ?? { label: type, color: "var(--color-text-muted)", icon: null }
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold"
      style={{
        color: cfg.color,
        background: `color-mix(in srgb, ${cfg.color} 10%, transparent)`,
        border: `1px solid color-mix(in srgb, ${cfg.color} 30%, transparent)`,
      }}
    >
      {cfg.icon}{cfg.label}
    </span>
  )
}

function StatusBadge({ status }: { status: AdminTransaction["status"] }) {
  const map: Record<string, { label: string; color: string }> = {
    completed: { label: "Completed", color: "var(--color-success)" },
    pending:   { label: "Pending",   color: "#F59E0B" },
    failed:    { label: "Failed",    color: "var(--color-danger, #EF4444)" },
    cancelled: { label: "Cancelled", color: "var(--color-text-muted)" },
  }
  const cfg = map[status] ?? map.completed
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: cfg.color }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  )
}

export default async function AdminTransactionsPage() {
  const transactions = await getTransactions()

  const totalRevenue = transactions.filter(t => t.type === "topup").reduce((s, t) => s + t.amount, 0)
  const totalUsage   = transactions.filter(t => t.type === "usage").reduce((s, t) => s + t.amount, 0)
  const totalRefunds = transactions.filter(t => t.type === "refund").reduce((s, t) => s + t.amount, 0)
  const pending      = transactions.filter(t => t.status === "pending").length

  const summary = [
    { label: "Top-ups", value: formatCurrency(totalRevenue), color: "var(--color-success)" },
    { label: "Usage",   value: formatCurrency(totalUsage),   color: "var(--color-danger, #EF4444)" },
    { label: "Refunds", value: formatCurrency(totalRefunds), color: "var(--color-secondary)" },
    { label: "Pending", value: String(pending),              color: "#F59E0B" },
  ]

  const cols = "160px 1fr 90px 110px 110px 110px 130px 36px"

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Page header */}
        <div className="flex items-end justify-between pb-8"
          style={{ borderBottom: "1px solid var(--color-border)" }}>
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold"
              style={{ color: "var(--color-primary)" }}>Admin</span>
            <h1 style={{
              fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900,
              lineHeight: 1, letterSpacing: "-0.04em", color: "var(--color-text)",
            }}>
              Transactions
            </h1>
          </div>
          <div className="flex items-center gap-2 pb-1">
            <div className="w-2 h-2 rounded-full"
              style={{ background: "var(--color-success)", animation: "pulse 2s ease-in-out infinite" }} />
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {transactions.length} records
            </span>
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}>
          {summary.map((s, i) => (
            <div key={s.label} className="flex flex-col gap-1 px-6 lg:px-8 py-5"
              style={{ borderRight: i < summary.length - 1 ? "1px solid var(--color-border)" : "none" }}>
              <span className="text-xs uppercase tracking-wider font-semibold"
                style={{ color: "var(--color-text-muted)" }}>{s.label}</span>
              <span className="text-lg font-black" style={{ color: s.color, letterSpacing: "-0.03em" }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ borderBottom: "1px solid var(--color-border)" }}>

          {/* thead — desktop */}
          <div
            className="hidden lg:grid px-6 py-3 text-xs uppercase tracking-wider font-semibold"
            style={{
              gridTemplateColumns: cols,
              borderBottom: "1px solid var(--color-border)",
              background: "color-mix(in srgb, var(--color-primary) 4%, var(--color-surface-1))",
              color: "var(--color-text-muted)",
            }}
          >
            <span>Date</span>
            <span>User</span>
            <span>Type</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Method</span>
            <span>Reference</span>
            <span />
          </div>

          {transactions.length > 0 ? transactions.map((tx, i) => {
            const isTopup  = tx.type === "topup"
            const amtColor = isTopup ? "var(--color-success)" : "var(--color-danger, #EF4444)"

            return (
              <div key={tx.id}
                style={{ borderBottom: i < transactions.length - 1 ? "1px solid var(--color-border)" : "none" }}>

                {/* Desktop row */}
                <div
                  className="hidden lg:grid items-center px-6 py-4 group"
                  style={{ gridTemplateColumns: cols }}
                >
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {formatDate(tx.created_at)}
                  </span>
                  <div className="flex flex-col gap-0.5 pr-4">
                    <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                      {tx.user_name || "N/A"}
                    </span>
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{tx.user_email}</span>
                  </div>
                  <TypeBadge type={tx.type} />
                  <span className="text-sm font-bold" style={{ color: amtColor }}>
                    {isTopup ? "+" : "−"}{formatCurrency(tx.amount)}
                  </span>
                  <StatusBadge status={tx.status} />
                  <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    {tx.payment_method || "N/A"}
                  </span>
                  <span className="font-mono text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {tx.reference_id ? `…${tx.reference_id.slice(-8)}` : "N/A"}
                  </span>
                  <Link
                    href={`/admin/invoices/${tx.id}`}
                    className="flex items-center justify-center w-7 h-7 opacity-60 hover:opacity-100 transition-opacity"
                    style={{ border: "1px solid var(--color-border)", color: "var(--color-primary)" }}
                    title="View invoice"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Mobile card */}
                <div className="flex flex-col gap-3 px-5 py-4 lg:hidden">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold" style={{ color: "var(--color-text)" }}>
                        {tx.user_name || "N/A"}
                      </span>
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{tx.user_email}</span>
                    </div>
                    <span className="font-bold" style={{ color: amtColor }}>
                      {isTopup ? "+" : "−"}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <TypeBadge type={tx.type} />
                    <StatusBadge status={tx.status} />
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {formatDate(tx.created_at)}
                    </span>
                    <Link
                      href={`/admin/invoices/${tx.id}`}
                      className="ml-auto inline-flex items-center gap-1 text-xs font-semibold opacity-70 hover:opacity-100 transition-opacity"
                      style={{ color: "var(--color-primary)" }}
                    >
                      <Receipt className="w-3 h-3" /> Invoice
                    </Link>
                  </div>
                </div>

              </div>
            )
          }) : (
            <div className="flex items-center justify-center py-20">
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                No transactions found.
              </span>
            </div>
          )}
        </div>

      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
    </div>
  )
}