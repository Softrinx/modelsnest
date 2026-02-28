"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/themeContext"
import {
  Key, Plus, Eye, EyeOff, Trash2, CheckCircle2,
  AlertCircle, Copy, RefreshCw, Zap, FlaskConical,
  Globe, ChevronDown, X, Shield
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
interface ApiKeyEntry {
  id: string
  provider: string
  label: string
  key: string
  addedAt: string
  status: "active" | "error" | "untested"
  isPrimary: boolean
}

interface Provider {
  id: string
  label: string
  icon: React.ElementType
  color: string
  placeholder: string
  docsUrl: string
  prefix?: string
}

// ─── Provider config ──────────────────────────────────────────────────────────
const PROVIDERS: Provider[] = [
  {
    id: "novita",
    label: "Novita AI",
    icon: Zap,
    color: "#6366f1",
    placeholder: "sk-xxxxxxxxxxxxxxxxxxxxxxxx",
    docsUrl: "https://novita.ai/docs",
    prefix: "sk-",
  },
  {
    id: "models_lab",
    label: "Models Lab",
    icon: FlaskConical,
    color: "#10b981",
    placeholder: "ml_xxxxxxxxxxxxxxxxxxxxxxxx",
    docsUrl: "https://modelslab.com/api-docs",
    prefix: "ml_",
  },
  {
    id: "openai",
    label: "OpenAI",
    icon: Globe,
    color: "#f59e0b",
    placeholder: "sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx",
    docsUrl: "https://platform.openai.com/api-keys",
    prefix: "sk-",
  },
  {
    id: "anthropic",
    label: "Anthropic",
    icon: Shield,
    color: "#ef4444",
    placeholder: "sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx",
    docsUrl: "https://console.anthropic.com",
    prefix: "sk-ant-",
  },
  {
    id: "custom",
    label: "Custom / Other",
    icon: Key,
    color: "#a1a1aa",
    placeholder: "Enter your API key",
    docsUrl: "",
  },
]

function maskKey(key: string) {
  if (key.length <= 12) return "•".repeat(key.length)
  return key.slice(0, 6) + "•".repeat(Math.max(0, key.length - 10)) + key.slice(-4)
}

// ─── Add Key Modal ────────────────────────────────────────────────────────────
function AddKeyModal({
  onClose,
  onAdd,
  isDark,
  border,
  surface,
  text,
  textMuted,
}: {
  onClose: () => void
  onAdd: (entry: Omit<ApiKeyEntry, "id" | "addedAt" | "status">) => void
  isDark: boolean
  border: string
  surface: string
  text: string
  textMuted: string
}) {
  const [selectedProvider, setSelectedProvider] = useState<Provider>(PROVIDERS[0])
  const [label, setLabel] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [providerOpen, setProviderOpen] = useState(false)
  const [error, setError] = useState("")

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
    border: `1px solid ${border}`,
    borderRadius: 0,
    color: text,
    fontSize: 13,
    fontFamily: "monospace",
    outline: "none",
    boxSizing: "border-box" as const,
  }

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: textMuted,
    marginBottom: 8,
    display: "block",
  }

  function handleSubmit() {
    if (!apiKey.trim()) { setError("API key is required."); return }
    if (!label.trim()) { setError("Label is required."); return }
    setError("")
    onAdd({ provider: selectedProvider.id, label: label.trim(), key: apiKey.trim() })
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ duration: 0.22 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: surface,
          border: `1px solid ${border}`,
          width: "100%",
          maxWidth: 480,
          boxShadow: isDark ? "0 32px 80px rgba(0,0,0,0.8)" : "0 32px 80px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: `1px solid ${border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32,
              background: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Plus size={16} style={{ color: "#6366f1" }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: text }}>Add API Key</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: textMuted, padding: 4, display: "flex",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Provider selector */}
          <div>
            <label style={labelStyle}>Provider</label>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setProviderOpen(o => !o)}
                style={{
                  width: "100%", padding: "10px 14px",
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                  border: `1px solid ${border}`,
                  color: text, fontSize: 13, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <selectedProvider.icon size={15} style={{ color: selectedProvider.color }} />
                  <span>{selectedProvider.label}</span>
                </div>
                <ChevronDown size={13} style={{ color: textMuted, transform: providerOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>

              <AnimatePresence>
                {providerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    style={{
                      position: "absolute", top: "calc(100% + 2px)", left: 0, right: 0, zIndex: 10,
                      background: surface,
                      border: `1px solid ${border}`,
                      boxShadow: isDark ? "0 16px 40px rgba(0,0,0,0.6)" : "0 16px 40px rgba(0,0,0,0.12)",
                    }}
                  >
                    {PROVIDERS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setSelectedProvider(p); setProviderOpen(false) }}
                        style={{
                          width: "100%", padding: "10px 14px",
                          background: selectedProvider.id === p.id
                            ? isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"
                            : "transparent",
                          border: "none",
                          display: "flex", alignItems: "center", gap: 10,
                          cursor: "pointer", color: text, fontSize: 13,
                          fontFamily: "inherit", textAlign: "left",
                        }}
                      >
                        <p.icon size={15} style={{ color: p.color }} />
                        {p.label}
                        {selectedProvider.id === p.id && (
                          <CheckCircle2 size={13} style={{ color: p.color, marginLeft: "auto" }} />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Label */}
          <div>
            <label style={labelStyle}>Label</label>
            <input
              style={inputStyle}
              placeholder="e.g. Production Key, Dev Key"
              value={label}
              onChange={e => setLabel(e.target.value)}
            />
          </div>

          {/* Key */}
          <div>
            <label style={labelStyle}>API Key</label>
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inputStyle, paddingRight: 44 }}
                type={showKey ? "text" : "password"}
                placeholder={selectedProvider.placeholder}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
              />
              <button
                onClick={() => setShowKey(s => !s)}
                style={{
                  position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent", border: "none",
                  cursor: "pointer", color: textMuted, display: "flex",
                  padding: 0,
                }}
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#ef4444", fontSize: 12 }}>
              <AlertCircle size={13} />
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: "10px 0",
                background: "transparent",
                border: `1px solid ${border}`,
                color: textMuted, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              style={{
                flex: 2, padding: "10px 0",
                background: "#6366f1",
                border: "none",
                color: "#fff", fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
              }}
            >
              Save Key
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Key Row ──────────────────────────────────────────────────────────────────
function KeyRow({
  entry,
  onDelete,
  onSetPrimary,
  isPrimaryUpdating,
  isDark,
  border,
  surface,
  text,
  textMuted,
  textSub,
}: {
  entry: ApiKeyEntry
  onDelete: (id: string) => void
  onSetPrimary: (id: string) => void
  isPrimaryUpdating: boolean
  isDark: boolean
  border: string
  surface: string
  text: string
  textMuted: string
  textSub: string
}) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)
  const provider = PROVIDERS.find(p => p.id === entry.provider) ?? PROVIDERS[PROVIDERS.length - 1]

  function copyKey() {
    navigator.clipboard.writeText(entry.key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statusColors: Record<ApiKeyEntry["status"], string> = {
    active: "#10b981",
    error: "#ef4444",
    untested: "#f59e0b",
  }
  const statusLabels: Record<ApiKeyEntry["status"], string> = {
    active: "Active",
    error: "Error",
    untested: "Untested",
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr auto",
        alignItems: "center",
        gap: 16,
        padding: "18px 24px",
        borderBottom: `1px solid ${border}`,
        background: surface,
      }}
    >
      {/* Provider + label */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <div style={{
          width: 36, height: 36, flexShrink: 0,
          background: `${provider.color}18`,
          border: `1px solid ${provider.color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <provider.icon size={16} style={{ color: provider.color }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {entry.label}
          </div>
          <div style={{ fontSize: 11, color: textSub, display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <span>{provider.label}</span>
            <span>·</span>
            <span style={{ color: statusColors[entry.status] }}>
              {statusLabels[entry.status]}
            </span>
          </div>
        </div>
      </div>

      {/* Key + actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <code style={{
          fontSize: 12, fontFamily: "monospace",
          color: textMuted,
          background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
          border: `1px solid ${border}`,
          padding: "4px 10px",
          flex: 1, minWidth: 0,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {revealed ? entry.key : maskKey(entry.key)}
        </code>
        <button
          onClick={() => setRevealed(r => !r)}
          title={revealed ? "Hide key" : "Reveal key"}
          style={{ background: "transparent", border: "none", cursor: "pointer", color: textMuted, padding: 6, flexShrink: 0, display: "flex" }}
        >
          {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        <button
          onClick={copyKey}
          title="Copy key"
          style={{ background: "transparent", border: "none", cursor: "pointer", color: copied ? "#10b981" : textMuted, padding: 6, flexShrink: 0, display: "flex" }}
        >
          {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {entry.isPrimary ? (
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#10b981",
            border: "1px solid rgba(16,185,129,0.3)",
            background: "rgba(16,185,129,0.12)",
            padding: "4px 8px",
          }}>
            In Use
          </span>
        ) : (
          <button
            onClick={() => onSetPrimary(entry.id)}
            disabled={isPrimaryUpdating}
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
              border: `1px solid ${border}`,
              color: textMuted,
              cursor: isPrimaryUpdating ? "not-allowed" : "pointer",
              opacity: isPrimaryUpdating ? 0.65 : 1,
              padding: "5px 9px",
              fontFamily: "inherit",
            }}
          >
            Use This Key
          </button>
        )}

        <button
          onClick={() => onDelete(entry.id)}
          style={{ background: "transparent", border: "none", cursor: "pointer", color: textMuted, padding: 6, display: "flex", flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
          onMouseLeave={e => (e.currentTarget.style.color = textMuted)}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </motion.div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function AdminApiKeysClient() {
  const { isDark } = useTheme()

  // Theme tokens
  const bg      = isDark ? "#0d0d10" : "#f8f8f6"
  const surface = isDark ? "#111114" : "#ffffff"
  const border  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const text    = isDark ? "#f4f4f5" : "#09090b"
  const textMuted = isDark ? "#71717a" : "#71717a"
  const textSub = isDark ? "#52525b" : "#a1a1aa"

  const [keys, setKeys] = useState<ApiKeyEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [requestError, setRequestError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [primaryUpdatingId, setPrimaryUpdatingId] = useState<string | null>(null)

  const [showModal, setShowModal] = useState(false)
  const [filterProvider, setFilterProvider] = useState("all")

  async function fetchKeys() {
    setIsLoading(true)
    setRequestError("")
    try {
      const response = await fetch("/api/admin/api-keys", { cache: "no-store" })
      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(payload?.error || "Failed to fetch API keys")
      }

      const fetchedKeys = Array.isArray(payload?.keys) ? payload.keys : []
      setKeys(fetchedKeys)
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Failed to fetch API keys")
      setKeys([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchKeys()
  }, [])

  async function addKey(entry: Omit<ApiKeyEntry, "id" | "addedAt" | "status">) {
    setIsSaving(true)
    setRequestError("")

    try {
      const response = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: entry.provider,
          label: entry.label,
          key: entry.key,
          status: "untested",
        }),
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to save API key")
      }

      if (payload?.key) {
        setKeys(prev => [payload.key, ...prev])
      } else {
        await fetchKeys()
      }
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Failed to save API key")
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteKey(id: string) {
    setRequestError("")

    try {
      const response = await fetch(`/api/admin/api-keys/${id}`, {
        method: "DELETE",
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to delete API key")
      }

      setKeys(prev => prev.filter(k => k.id !== id))
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Failed to delete API key")
    }
  }

  async function setPrimaryKey(id: string) {
    const current = keys
    const target = current.find(entry => entry.id === id)
    if (!target || target.isPrimary) {
      return
    }

    setPrimaryUpdatingId(id)
    setRequestError("")

    setKeys(prev => prev.map(item => (
      item.provider === target.provider
        ? { ...item, isPrimary: item.id === id }
        : item
    )))

    try {
      const response = await fetch(`/api/admin/api-keys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set-primary" }),
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to set provider API key")
      }

      if (payload?.key) {
        setKeys(prev => prev.map(item => (
          item.provider === payload.key.provider
            ? { ...item, isPrimary: item.id === payload.key.id }
            : item
        )))
      }
    } catch (error) {
      setKeys(current)
      setRequestError(error instanceof Error ? error.message : "Failed to set provider API key")
    } finally {
      setPrimaryUpdatingId(null)
    }
  }

  const filtered = filterProvider === "all"
    ? keys
    : keys.filter(k => k.provider === filterProvider)

  const countByProvider = PROVIDERS.reduce((acc, p) => {
    acc[p.id] = keys.filter(k => k.provider === p.id).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div style={{ minHeight: "100vh", background: bg }}>

      {/* ── PAGE HEADER ── */}
      <div style={{
        padding: "40px 48px 36px",
        borderBottom: `1px solid ${border}`,
        background: isDark ? "linear-gradient(160deg,#0d0d10,#111118)" : surface,
        position: "relative", overflow: "hidden",
      }}>
        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle,${isDark ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.03)"} 1px,transparent 1px)`,
          backgroundSize: "28px 28px",
        }} />
        <div style={{
          position: "absolute", top: -100, left: "30%", width: 500, height: 400,
          borderRadius: "50%", pointerEvents: "none",
          background: isDark ? "radial-gradient(ellipse,rgba(99,102,241,0.1) 0%,transparent 70%)" : "transparent",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1400 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", padding: "4px 10px",
                  background: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)",
                  color: "#6366f1",
                  border: `1px solid ${isDark ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.25)"}`,
                  boxShadow: "0 0 12px rgba(99,102,241,0.15)",
                }}>
                  Admin Portal
                </span>
              </div>
              <h1 style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 900, lineHeight: 1,
                letterSpacing: "-0.04em", color: text, marginBottom: 8,
              }}>
                API Keys
              </h1>
              <p style={{ fontSize: 14, color: textMuted, maxWidth: 480 }}>
                Manage third-party API keys for Novita, Models Lab, and other providers used across the platform.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              disabled={isSaving}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "11px 20px",
                background: "#6366f1",
                border: "none", cursor: "pointer",
                color: "#fff", fontSize: 13, fontWeight: 700,
                fontFamily: "inherit",
                boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
                transition: "box-shadow 0.15s",
                opacity: isSaving ? 0.75 : 1,
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 28px rgba(99,102,241,0.5)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.35)")}
            >
              {isSaving ? <RefreshCw size={15} className="animate-spin" /> : <Plus size={15} />}
              {isSaving ? "Saving..." : "Add API Key"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "32px 48px", maxWidth: 1400 }}>

        {/* ── SUMMARY CARDS ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 1, background: border, marginBottom: 32,
        }}>
          {[
            { label: "Total Keys", value: keys.length, color: "#6366f1" },
            { label: "Active", value: keys.filter(k => k.status === "active").length, color: "#10b981" },
            { label: "Untested", value: keys.filter(k => k.status === "untested").length, color: "#f59e0b" },
            { label: "Errors", value: keys.filter(k => k.status === "error").length, color: "#ef4444" },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{ padding: "24px", background: surface, position: "relative", overflow: "hidden" }}
            >
              <div style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 900, fontFamily: "monospace", color: card.color, letterSpacing: "-0.04em" }}>
                {card.value}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: textMuted, marginTop: 6 }}>{card.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── FILTER + TABLE ── */}
        <div style={{ background: surface, border: `1px solid ${border}` }}>

          {/* Filter bar */}
          <div style={{
            padding: "16px 24px",
            borderBottom: `1px solid ${border}`,
            display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, marginRight: 4 }}>
              Filter:
            </span>
            {[{ id: "all", label: "All", color: text }, ...PROVIDERS.map(p => ({ id: p.id, label: p.label, color: p.color }))].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterProvider(f.id)}
                style={{
                  padding: "5px 12px",
                  background: filterProvider === f.id
                    ? f.id === "all"
                      ? isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"
                      : `${f.color}20`
                    : "transparent",
                  border: `1px solid ${filterProvider === f.id ? (f.id === "all" ? border : `${f.color}50`) : border}`,
                  color: filterProvider === f.id ? (f.id === "all" ? text : f.color) : textMuted,
                  fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >
                {f.label}
                {f.id !== "all" && countByProvider[f.id] > 0 && (
                  <span style={{ marginLeft: 6, opacity: 0.7 }}>({countByProvider[f.id]})</span>
                )}
              </button>
            ))}
          </div>

          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr auto",
            gap: 16,
            padding: "10px 24px",
            borderBottom: `1px solid ${border}`,
            background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
          }}>
            {["Provider / Label", "Key", "Usage"].map((h, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: textSub }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ padding: "64px 24px", textAlign: "center", color: textMuted }}
              >
                <RefreshCw size={24} className="animate-spin" style={{ marginBottom: 12, display: "block", margin: "0 auto 12px" }} />
                <p style={{ fontSize: 14, fontWeight: 600 }}>Loading API keys...</p>
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ padding: "64px 24px", textAlign: "center", color: textMuted }}
              >
                <Key size={32} style={{ opacity: 0.3, marginBottom: 12, display: "block", margin: "0 auto 12px" }} />
                <p style={{ fontSize: 14, fontWeight: 600 }}>No API keys found</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>Add your first key to get started.</p>
              </motion.div>
            ) : (
              filtered.map(entry => (
                <KeyRow
                  key={entry.id}
                  entry={entry}
                  onDelete={deleteKey}
                  onSetPrimary={setPrimaryKey}
                  isPrimaryUpdating={primaryUpdatingId === entry.id}
                  isDark={isDark}
                  border={border}
                  surface={surface}
                  text={text}
                  textMuted={textMuted}
                  textSub={textSub}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* ── SECURITY NOTE ── */}
        <div style={{
          marginTop: 24,
          padding: "16px 20px",
          background: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)",
          border: `1px solid ${isDark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.15)"}`,
          display: "flex", alignItems: "flex-start", gap: 12,
        }}>
          <Shield size={15} style={{ color: "#ef4444", marginTop: 1, flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", display: "block", marginBottom: 2 }}>
              Security Notice
            </span>
            <span style={{ fontSize: 12, color: textMuted }}>
              API keys are stored encrypted and only visible to administrators. Never share keys in public channels. Rotate keys regularly and revoke any that may be compromised.
            </span>
          </div>
        </div>

        {requestError && (
          <div style={{
            marginTop: 12,
            padding: "10px 14px",
            background: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)",
            border: `1px solid ${isDark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.15)"}`,
            color: "#ef4444",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <AlertCircle size={13} />
            {requestError}
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <AddKeyModal
            onClose={() => setShowModal(false)}
            onAdd={addKey}
            isDark={isDark}
            border={border}
            surface={surface}
            text={text}
            textMuted={textMuted}
          />
        )}
      </AnimatePresence>
    </div>
  )
}