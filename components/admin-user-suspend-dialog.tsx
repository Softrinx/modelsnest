"use client"

import { useState, useTransition } from "react"
import { adminSuspendUserAction, adminUnsuspendUserAction } from "@/app/actions/admin"
import { useTheme } from "@/contexts/themeContext"
import { X, ShieldOff, ShieldCheck, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

interface AdminUserSuspendDialogProps {
  userId: string
  userEmail: string
  isSuspended: boolean
}

export function AdminUserSuspendDialog({ userId, userEmail, isSuspended }: AdminUserSuspendDialogProps) {
  const { isDark } = useTheme()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"days" | "indefinite">("days")
  const [days, setDays] = useState(7)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const surface   = isDark ? "#111114" : "#ffffff"
  const surface2  = isDark ? "#18181b" : "#f4f4f2"
  const border    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.1)"
  const text      = isDark ? "#f4f4f5" : "#09090b"
  const textMuted = isDark ? "#71717a" : "#71717a"
  const overlay   = isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)"

  const inputStyle = {
    width: "100%", height: 40, padding: "0 12px",
    background: surface2, border: `1px solid ${border}`,
    fontSize: 13, color: text, outline: "none", boxSizing: "border-box" as const,
  }
  const labelStyle = { display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: textMuted, marginBottom: 6 }

  const handleReactivate = () => {
    setError(null); setSuccess(null)
    startTransition(async () => {
      const fd = new FormData(); fd.append("userId", userId)
      const result = await adminUnsuspendUserAction(fd)
      if (!result.success) { setError(result.error || "Failed to reactivate"); return }
      setSuccess(result.message || "User reactivated")
      setTimeout(() => window.location.reload(), 800)
    })
  }

  const handleSuspend = (formData: FormData) => {
    setError(null); setSuccess(null)
    startTransition(async () => {
      const result = await adminSuspendUserAction(formData)
      if (!result.success) { setError(result.error || "Failed to suspend user"); return }
      setSuccess(result.message || "User suspended")
      setTimeout(() => { setOpen(false); window.location.reload() }, 800)
    })
  }

  // Reactivate button (no dialog needed)
  if (isSuspended) {
    return (
      <>
        <button onClick={handleReactivate} disabled={isPending} style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "6px 12px", background: "rgba(16,185,129,0.1)",
          border: "1px solid rgba(16,185,129,0.3)", color: "#10b981",
          fontSize: 11, fontWeight: 700, cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? 0.7 : 1,
        }}>
          {isPending ? <RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} /> : <ShieldCheck size={12} />}
          {isPending ? "Reactivating…" : "Reactivate"}
        </button>
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </>
    )
  }

  return (
    <>
      <button onClick={() => setOpen(true)} style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "6px 12px", background: "rgba(245,158,11,0.1)",
        border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b",
        fontSize: 11, fontWeight: 700, cursor: "pointer",
      }}>
        <ShieldOff size={12} />Suspend
      </button>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={() => !isPending && setOpen(false)} style={{ position: "absolute", inset: 0, background: overlay }} />

          <div style={{ position: "relative", width: "100%", maxWidth: 420, background: surface, border: `1px solid ${border}`, boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.6)" : "0 12px 48px rgba(0,0,0,0.15)", borderTop: "3px solid #f59e0b" }}>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: `1px solid ${border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 30, height: 30, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShieldOff size={15} style={{ color: "#f59e0b" }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: text }}>Suspend user</div>
                  <div style={{ fontSize: 11, color: textMuted, fontFamily: "monospace" }}>{userEmail}</div>
                </div>
              </div>
              <button onClick={() => !isPending && setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: textMuted, display: "flex" }}>
                <X size={16} />
              </button>
            </div>

            <form action={handleSuspend} style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              <input type="hidden" name="userId" value={userId} />
              <input type="hidden" name="mode" value={mode} />

              {/* Mode selector */}
              <div>
                <label style={labelStyle}>Suspension type</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: border }}>
                  {[{ val: "days", label: "Fixed duration" }, { val: "indefinite", label: "Indefinite" }].map(opt => (
                    <button key={opt.val} type="button" onClick={() => setMode(opt.val as any)}
                      style={{
                        padding: "10px", background: mode === opt.val ? "rgba(245,158,11,0.12)" : surface2,
                        border: "none", color: mode === opt.val ? "#f59e0b" : textMuted,
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        outline: mode === opt.val ? "2px solid rgba(245,158,11,0.4)" : "none",
                        outlineOffset: -2,
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {mode === "days" && (
                <div>
                  <label style={labelStyle}>Duration (days)</label>
                  <input name="days" type="number" min="1" max="3650" value={days}
                    onChange={e => setDays(Number(e.target.value))}
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = "#f59e0b"}
                    onBlur={e => e.currentTarget.style.borderColor = border}
                    required />
                  <div style={{ fontSize: 11, color: textMuted, marginTop: 5 }}>
                    Suspended until: <strong>{new Date(Date.now() + days * 86400000).toLocaleDateString()}</strong>
                  </div>
                </div>
              )}

              {mode === "indefinite" && (
                <div style={{ padding: "10px 12px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
                  <span style={{ fontSize: 12, color: "#f59e0b" }}>User will be deactivated until manually reactivated.</span>
                </div>
              )}

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
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#f59e0b", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? 0.7 : 1 }}>
                  {isPending ? <><RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} />Saving…</> : <><ShieldOff size={12} />{mode === "indefinite" ? "Deactivate" : "Suspend"}</>}
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