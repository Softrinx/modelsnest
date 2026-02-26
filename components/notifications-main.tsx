"use client"

import { useState, useEffect } from "react"
import { getProfile, updateNotificationSettings } from "@/app/actions/settings"
import { useTheme } from "@/contexts/themeContext"
import { useSidebar } from "@/components/dashboard-layout-controller"
import {
  Bell, Mail, Smartphone, MessageSquare, Globe,
  Shield, CreditCard, CheckCircle, Clock, Zap,
  Volume2, VolumeX, AlertCircle, Info, Loader2,
} from "lucide-react"
import type { DashboardUser } from "@/types/dashboard-user"

interface NotificationsMainProps { user: DashboardUser }

type NotificationUpdates = Parameters<typeof updateNotificationSettings>[0]

// ── Reusable toggle ──────────────────────────────────────────────────────────
function Toggle({ on, onChange, disabled }: { on: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      style={{
        width: 44, height: 24, borderRadius: 12, padding: 2, border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        background: on ? "var(--color-primary)" : "rgba(128,128,128,0.25)",
        transition: "background 0.2s",
        flexShrink: 0, position: "relative",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 2,
        left: on ? 22 : 2,
        transition: "left 0.2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }} />
    </button>
  )
}

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, sub, icon: Icon, children, card, border, text, muted, color = "var(--color-primary)" }: any) {
  return (
    <div style={{ border: `1px solid ${border}`, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px",
        borderBottom: `1px solid ${border}`, background: card }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          border: `1px solid color-mix(in srgb, ${color} 25%, transparent)` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: text }}>{title}</div>
          <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{sub}</div>
        </div>
      </div>
      {children}
    </div>
  )
}

// ── Toggle row ───────────────────────────────────────────────────────────────
function ToggleRow({ label, sub, value, onToggle, card, border, text, muted, indent = false, disabled }: any) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: indent ? "13px 20px 13px 52px" : "13px 20px",
      background: card, borderBottom: `1px solid ${border}`,
      gap: 16,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: indent ? 500 : 600, color: text }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{sub}</div>}
      </div>
      <Toggle on={value} onChange={onToggle} disabled={disabled} />
    </div>
  )
}

export function NotificationsMain({ user }: NotificationsMainProps) {
  const { isDark } = useTheme()
  const { sidebarWidth, isMobile } = useSidebar()

  const bg     = isDark ? "#0D0D0F" : "#f8f8f6"
  const card   = isDark ? "#1A1B1F" : "#ffffff"
  const card2  = isDark ? "#141416" : "#f4f4f2"
  const border = isDark ? "#202126" : "#e2e2e0"
  const text   = isDark ? "#ffffff" : "#0a0a0b"
  const muted  = isDark ? "#71717a" : "#71717a"
  const subtle = isDark ? "#52525b" : "#a1a1aa"

  const headerPaddingLeft = isMobile ? 56 : sidebarWidth + 24

  type Notifs = {
    email:  { enabled: boolean; marketing: boolean; updates: boolean; security: boolean; billing: boolean }
    push:   { enabled: boolean; chat: boolean; updates: boolean; security: boolean }
    inApp:  { enabled: boolean; chat: boolean; updates: boolean; tips: boolean }
  }

  const [notifs, setNotifs] = useState<Notifs>({
    email: { enabled: true, marketing: false, updates: true, security: true, billing: true },
    push:  { enabled: false, chat: true, updates: true, security: true },
    inApp: { enabled: true, chat: true, updates: true, tips: false },
  })

  const [quiet, setQuiet] = useState({ enabled: false, start: "22:00", end: "08:00" })
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [fetching, setFetching] = useState(true)

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    setFetching(true)
    getProfile().then(r => {
      if (r.success && r.data) {
        const d = r.data
        setNotifs({
          email: {
            enabled:   d.email_notifications,
            marketing: d.marketing_updates,
            updates:   d.product_updates,
            security:  d.security_alerts,
            billing:   d.billing_notifications,
          },
          push: {
            enabled:  d.push_notifications,
            chat:     d.chat_messages,
            updates:  d.product_updates,
            security: d.security_push_alerts,
          },
          inApp: {
            enabled: d.in_app_notifications,
            chat:    d.chat_notifications,
            updates: d.product_updates,
            tips:    d.tips,
          },
        })
        setQuiet({
          enabled: d.quiet_hours,
          start:   d.quiet_hours_start?.slice(0, 5) ?? "22:00",
          end:     d.quiet_hours_end?.slice(0, 5) ?? "08:00",
        })
      } else {
        showToast("error", "Failed to load notification preferences")
      }
    }).finally(() => setFetching(false))
  }, [])

  const FIELD_MAP: Record<string, Record<string, string>> = {
    email: {
      enabled:   "email_notifications",
      security:  "security_alerts",
      billing:   "billing_notifications",
      updates:   "product_updates",
      marketing: "marketing_updates",
    },
    push: {
      enabled:  "push_notifications",
      chat:     "chat_messages",
      updates:  "product_updates",
      security: "security_push_alerts",
    },
    inApp: {
      enabled: "in_app_notifications",
      chat:    "chat_notifications",
      updates: "product_updates",
      tips:    "tips",
    },
  }

  const toggle = async (cat: keyof Notifs, key: string) => {
    const current = (notifs[cat] as any)[key]
    const next = !current
    setNotifs(p => ({ ...p, [cat]: { ...p[cat], [key]: next } }))
    const field = FIELD_MAP[cat]?.[key]
    if (!field) return
    const r = await updateNotificationSettings({ [field]: next } as NotificationUpdates)
    if (!r.success) {
      setNotifs(p => ({ ...p, [cat]: { ...p[cat], [key]: current } }))
      showToast("error", r.error ?? "Failed to update")
    } else {
      showToast("success", "Preferences updated")
    }
  }

  const toggleQuiet = async () => {
    const next = !quiet.enabled
    setQuiet(p => ({ ...p, enabled: next }))
    const r = await updateNotificationSettings({ quiet_hours: next } as NotificationUpdates)
    if (!r.success) {
      setQuiet(p => ({ ...p, enabled: !next }))
      showToast("error", r.error ?? "Failed")
    } else {
      showToast("success", "Quiet hours updated")
    }
  }

  const changeQuietTime = async (field: "start" | "end", value: string) => {
    const prev = quiet[field]
    setQuiet(p => ({ ...p, [field]: value }))
    const r = await updateNotificationSettings({
      [field === "start" ? "quiet_hours_start" : "quiet_hours_end"]: value,
    } as NotificationUpdates)
    if (!r.success) {
      setQuiet(p => ({ ...p, [field]: prev }))
      showToast("error", r.error ?? "Failed")
    }
  }

  const sharedRowProps = { card, border, text, muted }

  return (
    <div style={{ minHeight: "100svh", background: bg }}>

      {!isDark && (
        <style>{`
          input[type="time"] { background-color: #f4f4f2 !important; color: #0a0a0b !important; border-color: #e2e2e0 !important; }
        `}</style>
      )}

      {/* ── FIXED HEADER ── */}
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
            background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)" }}>
            <Bell className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: text, letterSpacing: "-0.03em", lineHeight: 1 }}>Notifications</div>
            <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>Alerts & preferences</div>
          </div>
        </div>

        {fetching && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
            background: "color-mix(in srgb, var(--color-primary) 8%, transparent)",
            border: "1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)",
            borderRadius: 8 }}>
            <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "var(--color-primary)" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-primary)" }}>Loading…</span>
          </div>
        )}
      </div>

      {/* ── BODY ── */}
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px", display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Page title */}
          <div>
            <h1 style={{ fontSize: "clamp(1.3rem,3vw,1.8rem)", fontWeight: 900, color: text, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 6 }}>
              Notification settings
            </h1>
            <p style={{ fontSize: 13, color: muted }}>Choose how and when you hear from Outsoor.</p>
          </div>

          {/* Toast */}
          {toast && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
              background: toast.type === "success" ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${toast.type === "success" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
            }}>
              {toast.type === "success"
                ? <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#10b981" }} />
                : <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#ef4444" }} />}
              <span style={{ fontSize: 13, color: toast.type === "success" ? "#10b981" : "#ef4444" }}>{toast.text}</span>
            </div>
          )}

          {/* Skeleton overlay when fetching */}
          {fetching ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ border: `1px solid ${border}`, overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, background: card, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: isDark ? "#2a2b30" : "#ebebeb" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ width: 120, height: 12, borderRadius: 4, background: isDark ? "#2a2b30" : "#ebebeb", marginBottom: 6 }} />
                      <div style={{ width: 180, height: 10, borderRadius: 4, background: isDark ? "#232428" : "#f0f0ee" }} />
                    </div>
                  </div>
                  {[1, 2, 3].map(j => (
                    <div key={j} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 20px", background: card, borderBottom: `1px solid ${border}` }}>
                      <div>
                        <div style={{ width: 100 + j * 20, height: 11, borderRadius: 4, background: isDark ? "#2a2b30" : "#ebebeb", marginBottom: 5 }} />
                        <div style={{ width: 140 + j * 10, height: 9, borderRadius: 4, background: isDark ? "#232428" : "#f0f0ee" }} />
                      </div>
                      <div style={{ width: 44, height: 24, borderRadius: 12, background: isDark ? "#2a2b30" : "#ebebeb" }} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* ── EMAIL ── */}
              <Section title="Email notifications" sub="Control which emails you receive" icon={Mail} {...sharedRowProps} color="#6366f1">
                <ToggleRow label="Email notifications" sub="Master toggle for all email delivery" value={notifs.email.enabled} onToggle={() => toggle("email", "enabled")} {...sharedRowProps} />
                {notifs.email.enabled && <>
                  <ToggleRow indent label="Security alerts" sub="Login attempts, API key changes" value={notifs.email.security} onToggle={() => toggle("email", "security")} {...sharedRowProps} />
                  <ToggleRow indent label="Billing updates" sub="Payment receipts and invoices" value={notifs.email.billing} onToggle={() => toggle("email", "billing")} {...sharedRowProps} />
                  <ToggleRow indent label="Product updates" sub="New features and improvements" value={notifs.email.updates} onToggle={() => toggle("email", "updates")} {...sharedRowProps} />
                  <ToggleRow indent label="Marketing" sub="Promotions and special offers" value={notifs.email.marketing} onToggle={() => toggle("email", "marketing")} {...sharedRowProps} />
                </>}
              </Section>

              {/* ── PUSH ── */}
              <Section title="Push notifications" sub="Alerts on your mobile and desktop devices" icon={Smartphone} {...sharedRowProps} color="#8b5cf6">
                <ToggleRow label="Push notifications" sub="Master toggle for all push delivery" value={notifs.push.enabled} onToggle={() => toggle("push", "enabled")} {...sharedRowProps} />
                {notifs.push.enabled && <>
                  <ToggleRow indent label="Chat messages" sub="New AI responses and completions" value={notifs.push.chat} onToggle={() => toggle("push", "chat")} {...sharedRowProps} />
                  <ToggleRow indent label="Security alerts" sub="Suspicious activity detected" value={notifs.push.security} onToggle={() => toggle("push", "security")} {...sharedRowProps} />
                  <ToggleRow indent label="Product updates" sub="New models and features" value={notifs.push.updates} onToggle={() => toggle("push", "updates")} {...sharedRowProps} />
                </>}
              </Section>

              {/* ── IN-APP ── */}
              <Section title="In-app notifications" sub="What appears inside the dashboard" icon={Bell} {...sharedRowProps} color="#06b6d4">
                <ToggleRow label="In-app notifications" sub="Master toggle for all in-app alerts" value={notifs.inApp.enabled} onToggle={() => toggle("inApp", "enabled")} {...sharedRowProps} />
                {notifs.inApp.enabled && <>
                  <ToggleRow indent label="Chat activity" sub="Message completions and errors" value={notifs.inApp.chat} onToggle={() => toggle("inApp", "chat")} {...sharedRowProps} />
                  <ToggleRow indent label="Product updates" sub="Release notes and changelogs" value={notifs.inApp.updates} onToggle={() => toggle("inApp", "updates")} {...sharedRowProps} />
                  <ToggleRow indent label="Tips & hints" sub="Contextual usage suggestions" value={notifs.inApp.tips} onToggle={() => toggle("inApp", "tips")} {...sharedRowProps} />
                </>}
              </Section>

              {/* ── QUIET HOURS ── */}
              <Section title="Quiet hours" sub="Pause all non-critical notifications on a schedule" icon={Clock} {...sharedRowProps} color="#f59e0b">
                <ToggleRow label="Enable quiet hours" sub="Mute notifications during selected times" value={quiet.enabled} onToggle={toggleQuiet} {...sharedRowProps} />
                {quiet.enabled && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: border, borderTop: `1px solid ${border}` }}>
                    {(["start", "end"] as const).map(f => (
                      <div key={f} style={{ background: card, padding: "16px 20px" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, marginBottom: 8 }}>
                          {f === "start" ? "Start time" : "End time"}
                        </div>
                        <input
                          type="time"
                          value={quiet[f]}
                          onChange={e => changeQuietTime(f, e.target.value)}
                          style={{
                            width: "100%", padding: "8px 10px", fontSize: 14, fontWeight: 700,
                            fontFamily: "monospace", color: text,
                            background: card2, border: `1px solid ${border}`,
                            outline: "none", borderRadius: 0,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            </>
          )}

          {/* Info note */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "12px 0" }}>
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: subtle }} />
            <span style={{ fontSize: 11, color: subtle, lineHeight: 1.6 }}>
              Critical security notifications are always delivered regardless of your preferences. Changes take effect immediately.
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}