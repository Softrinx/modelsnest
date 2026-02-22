"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/themeContext"
import { useSidebar } from "@/components/dashboard-layout-controller"
import { createClient } from "@/lib/supabase/client"
import { getAuthUsersByEmails, getAuthUsersByIds } from "@/app/actions/team"
import {
  Users, UserPlus, Mail, Crown, Shield, Eye, ArrowLeft,
  Copy, Check, Trash2, Search, X, Clock, Zap, Key, Lock,
  Send, AlertTriangle, ChevronDown, MoreVertical, RefreshCw,
  Plus, Globe, Building2, ChevronRight, Hash, Sparkles,
  NewspaperIcon,
  BadgePlus,
} from "lucide-react"
import type { DashboardUser } from "@/types/dashboard-user"
import type { SupabaseClient } from "@supabase/supabase-js"

interface TeamPageProps { user: DashboardUser }

type Role = "owner" | "admin" | "developer" | "viewer"
type MemberStatus = "active" | "pending" | "suspended"
type View = "list" | "create" | "detail"
type TeamTier = "free" | "pro" | "enterprise"

interface Member {
  id: string; name: string; email: string; role: Role
  status: MemberStatus; joinedAt: string; lastActive: string
  avatarColor: string; apiAccess: boolean
}
interface Invite {
  id: string; email: string; role: Role; sentAt: string; expiresAt: string
}
interface Team {
  id: string; name: string; slug: string; description: string
  plan: TeamTier; role: Role
  memberCount: number; avatarColor: string; createdAt: string
  members: Member[]; invites: Invite[]
}

interface PendingInvite {
  id: string
  teamId: string
  teamName: string
  teamSlug: string
  tier: TeamTier
  role: Role
  sentAt: string
  expiresAt: string
}

const ROLE_CFG: Record<Role, { label: string; color: string; bg: string; icon: any; perms: string[] }> = {
  owner:     { label:"Owner",     color:"#f59e0b", bg:"rgba(245,158,11,0.1)",  icon:Crown,  perms:["Full access","Billing","Delete team","All API keys"] },
  admin:     { label:"Admin",     color:"#6366f1", bg:"rgba(99,102,241,0.1)",  icon:Shield, perms:["Manage members","API keys","Models","Settings"] },
  developer: { label:"Developer", color:"#10b981", bg:"rgba(16,185,129,0.1)",  icon:Zap,    perms:["API keys (read)","Models","Usage stats"] },
  viewer:    { label:"Viewer",    color:"#71717a", bg:"rgba(113,113,122,0.1)", icon:Eye,    perms:["Usage stats (read-only)","Model list"] },
}

const PLAN_CFG = {
  free:       { label: "Free",       color: "#71717a", bg: "rgba(113,113,122,0.1)" },
  pro:        { label: "Pro",        color: "#6366f1", bg: "rgba(99,102,241,0.1)"  },
  enterprise: { label: "Enterprise", color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
}

const AVATAR_COLORS = ["#6366f1", "#10b981", "#ec4899", "#f59e0b", "#06b6d4", "#8b5cf6"]

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

const formatMonthYear = (value?: string) => {
  if (!value) return "Unknown"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Unknown"
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

const formatShortDate = (value?: string) => {
  if (!value) return "Unknown"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Unknown"
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const formatExpiry = (value?: string) => {
  if (!value) return "Unknown"
  const expiresAt = new Date(value)
  if (Number.isNaN(expiresAt.getTime())) return "Unknown"
  const diffMs = expiresAt.getTime() - Date.now()
  if (diffMs <= 0) return "Expired"
  const days = Math.ceil(diffMs / 86400000)
  return days === 1 ? "1 day" : `${days} days`
}

const getAvatarColor = (seed: string) => {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

// ─── Shared primitives ────────────────────────────────────────────────────────
function Avatar({ name, color, size = 40 }: { name: string; color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, flexShrink: 0, borderRadius: "50%",
      background: `color-mix(in srgb,${color} 18%,transparent)`,
      border: `1.5px solid color-mix(in srgb,${color} 35%,transparent)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 900, color, letterSpacing: "-0.02em",
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

function RoleBadge({ role, small }: { role: Role; small?: boolean }) {
  const c = ROLE_CFG[role]
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: small ? "2px 7px" : "4px 10px",
      background: c.bg, color: c.color, borderRadius: 4,
      fontSize: small ? 10 : 11, fontWeight: 700, letterSpacing: "0.04em",
      border: `1px solid color-mix(in srgb,${c.color} 22%,transparent)`,
    }}>
      <c.icon size={small ? 9 : 10} />
      {c.label}
    </span>
  )
}

// ─── Role dropdown ────────────────────────────────────────────────────────────
function RoleSelect({ current, onChange, disabled, surface, border, isDark, muted }: {
  current: Role; onChange: (r: Role) => void; disabled?: boolean
  surface: string; border: string; isDark: boolean; muted: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => !disabled && setOpen(o => !o)} disabled={disabled}
        style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 8px 4px 6px",
          background: "transparent", border: `1px solid ${border}`, borderRadius: 6,
          cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}>
        <RoleBadge role={current} small />
        {!disabled && <ChevronDown size={10} style={{ color: muted }} />}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div style={{ position: "fixed", inset: 0, zIndex: 100 }} onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.13 }}
              style={{ position: "absolute", top: "calc(100% + 5px)", left: 0, zIndex: 101,
                background: surface, border: `1px solid ${border}`, borderRadius: 10,
                boxShadow: isDark ? "0 16px 48px rgba(0,0,0,0.75)" : "0 16px 48px rgba(0,0,0,0.14)",
                minWidth: 205, overflow: "hidden" }}>
              {(["admin", "developer", "viewer"] as Role[]).map(r => {
                const rc = ROLE_CFG[r]; const isActive = current === r
                return (
                  <button key={r} onClick={() => { onChange(r); setOpen(false) }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
                      background: isActive ? rc.bg : "transparent", border: "none", cursor: "pointer", textAlign: "left",
                      borderLeft: `2px solid ${isActive ? rc.color : "transparent"}`, transition: "background 0.1s" }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}>
                    <div style={{ width: 28, height: 28, flexShrink: 0, borderRadius: 6, background: rc.bg,
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <rc.icon size={13} style={{ color: rc.color }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: rc.color }}>{rc.label}</div>
                      <div style={{ fontSize: 11, color: muted }}>{rc.perms[0]}</div>
                    </div>
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Invite modal ─────────────────────────────────────────────────────────────
function InviteModal({ onClose, onAdd, surface, border, text, muted, isDark }: {
  onClose: () => void; onAdd?: (email: string, role: Role) => void
  surface: string; border: string; text: string; muted: string; isDark: boolean
}) {
  const [email, setEmail]     = useState("")
  const [role, setRole]       = useState<Role>("developer")
  const [message, setMessage] = useState("")
  const [sent, setSent]       = useState(false)

  const handleSend = () => {
    if (!email.trim()) return
    onAdd?.(email, role)
    setSent(true)
    setTimeout(onClose, 1600)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-end",
        justifyContent: "center", background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 300 }}
        style={{ width: "100%", maxWidth: 560, background: surface, borderRadius: "14px 14px 0 0", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }} />
        </div>
        <div style={{ padding: "16px 24px 14px", display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8,
              background: "color-mix(in srgb,var(--color-primary) 14%,transparent)",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserPlus size={16} style={{ color: "var(--color-primary)" }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: text, letterSpacing: "-0.03em" }}>Invite teammate</div>
              <div style={{ fontSize: 12, color: muted }}>They'll see the invite in their dashboard</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: muted, padding: 4 }}>
            <X size={15} />
          </button>
        </div>
        <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, marginBottom: 8 }}>Email address</div>
            <div style={{ display: "flex", border: `1px solid ${border}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ padding: "0 12px", height: 44, display: "flex", alignItems: "center",
                borderRight: `1px solid ${border}`, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}>
                <Mail size={14} style={{ color: muted }} />
              </div>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="colleague@company.com"
                style={{ flex: 1, height: 44, padding: "0 14px", background: "transparent",
                  border: "none", outline: "none", fontSize: 14, color: text, fontFamily: "inherit" }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, marginBottom: 10 }}>Role</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: border, borderRadius: 8, overflow: "hidden" }}>
              {(["admin", "developer", "viewer"] as Role[]).map(r => {
                const c = ROLE_CFG[r]; const active = role === r
                return (
                  <button key={r} onClick={() => setRole(r)}
                    style={{ padding: "13px 10px", background: active ? c.bg : (isDark ? "#0f0f12" : "#f8f8f8"),
                      border: "none", cursor: "pointer", textAlign: "left",
                      borderTop: `2px solid ${active ? c.color : "transparent"}`, transition: "all 0.14s" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: active ? c.color : muted,
                      marginBottom: 3, display: "flex", alignItems: "center", gap: 5 }}>
                      <c.icon size={11} /> {c.label}
                    </div>
                    <div style={{ fontSize: 10, color: muted, lineHeight: 1.4 }}>{c.perms[0]}</div>
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, marginBottom: 8 }}>
              Message <span style={{ fontWeight: 400, opacity: 0.6, textTransform: "none" }}>(optional)</span>
            </div>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
              placeholder="Hey! Join our team to access shared API keys..."
              style={{ width: "100%", padding: "10px 14px", background: "transparent",
                border: `1px solid ${border}`, borderRadius: 8, outline: "none", resize: "none",
                fontSize: 13, color: text, fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box" }} />
          </div>
          <motion.button onClick={handleSend} whileTap={{ scale: 0.97 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "13px 20px",
              background: sent ? "#10b981" : "var(--color-primary)", borderRadius: 8,
              border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}>
            {sent ? <><Check size={14} /> Invite sent!</> : <><Send size={14} /> Send invite</>}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Member Card ──────────────────────────────────────────────────────────────
function MemberCard({ member, onRoleChange, onRemove, onToggleAccess, onToggleSuspend, canManage, isDark, card, border, text, muted, subtle }: {
  member: Member; onRoleChange: (id: string, r: Role) => void
  onRemove: (id: string) => void; onToggleAccess: (id: string) => void
  onToggleSuspend: (id: string) => void; canManage: boolean
  isDark: boolean; card: string; border: string; text: string; muted: string; subtle: string
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isOwner = member.role === "owner"
  const isSusp  = member.status === "suspended"

  return (
    <div style={{ background: isSusp ? (isDark ? "rgba(239,68,68,0.04)" : "rgba(239,68,68,0.02)") : card,
      border: `1px solid ${border}`, borderRadius: 10 }}>
      <div style={{ padding: "14px 16px 12px", display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <Avatar name={member.name} color={member.avatarColor} size={42} />
          {member.status === "active" && (
            <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10,
              borderRadius: "50%", background: "#10b981", border: `2px solid ${card}` }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: text, letterSpacing: "-0.02em",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.name}</div>
            {isOwner && <Crown size={12} style={{ color: "#f59e0b", flexShrink: 0 }} />}
          </div>
          <div style={{ fontSize: 12, color: muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.email}</div>
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <RoleSelect current={member.role} onChange={r => onRoleChange(member.id, r)}
              disabled={isOwner || !canManage} surface={card} border={border} isDark={isDark} muted={muted} />
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", letterSpacing: "0.05em", borderRadius: 4,
              background: isSusp ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
              color: isSusp ? "#ef4444" : "#10b981",
              border: `1px solid ${isSusp ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}` }}>
              {isSusp ? "Suspended" : "Active"}
            </span>
          </div>
        </div>
        {!isOwner && canManage && (
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button onClick={() => setMenuOpen(o => !o)}
              style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                background: "transparent", border: `1px solid ${border}`, borderRadius: 6, cursor: "pointer", color: muted }}>
              <MoreVertical size={13} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <>
                  <div style={{ position: "fixed", inset: 0, zIndex: 100 }} onClick={() => setMenuOpen(false)} />
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.12 }}
                    style={{ position: "absolute", right: 0, top: "calc(100% + 5px)", zIndex: 101,
                      background: card, border: `1px solid ${border}`, borderRadius: 10,
                      boxShadow: isDark ? "0 16px 48px rgba(0,0,0,0.75)" : "0 12px 36px rgba(0,0,0,0.14)",
                      minWidth: 190, overflow: "hidden" }}>
                    {[
                      { label: isSusp ? "Unsuspend" : "Suspend", icon: AlertTriangle, color: "#f59e0b", action: () => { onToggleSuspend(member.id); setMenuOpen(false) } },
                      { label: member.apiAccess ? "Revoke API access" : "Grant API access", icon: Key, color: "#06b6d4", action: () => { onToggleAccess(member.id); setMenuOpen(false) } },
                      { label: "Remove member", icon: Trash2, color: "#ef4444", action: () => { onRemove(member.id) } },
                    ].map(opt => (
                      <button key={opt.label} onClick={opt.action}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "10px 14px",
                          background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
                          fontSize: 12, fontWeight: 600, color: opt.color, transition: "background 0.1s" }}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <opt.icon size={13} /> {opt.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      <div style={{ padding: "10px 16px 13px", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderTop: `1px solid ${border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => !isOwner && canManage && onToggleAccess(member.id)} disabled={isOwner || !canManage}
            style={{ width: 38, height: 20, border: "none", cursor: isOwner ? "not-allowed" : "pointer",
              background: member.apiAccess ? "#10b981" : (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"),
              position: "relative", transition: "background 0.2s", flexShrink: 0, opacity: isOwner || !canManage ? 0.5 : 1, borderRadius: 10 }}>
            <motion.div animate={{ x: member.apiAccess ? 19 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 35 }}
              style={{ position: "absolute", top: 2, width: 16, height: 16, background: "#fff",
                borderRadius: "50%", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {member.apiAccess ? <Key size={11} style={{ color: "#10b981" }} /> : <Lock size={11} style={{ color: muted }} />}
            <span style={{ fontSize: 12, fontWeight: 600, color: member.apiAccess ? "#10b981" : muted }}>
              API {member.apiAccess ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: member.status === "active" ? "#10b981" : subtle }} />
          <span style={{ fontSize: 11, color: subtle }}>{member.lastActive}</span>
        </div>
      </div>
    </div>
  )
}

// ─── VIEW 1: Teams List ───────────────────────────────────────────────────────
function TeamsListView({ teams, pendingInvites, onSelectTeam, onCreateTeam, onAcceptInvite, loading, error, isDark, card, border, text, muted, subtle, isMobile }: {
  teams: Team[]; pendingInvites: PendingInvite[]
  onSelectTeam: (t: Team) => void; onCreateTeam: () => void; onAcceptInvite: (invite: PendingInvite) => void
  loading: boolean; error: string | null
  isDark: boolean; card: string; border: string; text: string; muted: string; subtle: string; isMobile: boolean
}) {
  const owned  = teams.filter(t => t.role === "owner" || t.role === "admin")
  const member = teams.filter(t => t.role === "developer" || t.role === "viewer")

  const TeamCard = ({ team }: { team: Team }) => {
    const pc = PLAN_CFG[team.plan]
    return (
      <motion.button
        whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }}
        onClick={() => onSelectTeam(team)}
        style={{ width: "100%", textAlign: "left", background: card, border: `1px solid ${border}`, borderRadius: 12,
          padding: "18px 20px", cursor: "pointer", transition: "border-color 0.15s, box-shadow 0.15s",
          display: "flex", alignItems: "center", gap: 16 }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)" }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = "none" }}
      >
        {/* Team avatar */}
        <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: `color-mix(in srgb,${team.avatarColor} 18%,transparent)`,
          border: `1.5px solid color-mix(in srgb,${team.avatarColor} 30%,transparent)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 900, color: team.avatarColor }}>
          {team.name.charAt(0)}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: text, letterSpacing: "-0.02em" }}>{team.name}</div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4,
              background: pc.bg, color: pc.color }}>{pc.label}</span>
            <RoleBadge role={team.role} small />
          </div>
          <div style={{ fontSize: 12, color: muted, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {team.description}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Users size={11} style={{ color: subtle }} />
              <span style={{ fontSize: 11, color: subtle }}>{team.memberCount} members</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Hash size={11} style={{ color: subtle }} />
              <span style={{ fontSize: 11, color: subtle, fontFamily: "monospace" }}>{team.slug}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Clock size={11} style={{ color: subtle }} />
              <span style={{ fontSize: 11, color: subtle }}>Since {team.createdAt}</span>
            </div>
          </div>
        </div>

        <ChevronRight size={16} style={{ color: subtle, flexShrink: 0 }} />
      </motion.button>
    )
  }

  if (loading) {
    return (
      <div style={{ padding: "36px 0", textAlign: "center", color: muted, fontSize: 13 }}>
        Loading teams…
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: "36px 0", textAlign: "center", color: "#ef4444", fontSize: 13 }}>
        {error}
      </div>
    )
  }

  // Empty state
  if (teams.length === 0 && pendingInvites.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: "60vh", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, marginBottom: 24,
          background: "color-mix(in srgb,var(--color-primary) 12%,transparent)",
          border: "1.5px solid color-mix(in srgb,var(--color-primary) 22%,transparent)",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Users size={32} style={{ color: "var(--color-primary)" }} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: text, letterSpacing: "-0.04em", marginBottom: 10 }}>
          No teams yet
        </div>
        <div style={{ fontSize: 14, color: muted, lineHeight: 1.7, maxWidth: 340, marginBottom: 28 }}>
          Create a team to collaborate with others, share API keys, and manage access together.
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onCreateTeam}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px",
            background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: 10,
            fontSize: 14, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 20px color-mix(in srgb,var(--color-primary) 40%,transparent)" }}>
          <Plus size={16} /> Create your first team
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
      style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {pendingInvites.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            color: muted, marginBottom: 12 }}>Invites for you</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pendingInvites.map((invite) => {
              const pc = PLAN_CFG[invite.tier]
              return (
                <div key={invite.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "16px 18px",
                  display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: `color-mix(in srgb,${pc.color} 18%,transparent)`,
                    border: `1.5px solid color-mix(in srgb,${pc.color} 30%,transparent)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, fontWeight: 900, color: pc.color }}>
                    {invite.teamName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: text }}>{invite.teamName}</div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4,
                        background: pc.bg, color: pc.color }}>{pc.label}</span>
                      <RoleBadge role={invite.role} small />
                    </div>
                    <div style={{ fontSize: 12, color: muted, marginTop: 6 }}>
                      Invite expires in {invite.expiresAt}
                    </div>
                  </div>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={() => onAcceptInvite(invite)}
                    style={{ padding: "9px 14px", background: "var(--color-primary)", color: "#fff",
                      border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    Accept invite
                  </motion.button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Teams you manage */}
      {owned.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            color: muted, marginBottom: 12 }}>Your teams</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {owned.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <TeamCard team={t} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Teams you're a member of */}
      {member.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            color: muted, marginBottom: 12 }}>Member of</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {member.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <TeamCard team={t} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Create another */}
      <motion.button whileTap={{ scale: 0.98 }} onClick={onCreateTeam}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px",
          background: "transparent", border: `1.5px dashed ${border}`, borderRadius: 12, width: "100%",
          color: muted, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.color = "var(--color-primary)" }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted }}>
        <Plus size={15} /> Create another team
      </motion.button>
    </motion.div>
  )
}

// ─── VIEW 2: Create Team ──────────────────────────────────────────────────────
function CreateTeamView({ onBack, onCreate, isDark, card, border, text, muted, subtle, isMobile }: {
  onBack: () => void
  onCreate: (payload: { name: string; description: string; plan: TeamTier; invites: { email: string; role: Role }[] }) => Promise<{ success: boolean; error?: string }>
  isDark: boolean; card: string; border: string; text: string; muted: string; subtle: string; isMobile: boolean
}) {
  const [step, setStep]         = useState<1 | 2>(1)
  const [name, setName]         = useState("")
  const [description, setDesc]  = useState("")
  const [plan, setPlan]         = useState<"free" | "pro" | "enterprise">("free")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole]   = useState<Role>("developer")
  const [pendingInvites, setPendingInvites] = useState<{ email: string; role: Role }[]>([])
  const [creating, setCreating] = useState(false)
  const [done, setDone]         = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const slug = slugify(name)

  const addInvite = () => {
    const trimmed = inviteEmail.trim().toLowerCase()
    if (!trimmed || pendingInvites.find(i => i.email === trimmed)) return
    setPendingInvites(p => [...p, { email: trimmed, role: inviteRole }])
    setInviteEmail("")
  }

  const handleCreate = async () => {
    setCreating(true)
    setError(null)
    const result = await onCreate({
      name,
      description,
      plan,
      invites: pendingInvites,
    })
    if (result.success) {
      setDone(true)
    } else {
      setError(result.error ?? "Failed to create team")
    }
    setCreating(false)
  }

  const PLANS = [
    { id: "free",       label: "Free",       desc: "Up to 3 members",        color: "#71717a", icon: Globe },
    { id: "pro",        label: "Pro",         desc: "Up to 20 members",       color: "#6366f1", icon: Building2 },
    { id: "enterprise", label: "Enterprise",  desc: "Unlimited + SSO",        color: "#f59e0b", icon: NewspaperIcon },
  ] as const

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: "50vh", textAlign: "center", gap: 16 }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}
          style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(16,185,129,0.15)",
            border: "2px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={32} style={{ color: "#10b981" }} />
        </motion.div>
        <div style={{ fontSize: 22, fontWeight: 900, color: text, letterSpacing: "-0.04em" }}>Team created!</div>
        <div style={{ fontSize: 14, color: muted }}>Setting up your workspace…</div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
      style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
        borderRadius: 10, padding: 4 }}>
        {[{ n: 1, label: "Team details" }, { n: 2, label: "Invite members" }].map((s, i) => (
          <div key={s.n} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px", borderRadius: 7,
            background: step === s.n ? card : "transparent",
            boxShadow: step === s.n ? (isDark ? "0 2px 8px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.08)") : "none",
            transition: "all 0.2s" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: step > s.n ? "#10b981" : step === s.n ? "var(--color-primary)" : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"),
              fontSize: 11, fontWeight: 800, color: step >= s.n ? "#fff" : muted }}>
              {step > s.n ? <Check size={12} /> : s.n}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: step === s.n ? text : muted }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Team details */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Name */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, marginBottom: 8 }}>Team name</div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Acme AI"
              style={{ width: "100%", height: 46, padding: "0 14px", background: card,
                border: `1px solid ${border}`, borderRadius: 8, outline: "none",
                fontSize: 15, fontWeight: 600, color: text, fontFamily: "inherit", boxSizing: "border-box",
                transition: "border-color 0.15s" }}
              onFocus={e => e.target.style.borderColor = "var(--color-primary)"}
              onBlur={e => e.target.style.borderColor = border} />
            {slug && (
              <div style={{ fontSize: 11, color: muted, marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
                <Hash size={10} style={{ color: subtle }} />
                <span style={{ fontFamily: "monospace" }}>modelsnest.com/team/{slug}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, marginBottom: 8 }}>
              Description <span style={{ fontWeight: 400, opacity: 0.6, textTransform: "none" }}>(optional)</span>
            </div>
            <textarea value={description} onChange={e => setDesc(e.target.value)} rows={3}
              placeholder="What does this team work on?"
              style={{ width: "100%", padding: "12px 14px", background: card,
                border: `1px solid ${border}`, borderRadius: 8, outline: "none", resize: "none",
                fontSize: 13, color: text, fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box",
                transition: "border-color 0.15s" }}
              onFocus={e => e.target.style.borderColor = "var(--color-primary)"}
              onBlur={e => e.target.style.borderColor = border} />
          </div>

          {/* Plan */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, marginBottom: 10 }}>Plan</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {PLANS.map(p => {
                const active = plan === p.id
                return (
                  <button key={p.id} onClick={() => setPlan(p.id)}
                    style={{ padding: "14px 12px", background: active ? `color-mix(in srgb,${p.color} 10%,${card})` : card,
                      border: `1.5px solid ${active ? p.color : border}`, borderRadius: 10,
                      cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                    <p.icon size={18} style={{ color: p.color, marginBottom: 8 }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: active ? p.color : text, marginBottom: 3 }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: muted }}>{p.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <button onClick={() => name.trim() && setStep(2)} disabled={!name.trim()}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px",
              background: name.trim() ? "var(--color-primary)" : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"),
              color: name.trim() ? "#fff" : muted, border: "none", borderRadius: 8,
              fontSize: 14, fontWeight: 700, cursor: name.trim() ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
            Continue to invites <ChevronRight size={15} />
          </button>
        </motion.div>
      )}

      {/* Step 2: Invite members */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <div style={{ padding: "14px 16px", background: card, border: `1px solid ${border}`, borderRadius: 10,
            display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: "color-mix(in srgb,var(--color-primary) 14%,transparent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 900, color: "var(--color-primary)" }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: text }}>{name}</div>
              <div style={{ fontSize: 12, color: muted }}>{PLAN_CFG[plan].label} plan · {pendingInvites.length} pending invite{pendingInvites.length !== 1 ? "s" : ""}</div>
            </div>
          </div>

          {/* Add invite row */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, marginBottom: 8 }}>Invite by email</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200, display: "flex", border: `1px solid ${border}`, borderRadius: 8, overflow: "hidden" }}>
                <div style={{ padding: "0 12px", height: 42, display: "flex", alignItems: "center",
                  borderRight: `1px solid ${border}`, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}>
                  <Mail size={13} style={{ color: muted }} />
                </div>
                <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addInvite()}
                  placeholder="colleague@company.com"
                  style={{ flex: 1, height: 42, padding: "0 12px", background: "transparent",
                    border: "none", outline: "none", fontSize: 13, color: text, fontFamily: "inherit" }} />
              </div>
              <select value={inviteRole} onChange={e => setInviteRole(e.target.value as Role)}
                style={{ height: 42, padding: "0 12px", background: card, border: `1px solid ${border}`,
                  borderRadius: 8, color: text, fontSize: 13, fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
                <option value="admin">Admin</option>
                <option value="developer">Developer</option>
                <option value="viewer">Viewer</option>
              </select>
              <button onClick={addInvite} disabled={!inviteEmail.trim()}
                style={{ height: 42, padding: "0 16px", background: inviteEmail.trim() ? "var(--color-primary)" : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"),
                  color: inviteEmail.trim() ? "#fff" : muted, border: "none", borderRadius: 8,
                  fontSize: 13, fontWeight: 700, cursor: inviteEmail.trim() ? "pointer" : "not-allowed", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Pending invites list */}
          {pendingInvites.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {pendingInvites.map((inv, i) => {
                const rc = ROLE_CFG[inv.role]
                return (
                  <motion.div key={inv.email} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                      background: card, border: `1px solid ${border}`, borderRadius: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: rc.bg, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Mail size={13} style={{ color: rc.color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inv.email}</div>
                    </div>
                    <RoleBadge role={inv.role} small />
                    <button onClick={() => setPendingInvites(p => p.filter(x => x.email !== inv.email))}
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: muted, padding: 4, flexShrink: 0,
                        display: "flex", alignItems: "center" }}>
                      <X size={14} />
                    </button>
                  </motion.div>
                )
              })}
            </div>
          )}

          {pendingInvites.length === 0 && (
            <div style={{ padding: "20px", textAlign: "center", border: `1px dashed ${border}`, borderRadius: 8 }}>
              <div style={{ fontSize: 13, color: muted }}>Add teammates above, or skip and invite later</div>
            </div>
          )}

          {error && (
            <div style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.08)", color: "#ef4444", fontSize: 12, fontWeight: 600 }}>
              {error}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setStep(1)}
              style={{ flex: 1, padding: "12px", background: "transparent", border: `1px solid ${border}`,
                borderRadius: 8, color: muted, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Back
            </button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleCreate}
              disabled={creating}
              style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px",
                background: creating ? "#10b981" : "var(--color-primary)",
                border: "none", color: "#fff", borderRadius: 8,
                fontSize: 14, fontWeight: 700, cursor: creating ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
              {creating ? <><Check size={15} /> Creating…</> : <><BadgePlus size={15} /> Create team{pendingInvites.length > 0 ? ` & send ${pendingInvites.length} invite${pendingInvites.length !== 1 ? "s" : ""}` : ""}</>}
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── VIEW 3: Team Detail ──────────────────────────────────────────────────────
function TeamDetailView({ team, onBack, supabase, user, canManage, onRefreshTeams, isDark, card, border, text, muted, subtle, isMobile }: {
  team: Team; onBack: () => void; supabase: SupabaseClient; user: DashboardUser
  canManage: boolean; onRefreshTeams: () => Promise<void>
  isDark: boolean; card: string; border: string; text: string; muted: string; subtle: string; isMobile: boolean
}) {
  const [members, setMembers]       = useState<Member[]>([])
  const [invites, setInvites]       = useState<Invite[]>([])
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [memberError, setMemberError] = useState<string | null>(null)
  const [search, setSearch]         = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")
  const [tab, setTab]               = useState<"members" | "invites" | "permissions">("members")
  const [showInvite, setShowInvite] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
    const matchRole   = roleFilter === "all" || m.role === roleFilter
    return matchSearch && matchRole
  })

  const loadMembers = async () => {
    setLoadingMembers(true)
    setMemberError(null)
    const { data: rows, error } = await supabase
      .from("team_members")
      .select("user_id, role, status, api_access, created_at, invite_expiry")
      .eq("team_id", team.id)

    if (error) {
      setMemberError(error.message)
      setLoadingMembers(false)
      return
    }

    const memberRows = rows ?? []
    const userIds = Array.from(new Set(memberRows.map((row) => row.user_id)))
    const [{ data: profiles }, authUsers] = await Promise.all([
      userIds.length
        ? supabase.from("profiles").select("id, name").in("id", userIds)
        : Promise.resolve({ data: [] }),
      getAuthUsersByIds(userIds),
    ])

    const nameById = new Map((profiles ?? []).map((profile) => [profile.id, profile.name]))
    const authById = new Map(authUsers.map((user) => [user.id, user]))

    const mappedMembers: Member[] = memberRows
      .filter((row) => row.status !== "pending")
      .map((row) => {
        const authUser = authById.get(row.user_id)
        const name =
          nameById.get(row.user_id) ||
          authUser?.name ||
          (row.user_id === user.id ? (user.name || "You") : "Team member")
        const email = authUser?.email || (row.user_id === user.id ? user.email : "Unknown email")
        return {
          id: row.user_id,
          name,
          email,
          role: (row.role ?? "viewer") as Role,
          status: (row.status ?? "active") as MemberStatus,
          joinedAt: formatShortDate(row.created_at),
          lastActive: row.status === "suspended" ? "Suspended" : "Active",
          avatarColor: getAvatarColor(row.user_id),
          apiAccess: Boolean(row.api_access),
        }
      })

    const mappedInvites: Invite[] = memberRows
      .filter((row) => row.status === "pending")
      .map((row) => {
        const authUser = authById.get(row.user_id)
        const name = nameById.get(row.user_id) || authUser?.email || authUser?.name || "Pending member"
        return {
          id: `${team.id}-${row.user_id}`,
          email: name,
          role: (row.role ?? "viewer") as Role,
          sentAt: formatShortDate(row.created_at),
          expiresAt: formatExpiry(row.invite_expiry),
        }
      })

    setMembers(mappedMembers)
    setInvites(mappedInvites)
    setLoadingMembers(false)
  }

  useEffect(() => {
    loadMembers()
  }, [team.id])

  const handleRoleChange = async (id: string, role: Role) => {
    if (!canManage) return
    const { error } = await supabase
      .from("team_members")
      .update({ role })
      .eq("team_id", team.id)
      .eq("user_id", id)
    if (!error) {
      setMembers(ms => ms.map(m => m.id === id ? { ...m, role } : m))
      await onRefreshTeams()
    }
  }
  const handleRemove = async (id: string) => {
    if (!canManage) return
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", team.id)
      .eq("user_id", id)
    if (!error) {
      setMembers(ms => ms.filter(m => m.id !== id))
      await onRefreshTeams()
    }
  }
  const handleToggleAccess = async (id: string) => {
    if (!canManage) return
    const target = members.find(m => m.id === id)
    if (!target) return
    const { error } = await supabase
      .from("team_members")
      .update({ api_access: !target.apiAccess })
      .eq("team_id", team.id)
      .eq("user_id", id)
    if (!error) {
      setMembers(ms => ms.map(m => m.id === id ? { ...m, apiAccess: !m.apiAccess } : m))
      await onRefreshTeams()
    }
  }
  const handleToggleSuspend = async (id: string) => {
    if (!canManage) return
    const target = members.find(m => m.id === id)
    if (!target) return
    const nextStatus: MemberStatus = target.status === "suspended" ? "active" : "suspended"
    const { error } = await supabase
      .from("team_members")
      .update({ status: nextStatus })
      .eq("team_id", team.id)
      .eq("user_id", id)
    if (!error) {
      setMembers(ms => ms.map(m => m.id === id ? { ...m, status: nextStatus } : m))
      await onRefreshTeams()
    }
  }
  const revokeInvite = async (id: string) => {
    if (!canManage) return
    const userId = id.split("-").slice(1).join("-")
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", team.id)
      .eq("user_id", userId)
    if (!error) {
      setInvites(is => is.filter(i => i.id !== id))
      await onRefreshTeams()
    }
  }
  const addInvite = async (email: string, role: Role) => {
    if (!canManage) return
    const normalized = email.trim().toLowerCase()
    if (!normalized) {
      setMemberError("Enter a valid email address.")
      return
    }
    const resolved = await getAuthUsersByEmails([normalized])
    const userId = resolved[0]?.id
    if (!userId) {
      setMemberError("No matching user for that email address.")
      return
    }
    const { error } = await supabase
      .from("team_members")
      .insert({ team_id: team.id, user_id: userId, role, status: "pending" })
    if (!error) {
      setMemberError(null)
      await loadMembers()
      await onRefreshTeams()
    }
  }
  const copyInviteLink = () => {
    if (!canManage) return
    navigator.clipboard.writeText(`https://modelsnest.com/invite/${team.slug}`)
    setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000)
  }

  const pc = PLAN_CFG[team.plan]
  const TABS = [
    { id: "members",     label: "Members",    count: members.length },
    { id: "invites",     label: "Pending",    count: invites.length },
    { id: "permissions", label: "Permissions", count: null },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}
      style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Team header card */}
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0,
            background: `color-mix(in srgb,${team.avatarColor} 18%,transparent)`,
            border: `1.5px solid color-mix(in srgb,${team.avatarColor} 30%,transparent)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 900, color: team.avatarColor }}>
            {team.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: text, letterSpacing: "-0.03em" }}>{team.name}</div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: pc.bg, color: pc.color }}>{pc.label}</span>
              <RoleBadge role={team.role} small />
            </div>
            <div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>{team.description}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Hash size={10} style={{ color: subtle }} />
              <span style={{ fontSize: 11, color: subtle, fontFamily: "monospace" }}>{team.slug}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button onClick={copyInviteLink} disabled={!canManage}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px",
                fontSize: 12, fontWeight: 600, background: "transparent",
                border: `1px solid ${border}`, borderRadius: 8, color: muted,
                cursor: canManage ? "pointer" : "not-allowed", opacity: canManage ? 1 : 0.6, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = text; e.currentTarget.style.borderColor = "var(--color-primary)" }}
              onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.borderColor = border }}>
              {copiedLink ? <Check size={12} style={{ color: "#10b981" }} /> : <Copy size={12} />}
              {copiedLink ? "Copied!" : "Copy link"}
            </button>
            <button onClick={() => canManage && setShowInvite(true)} disabled={!canManage}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
                fontSize: 13, fontWeight: 700, background: "var(--color-primary)", color: "#fff",
                border: "none", borderRadius: 8, cursor: canManage ? "pointer" : "not-allowed",
                opacity: canManage ? 1 : 0.6,
                boxShadow: "0 4px 14px color-mix(in srgb,var(--color-primary) 40%,transparent)" }}>
              <UserPlus size={13} /> {isMobile ? "Invite" : "Invite member"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {[
          { n: members.filter(m => m.status === "active").length, l: "Active",     icon: Users, color: "#10b981" },
          { n: invites.length,                                      l: "Pending",    icon: Clock, color: "#f59e0b" },
          { n: members.filter(m => m.apiAccess).length,            l: "API Access", icon: Key,   color: "#6366f1" },
        ].map(s => (
          <div key={s.l} style={{ padding: "14px 16px", background: card, borderRadius: 10,
            border: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 8,
              background: `color-mix(in srgb,${s.color} 12%,transparent)`,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <s.icon size={14} style={{ color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: text, letterSpacing: "-0.04em", lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${border}`, overflowX: "auto" }}>
        {TABS.map(t => {
          const active = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              style={{ padding: "0 18px", height: 42, border: "none", cursor: "pointer", flexShrink: 0,
                background: "transparent", fontSize: 13, fontWeight: 600,
                color: active ? text : muted,
                borderBottom: `2px solid ${active ? "var(--color-primary)" : "transparent"}`,
                transition: "all 0.15s", display: "flex", alignItems: "center", gap: 7 }}>
              {t.label}
              {t.count !== null && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4,
                  background: active ? "color-mix(in srgb,var(--color-primary) 14%,transparent)" : (isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"),
                  color: active ? "var(--color-primary)" : muted }}>{t.count}</span>
              )}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>

          {/* Members */}
          {tab === "members" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", border: `1px solid ${border}`, background: card, borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ padding: "0 12px", height: 42, display: "flex", alignItems: "center",
                    borderRight: `1px solid ${border}`, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }}>
                    <Search size={13} style={{ color: muted }} />
                  </div>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members…"
                    style={{ flex: 1, height: 42, padding: "0 12px", background: "transparent",
                      border: "none", outline: "none", fontSize: 13, color: text, fontFamily: "inherit" }} />
                  {search && <button onClick={() => setSearch("")} style={{ padding: "0 12px", background: "transparent", border: "none", cursor: "pointer", color: muted }}><X size={13} /></button>}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(["all", "owner", "admin", "developer", "viewer"] as const).map(r => {
                    const active = roleFilter === r
                    const color  = r !== "all" ? ROLE_CFG[r].color : "var(--color-primary)"
                    const bgCol  = r !== "all" ? ROLE_CFG[r].bg : "color-mix(in srgb,var(--color-primary) 12%,transparent)"
                    return (
                      <button key={r} onClick={() => setRoleFilter(r)}
                        style={{ padding: "4px 12px", border: `1px solid ${active ? color : border}`, borderRadius: 6,
                          cursor: "pointer", background: active ? bgCol : "transparent",
                          color: active ? color : muted, fontSize: 12, fontWeight: 600, transition: "all 0.14s" }}>
                        {r === "all" ? "All" : ROLE_CFG[r].label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {loadingMembers ? (
                <div style={{ textAlign: "center", padding: "48px 0", background: card, border: `1px solid ${border}`, borderRadius: 10 }}>
                  <div style={{ fontSize: 13, color: muted }}>Loading team members…</div>
                </div>
              ) : memberError ? (
                <div style={{ textAlign: "center", padding: "48px 0", background: card, border: `1px solid ${border}`, borderRadius: 10 }}>
                  <div style={{ fontSize: 13, color: "#ef4444" }}>{memberError}</div>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", background: card, border: `1px solid ${border}`, borderRadius: 10 }}>
                  <Users size={26} style={{ color: subtle, margin: "0 auto 10px", display: "block" }} />
                  <p style={{ fontSize: 13, color: muted }}>No members match your search</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filtered.map((m, i) => (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <MemberCard member={m} onRoleChange={handleRoleChange} onRemove={handleRemove}
                        onToggleAccess={handleToggleAccess} onToggleSuspend={handleToggleSuspend} canManage={canManage}
                        isDark={isDark} card={card} border={border} text={text} muted={muted} subtle={subtle} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Invites */}
          {tab === "invites" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ padding: "12px 16px", background: card, border: `1px solid ${border}`, borderRadius: 8,
                display: "flex", alignItems: "center", gap: 10 }}>
                <Clock size={13} style={{ color: "#f59e0b", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: muted, flex: 1 }}>Invites expire after 7 days.</span>
                <button onClick={() => canManage && setShowInvite(true)} disabled={!canManage}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
                    background: "var(--color-primary)", border: "none", color: "#fff", fontSize: 12, fontWeight: 700,
                    cursor: canManage ? "pointer" : "not-allowed", borderRadius: 6, flexShrink: 0, opacity: canManage ? 1 : 0.6 }}>
                  <UserPlus size={12} /> New invite
                </button>
              </div>
              {invites.length === 0 ? (
                <div style={{ textAlign: "center", padding: "56px 0", background: card, border: `1px solid ${border}`, borderRadius: 10 }}>
                  <Mail size={28} style={{ color: subtle, margin: "0 auto 12px", display: "block" }} />
                  <p style={{ fontSize: 15, fontWeight: 700, color: text, marginBottom: 4 }}>No pending invites</p>
                  <p style={{ fontSize: 13, color: muted }}>Invite teammates to collaborate</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {invites.map((inv, i) => {
                    const rc = ROLE_CFG[inv.role]
                    return (
                      <motion.div key={inv.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        style={{ background: card, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <div style={{ width: 38, height: 38, background: rc.bg, borderRadius: 8, flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Mail size={15} style={{ color: rc.color }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: text, overflow: "hidden",
                              textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 5 }}>{inv.email}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <RoleBadge role={inv.role} small />
                              <span style={{ fontSize: 11, color: muted }}>Sent {inv.sentAt}</span>
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <Clock size={10} style={{ color: "#f59e0b" }} />
                                <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600 }}>Expires in {inv.expiresAt}</span>
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                            <button title="Resend" disabled={!canManage}
                              style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                                background: "transparent", border: `1px solid ${border}`, borderRadius: 6,
                                cursor: canManage ? "pointer" : "not-allowed", color: muted, opacity: canManage ? 1 : 0.6, transition: "color 0.15s" }}
                              onMouseEnter={e => { if (canManage) e.currentTarget.style.color = "var(--color-primary)" }}
                              onMouseLeave={e => { e.currentTarget.style.color = muted }}>
                              <RefreshCw size={12} />
                            </button>
                            <button onClick={() => revokeInvite(inv.id)} title="Revoke" disabled={!canManage}
                              style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                                background: "transparent", border: `1px solid ${border}`, borderRadius: 6,
                                cursor: canManage ? "pointer" : "not-allowed", color: muted, opacity: canManage ? 1 : 0.6, transition: "color 0.15s" }}
                              onMouseEnter={e => { if (canManage) e.currentTarget.style.color = "#ef4444" }}
                              onMouseLeave={e => { e.currentTarget.style.color = muted }}>
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
              <button onClick={copyInviteLink} disabled={!canManage}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px",
                  background: "transparent", border: `1px dashed ${border}`, borderRadius: 8,
                  color: muted, fontSize: 13, fontWeight: 600, cursor: canManage ? "pointer" : "not-allowed", opacity: canManage ? 1 : 0.6, transition: "all 0.15s", width: "100%" }}
                onMouseEnter={e => { if (canManage) { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.color = "var(--color-primary)" } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted }}>
                {copiedLink ? <><Check size={13} style={{ color: "#10b981" }} /> Copied!</> : <><Copy size={13} /> Copy invite link</>}
              </button>
            </div>
          )}

          {/* Permissions */}
          {tab === "permissions" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 13, color: muted, lineHeight: 1.7, margin: 0 }}>
                Roles define what members can do. Assign roles from the Members tab.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(["owner", "admin", "developer", "viewer"] as Role[]).map((r, idx) => {
                  const c = ROLE_CFG[r]; const count = members.filter(m => m.role === r).length
                  return (
                    <motion.div key={r} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                      style={{ background: card, border: `1px solid ${border}`, borderRadius: 10, padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, background: c.bg, flexShrink: 0, borderRadius: 8,
                            display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <c.icon size={15} style={{ color: c.color }} />
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: text }}>{c.label}</div>
                            <div style={{ fontSize: 11, color: muted }}>{count} member{count !== 1 ? "s" : ""}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: 11, padding: "2px 8px", background: c.bg, color: c.color, fontWeight: 700, borderRadius: 4 }}>{count}</span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {c.perms.map(p => (
                          <span key={p} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: muted,
                            padding: "4px 10px", borderRadius: 4,
                            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                            {p}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              <div style={{ padding: "14px 16px", background: "rgba(6,182,212,0.07)", borderRadius: 10,
                border: "1px solid rgba(6,182,212,0.18)", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Key size={15} style={{ color: "#06b6d4", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 4 }}>API access is controlled separately</div>
                  <p style={{ fontSize: 12, color: muted, lineHeight: 1.65, margin: 0 }}>
                    Even Admins and Developers need explicit API access enabled via the toggle on each member's card.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showInvite && (
          <InviteModal onClose={() => setShowInvite(false)} onAdd={addInvite}
            surface={card} border={border} text={text} muted={muted} isDark={isDark} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export function TeamPage({ user }: TeamPageProps) {
  const { isDark } = useTheme()
  const { sidebarWidth, isMobile } = useSidebar()
  const supabase = useMemo(() => createClient(), [])

  const bg     = isDark ? "#0D0D0F" : "#f4f4f2"
  const card   = isDark ? "#18181c" : "#ffffff"
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)"
  const text   = isDark ? "#f4f4f5" : "#0a0a0b"
  const muted  = isDark ? "#71717a" : "#71717a"
  const subtle = isDark ? "#52525b" : "#a1a1aa"

  const headerLeft = isMobile ? 0 : sidebarWidth

  const [view, setView]             = useState<View>("list")
  const [teams, setTeams]           = useState<Team[]>([])
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([])
  const [activeTeam, setActiveTeam] = useState<Team | null>(null)
  const [loadingTeams, setLoadingTeams] = useState(true)
  const [teamsError, setTeamsError] = useState<string | null>(null)

  const loadTeams = async () => {
    setLoadingTeams(true)
    setTeamsError(null)

    const { data: memberships, error: membershipError } = await supabase
      .from("team_members")
      .select("team_id, user_id, role, status, created_at, invite_expiry")
      .eq("user_id", user.id)

    if (membershipError) {
      setTeamsError(membershipError.message)
      setLoadingTeams(false)
      return
    }

    const rows = memberships ?? []
    const teamIds = Array.from(new Set(rows.map((row) => row.team_id)))
    const { data: teamRows, error: teamError } = teamIds.length
      ? await supabase
          .from("teams")
          .select("id, name, description, tier, created_at, owner_id")
          .in("id", teamIds)
      : { data: [], error: null }

    if (teamError) {
      setTeamsError(teamError.message)
      setLoadingTeams(false)
      return
    }

    const { data: memberCounts } = teamIds.length
      ? await supabase
          .from("team_members")
          .select("team_id, status")
          .in("team_id", teamIds)
      : { data: [] }

    const countByTeam = new Map<string, number>()
    ;(memberCounts ?? []).forEach((row) => {
      if (row.status === "pending") return
      countByTeam.set(row.team_id, (countByTeam.get(row.team_id) ?? 0) + 1)
    })

    const teamById = new Map((teamRows ?? []).map((row) => [row.id, row]))
    const mappedTeams = rows
      .filter((row) => row.status !== "pending")
      .map((row) => {
        const team = teamById.get(row.team_id)
        if (!team) return null
        return {
          id: team.id,
          name: team.name ?? "Untitled team",
          slug: slugify(team.name ?? "team"),
          description: team.description ?? "",
          plan: (team.tier ?? "free") as TeamTier,
          role: (row.role ?? "viewer") as Role,
          memberCount: countByTeam.get(team.id) ?? 1,
          avatarColor: getAvatarColor(team.id),
          createdAt: formatMonthYear(team.created_at),
          members: [],
          invites: [],
        }
      })
      .filter(Boolean) as Team[]

    const now = Date.now()
    const mappedInvites: PendingInvite[] = rows
      .filter((row) => row.status === "pending")
      .filter((row) => {
        if (!row.invite_expiry) return true
        const expiresAt = new Date(row.invite_expiry)
        return !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() > now
      })
      .map((row) => {
        const team = teamById.get(row.team_id)
        return {
          id: `${row.team_id}-${row.user_id}`,
          teamId: row.team_id,
          teamName: team?.name ?? "Team",
          teamSlug: slugify(team?.name ?? "team"),
          tier: (team?.tier ?? "free") as TeamTier,
          role: (row.role ?? "viewer") as Role,
          sentAt: formatShortDate(row.created_at),
          expiresAt: formatExpiry(row.invite_expiry),
        }
      })

    setTeams(mappedTeams)
    setPendingInvites(mappedInvites)
    setActiveTeam((current) => {
      if (!current) return current
      return mappedTeams.find((team) => team.id === current.id) ?? null
    })
    setLoadingTeams(false)
  }

  useEffect(() => {
    loadTeams()
  }, [user.id])

  const handleSelectTeam = (t: Team) => { setActiveTeam(t); setView("detail") }
  const handleCreateTeam = () => { setActiveTeam(null); setView("create") }

  const handleTeamCreated = async (payload: { name: string; description: string; plan: TeamTier; invites: { email: string; role: Role }[] }) => {
    const { data: teamRow, error: teamError } = await supabase
      .from("teams")
      .insert({
        name: payload.name,
        description: payload.description,
        owner_id: user.id,
        tier: payload.plan,
      })
      .select("id, name, description, tier, created_at, owner_id")
      .single()

    if (teamError || !teamRow) {
      return { success: false, error: teamError?.message ?? "Failed to create team" }
    }

    const { error: memberError } = await supabase
      .from("team_members")
      .insert({ team_id: teamRow.id, user_id: user.id, role: "owner", status: "active", api_access: true })

    if (memberError) {
      return { success: false, error: memberError.message }
    }

    if (payload.invites.length > 0) {
      const normalizedInvites = payload.invites.map((inv) => ({
        email: inv.email.trim().toLowerCase(),
        role: inv.role,
      }))
      const resolved = await getAuthUsersByEmails(normalizedInvites.map((inv) => inv.email))
      const resolvedByEmail = new Map(resolved.map((user) => [user.email, user]))

      const inviteRows = normalizedInvites
        .map((inv) => {
          const match = resolvedByEmail.get(inv.email)
          if (!match?.id) return null
          return {
            team_id: teamRow.id,
            user_id: match.id,
            role: inv.role,
            status: "pending",
          }
        })
        .filter(Boolean) as { team_id: string; user_id: string; role: Role; status: "pending" }[]

      if (inviteRows.length === 0) {
        return { success: false, error: "No matching users found for invite emails." }
      }

      const { error: inviteError } = await supabase
        .from("team_members")
        .insert(inviteRows)
      if (inviteError) {
        return { success: false, error: inviteError.message }
      }
    }

    await loadTeams()
    const newTeam: Team = {
      id: teamRow.id,
      name: teamRow.name ?? payload.name,
      slug: slugify(teamRow.name ?? payload.name),
      description: teamRow.description ?? payload.description,
      plan: (teamRow.tier ?? payload.plan) as TeamTier,
      role: "owner",
      memberCount: 1 + payload.invites.length,
      avatarColor: getAvatarColor(teamRow.id),
      createdAt: formatMonthYear(teamRow.created_at),
      members: [],
      invites: [],
    }
    setActiveTeam(newTeam)
    setView("detail")
    return { success: true }
  }

  const handleAcceptInvite = async (invite: PendingInvite) => {
    const { error } = await supabase
      .from("team_members")
      .update({ status: "active" })
      .eq("team_id", invite.teamId)
      .eq("user_id", user.id)

    if (error) {
      setTeamsError(error.message)
      return
    }
    await loadTeams()
  }

  const headerTitle = view === "list" ? "Teams" : view === "create" ? "Create team" : activeTeam?.name ?? "Team"
  const headerSub   = view === "list"
    ? (loadingTeams ? "Loading…" : `${teams.length} team${teams.length !== 1 ? "s" : ""}`)
    : view === "create" ? "Set up your workspace"
    : `${activeTeam?.memberCount ?? 0} members`

  return (
    <div style={{ minHeight: "100svh", background: bg }}>

      {/* ── FIXED HEADER ── */}
      <div style={{
        position: "fixed", top: 0, left: headerLeft, right: 0, zIndex: 30, height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px",
        borderBottom: `1px solid ${border}`,
        background: isDark ? "rgba(13,13,15,0.94)" : "rgba(255,255,255,0.94)",
        backdropFilter: "blur(14px)",
        transition: "left 0.28s cubic-bezier(0.25,0.25,0,1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {view !== "list" && (
            <button onClick={() => setView("list")}
              style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                background: "transparent", border: `1px solid ${border}`, borderRadius: 8,
                cursor: "pointer", color: muted, flexShrink: 0, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = text; e.currentTarget.style.borderColor = "var(--color-primary)" }}
              onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.borderColor = border }}>
              <ArrowLeft size={14} />
            </button>
          )}
          <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 8, background: "color-mix(in srgb,var(--color-primary) 14%,transparent)",
            border: "1px solid color-mix(in srgb,var(--color-primary) 28%,transparent)" }}>
            <Users size={15} style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: text, letterSpacing: "-0.03em", lineHeight: 1.1 }}>{headerTitle}</div>
            <div style={{ fontSize: 11, color: muted }}>{headerSub}</div>
          </div>
        </div>

        {view === "list" && (
          <button onClick={handleCreateTeam}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
              fontSize: 13, fontWeight: 700, background: "var(--color-primary)", color: "#fff",
              border: "none", borderRadius: 8, cursor: "pointer",
              boxShadow: "0 4px 14px color-mix(in srgb,var(--color-primary) 40%,transparent)" }}>
            <Plus size={14} /> {isMobile ? "New" : "New team"}
          </button>
        )}
      </div>

      {/* ── BODY ── */}
      <div style={{ paddingTop: 56 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "20px 12px" : "28px 24px" }}>
          <AnimatePresence mode="wait">
            {view === "list" && (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <TeamsListView teams={teams} pendingInvites={pendingInvites} onSelectTeam={handleSelectTeam}
                  onCreateTeam={handleCreateTeam} onAcceptInvite={handleAcceptInvite} loading={loadingTeams} error={teamsError}
                  isDark={isDark} card={card} border={border} text={text} muted={muted} subtle={subtle} isMobile={isMobile} />
              </motion.div>
            )}
            {view === "create" && (
              <motion.div key="create" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
                <CreateTeamView onBack={() => setView("list")} onCreate={handleTeamCreated}
                  isDark={isDark} card={card} border={border} text={text} muted={muted} subtle={subtle} isMobile={isMobile} />
              </motion.div>
            )}
            {view === "detail" && activeTeam && (
              <motion.div key={`detail-${activeTeam.id}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
                <TeamDetailView team={activeTeam} onBack={() => setView("list")}
                  supabase={supabase} user={user} onRefreshTeams={loadTeams}
                  canManage={activeTeam.role === "owner" || activeTeam.role === "admin"}
                  isDark={isDark} card={card} border={border} text={text} muted={muted} subtle={subtle} isMobile={isMobile} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}