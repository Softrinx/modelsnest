"use client"

import { useState, useTransition } from "react"
import { adminTopUpUserAction } from "@/app/actions/admin"
import { useTheme } from "@/contexts/themeContext"
import { X, DollarSign, CheckCircle, AlertCircle, RefreshCw, Plus } from "lucide-react"

interface AdminUserTopUpDialogProps {
  userId: string
  userEmail: string
  currentBalance: number
}

export function AdminUserTopUpDialog({ userId, userEmail, currentBalance }: AdminUserTopUpDialogProps) {
  const { isDark } = useTheme()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(10)
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const surface   = isDark ? "#111114" : "#ffffff"
  const surface2  = isDark ? "#18181b" : "#f4f4f2"
  const border    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.1)"
  const text      = isDark ? "#f4f4f5" : "#09090b"
  const textMuted = isDark ? "#71717a" : "#71717a"
  const overlay   = isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)"

  const handleSubmit = (formData: FormData) => {
    setError(null); setSuccess(null)
    startTransition(async () => {
      const result = await adminTopUpUserAction(formData)
      if (!result.success) { setError(result.error || "Failed to add credits"); return }
      setSuccess(result.message || "Credits added successfully")
      setTimeout(() => { setOpen(false); window.location.reload() }, 800)
    })
  }

  const inputStyle = {
    width: "100%", height: 40, padding: "0 12px",
    background: surface2, border: `1px solid ${border}`,
    fontSize: 13, color: text, outline: "none", boxSizing: "border-box" as const,
  }
  const labelStyle = { display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: textMuted, marginBottom: 6 }

  return (
    <>
      {/* Trigger button */}
      <button onClick={() => setOpen(true)} style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "6px 12px", background: "rgba(16,185,129,0.1)",
        border: "1px solid rgba(16,185,129,0.3)", color: "#10b981",
        fontSize: 11, fontWeight: 700, cursor: "pointer",
      }}>
        <Plus size={12} />Add credits
      </button>

      {/* Modal */}
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          {/* Overlay */}
          <div onClick={() => !isPending && setOpen(false)} style={{ position: "absolute", inset: 0, background: overlay }} />

          {/* Dialog */}
          <div style={{ position: "relative", width: "100%", maxWidth: 420, background: surface, border: `1px solid ${border}`, boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.6)" : "0 12px 48px rgba(0,0,0,0.15)", borderTop: "3px solid #10b981" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: `1px solid ${border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 30, height: 30, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <DollarSign size={15} style={{ color: "#10b981" }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: text }}>Add credits</div>
                  <div style={{ fontSize: 11, color: textMuted, fontFamily: "monospace" }}>{userEmail}</div>
                </div>
              </div>
              <button onClick={() => !isPending && setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: textMuted, display: "flex" }}>
                <X size={16} />
              </button>
            </div>

            {/* Current balance */}
            <div style={{ margin: "16px 20px 0", padding: "10px 14px", background: surface2, border: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: textMuted }}>Current balance</span>
              <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "monospace", color: "#10b981" }}>${currentBalance.toFixed(2)}</span>
            </div>

            {/* Form */}
            <form action={handleSubmit} style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              <input type="hidden" name="userId" value={userId} />

              <div>
                <label style={labelStyle}>Amount (USD)</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: textMuted }}>$</span>
                  <input name="amount" type="number" min="0.01" step="0.01" value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    style={{ ...inputStyle, paddingLeft: 26 }}
                    onFocus={e => e.currentTarget.style.borderColor = "#10b981"}
                    onBlur={e => e.currentTarget.style.borderColor = border}
                    required />
                </div>
                {amount > 0 && (
                  <div style={{ fontSize: 11, color: textMuted, marginTop: 5 }}>
                    New balance: <strong style={{ color: "#10b981", fontFamily: "monospace" }}>${(currentBalance + amount).toFixed(2)}</strong>
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Note (optional)</label>
                <input name="description" type="text" value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Reason for manual top-up"
                  style={inputStyle}
                  onFocus={e => e.currentTarget.style.borderColor = "#10b981"}
                  onBlur={e => e.currentTarget.style.borderColor = border}
                />
              </div>

              {error && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <AlertCircle size={13} style={{ color: "#ef4444", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#ef4444" }}>{error}</span>
                </div>
              )}
              {success && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <CheckCircle size={13} style={{ color: "#10b981", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#10b981" }}>{success}</span>
                </div>
              )}

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
                <button type="button" onClick={() => !isPending && setOpen(false)} disabled={isPending}
                  style={{ padding: "9px 16px", background: "transparent", border: `1px solid ${border}`, color: textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={isPending}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#10b981", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? 0.7 : 1 }}>
                  {isPending ? <><RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} />Adding…</> : <><Plus size={12} />Add credits</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </>
  )
}