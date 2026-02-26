"use client"

import { useState, useEffect, useRef } from "react"
import {
  updateUserProfile, logoutUser, getProfile,
  updateNotificationSettings, uploadProfileImage,
} from "@/app/actions/settings"
import { useTheme } from "@/contexts/themeContext"
import { useSidebar } from "@/components/dashboard-layout-controller"
import {
  User, Bell, Palette, Save, Camera, LogOut, CheckCircle,
  AlertCircle, Sun, Moon, Globe, RefreshCw, X, Info,
  ChevronRight, Shield, Mail, Smartphone, Monitor, Lock,
  MapPin, FileText, Zap, Eye, EyeOff,
} from "lucide-react"
import Link from "next/link"
import type { DashboardUser } from "@/types/dashboard-user"

interface SettingsMainProps {
  user: DashboardUser & { user_metadata?: Record<string, any> }
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ on, onChange, disabled }: { on: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button onClick={onChange} disabled={disabled} style={{
      width: 44, height: 24, borderRadius: 12, padding: 2, border: "none",
      background: on ? "var(--color-primary)" : "rgba(128,128,128,0.25)",
      cursor: disabled ? "not-allowed" : "pointer", transition: "background 0.2s",
      flexShrink: 0, position: "relative", opacity: disabled ? 0.5 : 1,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 2, left: on ? 22 : 2,
        transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }} />
    </button>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, icon: Icon, iconColor, iconBg, children, border, card, text }: any) {
  return (
    <div style={{ border: `1px solid ${border}`, overflow: "hidden" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "14px 20px",
        borderBottom: `1px solid ${border}`, background: card,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: iconBg, border: `1px solid ${iconColor}33`,
        }}>
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: text }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

// ── Field label ───────────────────────────────────────────────────────────────
function FieldLabel({ label, muted }: { label: string; muted: string }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, marginBottom: 7 }}>
      {label}
    </div>
  )
}

// ── Text input ────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type = "text", disabled, card, border, text, muted, readOnly }: any) {
  const [show, setShow] = useState(false)
  const isPassword = type === "password"
  return (
    <div>
      <FieldLabel label={label} muted={muted} />
      <div style={{ position: "relative" }}>
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || readOnly}
          readOnly={readOnly}
          style={{
            width: "100%", height: 40, paddingLeft: 12, paddingRight: isPassword ? 44 : 12,
            background: readOnly ? (card + "88") : card,
            border: `1px solid ${border}`, fontSize: 13,
            color: readOnly ? muted : text,
            outline: "none", boxSizing: "border-box",
            cursor: readOnly ? "default" : "text",
            fontFamily: isPassword && !show ? "monospace" : "inherit",
          }}
          onFocus={e => { if (!readOnly) e.currentTarget.style.borderColor = "var(--color-primary)" }}
          onBlur={e => e.currentTarget.style.borderColor = border}
        />
        {isPassword && (
          <button onClick={() => setShow(s => !s)} style={{
            position: "absolute", right: 0, top: 0, height: "100%", width: 40,
            background: "transparent", border: "none", cursor: "pointer", color: muted,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Notification row ──────────────────────────────────────────────────────────
function NotifRow({ label, sub, on, onChange, border, card, text, muted, last }: any) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      padding: "13px 20px", background: card,
      borderBottom: last ? "none" : `1px solid ${border}`,
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{label}</div>
        <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{sub}</div>
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  )
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toast, onDismiss }: { toast: { type: "success" | "error"; text: string }; onDismiss: () => void }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
      background: toast.type === "success" ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
      border: `1px solid ${toast.type === "success" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
      position: "sticky", top: 64, zIndex: 20,
    }}>
      {toast.type === "success"
        ? <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#10b981" }} />
        : <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#ef4444" }} />}
      <span style={{ fontSize: 13, color: toast.type === "success" ? "#10b981" : "#ef4444", flex: 1 }}>{toast.text}</span>
      <button onClick={onDismiss} style={{ background: "none", border: "none", cursor: "pointer", color: toast.type === "success" ? "#10b981" : "#ef4444" }}>
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function SettingsMain({ user }: SettingsMainProps) {
  const { isDark, setMode } = useTheme()
  const { sidebarWidth, isMobile } = useSidebar()

  const bg     = isDark ? "#0D0D0F" : "#f8f8f6"
  const card   = isDark ? "#1A1B1F" : "#ffffff"
  const card2  = isDark ? "#141416" : "#f4f4f2"
  const border = isDark ? "#202126" : "#e2e2e0"
  const text   = isDark ? "#ffffff" : "#0a0a0b"
  const muted  = isDark ? "#71717a" : "#71717a"
  const subtle = isDark ? "#52525b" : "#a1a1aa"

  const headerPaddingLeft = isMobile ? 56 : sidebarWidth + 24

  const [profileData, setProfileData] = useState({
    name: user.user_metadata?.name || user.name || "",
    bio: "", location: "",
  })
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [notifications, setNotifications] = useState({
    email:  { enabled: true,  marketing: false, updates: true, security: true, billing: true },
    push:   { enabled: false, chat: true,  security: true },
    inApp:  { enabled: true,  chat: true,  tips: true },
  })

  const [savingProfile, setSavingProfile] = useState(false)
  const [loadingImg, setLoadingImg]       = useState(false)
  const [loadingLogout, setLoadingLogout] = useState(false)
  const [toast, setToast]                 = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (type: "success" | "error", t: string) => {
    setToast({ type, text: t }); setTimeout(() => setToast(null), 3500)
  }

  // Load profile on mount
  useEffect(() => {
    getProfile().then(r => {
      if (!r.success || !r.data) return
      const d = r.data
      setProfileData(p => ({ ...p, bio: d.bio || "", location: d.location || "" }))
      if (d.profile_image)
        setProfileImageUrl(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_images/${d.profile_image}`)
      setNotifications({
        email: { enabled: d.email_notifications, marketing: d.marketing_updates, updates: d.product_updates, security: d.security_alerts, billing: d.billing_notifications },
        push:  { enabled: d.push_notifications, chat: d.chat_messages, security: d.security_push_alerts },
        inApp: { enabled: d.in_app_notifications, chat: d.chat_notifications, tips: d.tips },
      })
    })
  }, [])

  const saveProfile = async () => {
    setSavingProfile(true)
    const fd = new FormData()
    fd.append("name", profileData.name)
    fd.append("bio", profileData.bio)
    fd.append("location", profileData.location)
    const r = await updateUserProfile(fd)
    setSavingProfile(false)
    showToast(r.success ? "success" : "error", r.success ? (r.message || "Profile saved") : (r.error || "Failed"))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setLoadingImg(true)
    const fd = new FormData(); fd.append("file", file)
    const r = await uploadProfileImage(fd)
    setLoadingImg(false)
    if (r.success && r.data) {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_images/${r.data.profile_image}`
      setProfileImageUrl(url)
      showToast("success", "Photo updated")
    } else showToast("error", r.error || "Upload failed")
    if (fileRef.current) fileRef.current.value = ""
  }

  const NOTIF_MAP: Record<string, Record<string, string>> = {
    email: { enabled: "email_notifications", security: "security_alerts", billing: "billing_notifications", updates: "product_updates", marketing: "marketing_updates" },
    push:  { enabled: "push_notifications", chat: "chat_messages", security: "security_push_alerts" },
    inApp: { enabled: "in_app_notifications", chat: "chat_notifications", tips: "tips" },
  }

  const toggleNotif = async (cat: string, key: string) => {
    const cur = (notifications[cat as keyof typeof notifications] as any)[key]
    setNotifications(p => ({ ...p, [cat]: { ...(p[cat as keyof typeof p] as any), [key]: !cur } }))
    const field = NOTIF_MAP[cat]?.[key]; if (!field) return
    const r = await updateNotificationSettings({ [field]: !cur } as any)
    if (!r.success) {
      setNotifications(p => ({ ...p, [cat]: { ...(p[cat as keyof typeof p] as any), [key]: cur } }))
      showToast("error", r.error || "Failed to update")
    }
  }

  const displayName = user.user_metadata?.name || user.name || "User"
  const initials    = displayName[0]?.toUpperCase() ?? "U"

  // Shared props
  const fp = { card, border, text, muted }
  const sp = { border, card, text, muted }

  return (
    <div style={{ minHeight: "100svh", background: bg }}>
      {!isDark && (
        <style>{`
          input { background-color: #ffffff !important; color: #0a0a0b !important; border-color: #e2e2e0 !important; }
          input::placeholder { color: #a1a1aa !important; }
        `}</style>
      )}

      {/* ── HEADER ── */}
      <div className="fixed top-0 right-0 z-30 flex items-center justify-between gap-3"
        style={{ left: 0, height: 56, paddingLeft: headerPaddingLeft, paddingRight: 20,
          borderBottom: `1px solid ${border}`, background: card,
          transition: "padding-left 0.28s cubic-bezier(0.25,0.25,0,1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
            background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
            border: "1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)" }}>
            <User className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: text, letterSpacing: "-0.03em", lineHeight: 1 }}>Settings</div>
            <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>Preferences & account</div>
          </div>
        </div>
        <button
          onClick={async () => { setLoadingLogout(true); await logoutUser() }}
          disabled={loadingLogout}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)",
            color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          {loadingLogout ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{loadingLogout ? "Signing out…" : "Sign out"}</span>
        </button>
      </div>

      {/* ── BODY ── */}
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px", display: "flex", flexDirection: "column", gap: 28 }}>

          <div>
            <h1 style={{ fontSize: "clamp(1.3rem,3vw,1.8rem)", fontWeight: 900, color: text, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 6 }}>
              Account settings
            </h1>
            <p style={{ fontSize: 13, color: muted }}>Manage your profile, notifications, and preferences.</p>
          </div>

          {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}

          {/* ── 1. PROFILE ── */}
          <Section title="Profile" icon={User} iconColor="var(--color-primary)" iconBg="color-mix(in srgb, var(--color-primary) 12%, transparent)" border={border} card={card} text={text}>
            {/* Avatar row */}
            <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 16, borderBottom: `1px solid ${border}`, paddingBottom: 20, background: card2 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Avatar" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--color-primary)" }} />
                ) : (
                  <div style={{ width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                    boxShadow: "0 4px 14px color-mix(in srgb, var(--color-primary) 40%, transparent)" }}>
                    <span style={{ color: "#fff", fontWeight: 800, fontSize: 24 }}>{initials}</span>
                  </div>
                )}
                <button onClick={() => fileRef.current?.click()} disabled={loadingImg} style={{
                  position: "absolute", bottom: -2, right: -2, width: 26, height: 26, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: card, border: `1px solid ${border}`, cursor: "pointer", color: muted,
                }}>
                  {loadingImg ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: text, letterSpacing: "-0.02em" }}>{displayName}</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>{user.email}</div>
                <button onClick={() => fileRef.current?.click()} style={{ marginTop: 8, fontSize: 11, fontWeight: 600, color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Change photo
                </button>
              </div>
            </div>

            {/* Fields */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14, background: card2 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Full name" value={profileData.name} onChange={(v: string) => setProfileData(p => ({ ...p, name: v }))} placeholder="Your name" {...fp} />
                <Field label="Email address" value={user.email} readOnly {...fp} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Bio" value={profileData.bio} onChange={(v: string) => setProfileData(p => ({ ...p, bio: v }))} placeholder="Tell us about yourself" {...fp} />
                <Field label="Location" value={profileData.location} onChange={(v: string) => setProfileData(p => ({ ...p, location: v }))} placeholder="City, Country" {...fp} />
              </div>
              <div>
                <button onClick={saveProfile} disabled={savingProfile} style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "10px 18px",
                  background: "var(--color-primary)", border: "none", color: "#fff",
                  fontSize: 13, fontWeight: 700, cursor: savingProfile ? "not-allowed" : "pointer",
                  opacity: savingProfile ? 0.7 : 1,
                }}>
                  {savingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {savingProfile ? "Saving…" : "Save profile"}
                </button>
              </div>
            </div>
          </Section>

          {/* ── 2. SECURITY ── */}
          <Section title="Security" icon={Shield} iconColor="#ef4444" iconBg="rgba(239,68,68,0.10)" border={border} card={card} text={text}>
            <div style={{ background: card2 }}>
              {/* Quick info row */}
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 12, background: card }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: text }}>Password & two-factor authentication</div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>Change your password, enable 2FA, and review active sessions on the dedicated security page.</div>
                </div>
                <Link href="/dashboard/security" style={{ textDecoration: "none", flexShrink: 0 }}>
                  <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                    background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)",
                    color: "var(--color-primary)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    Manage <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>

              {/* Security stat rows */}
              {[
                { icon: Lock,       color: "#6366f1", label: "Password",                  value: "Last changed recently",           href: "/dashboard/security" },
                { icon: Smartphone, color: "#10b981", label: "Two-factor authentication", value: "Configure on security page",       href: "/dashboard/security" },
                { icon: Monitor,    color: "#8b5cf6", label: "Active sessions",            value: "View and revoke on security page", href: "/dashboard/security" },
              ].map((row, i, arr) => (
                <Link key={row.label} href={row.href} style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 20px",
                    borderBottom: i < arr.length - 1 ? `1px solid ${border}` : "none",
                    background: card, cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = card2)}
                    onMouseLeave={e => (e.currentTarget.style.background = card)}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 7, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${row.color}14`, border: `1px solid ${row.color}30` }}>
                      <row.icon className="w-3.5 h-3.5" style={{ color: row.color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: text }}>{row.label}</div>
                      <div style={{ fontSize: 11, color: muted, marginTop: 1 }}>{row.value}</div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" style={{ color: subtle, flexShrink: 0 }} />
                  </div>
                </Link>
              ))}
            </div>
          </Section>

          {/* ── 3. NOTIFICATIONS ── */}
          <Section title="Notifications" icon={Bell} iconColor="#f59e0b" iconBg="rgba(245,158,11,0.10)" border={border} card={card} text={text}>
            <div style={{ background: card2 }}>
              {/* Email */}
              <div style={{ padding: "10px 20px 6px", borderBottom: `1px solid ${border}`, background: card }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: subtle }}>Email</span>
              </div>
              {[
                { cat: "email", key: "enabled",   label: "Email notifications",  sub: "Receive updates and alerts via email"         },
                { cat: "email", key: "security",  label: "Security alerts",      sub: "Login attempts and API key activity"          },
                { cat: "email", key: "billing",   label: "Billing updates",      sub: "Receipts, invoices, and payment alerts"       },
                { cat: "email", key: "updates",   label: "Product updates",      sub: "New features and platform announcements"      },
                { cat: "email", key: "marketing", label: "Marketing emails",     sub: "Tips, case studies, and promotions"           },
              ].map((row, i, arr) => (
                <NotifRow key={`${row.cat}-${row.key}`} label={row.label} sub={row.sub}
                  on={(notifications[row.cat as keyof typeof notifications] as any)[row.key]}
                  onChange={() => toggleNotif(row.cat, row.key)}
                  last={i === arr.length - 1} {...sp} />
              ))}

              {/* Push */}
              <div style={{ padding: "10px 20px 6px", borderBottom: `1px solid ${border}`, borderTop: `1px solid ${border}`, background: card }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: subtle }}>Push</span>
              </div>
              {[
                { cat: "push", key: "enabled",  label: "Push notifications", sub: "Alerts sent to your devices"            },
                { cat: "push", key: "chat",     label: "Chat messages",      sub: "New message notifications"              },
                { cat: "push", key: "security", label: "Security push",      sub: "Immediate alerts for suspicious activity"},
              ].map((row, i, arr) => (
                <NotifRow key={`${row.cat}-${row.key}`} label={row.label} sub={row.sub}
                  on={(notifications[row.cat as keyof typeof notifications] as any)[row.key]}
                  onChange={() => toggleNotif(row.cat, row.key)}
                  last={i === arr.length - 1} {...sp} />
              ))}

              {/* In-app */}
              <div style={{ padding: "10px 20px 6px", borderBottom: `1px solid ${border}`, borderTop: `1px solid ${border}`, background: card }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: subtle }}>In-app</span>
              </div>
              {[
                { cat: "inApp", key: "enabled", label: "In-app notifications", sub: "Alerts shown inside the dashboard"  },
                { cat: "inApp", key: "chat",    label: "Chat notifications",   sub: "Real-time messages in dashboard"    },
                { cat: "inApp", key: "tips",    label: "Tips & hints",         sub: "Usage suggestions and help prompts" },
              ].map((row, i, arr) => (
                <NotifRow key={`${row.cat}-${row.key}`} label={row.label} sub={row.sub}
                  on={(notifications[row.cat as keyof typeof notifications] as any)[row.key]}
                  onChange={() => toggleNotif(row.cat, row.key)}
                  last={i === arr.length - 1} {...sp} />
              ))}
            </div>
          </Section>

          {/* ── 4. APPEARANCE ── */}
          <Section title="Appearance" icon={Palette} iconColor="#8b5cf6" iconBg="rgba(139,92,246,0.10)" border={border} card={card} text={text}>
            <div style={{ padding: "20px", background: card2, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted }}>Theme</div>

              {/* Theme tiles */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: border }}>
                {[
                  { mode: "dark",   label: "Dark",   icon: Moon,  preview: "#0D0D0F" },
                  { mode: "light",  label: "Light",  icon: Sun,   preview: "#f8f8f6" },
                  { mode: "system", label: "System", icon: Globe, preview: "linear-gradient(135deg, #0D0D0F 50%, #f8f8f6 50%)" },
                ].map(t => {
                  const active = t.mode === "system"
                    ? false
                    : isDark ? t.mode === "dark" : t.mode === "light"
                  return (
                    <button key={t.mode} onClick={() => setMode(t.mode as any)} style={{
                      background: card, padding: "16px", border: "none", cursor: "pointer", textAlign: "left",
                      outline: active ? "2px solid var(--color-primary)" : "none", outlineOffset: -2,
                    }}>
                      <div style={{ width: "100%", height: 44, borderRadius: 5, marginBottom: 10,
                        background: t.preview, border: `1px solid ${border}` }} />
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <t.icon className="w-3 h-3" style={{ color: muted }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: text }}>{t.label}</span>
                        </div>
                        {active && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-primary)" }} />}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: subtle }} />
                <span style={{ fontSize: 11, color: subtle, lineHeight: 1.6 }}>
                  Theme changes apply immediately across all dashboard pages.
                </span>
              </div>
            </div>
          </Section>

          {/* ── 5. ACCOUNT INFO ── */}
          <Section title="Account info" icon={Zap} iconColor="#10b981" iconBg="rgba(16,185,129,0.10)" border={border} card={card} text={text}>
            <div style={{ background: card2 }}>
              {[
                { label: "User ID",        value: user.id,    mono: true  },
                { label: "Email",          value: user.email, mono: false },
                { label: "Account type",   value: "Standard", mono: false },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 20px",
                  background: card, borderBottom: i < arr.length - 1 ? `1px solid ${border}` : "none" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: muted }}>{row.label}</span>
                  <span style={{ fontSize: 12, color: text, fontFamily: row.mono ? "monospace" : "inherit",
                    maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* ── 6. DANGER ZONE ── */}
          <Section title="Danger zone" icon={AlertCircle} iconColor="#ef4444" iconBg="rgba(239,68,68,0.10)" border={border} card={card} text={text}>
            <div style={{ background: card2 }}>
              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: card }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: text }}>Sign out of all devices</div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>Revokes all active sessions — you'll need to sign in again everywhere.</div>
                </div>
                <Link href="/dashboard/security" style={{ textDecoration: "none", flexShrink: 0 }}>
                  <button style={{ padding: "8px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
                    color: "#ef4444", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    Manage sessions
                  </button>
                </Link>
              </div>
              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                background: card, borderTop: `1px solid ${border}` }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#ef4444" }}>Delete account</div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>Permanently delete your account and all associated data. This cannot be undone.</div>
                </div>
                <button
                  onClick={() => showToast("error", "Please contact support to delete your account.")}
                  style={{ padding: "8px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
                    color: "#ef4444", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
                  Delete account
                </button>
              </div>
            </div>
          </Section>

          {/* Bottom info */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, paddingBottom: 8 }}>
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: subtle }} />
            <span style={{ fontSize: 11, color: subtle, lineHeight: 1.6 }}>
              For billing, API keys, and team management visit the respective pages in the sidebar.
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}