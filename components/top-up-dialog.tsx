"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Wallet, Bitcoin, CheckCircle, AlertCircle, ChevronRight, Zap, Shield, X } from "lucide-react"
import { PayPalButton } from "@/components/paypal-button"
import { CoinbaseButton } from "@/components/coinbase-button"
import { useTheme } from "@/contexts/themeContext"

interface TopUpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000]

export function TopUpDialog({ open, onOpenChange, onSuccess }: TopUpDialogProps) {
  const { isDark } = useTheme()
  const [amount, setAmount]               = useState(100)
  const [customAmount, setCustomAmount]   = useState("")
  const [selectedMethod, setSelectedMethod] = useState<"paypal" | "coinbase">("paypal")
  const [success, setSuccess]             = useState(false)
  const [error, setError]                 = useState("")

  // ── Theme tokens ─────────────────────────────────────────────────────────────
  const bg     = isDark ? "#0D0D0F" : "#f8f8f6"
  const card   = isDark ? "#1A1B1F" : "#ffffff"
  const card2  = isDark ? "#141416" : "#f4f4f2"
  const border = isDark ? "#202126" : "#e2e2e0"
  const text   = isDark ? "#ffffff" : "#0a0a0b"
  const muted  = isDark ? "#71717a" : "#71717a"
  const subtle = isDark ? "#52525b" : "#a1a1aa"

  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : amount
  const isValidAmount = finalAmount >= 50

  const handlePaymentSuccess = () => {
    setSuccess(true)
    setTimeout(() => {
      onSuccess()
      setSuccess(false)
      setAmount(100)
      setCustomAmount("")
    }, 2200)
  }

  // ── Success screen ───────────────────────────────────────────────────────────
  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, maxWidth: 380, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "48px 32px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}>
              <CheckCircle className="w-8 h-8" style={{ color: "#10b981" }} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: text, letterSpacing: "-0.04em", marginBottom: 6 }}>Payment successful</div>
              <div style={{ fontSize: 13, color: muted }}>${finalAmount.toFixed(2)} added to your balance</div>
            </div>
            <div style={{ width: "100%", height: 3, borderRadius: 3, background: border, overflow: "hidden", marginTop: 8 }}>
              <div style={{ height: "100%", background: "#10b981", animation: "grow 2.2s linear forwards", borderRadius: 3 }} />
            </div>
            <style>{`@keyframes grow { from { width: 0% } to { width: 100% } }`}</style>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{
        background: card, border: `1px solid ${border}`, borderRadius: 16,
        maxWidth: 560, width: "95vw", padding: 0, overflow: "hidden",
        boxShadow: isDark ? "0 32px 80px rgba(0,0,0,0.7)" : "0 32px 80px rgba(0,0,0,0.12)",
      }}>

        {/* Header */}
        <div style={{ padding: "24px 24px 20px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
              background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)" }}>
              <Zap className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: text, letterSpacing: "-0.03em" }}>Add Credits</div>
              <div style={{ fontSize: 11, color: muted }}>Minimum $50 · Instant top-up</div>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)}
            style={{ background: "none", border: "none", cursor: "pointer", color: muted, padding: 4, borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Amount presets */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
              Select amount
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 10 }}>
              {PRESET_AMOUNTS.map(p => (
                <button key={p}
                  onClick={() => { setAmount(p); setCustomAmount("") }}
                  style={{
                    padding: "10px 0", fontSize: 13, fontWeight: 700, borderRadius: 8, cursor: "pointer",
                    border: amount === p && !customAmount
                      ? "1px solid var(--color-primary)"
                      : `1px solid ${border}`,
                    background: amount === p && !customAmount
                      ? "color-mix(in srgb, var(--color-primary) 12%, transparent)"
                      : card2,
                    color: amount === p && !customAmount ? "var(--color-primary)" : muted,
                    transition: "all 0.15s",
                  }}
                >
                  ${p}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, fontWeight: 700, color: subtle }}>$</span>
              <input
                type="number" min="50" max="10000" step="0.01"
                placeholder="Custom amount (min $50)"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                style={{
                  width: "100%", paddingLeft: 28, paddingRight: 14, height: 42,
                  background: card2, border: `1px solid ${customAmount ? "var(--color-primary)" : border}`,
                  borderRadius: 8, fontSize: 13, color: text, outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary)"}
                onBlur={e => e.currentTarget.style.borderColor = customAmount ? "var(--color-primary)" : border}
              />
            </div>
            {customAmount && parseFloat(customAmount) < 50 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, padding: "8px 10px",
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 7 }}>
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#ef4444" }} />
                <span style={{ fontSize: 11, color: "#ef4444" }}>Minimum top-up amount is $50</span>
              </div>
            )}
          </div>

          {/* Payment methods */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
              Payment method
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {([
                { id: "paypal",   label: "PayPal",   sub: "Credit card, debit card, or PayPal account",  icon: Wallet,  color: "#0ea5e9" },
                { id: "coinbase", label: "Coinbase",  sub: "Bitcoin, Ethereum, USDC and more",            icon: Bitcoin, color: "#f59e0b" },
              ] as const).map(m => {
                const sel = selectedMethod === m.id
                return (
                  <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "14px 14px",
                      background: sel ? "color-mix(in srgb, var(--color-primary) 8%, transparent)" : card2,
                      border: sel ? "1px solid var(--color-primary)" : `1px solid ${border}`,
                      borderRadius: 10, cursor: "pointer", textAlign: "left", width: "100%",
                      transition: "all 0.15s",
                    }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${m.color}18`, border: `1px solid ${m.color}30` }}>
                      <m.icon className="w-4 h-4" style={{ color: m.color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 2 }}>{m.label}</div>
                      <div style={{ fontSize: 11, color: muted }}>{m.sub}</div>
                    </div>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${sel ? "var(--color-primary)" : border}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                      {sel && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-primary)" }} />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8 }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#ef4444" }} />
              <span style={{ fontSize: 12, color: "#ef4444" }}>{error}</span>
            </div>
          )}

          {/* Summary */}
          <div style={{ background: card2, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: muted }}>Credits to add</span>
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: text }}>${finalAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${border}` }}>
              <span style={{ fontSize: 12, color: muted }}>Processing fee</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>$0.00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: text }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 900, fontFamily: "monospace", color: "var(--color-primary)", letterSpacing: "-0.04em" }}>
                ${finalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Pay button */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {isValidAmount ? (
              selectedMethod === "paypal" ? (
                <PayPalButton amount={finalAmount} onSuccess={handlePaymentSuccess} onError={setError} onCancel={() => setError("Payment cancelled")} />
              ) : (
                <CoinbaseButton amount={finalAmount} onError={setError} />
              )
            ) : (
              <button disabled style={{
                width: "100%", padding: "13px", fontSize: 14, fontWeight: 700,
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${border}`, borderRadius: 10, color: subtle,
                cursor: "not-allowed",
              }}>
                Enter at least $50 to continue
              </button>
            )}

            <button onClick={() => onOpenChange(false)}
              style={{
                width: "100%", padding: "11px", fontSize: 13, fontWeight: 600,
                background: "transparent", border: `1px solid ${border}`, color: muted,
                borderRadius: 10, cursor: "pointer",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--color-primary)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = border}
            >
              Cancel
            </button>

            {/* Security note */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 4 }}>
              <Shield className="w-3 h-3" style={{ color: subtle }} />
              <span style={{ fontSize: 10, color: subtle }}>Secured by PayPal & Coinbase Commerce · Credits are non-refundable</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}