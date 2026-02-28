"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/themeContext"
import {
  Gauge, Plus, Trash2, Edit2, CheckCircle2, X,
  AlertCircle, Save, User, Globe,
  MessageSquare, Image, Mic, Video, Zap, ChevronDown,
  Shield, Clock, TrendingUp, Info
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
type Endpoint = "chat" | "images" | "audio" | "video" | "tts" | "all"

interface GlobalRule {
  id: string
  endpoint: Endpoint
  requests_per_minute: number
  requests_per_hour: number
  requests_per_day: number
  max_daily_spend_usd: number
  is_active: boolean
}

interface UserOverride {
  id: string
  user_id: string
  user_email: string
  user_name: string
  endpoint: Endpoint
  requests_per_minute: number | null
  requests_per_hour: number | null
  requests_per_day: number | null
  max_daily_spend_usd: number | null
  reason: string
  created_at: string
}

// ─── Endpoint config ──────────────────────────────────────────────────────────
const ENDPOINTS: { id: Endpoint; label: string; path: string; icon: React.ElementType; color: string }[] = [
  { id: "chat",   label: "Chat Completions",    path: "/api/v1/chat/completions",       icon: MessageSquare, color: "#6366f1" },
  { id: "images", label: "Image Generation",    path: "/api/v1/images/generate",        icon: Image,         color: "#10b981" },
  { id: "audio",  label: "Audio Transcription", path: "/api/v1/audio/transcriptions",   icon: Mic,           color: "#f59e0b" },
  { id: "video",  label: "Video Generation",    path: "/api/v1/video/generations",      icon: Video,         color: "#8b5cf6" },
  { id: "tts",    label: "Text-to-Speech",      path: "/api/v1/text-to-speech",         icon: Zap,           color: "#06b6d4" },
]

// ─── Mock seed data ───────────────────────────────────────────────────────────
const INITIAL_GLOBAL_RULES: GlobalRule[] = [
  { id: "1", endpoint: "chat",   requests_per_minute: 60,  requests_per_hour: 1000, requests_per_day: 10000, max_daily_spend_usd: 50,  is_active: true  },
  { id: "2", endpoint: "images", requests_per_minute: 10,  requests_per_hour: 200,  requests_per_day: 1000,  max_daily_spend_usd: 100, is_active: true  },
  { id: "3", endpoint: "audio",  requests_per_minute: 20,  requests_per_hour: 400,  requests_per_day: 2000,  max_daily_spend_usd: 30,  is_active: true  },
  { id: "4", endpoint: "video",  requests_per_minute: 5,   requests_per_hour: 50,   requests_per_day: 200,   max_daily_spend_usd: 200, is_active: false },
  { id: "5", endpoint: "tts",    requests_per_minute: 30,  requests_per_hour: 500,  requests_per_day: 3000,  max_daily_spend_usd: 20,  is_active: true  },
]

const INITIAL_OVERRIDES: UserOverride[] = [
  {
    id: "1", user_id: "u1", user_email: "enterprise@example.com", user_name: "Enterprise Client",
    endpoint: "chat", requests_per_minute: 200, requests_per_hour: 5000,
    requests_per_day: 50000, max_daily_spend_usd: 500,
    reason: "Enterprise contract — elevated limits agreed", created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "2", user_id: "u2", user_email: "trial@example.com", user_name: "Trial User",
    endpoint: "all", requests_per_minute: 5, requests_per_hour: 50,
    requests_per_day: 200, max_daily_spend_usd: 2,
    reason: "Free trial — hard spend cap enforced", created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
]

// ─── Shared style hook ────────────────────────────────────────────────────────
function useStyles(isDark: boolean) {
  const border    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const surface   = isDark ? "#111114" : "#ffffff"
  const text      = isDark ? "#f4f4f5" : "#09090b"
  const textMuted = isDark ? "#71717a" : "#71717a"
  const textSub   = isDark ? "#52525b" : "#a1a1aa"
  const bg        = isDark ? "#0d0d10" : "#f8f8f6"

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px",
    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
    border: `1px solid ${border}`,
    color: text, fontSize: 13, fontFamily: "monospace",
    outline: "none", boxSizing: "border-box",
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
    textTransform: "uppercase", color: textMuted,
    marginBottom: 6, display: "block",
  }

  return { border, surface, text, textMuted, textSub, bg, inputStyle, labelStyle }
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ value, onChange, color = "#10b981" }: {
  value: boolean; onChange: (v: boolean) => void; color?: string
}) {
  return (
    <motion.button
      onClick={() => onChange(!value)}
      animate={{ background: value ? color : "rgba(120,120,120,0.25)" }}
      style={{
        width: 40, height: 22, border: "none",
        cursor: "pointer", position: "relative", flexShrink: 0, padding: 0,
      }}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        style={{
          position: "absolute", top: 3, width: 16, height: 16,
          background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          borderRadius: "50%",
        }}
      />
    </motion.button>
  )
}

// ─── Endpoint badge ───────────────────────────────────────────────────────────
function EndpointBadge({ endpoint }: { endpoint: Endpoint }) {
  if (endpoint === "all") return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "3px 8px",
      background: "rgba(239,68,68,0.12)", color: "#ef4444",
      border: "1px solid rgba(239,68,68,0.25)",
    }}>All Endpoints</span>
  )
  const ep = ENDPOINTS.find(e => e.id === endpoint)
  if (!ep) return null
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontWeight: 700, padding: "3px 8px",
      background: `${ep.color}15`, color: ep.color,
      border: `1px solid ${ep.color}30`,
    }}>
      <ep.icon size={11} />{ep.label}
    </span>
  )
}

// ─── Edit Global Rule Modal ────────────────────────────────────────────────────
function EditGlobalRuleModal({ rule, onClose, onSave, isDark }: {
  rule: GlobalRule; onClose: () => void
  onSave: (u: GlobalRule) => void; isDark: boolean
}) {
  const s  = useStyles(isDark)
  const ep = ENDPOINTS.find(e => e.id === rule.endpoint)!
  const [draft, setDraft] = useState<GlobalRule>({ ...rule })

  const fields: { key: keyof GlobalRule; label: string; unit: string }[] = [
    { key: "requests_per_minute", label: "Requests / minute", unit: "req/min" },
    { key: "requests_per_hour",   label: "Requests / hour",   unit: "req/hr"  },
    { key: "requests_per_day",    label: "Requests / day",    unit: "req/day" },
    { key: "max_daily_spend_usd", label: "Max daily spend",   unit: "USD"     },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: s.surface, border: `1px solid ${s.border}`,
          width: "100%", maxWidth: 520,
          boxShadow: isDark ? "0 32px 80px rgba(0,0,0,0.8)" : "0 32px 80px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: `${ep.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ep.icon size={15} style={{ color: ep.color }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: s.text }}>Edit — {ep.label}</span>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: s.textMuted, display: "flex" }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {fields.map(f => (
              <div key={f.key as string}>
                <label style={s.labelStyle}>{f.label}</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number" min={0}
                    style={{ ...s.inputStyle, paddingRight: 60 }}
                    value={draft[f.key] as number}
                    onChange={e => setDraft(d => ({ ...d, [f.key]: Number(e.target.value) }))}
                  />
                  <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: s.textMuted, pointerEvents: "none" }}>
                    {f.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Active toggle */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 14px",
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
            border: `1px solid ${s.border}`,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: s.text }}>Rule active</div>
              <div style={{ fontSize: 11, color: s.textMuted, marginTop: 2 }}>Disabling removes the limit for this endpoint</div>
            </div>
            <Toggle value={draft.is_active} onChange={v => setDraft(d => ({ ...d, is_active: v }))} color={ep.color} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: "10px 0", background: "transparent",
              border: `1px solid ${s.border}`, color: s.textMuted,
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>Cancel</button>
            <button onClick={() => { onSave(draft); onClose() }} style={{
              flex: 2, padding: "10px 0", background: ep.color,
              border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: `0 4px 16px ${ep.color}40`,
            }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Save size={14} /> Save Changes
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Add Override Modal ────────────────────────────────────────────────────────
function AddOverrideModal({ onClose, onAdd, isDark }: {
  onClose: () => void
  onAdd: (o: Omit<UserOverride, "id" | "created_at">) => void
  isDark: boolean
}) {
  const s = useStyles(isDark)
  const allEndpoints = [
    { id: "all" as Endpoint, label: "All Endpoints", icon: Globe, color: "#ef4444" },
    ...ENDPOINTS,
  ]

  const [userEmail, setUserEmail] = useState("")
  const [userName,  setUserName]  = useState("")
  const [userId,    setUserId]    = useState("")
  const [endpoint,  setEndpoint]  = useState<Endpoint>("chat")
  const [rpm,   setRpm]   = useState("")
  const [rph,   setRph]   = useState("")
  const [rpd,   setRpd]   = useState("")
  const [spend, setSpend] = useState("")
  const [reason, setReason] = useState("")
  const [error,  setError]  = useState("")
  const [epOpen, setEpOpen] = useState(false)

  const selEp = allEndpoints.find(e => e.id === endpoint)!

  function handleSubmit() {
    if (!userEmail.trim()) { setError("User email is required"); return }
    if (!reason.trim())    { setError("Reason is required"); return }
    setError("")
    onAdd({
      user_id: userId || `usr_${Math.random().toString(36).slice(2)}`,
      user_email: userEmail.trim(),
      user_name:  userName.trim() || userEmail.split("@")[0],
      endpoint,
      requests_per_minute: rpm   ? Number(rpm)   : null,
      requests_per_hour:   rph   ? Number(rph)   : null,
      requests_per_day:    rpd   ? Number(rpd)   : null,
      max_daily_spend_usd: spend ? Number(spend) : null,
      reason: reason.trim(),
    })
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: s.surface, border: `1px solid ${s.border}`,
          width: "100%", maxWidth: 540,
          boxShadow: isDark ? "0 32px 80px rgba(0,0,0,0.8)" : "0 32px 80px rgba(0,0,0,0.2)",
          maxHeight: "90vh", overflowY: "auto",
        }}
      >
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${s.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={15} style={{ color: "#6366f1" }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: s.text }}>Add User Override</span>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: s.textMuted, display: "flex" }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={s.labelStyle}>User Email *</label>
              <input style={s.inputStyle} placeholder="user@example.com" value={userEmail} onChange={e => setUserEmail(e.target.value)} />
            </div>
            <div>
              <label style={s.labelStyle}>Display Name</label>
              <input style={s.inputStyle} placeholder="Auto from email" value={userName} onChange={e => setUserName(e.target.value)} />
            </div>
          </div>

          <div>
            <label style={s.labelStyle}>User ID (optional — leave blank to resolve by email)</label>
            <input style={s.inputStyle} placeholder="usr_xxxxxxxx" value={userId} onChange={e => setUserId(e.target.value)} />
          </div>

          {/* Endpoint selector */}
          <div>
            <label style={s.labelStyle}>Apply To</label>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setEpOpen(o => !o)}
                style={{
                  width: "100%", padding: "9px 12px",
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                  border: `1px solid ${s.border}`, color: s.text, fontSize: 13,
                  cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "space-between", fontFamily: "inherit",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <selEp.icon size={14} style={{ color: selEp.color }} />
                  {selEp.label}
                </span>
                <ChevronDown size={13} style={{ color: s.textMuted, transform: epOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              <AnimatePresence>
                {epOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    style={{
                      position: "absolute", top: "calc(100% + 2px)", left: 0, right: 0, zIndex: 10,
                      background: s.surface, border: `1px solid ${s.border}`,
                      boxShadow: isDark ? "0 16px 40px rgba(0,0,0,0.6)" : "0 16px 40px rgba(0,0,0,0.12)",
                    }}
                  >
                    {allEndpoints.map(ep => (
                      <button key={ep.id} onClick={() => { setEndpoint(ep.id); setEpOpen(false) }}
                        style={{
                          width: "100%", padding: "9px 14px",
                          background: endpoint === ep.id
                            ? isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"
                            : "transparent",
                          border: "none", display: "flex", alignItems: "center", gap: 10,
                          cursor: "pointer", color: s.text, fontSize: 13,
                          fontFamily: "inherit", textAlign: "left",
                        }}
                      >
                        <ep.icon size={14} style={{ color: ep.color }} />
                        {ep.label}
                        {endpoint === ep.id && <CheckCircle2 size={13} style={{ color: ep.color, marginLeft: "auto" }} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Rate limit fields */}
          <div style={{ padding: 14, background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px solid ${s.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <Info size={12} style={{ color: s.textMuted }} />
              <span style={{ fontSize: 11, color: s.textMuted }}>Leave blank to inherit the global rule value for that field</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Req / minute", v: rpm,   set: setRpm,   unit: "req" },
                { label: "Req / hour",   v: rph,   set: setRph,   unit: "req" },
                { label: "Req / day",    v: rpd,   set: setRpd,   unit: "req" },
                { label: "Max daily $",  v: spend, set: setSpend, unit: "USD" },
              ].map(f => (
                <div key={f.label}>
                  <label style={s.labelStyle}>{f.label}</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number" min={0} placeholder="—"
                      style={{ ...s.inputStyle, paddingRight: 44 }}
                      value={f.v} onChange={e => f.set(e.target.value)}
                    />
                    <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: s.textMuted, pointerEvents: "none" }}>
                      {f.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={s.labelStyle}>Reason *</label>
            <textarea
              style={{ ...s.inputStyle, fontFamily: "inherit", resize: "vertical", minHeight: 72, fontSize: 13 }}
              placeholder="e.g. Enterprise contract — elevated limits agreed in onboarding call"
              value={reason} onChange={e => setReason(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#ef4444", fontSize: 12 }}>
              <AlertCircle size={13} /> {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: "10px 0", background: "transparent",
              border: `1px solid ${s.border}`, color: s.textMuted,
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>Cancel</button>
            <button onClick={handleSubmit} style={{
              flex: 2, padding: "10px 0", background: "#6366f1",
              border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
            }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Plus size={14} /> Add Override
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Global Rules Tab ─────────────────────────────────────────────────────────
function GlobalRulesTab({ rules, onUpdate, isDark }: {
  rules: GlobalRule[]; onUpdate: (u: GlobalRule) => void; isDark: boolean
}) {
  const s = useStyles(isDark)
  const [editing, setEditing] = useState<GlobalRule | null>(null)

  return (
    <>
      {/* Column headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr 80px 60px",
        gap: 8, padding: "10px 24px",
        borderBottom: `1px solid ${s.border}`,
        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
      }}>
        {["Endpoint", "Req/min", "Req/hour", "Req/day", "Max $/day", "Active", ""].map((h, i) => (
          <span key={i} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: s.textSub }}>{h}</span>
        ))}
      </div>

      <AnimatePresence>
        {rules.map((rule, i) => {
          const ep = ENDPOINTS.find(e => e.id === rule.endpoint)!
          return (
            <motion.div
              key={rule.id} layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr 80px 60px",
                gap: 8, alignItems: "center",
                padding: "16px 24px",
                borderBottom: `1px solid ${s.border}`,
                opacity: rule.is_active ? 1 : 0.5,
                transition: "opacity 0.2s",
              }}
            >
              {/* Endpoint cell */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 34, height: 34, flexShrink: 0,
                  background: `${ep.color}15`,
                  border: `1px solid ${ep.color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <ep.icon size={15} style={{ color: ep.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: s.text }}>{ep.label}</div>
                  <div style={{ fontSize: 11, color: s.textSub, marginTop: 1, fontFamily: "monospace" }}>{ep.path}</div>
                </div>
              </div>

              {/* Numeric cells */}
              {[rule.requests_per_minute, rule.requests_per_hour, rule.requests_per_day].map((v, idx) => (
                <span key={idx} style={{ fontSize: 14, fontWeight: 800, fontFamily: "monospace", color: s.text }}>
                  {v.toLocaleString()}
                </span>
              ))}
              <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "monospace", color: "#10b981" }}>
                ${rule.max_daily_spend_usd}
              </span>

              {/* Toggle */}
              <Toggle value={rule.is_active} onChange={v => onUpdate({ ...rule, is_active: v })} color={ep.color} />

              {/* Edit button */}
              <button
                onClick={() => setEditing(rule)}
                style={{
                  background: "transparent", border: `1px solid ${s.border}`,
                  cursor: "pointer", color: s.textMuted, padding: "6px 10px",
                  display: "flex", alignItems: "center", gap: 4,
                  fontSize: 11, fontWeight: 600, fontFamily: "inherit",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = ep.color; e.currentTarget.style.color = ep.color }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = s.border; e.currentTarget.style.color = s.textMuted }}
              >
                <Edit2 size={12} /> Edit
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>

      <AnimatePresence>
        {editing && (
          <EditGlobalRuleModal
            rule={editing}
            onClose={() => setEditing(null)}
            onSave={u => { onUpdate(u); setEditing(null) }}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ─── User Overrides Tab ───────────────────────────────────────────────────────
function UserOverridesTab({ overrides, onAdd, onDelete, isDark }: {
  overrides: UserOverride[]
  onAdd: (o: Omit<UserOverride, "id" | "created_at">) => void
  onDelete: (id: string) => void
  isDark: boolean
}) {
  const s = useStyles(isDark)
  const [showModal, setShowModal] = useState(false)

  function fmt(v: number | null) {
    if (v === null) return <span style={{ color: s.textSub, fontSize: 12, fontStyle: "italic" }}>inherit</span>
    return <span style={{ fontFamily: "monospace", fontWeight: 700, color: s.text, fontSize: 13 }}>{v.toLocaleString()}</span>
  }

  return (
    <>
      {/* Toolbar */}
      <div style={{
        padding: "14px 24px", borderBottom: `1px solid ${s.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 12, color: s.textMuted }}>
          {overrides.length} override{overrides.length !== 1 ? "s" : ""} — user-level rules override global defaults
        </span>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", background: "#6366f1",
            border: "none", cursor: "pointer",
            color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "inherit",
            boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
          }}
        >
          <Plus size={13} /> Add Override
        </button>
      </div>

      {/* Column headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1.2fr 1fr 1fr 1fr 1fr 44px",
        gap: 8, padding: "10px 24px",
        borderBottom: `1px solid ${s.border}`,
        background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
      }}>
        {["User", "Endpoint", "Req/min", "Req/hour", "Req/day", "Max $/day", ""].map((h, i) => (
          <span key={i} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: s.textSub }}>{h}</span>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {overrides.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: "64px 24px", textAlign: "center", color: s.textMuted }}
          >
            <User size={32} style={{ opacity: 0.25, display: "block", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 14, fontWeight: 600 }}>No user overrides</p>
            <p style={{ fontSize: 12, marginTop: 4, color: s.textSub }}>Add an override to give a specific user custom rate limits.</p>
          </motion.div>
        ) : overrides.map((o, i) => (
          <motion.div
            key={o.id} layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ delay: i * 0.04 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1.2fr 1fr 1fr 1fr 1fr 44px",
              gap: 8, alignItems: "center",
              padding: "14px 24px",
              borderBottom: `1px solid ${s.border}`,
            }}
          >
            {/* User */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <div style={{
                width: 30, height: 30, flexShrink: 0,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 900, color: "#fff",
              }}>
                {o.user_name.charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {o.user_name}
                </div>
                <div style={{ fontSize: 11, color: s.textSub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {o.user_email}
                </div>
              </div>
            </div>

            <div><EndpointBadge endpoint={o.endpoint} /></div>
            <div>{fmt(o.requests_per_minute)}</div>
            <div>{fmt(o.requests_per_hour)}</div>
            <div>{fmt(o.requests_per_day)}</div>
            <div>
              {o.max_daily_spend_usd !== null
                ? <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#10b981", fontSize: 13 }}>${o.max_daily_spend_usd}</span>
                : <span style={{ color: s.textSub, fontSize: 12, fontStyle: "italic" }}>inherit</span>
              }
            </div>

            <button
              onClick={() => onDelete(o.id)}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: s.textMuted, padding: 6, display: "flex" }}
              onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
              onMouseLeave={e => e.currentTarget.style.color = s.textMuted}
            >
              <Trash2 size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <AddOverrideModal onClose={() => setShowModal(false)} onAdd={onAdd} isDark={isDark} />
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function AdminRateLimitsClient() {
  const { isDark } = useTheme()
  const s = useStyles(isDark)

  const [tab,       setTab]       = useState<"global" | "overrides">("global")
  const [rules,     setRules]     = useState<GlobalRule[]>(INITIAL_GLOBAL_RULES)
  const [overrides, setOverrides] = useState<UserOverride[]>(INITIAL_OVERRIDES)
  const [saved,     setSaved]     = useState(false)

  function handleSave() {
    // TODO: call server action saveRateLimits(rules, overrides)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const activeCount   = rules.filter(r => r.is_active).length
  const inactiveCount = rules.filter(r => !r.is_active).length

  return (
    <div style={{ minHeight: "100vh", background: s.bg }}>

      {/* ── PAGE HEADER ── */}
      <div style={{
        padding: "40px 48px 36px",
        borderBottom: `1px solid ${s.border}`,
        background: isDark ? "linear-gradient(160deg,#0d0d10,#111118)" : s.surface,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle,${isDark ? "rgba(16,185,129,0.05)" : "rgba(16,185,129,0.025)"} 1px,transparent 1px)`,
          backgroundSize: "28px 28px",
        }} />
        <div style={{
          position: "absolute", top: -80, right: "15%", width: 500, height: 380,
          pointerEvents: "none",
          background: isDark ? "radial-gradient(ellipse,rgba(16,185,129,0.09) 0%,transparent 70%)" : "transparent",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1400 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", padding: "4px 10px",
                  background: isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)",
                  color: "#10b981",
                  border: `1px solid ${isDark ? "rgba(16,185,129,0.3)" : "rgba(16,185,129,0.2)"}`,
                  boxShadow: "0 0 12px rgba(16,185,129,0.15)",
                }}>Admin Portal</span>
              </div>
              <h1 style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 900, lineHeight: 1,
                letterSpacing: "-0.04em", color: s.text, marginBottom: 8,
              }}>
                Rate Limits
              </h1>
              <p style={{ fontSize: 14, color: s.textMuted, maxWidth: 520 }}>
                Control request rates and spend caps per endpoint. Set global defaults, then override for individual users.
              </p>
            </div>

            <button
              onClick={handleSave}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "11px 22px",
                background: saved ? "#10b981" : isDark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)",
                border: `1px solid ${saved ? "#10b981" : "rgba(16,185,129,0.3)"}`,
                cursor: "pointer", color: saved ? "#fff" : "#10b981",
                fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "32px 48px", maxWidth: 1400 }}>

        {/* ── STAT CARDS ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 1, background: s.border, marginBottom: 32,
        }}>
          {[
            { label: "Endpoints",      value: rules.length,      color: "#6366f1", icon: Globe         },
            { label: "Active Rules",   value: activeCount,        color: "#10b981", icon: CheckCircle2  },
            { label: "Paused Rules",   value: inactiveCount,      color: "#f59e0b", icon: Clock         },
            { label: "User Overrides", value: overrides.length,   color: "#8b5cf6", icon: User          },
            { label: "Restricted",     value: overrides.filter(o => (o.requests_per_minute ?? 999) < 10).length, color: "#ef4444", icon: Shield },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{ padding: "22px 20px", background: s.surface }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                <card.icon size={13} style={{ color: card.color }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: s.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {card.label}
                </span>
              </div>
              <div style={{ fontSize: "clamp(1.6rem,2.5vw,2.2rem)", fontWeight: 900, fontFamily: "monospace", color: card.color, letterSpacing: "-0.04em" }}>
                {card.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div style={{ background: s.surface, border: `1px solid ${s.border}` }}>

          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: `1px solid ${s.border}` }}>
            {([
              { id: "global",    label: "Global Rules",   icon: Globe, badge: `${rules.length} endpoints` },
              { id: "overrides", label: "User Overrides", icon: User,  badge: `${overrides.length} active` },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "16px 24px",
                  background: tab === t.id
                    ? isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"
                    : "transparent",
                  border: "none",
                  borderBottom: `2px solid ${tab === t.id ? "#10b981" : "transparent"}`,
                  marginBottom: -1,
                  cursor: "pointer", color: tab === t.id ? s.text : s.textMuted,
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 13, fontWeight: 700, fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >
                <t.icon size={14} />
                {t.label}
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 7px",
                  background: tab === t.id ? "rgba(16,185,129,0.15)" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                  color: tab === t.id ? "#10b981" : s.textMuted,
                }}>
                  {t.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {tab === "global"
                ? <GlobalRulesTab rules={rules} onUpdate={u => setRules(prev => prev.map(r => r.id === u.id ? u : r))} isDark={isDark} />
                : <UserOverridesTab
                    overrides={overrides}
                    onAdd={o => setOverrides(prev => [...prev, { ...o, id: Math.random().toString(36).slice(2), created_at: new Date().toISOString() }])}
                    onDelete={id => setOverrides(prev => prev.filter(o => o.id !== id))}
                    isDark={isDark}
                  />
              }
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── INFO FOOTER ── */}
        <div style={{
          marginTop: 24, padding: "16px 20px",
          background: isDark ? "rgba(16,185,129,0.06)" : "rgba(16,185,129,0.04)",
          border: `1px solid ${isDark ? "rgba(16,185,129,0.18)" : "rgba(16,185,129,0.15)"}`,
          display: "flex", alignItems: "flex-start", gap: 12,
        }}>
          <TrendingUp size={15} style={{ color: "#10b981", marginTop: 1, flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981", display: "block", marginBottom: 3 }}>
              How enforcement works
            </span>
            <span style={{ fontSize: 12, color: s.textMuted, lineHeight: 1.7 }}>
              On every API request, the middleware checks the user's recent rows in{" "}
              <code style={{ fontSize: 11, padding: "1px 5px", background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" }}>usage_logs</code>{" "}
              against the applicable rule (user override takes priority over global). If a limit is exceeded the API returns{" "}
              <code style={{ fontSize: 11, padding: "1px 5px", background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" }}>429 RATE_LIMIT_EXCEEDED</code>{" "}
              with a{" "}
              <code style={{ fontSize: 11, padding: "1px 5px", background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" }}>Retry-After</code>{" "}
              header. Daily spend caps are evaluated against the sum of{" "}
              <code style={{ fontSize: 11, padding: "1px 5px", background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" }}>credit_transactions</code>{" "}
              for the calendar day (UTC).
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}