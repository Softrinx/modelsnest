"use client"

import { useState, useEffect, useRef } from "react"
import { updateUserProfile, changePassword, logoutUser, getProfile, updateNotificationSettings, uploadProfileImage } from "@/app/actions/settings"
import { useTheme } from "@/contexts/themeContext"
import { useSidebar } from "@/components/dashboard-layout-controller"
import {
  User, Shield, Bell, Palette, Key, Save, Camera,
  ArrowRight, LogOut, CheckCircle, AlertCircle,
  Eye, EyeOff, Sun, Moon, Globe, MapPin, FileText,
  RefreshCw, X, Info, ChevronRight,
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

// ── Tab button ────────────────────────────────────────────────────────────────
function Tab({ label, icon: Icon, active, onClick, text, muted, border, card }: any) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 7, padding: "10px 16px",
      background: active ? card : "transparent",
      border: `1px solid ${active ? border : "transparent"}`,
      borderBottom: active ? `1px solid ${card}` : `1px solid ${border}`,
      marginBottom: active ? -1 : 0,
      cursor: "pointer", fontSize: 13, fontWeight: 600,
      color: active ? text : muted, transition: "all 0.15s", whiteSpace: "nowrap",
    }}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  )
}

// ── Field label ───────────────────────────────────────────────────────────────
function FieldLabel({ label, muted }: { label: string; muted: string }) {
  return <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, marginBottom: 7 }}>{label}</div>
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
            background: readOnly ? (typeof card === "string" ? card + "88" : card) : card,
            border: `1px solid ${border}`, fontSize: 13, color: readOnly ? muted : text,
            outline: "none", boxSizing: "border-box", cursor: readOnly ? "default" : "text",
            fontFamily: isPassword && !show ? "monospace" : "inherit",
          }}
          onFocus={e => { if (!readOnly) e.currentTarget.style.borderColor = "var(--color-primary)" }}
          onBlur={e => e.currentTarget.style.borderColor = border}
        />
        {isPassword && (
          <button onClick={() => setShow(s => !s)} style={{ position: "absolute", right: 0, top: 0,
            height: "100%", width: 40, background: "transparent", border: "none", cursor: "pointer", color: muted,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toast, onDismiss }: { toast: { type: "success" | "error"; text: string }; onDismiss: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
      background: toast.type === "success" ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
      border: `1px solid ${toast.type === "success" ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}` }}>
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

  const [tab, setTab] = useState<"profile" | "security" | "notifications" | "appearance">("profile")

  const [profileData, setProfileData] = useState({
    name: user.user_metadata?.name || user.name || "",
    bio: "", location: "", profile_image: "",
  })
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [passwords, setPasswords] = useState({ new: "", confirm: "" })
  const [notifications, setNotifications] = useState({
    email: { enabled: true, marketing: false, updates: true, security: true, billing: true },
    push:  { enabled: false, chat: true, security: true },
    inApp: { enabled: true, chat: true, tips: true },
  })
  const [quiet, setQuiet] = useState({ enabled: false, start: "20:00", end: "08:00" })

  const [saving, setSaving]   = useState(false)
  const [toast, setToast]     = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [loadingImg, setLoadingImg] = useState(false)
  const [loadingLogout, setLoadingLogout] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text }); setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    getProfile().then(r => {
      if (!r.success || !r.data) return
      const d = r.data
      setProfileData(p => ({ ...p, bio: d.bio || "", location: d.location || "", profile_image: d.profile_image || "" }))
      if (d.profile_image)
        setProfileImageUrl(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_images/${d.profile_image}`)
      setNotifications({
        email: { enabled: d.email_notifications, marketing: d.marketing_updates, updates: d.product_updates, security: d.security_alerts, billing: d.billing_notifications },
        push:  { enabled: d.push_notifications, chat: d.chat_messages, security: d.security_push_alerts },
        inApp: { enabled: d.in_app_notifications, chat: d.chat_notifications, tips: d.tips },
      })
      setQuiet({ enabled: d.quiet_hours, start: d.quiet_hours_start?.slice(0,5) ?? "20:00", end: d.quiet_hours_end?.slice(0,5) ?? "08:00" })
    })
  }, [])

  const saveProfile = async () => {
    setSaving(true)
    const fd = new FormData()
    fd.append("name", profileData.name)
    fd.append("bio", profileData.bio)
    fd.append("location", profileData.location)
    const r = await updateUserProfile(fd)
    setSaving(false)
    showToast(r.success ? "success" : "error", r.success ? (r.message || "Profile saved") : (r.error || "Failed"))
  }

  const savePassword = async () => {
    if (!passwords.new || !passwords.confirm) return showToast("error", "Both fields are required")
    if (passwords.new !== passwords.confirm) return showToast("error", "Passwords do not match")
    if (passwords.new.length < 8) return showToast("error", "Password must be at least 8 characters")
    setSaving(true)
    const fd = new FormData()
    fd.append("newPassword", passwords.new)
    fd.append("confirmPassword", passwords.confirm)
    const r = await changePassword(fd)
    setSaving(false)
    if (r.success) { setPasswords({ new: "", confirm: "" }); showToast("success", r.message || "Password updated") }
    else showToast("error", r.error || "Failed to update password")
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoadingImg(true)
    const fd = new FormData(); fd.append("file", file)
    const r = await uploadProfileImage(fd)
    setLoadingImg(false)
    if (r.success && r.data) {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_images/${r.data.profile_image}`
      setProfileImageUrl(url)
      setProfileData(p => ({ ...p, profile_image: r.data.profile_image }))
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
    setNotifications(p => ({ ...p, [cat]: { ...p[cat as keyof typeof p], [key]: !cur } }))
    const field = NOTIF_MAP[cat]?.[key]; if (!field) return
    const r = await updateNotificationSettings({ [field]: !cur } as any)
    if (!r.success) { setNotifications(p => ({ ...p, [cat]: { ...p[cat as keyof typeof p], [key]: cur } })); showToast("error", r.error || "Failed") }
    else showToast("success", "Preferences updated")
  }

  const displayName = user.user_metadata?.name || user.name || "User"
  const initials = displayName[0]?.toUpperCase() ?? "U"

  const sharedTab = { text, muted, border, card }

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
        {/* Logout */}
        <button onClick={async () => { 
          setLoadingLogout(true)
          localStorage.removeItem("activeAccount")
          await logoutUser()
        }}
          disabled={loadingLogout}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)",
            color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer", borderRadius: 0 }}>
          {loadingLogout ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{loadingLogout ? "Signing out…" : "Sign out"}</span>
        </button>
      </div>

      {/* ── BODY ── */}
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px", display: "flex", flexDirection: "column", gap: 24 }}>

          <div>
            <h1 style={{ fontSize: "clamp(1.3rem,3vw,1.8rem)", fontWeight: 900, color: text, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 6 }}>
              Account settings
            </h1>
            <p style={{ fontSize: 13, color: muted }}>Manage your profile, security, notifications, and appearance.</p>
          </div>

          {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}

          {/* ── TABS ── */}
          <div>
            <div style={{ display: "flex", borderBottom: `1px solid ${border}`, overflowX: "auto" }}>
              {([
                { id: "profile",       label: "Profile",       icon: User    },
                { id: "security",      label: "Security",      icon: Shield  },
                { id: "notifications", label: "Notifications", icon: Bell    },
                { id: "appearance",    label: "Appearance",    icon: Palette },
              ] as const).map(t => (
                <Tab key={t.id} label={t.label} icon={t.icon} active={tab === t.id} onClick={() => setTab(t.id)} {...sharedTab} />
              ))}
            </div>

            {/* ── PROFILE TAB ── */}
            {tab === "profile" && (
              <div style={{ border: `1px solid ${border}`, borderTop: "none", background: card2 }}>
                {/* Avatar */}
                <div style={{ padding: "24px 24px 0", display: "flex", alignItems: "center", gap: 16, borderBottom: `1px solid ${border}`, paddingBottom: 20 }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    {profileImageUrl ? (
                      <img src={profileImageUrl} alt="Avatar" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover",
                        border: "2px solid var(--color-primary)" }} />
                    ) : (
                      <div style={{ width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                        background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                        boxShadow: "0 4px 14px color-mix(in srgb, var(--color-primary) 40%, transparent)" }}>
                        <span style={{ color: "#fff", fontWeight: 800, fontSize: 24 }}>{initials}</span>
                      </div>
                    )}
                    <button onClick={() => fileRef.current?.click()} disabled={loadingImg}
                      style={{ position: "absolute", bottom: -2, right: -2, width: 26, height: 26, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: card, border: `1px solid ${border}`, cursor: "pointer", color: muted }}>
                      {loadingImg ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: text, letterSpacing: "-0.02em" }}>{displayName}</div>
                    <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>{user.email}</div>
                    <button onClick={() => fileRef.current?.click()}
                      style={{ marginTop: 8, fontSize: 11, fontWeight: 600, color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      Change photo
                    </button>
                  </div>
                </div>

                {/* Fields */}
                <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <Field label="Full name" value={profileData.name} onChange={(v: string) => setProfileData(p => ({ ...p, name: v }))}
                      placeholder="Your name" card={card} border={border} text={text} muted={muted} />
                    <Field label="Email address" value={user.email} readOnly card={card} border={border} text={text} muted={muted} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <Field label="Bio" value={profileData.bio} onChange={(v: string) => setProfileData(p => ({ ...p, bio: v }))}
                      placeholder="Tell us about yourself" card={card} border={border} text={text} muted={muted} />
                    <Field label="Location" value={profileData.location} onChange={(v: string) => setProfileData(p => ({ ...p, location: v }))}
                      placeholder="City, Country" card={card} border={border} text={text} muted={muted} />
                  </div>
                  <button onClick={saveProfile} disabled={saving}
                    style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", width: "fit-content",
                      background: "var(--color-primary)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {saving ? "Saving…" : "Save profile"}
                  </button>
                </div>
              </div>
            )}

            {/* ── SECURITY TAB ── */}
            {tab === "security" && (
              <div style={{ border: `1px solid ${border}`, borderTop: "none", background: card2 }}>
                <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted }}>Change password</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <Field label="New password" value={passwords.new} onChange={(v: string) => setPasswords(p => ({ ...p, new: v }))}
                      type="password" placeholder="Min 8 characters" card={card} border={border} text={text} muted={muted} />
                    <Field label="Confirm password" value={passwords.confirm} onChange={(v: string) => setPasswords(p => ({ ...p, confirm: v }))}
                      type="password" placeholder="Repeat new password" card={card} border={border} text={text} muted={muted} />
                  </div>
                  {passwords.confirm.length > 0 && passwords.new !== passwords.confirm && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px",
                      background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                      <AlertCircle className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
                      <span style={{ fontSize: 11, color: "#ef4444" }}>Passwords do not match</span>
                    </div>
                  )}
                  <button onClick={savePassword} disabled={saving}
                    style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", width: "fit-content",
                      background: "#6366f1", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                    {saving ? "Updating…" : "Update password"}
                  </button>
                </div>

                {/* Link to full security page */}
                <div style={{ margin: "0 24px 20px", border: `1px solid ${border}`, background: card }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: text }}>Advanced security settings</div>
                      <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>2FA, login history, active sessions</div>
                    </div>
                    <Link href="/dashboard/security" style={{ textDecoration: "none" }}>
                      <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                        background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)",
                        color: "var(--color-primary)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        Manage <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS TAB ── */}
            {tab === "notifications" && (
              <div style={{ border: `1px solid ${border}`, borderTop: "none", background: card2 }}>
                {/* Link to full notifications page */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px",
                  background: card, borderBottom: `1px solid ${border}` }}>
                  <div style={{ fontSize: 12, color: muted }}>Full notification controls available on the Notifications page</div>
                  <Link href="/dashboard/notifications" style={{ textDecoration: "none" }}>
                    <button style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700,
                      color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer" }}>
                      Open <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>

                {[
                  { cat: "email", key: "enabled",  label: "Email notifications",   sub: "Updates and alerts via email"     },
                  { cat: "email", key: "security",  label: "Security alerts",       sub: "Login and API key notifications"  },
                  { cat: "email", key: "billing",   label: "Billing updates",       sub: "Receipts and payment alerts"      },
                  { cat: "push",  key: "enabled",   label: "Push notifications",    sub: "Alerts on your devices"           },
                  { cat: "inApp", key: "enabled",   label: "In-app notifications",  sub: "Alerts inside the dashboard"      },
                  { cat: "inApp", key: "tips",      label: "Tips & hints",          sub: "Usage suggestions and help"       },
                ].map((row, i, arr) => (
                  <div key={`${row.cat}-${row.key}`}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                      padding: "14px 20px", background: card,
                      borderBottom: i < arr.length - 1 ? `1px solid ${border}` : "none" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{row.label}</div>
                      <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{row.sub}</div>
                    </div>
                    <Toggle on={(notifications[row.cat as keyof typeof notifications] as any)[row.key]}
                      onChange={() => toggleNotif(row.cat, row.key)} />
                  </div>
                ))}
              </div>
            )}

            {/* ── APPEARANCE TAB ── */}
            {tab === "appearance" && (
              <div style={{ border: `1px solid ${border}`, borderTop: "none", background: card2 }}>
                <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted }}>Theme</div>

                  {/* Theme tiles */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: border }}>
                    {[
                      { mode: "dark",  label: "Dark",  icon: Moon,   preview: "#0D0D0F" },
                      { mode: "light", label: "Light", icon: Sun,    preview: "#f8f8f6" },
                    ].map(t => {
                      const active = isDark ? t.mode === "dark" : t.mode === "light"
                      return (
                        <button key={t.mode} onClick={() => setMode(t.mode as any)}
                          style={{ background: card, padding: "18px 20px", border: "none",
                            cursor: "pointer", textAlign: "left",
                            outline: active ? "2px solid var(--color-primary)" : "none",
                            outlineOffset: -2,
                          }}>
                          <div style={{ width: "100%", height: 56, borderRadius: 6, marginBottom: 12,
                            background: t.preview, border: `1px solid ${border}`,
                            display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 28, height: 18, borderRadius: 3,
                              background: t.mode === "dark" ? "#1A1B1F" : "#ffffff",
                              border: `1px solid ${t.mode === "dark" ? "#202126" : "#e2e2e0"}` }} />
                          </div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <t.icon className="w-3.5 h-3.5" style={{ color: muted }} />
                              <span style={{ fontSize: 12, fontWeight: 600, color: text }}>{t.label}</span>
                            </div>
                            {active && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-primary)" }} />}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* System option */}
                  <button onClick={() => setMode("system")}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px",
                      background: card, border: `1px solid ${border}`, cursor: "pointer", width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Globe className="w-3.5 h-3.5" style={{ color: muted }} />
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: text }}>System default</div>
                        <div style={{ fontSize: 11, color: muted }}>Follow OS dark/light preference</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" style={{ color: muted }} />
                  </button>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                    <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: subtle }} />
                    <span style={{ fontSize: 11, color: subtle, lineHeight: 1.6 }}>
                      Theme changes take effect immediately across all dashboard pages.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}