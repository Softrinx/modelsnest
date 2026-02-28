"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/themeContext"
import { Eye, EyeOff, Copy, RotateCcw, Edit, Trash2, Check } from "lucide-react"
import { maskToken, formatDate, copyToClipboard } from "@/lib/api-utils"
import { regenerateToken, deleteToken } from "@/app/actions/api-tokens"
import { TokenActionDialog } from "@/components/token-action-dialog"

interface Token {
  id: string
  name: string
  token: string
  token_prefix: string
  last_used_at: string | null
  created_at: string
  expires_at: string | null
  is_active: boolean
}

interface ApiTokensListProps {
  tokens: Token[]
  onTokensChanged?: () => void | Promise<void>
}

function IconBtn({
  onClick, title, disabled, spin, danger, children
}: {
  onClick?: () => void; title: string; disabled?: boolean; spin?: boolean; danger?: boolean; children: React.ReactNode
}) {
  const { isDark } = useTheme()
  const [hov, setHov] = useState(false)
  const border  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const muted   = isDark ? "#52525b" : "#a1a1aa"
  const hoverBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 32, height: 32, border: `1px solid ${hov && !disabled ? (danger ? "#ef4444" : "var(--color-primary)") : border}`,
        background: hov && !disabled ? hoverBg : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1,
        color: hov && !disabled ? (danger ? "#ef4444" : "var(--color-primary)") : muted,
        transition: "all 0.15s", flexShrink: 0,
      }}
    >
      <motion.div animate={spin ? { rotate: 360 } : { rotate: 0 }} transition={{ repeat: spin ? Infinity : 0, duration: 0.9, ease: "linear" }}>
        {children}
      </motion.div>
    </button>
  )
}

export function ApiTokensList({ tokens, onTokensChanged }: ApiTokensListProps) {
  const { isDark } = useTheme()
  const [visible,      setVisible]      = useState<Set<string>>(new Set())
  const [copied,       setCopied]        = useState<Set<string>>(new Set())
  const [regenerating, setRegenerating]  = useState<Set<string>>(new Set())
  const [hovered,      setHovered]       = useState<string | null>(null)

  const bg      = isDark ? "#111114" : "#ffffff"
  const border  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const text    = isDark ? "#f4f4f5" : "#09090b"
  const muted   = isDark ? "#52525b" : "#a1a1aa"
  const subtext = isDark ? "#71717a" : "#71717a"

  const toggleVisible = (id: string) => {
    setVisible(s => {
      const n = new Set(s)
      if (n.has(id)) {
        n.delete(id)
      } else {
        n.add(id)
      }
      return n
    })
  }

  const handleCopy = async (tokenValue: string, id: string) => {
    try {
      await copyToClipboard(tokenValue)
      setCopied(s => new Set(s).add(id))
      setTimeout(() => setCopied(s => { const n = new Set(s); n.delete(id); return n }), 2000)
    } catch (e) { console.error(e) }
  }

  const handleRegenerate = async (id: string) => {
    setRegenerating(s => new Set(s).add(id))
    try {
      const fd = new FormData(); fd.append("tokenId", String(id))
      const res = await regenerateToken(fd)
      if (res.success) {
        const tok = "token" in res ? res.token : ""
        alert(`New token generated:\n${tok}\n\nCopy it now — you won't see it again.`)
        await onTokensChanged?.()
      }
    } catch (e) { console.error(e); alert("Failed to regenerate token") }
    finally { setRegenerating(s => { const n = new Set(s); n.delete(id); return n }) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this token? This cannot be undone.")) return
    try {
      const fd = new FormData(); fd.append("tokenId", String(id))
      const res = await deleteToken(fd)
      if (res.success) {
        await onTokensChanged?.()
      }
    } catch (e) { console.error(e); alert("Failed to delete token") }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1, background: border }}>
      {/* Column header */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr auto auto auto",
        padding: "9px 16px", background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
        gap: 12,
      }}>
        {["Token", "Status", "Created", "Actions"].map(h => (
          <span key={h} style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted }}>{h}</span>
        ))}
      </div>

      {tokens.map((token, i) => {
        const isVis   = visible.has(token.id)
        const isCopied= copied.has(token.id)
        const isRegen = regenerating.has(token.id)
        const isHov   = hovered === token.id

        return (
          <motion.div key={token.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.04 }}
            onMouseEnter={() => setHovered(token.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "grid", gridTemplateColumns: "1fr auto auto auto",
              alignItems: "center", gap: 12, padding: "14px 16px",
              background: isHov ? (isDark ? "#13131a" : "#fafaf9") : bg,
              borderLeft: `2px solid ${isHov ? "var(--color-primary)" : "transparent"}`,
              transition: "all 0.15s",
            }}
          >
            {/* Token value */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                {/* Active indicator */}
                <div style={{
                  width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                  background: token.is_active ? "#10b981" : muted,
                  boxShadow: token.is_active ? "0 0 6px #10b98166" : "none",
                }} />
                <span style={{
                  fontFamily: "monospace", fontSize: 13, color: text, letterSpacing: "0.02em",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {isVis ? token.token : maskToken(token.token)}
                </span>
                {token.name && (
                  <span style={{
                    fontSize: 10, padding: "2px 7px", fontWeight: 600,
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                    color: muted,
                  }}>{token.name}</span>
                )}
              </div>
              <div style={{ fontSize: 11, color: subtext, paddingLeft: 17 }}>
                Created {formatDate(token.created_at)}
                {token.last_used_at && ` · Last used ${formatDate(token.last_used_at)}`}
                {token.expires_at && ` · Expires ${formatDate(token.expires_at)}`}
              </div>
            </div>

            {/* Status badge */}
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "3px 9px", letterSpacing: "0.06em", textTransform: "uppercase",
              background: token.is_active ? "rgba(16,185,129,0.1)" : "rgba(113,113,122,0.1)",
              color: token.is_active ? "#10b981" : muted,
            }}>
              {token.is_active ? "Active" : "Inactive"}
            </span>

            {/* Created date */}
            <span style={{ fontSize: 12, fontFamily: "monospace", color: subtext, whiteSpace: "nowrap" }}>
              {formatDate(token.created_at)}
            </span>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <IconBtn title={isVis ? "Hide token" : "Show token"} onClick={() => toggleVisible(token.id)}>
                {isVis ? <EyeOff size={13} /> : <Eye size={13} />}
              </IconBtn>

              <IconBtn title="Copy token" onClick={() => handleCopy(token.token, token.id)}>
                <AnimatePresence mode="wait" initial={false}>
                  {isCopied
                    ? <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check size={13} style={{ color: "#10b981" }} />
                      </motion.div>
                    : <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Copy size={13} />
                      </motion.div>
                  }
                </AnimatePresence>
              </IconBtn>

              <IconBtn title="Regenerate token" onClick={() => handleRegenerate(token.id)} disabled={isRegen} spin={isRegen}>
                <RotateCcw size={13} />
              </IconBtn>

              <TokenActionDialog
                token={token}
                trigger={
                  <div>
                    <IconBtn title="Edit token">
                      <Edit size={13} />
                    </IconBtn>
                  </div>
                }
              />

              <IconBtn title="Delete token" onClick={() => handleDelete(token.id)} danger>
                <Trash2 size={13} />
              </IconBtn>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}