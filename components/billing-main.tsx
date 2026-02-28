"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getBillingInfo } from "@/app/actions/billing"
import { BillingOverview } from "@/components/billing-overview"
import { TopUpDialog } from "@/components/top-up-dialog"
import { useTheme } from "@/contexts/themeContext"
import { useSidebar } from "@/components/dashboard-layout-controller"
import { useAccount } from "@/contexts/accountContext"
import {
  Plus, Download, CheckCircle, AlertCircle, XCircle,
  CreditCard, Shield, Zap, RefreshCw,
} from "lucide-react"
import type { DashboardUser } from "@/types/dashboard-user"

interface BillingMainProps {
  user: DashboardUser
}

export function BillingMain({ user }: BillingMainProps) {
  const { isDark } = useTheme()
  const { sidebarWidth, isMobile } = useSidebar()
  const { isTeam, teamId } = useAccount()

  const searchParams = useSearchParams()
  const [billingData, setBillingData] = useState<any>(null)
  const [loading, setLoading]         = useState(true)
  const [showTopUp, setShowTopUp]     = useState(false)
  const [hashStatus, setHashStatus]   = useState<null | "success" | "cancelled">(null)

  const querySuccess    = searchParams.get("success")
  const queryError      = searchParams.get("error")
  const amount          = searchParams.get("amount")
  const transactionId   = searchParams.get("transactionId")
  const orderId         = searchParams.get("orderId")

  useEffect(() => {
    const raw = window.location.hash?.replace(/^#/, "")
    if (!raw) return
    const normalized = raw === "canceled" ? "cancelled" : raw
    if (normalized === "success" || normalized === "cancelled") {
      setHashStatus(normalized)
      window.history.replaceState({}, "", "/dashboard/billing")
    }
  }, [])

  const success = querySuccess === "true" || hashStatus === "success"
  const error   = queryError || (hashStatus === "cancelled" ? "cancelled" : null)

  const loadBillingData = async () => {
    try {
      setLoading(true)
      // Fetch team owner's billing data if in team mode (by passing teamId), otherwise current user's data
      const result = isTeam && teamId
        ? await getBillingInfo(undefined, teamId)
        : await getBillingInfo()
      console.log("Billing result:", result)
      if (result.success) {
        setBillingData(result.data)
      } else {
        setBillingData({ credits: { balance: 0, total_spent: 0, total_topped_up: 0 }, transactions: [], monthlyUsage: [], user: { id: user.id, email: user.email, name: user.name } })
      }
    } catch {
      setBillingData({ credits: { balance: 0, total_spent: 0, total_topped_up: 0 }, transactions: [], monthlyUsage: [], user: { id: user.id, email: user.email, name: user.name } })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBillingData() }, [isTeam, teamId])
  useEffect(() => { if (success || error) loadBillingData() }, [success, error])

  // ── Theme tokens ─────────────────────────────────────────────────────────────
  const bg     = isDark ? "#0D0D0F" : "#f8f8f6"
  const card   = isDark ? "#1A1B1F" : "#ffffff"
  const border = isDark ? "#202126" : "#e2e2e0"
  const text   = isDark ? "#ffffff" : "#0a0a0b"
  const muted  = isDark ? "#71717a" : "#71717a"
  const subtle = isDark ? "#52525b" : "#a1a1aa"

  const headerPaddingLeft = isMobile ? 56 : sidebarWidth + 24

  const credits   = billingData?.credits ?? { balance: 0, total_spent: 0, total_topped_up: 0 }
  const balance   = typeof credits.balance === "number" ? credits.balance : 0
  const isLow     = balance < 10

  // ── Loading spinner ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100svh", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <RefreshCw className="w-6 h-6 animate-spin" style={{ color: "var(--color-primary)" }} />
          <span style={{ fontSize: 13, color: muted }}>Loading billing data…</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100svh", background: bg }}>

      {!isDark && (
        <style>{`
          input, textarea, select { background-color: #ffffff !important; color: #0a0a0b !important; border-color: #e2e2e0 !important; }
          input::placeholder { color: #a1a1aa !important; }
        `}</style>
      )}

      {/* ── HEADER — full width, sidebar-aware padding ── */}
      <div
        className="fixed top-0 right-0 z-30 flex items-center justify-between gap-3"
        style={{
          left: 0, height: 56,
          paddingLeft: headerPaddingLeft,
          paddingRight: 20,
          borderBottom: `1px solid ${border}`,
          background: card,
          transition: "padding-left 0.28s cubic-bezier(0.25,0.25,0,1)",
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
            background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)" }}>
            <CreditCard className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: text, letterSpacing: "-0.03em", lineHeight: 1 }}>Billing</div>
            <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>Credits & usage</div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Balance pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            border: `1px solid ${border}`, borderRadius: 8, fontSize: 12, fontWeight: 700,
            fontFamily: "monospace", color: isLow ? "#ef4444" : "#10b981",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: isLow ? "#ef4444" : "#10b981",
              boxShadow: `0 0 6px ${isLow ? "#ef4444" : "#10b981"}` }} />
            ${balance.toFixed(2)}
          </div>

          <button
            onClick={() => loadBillingData()}
            style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              background: "transparent", border: `1px solid ${border}`, borderRadius: 8, cursor: "pointer", color: muted }}
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", fontSize: 12, fontWeight: 600,
              background: "transparent", border: `1px solid ${border}`, color: muted, borderRadius: 8, cursor: "pointer" }}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => setShowTopUp(true)}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", fontSize: 12, fontWeight: 700,
              background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer",
              boxShadow: "0 4px 14px color-mix(in srgb, var(--color-primary) 40%, transparent)" }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Credits
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Page title row */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 900, color: text, letterSpacing: "-0.04em", lineHeight: 1 }}>
                Billing & Usage
              </h1>
              <p style={{ fontSize: 13, color: muted, marginTop: 6 }}>
                Manage your balance, review usage, and track transactions.
              </p>
            </div>
            {/* Trust badges */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {[
                { icon: Shield, label: "Secure payments" },
                { icon: Zap,    label: "Instant top-up" },
              ].map(b => (
                <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: subtle }}>
                  <b.icon className="w-3 h-3" style={{ color: "var(--color-primary)" }} />
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Alert banners ── */}
          {success && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
              background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 10 }}>
              <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#10b981" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>Payment successful</div>
                <div style={{ fontSize: 11, color: "rgba(16,185,129,0.7)", marginTop: 2 }}>
                  {amount && `$${amount} added to your balance.`}
                  {transactionId && ` Ref: ${transactionId.slice(0, 12)}…`}
                </div>
              </div>
              <button onClick={() => window.history.replaceState({}, "", "/dashboard/billing")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#10b981" }}>
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10 }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#ef4444" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444" }}>
                  {error === "cancelled" ? "Payment cancelled" : "Payment failed"}
                </div>
                <div style={{ fontSize: 11, color: "rgba(239,68,68,0.7)", marginTop: 2 }}>
                  {error === "capture_failed"         && "Payment capture failed. Please try again."}
                  {error === "missing_token"          && "Payment token missing. Please try again."}
                  {error === "unauthorized"           && "You are not authorised to complete this payment."}
                  {error === "paypal_not_configured"  && "PayPal is not properly configured."}
                  {error === "internal_error"         && "An internal error occurred. Please try again."}
                  {error === "cancelled"              && "Your payment was cancelled. No charges were made."}
                  {!["capture_failed","missing_token","unauthorized","paypal_not_configured","internal_error","cancelled"].includes(error) && `Error: ${error}`}
                </div>
                {orderId && <div style={{ fontSize: 10, color: "rgba(239,68,68,0.5)", marginTop: 4 }}>Order: {orderId}</div>}
              </div>
              <button onClick={() => window.history.replaceState({}, "", "/dashboard/billing")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Low balance banner */}
          {isLow && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
              background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", animation: "pulse 2s infinite", flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#f59e0b" }}>
                Low balance — ${balance.toFixed(2)} remaining.{" "}
                <button onClick={() => setShowTopUp(true)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#f59e0b", textDecoration: "underline", fontSize: 13, fontWeight: 700 }}>
                  Top up now
                </button>
              </div>
            </div>
          )}

          {/* Main billing overview */}
          <BillingOverview billingData={billingData} />

          {/* Bottom note */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 0" }}>
            <Shield className="w-3 h-3" style={{ color: subtle }} />
            <span style={{ fontSize: 11, color: subtle }}>
              Payments processed securely via PayPal & Coinbase Commerce. Credits are non-refundable.
            </span>
          </div>
        </div>
      </div>

      {showTopUp && (
        <TopUpDialog
          open={showTopUp}
          onOpenChange={setShowTopUp}
          onSuccess={() => { setShowTopUp(false); loadBillingData() }}
        />
      )}
    </div>
  )
}