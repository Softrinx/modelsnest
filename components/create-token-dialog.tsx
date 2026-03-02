"use client"

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Copy, Check, Key, AlertCircle } from "lucide-react"
import { useState } from "react"
import { createApiToken } from "@/app/actions/api-tokens"
import { useTheme } from "@/contexts/themeContext"

interface CreateTokenDialogProps {
  onTokenCreated?: () => void | Promise<void>
}

export function CreateTokenDialog({ onTokenCreated }: CreateTokenDialogProps) {
  const { isDark } = useTheme()
  const [open, setOpen]             = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newToken, setNewToken]     = useState<string | null>(null)
  const [copied, setCopied]         = useState(false)
  const [error, setError]           = useState<string | null>(null)

  // ── Theme tokens ────────────────────────────────────────────────────────────
  const bg     = isDark ? "#0d0d10"               : "#ffffff"
  const card   = isDark ? "#111114"               : "#f8f8f6"
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)"
  const text   = isDark ? "#f4f4f5"               : "#09090b"
  const muted  = isDark ? "#71717a"               : "#71717a"
  const subtle = isDark ? "#52525b"               : "#a1a1aa"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreating(true)
    setError(null)
    try {
      const formData = new FormData(e.currentTarget)
      const result = await createApiToken(formData)
      if (result.success && typeof result.token === "string") {
        setNewToken(result.token)
        await onTokenCreated?.()
      } else {
        setError((result.error as string) ?? "Failed to create token")
      }
    } catch (err) {
      console.error("Failed to create token:", err)
      setError("Unexpected error. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      setNewToken(null)
      setCopied(false)
      setError(null)
    }, 200)
  }

  const handleCopy = async () => {
    if (!newToken) return
    await navigator.clipboard.writeText(newToken)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "0 16px", height: 38,
            background: "var(--color-primary)",
            border: "none", borderRadius: 4,
            color: "#fff", fontSize: 12, fontWeight: 700,
            cursor: "pointer", letterSpacing: "-0.01em",
            boxShadow: "0 2px 8px color-mix(in srgb, var(--color-primary) 35%, transparent)",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <Plus size={14} />
          Create token
        </button>
      </DialogTrigger>

      <DialogContent style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 4,
        padding: 0,
        maxWidth: 440,
        width: "95vw",
        overflow: "hidden",
        boxShadow: isDark
          ? "0 24px 64px rgba(0,0,0,0.7)"
          : "0 24px 64px rgba(0,0,0,0.12)",
      }}>

        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: `1px solid ${border}`,
          display: "flex", alignItems: "center", gap: 12,
          background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 4, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "color-mix(in srgb, var(--color-primary) 14%, transparent)",
            border: "1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)",
          }}>
            <Key size={14} style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: text, letterSpacing: "-0.03em" }}>
              {newToken ? "Token created" : "New API token"}
            </div>
            <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>
              {newToken
                ? "Copy your token — it won't be shown again"
                : "Generate a personal API token for programmatic access"}
            </div>
          </div>
        </div>

        <div style={{ padding: "24px" }}>

          {/* ── SUCCESS STATE ── */}
          {newToken ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Token display */}
              <div style={{
                border: "1px solid color-mix(in srgb, #10b981 30%, transparent)",
                borderRadius: 4, overflow: "hidden",
                background: isDark ? "rgba(16,185,129,0.05)" : "rgba(16,185,129,0.04)",
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 14px",
                  borderBottom: "1px solid color-mix(in srgb, #10b981 20%, transparent)",
                  background: isDark ? "rgba(16,185,129,0.07)" : "rgba(16,185,129,0.06)",
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>Token ready</span>
                </div>
                <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                  <code style={{
                    flex: 1, fontSize: 11, fontFamily: "monospace",
                    color: text, wordBreak: "break-all", lineHeight: 1.6,
                    minWidth: 0,
                  }}>
                    {newToken}
                  </code>
                  <button
                    onClick={handleCopy}
                    title="Copy token"
                    style={{
                      flexShrink: 0, width: 30, height: 30,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: copied
                        ? "rgba(16,185,129,0.12)"
                        : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                      border: `1px solid ${copied ? "rgba(16,185,129,0.4)" : border}`,
                      borderRadius: 4, cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {copied
                      ? <Check size={13} style={{ color: "#10b981" }} />
                      : <Copy size={13} style={{ color: muted }} />}
                  </button>
                </div>
              </div>

              <p style={{ fontSize: 11, color: muted, lineHeight: 1.6, margin: 0 }}>
                Store this token securely. We cannot display it again after you close this dialog.
              </p>

              <button
                onClick={handleClose}
                style={{
                  width: "100%", padding: "11px",
                  background: "var(--color-primary)", border: "none",
                  borderRadius: 4, fontSize: 13, fontWeight: 700,
                  color: "#fff", cursor: "pointer", transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Done
              </button>
            </div>

          ) : (
            /* ── CREATE FORM ── */
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label
                  htmlFor="name"
                  style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.07em" }}
                >
                  Token name{" "}
                  <span style={{ color: subtle, fontWeight: 400, textTransform: "none" }}>(optional)</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Production server"
                  maxLength={255}
                  style={{
                    width: "100%", height: 40, padding: "0 12px",
                    background: card,
                    border: `1px solid ${border}`,
                    borderRadius: 4, fontSize: 13, color: text,
                    outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                  onBlur={e => (e.currentTarget.style.borderColor = border)}
                />
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "9px 12px",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 4,
                }}>
                  <AlertCircle size={13} style={{ color: "#ef4444", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#ef4444" }}>{error}</span>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    flex: 1, padding: "10px",
                    background: "transparent",
                    border: `1px solid ${border}`,
                    borderRadius: 4, fontSize: 13, fontWeight: 600,
                    color: muted, cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "var(--color-primary)"
                    e.currentTarget.style.color = text
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = border
                    e.currentTarget.style.color = muted
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreating}
                  style={{
                    flex: 1, padding: "10px",
                    background: isCreating
                      ? "color-mix(in srgb, var(--color-primary) 55%, transparent)"
                      : "var(--color-primary)",
                    border: "none", borderRadius: 4,
                    fontSize: 13, fontWeight: 700,
                    color: "#fff",
                    cursor: isCreating ? "not-allowed" : "pointer",
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  {isCreating ? (
                    <>
                      <span style={{
                        width: 12, height: 12, borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        animation: "ctd-spin 0.7s linear infinite",
                        display: "inline-block",
                      }} />
                      Creating…
                    </>
                  ) : (
                    <>
                      <Key size={12} />
                      Create token
                    </>
                  )}
                </button>
              </div>

              <style>{`@keyframes ctd-spin { to { transform: rotate(360deg) } }`}</style>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}