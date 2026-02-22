"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/themeContext"
import {
  Search, ChevronLeft, ChevronRight, ChevronDown, Filter,
  Calendar, DollarSign, AlertCircle, X, Users
} from "lucide-react"
import { AdminUser } from "@/app/actions/admin"
import { AdminUserTopUpDialog } from "@/components/admin-user-topup-dialog"
import { AdminUserDeductDialog } from "@/components/admin-user-deduct-dialog"
import { AdminUserSuspendDialog } from "@/components/admin-user-suspend-dialog"

interface AdminUsersClientProps {
  users: AdminUser[]
}

export function AdminUsersClient({ users }: AdminUsersClientProps) {
  const { isDark } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [showFilters, setShowFilters] = useState(false)

  const bg        = isDark ? "#0d0d10" : "#f8f8f6"
  const surface   = isDark ? "#111114" : "#ffffff"
  const border    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const text      = isDark ? "#f4f4f5" : "#09090b"
  const textMuted = isDark ? "#71717a" : "#71717a"
  const textSub   = isDark ? "#52525b" : "#a1a1aa"

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !user.is_suspended) ||
        (statusFilter === "suspended" && user.is_suspended)
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchQuery, roleFilter, statusFilter])

  const totalPages     = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex     = (currentPage - 1) * itemsPerPage
  const endIndex       = startIndex + itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)
  const resetPage      = () => setCurrentPage(1)
  const hasFilters     = roleFilter !== "all" || statusFilter !== "all" || !!searchQuery

  const selectStyle = {
    width: "100%", padding: "9px 10px",
    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
    border: `1px solid ${border}`, color: text, fontSize: 13, cursor: "pointer",
  }

  return (
    <div style={{ minHeight: "100vh", background: bg }}>

      {/* PAGE HEADER */}
      <div style={{
        padding: "40px 48px 36px", borderBottom: `1px solid ${border}`,
        background: isDark ? "linear-gradient(160deg,#0d0d10,#111118)" : surface,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle,${isDark ? "rgba(139,92,246,0.04)" : "rgba(139,92,246,0.02)"} 1px,transparent 1px)`,
          backgroundSize: "28px 28px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1400 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Users size={16} style={{ color: "#8b5cf6" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted }}>
              User Management
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: text, marginBottom: 8 }}>
            Users
          </h1>
          <p style={{ fontSize: 14, color: textMuted, maxWidth: 600 }}>
            Manage user accounts, balances, roles, and suspension status.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "32px 48px", maxWidth: 1400 }}>

        {/* Search & Filters */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            <div style={{ position: "relative", flex: "1 1 300px" }}>
              <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: textSub, pointerEvents: "none" }} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); resetPage() }}
                style={{ width: "100%", padding: "10px 14px 10px 40px", background: surface, border: `1px solid ${border}`, fontSize: 13, color: text, outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.currentTarget.style.borderColor = "#8b5cf6"}
                onBlur={e => e.currentTarget.style.borderColor = border}
              />
            </div>
            <button onClick={() => setShowFilters(v => !v)} style={{
              display: "flex", alignItems: "center", gap: 7, padding: "10px 16px",
              background: showFilters ? "rgba(139,92,246,0.1)" : surface,
              border: `1px solid ${showFilters ? "rgba(139,92,246,0.4)" : border}`,
              color: showFilters ? "#8b5cf6" : text, fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              <Filter size={14} />Filters
              {hasFilters && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#8b5cf6" }} />}
              <ChevronDown size={14} style={{ transform: showFilters ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} style={{ overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10, padding: 14, background: surface, border: `1px solid ${border}`, marginBottom: 10 }}>
                  {[
                    { label: "Role",     val: roleFilter,   set: (v: any) => { setRoleFilter(v); resetPage() },        opts: [["all","All Roles"],["admin","Admin"],["user","User"]] },
                    { label: "Status",   val: statusFilter, set: (v: any) => { setStatusFilter(v); resetPage() },      opts: [["all","All Status"],["active","Active"],["suspended","Suspended"]] },
                    { label: "Per page", val: itemsPerPage, set: (v: any) => { setItemsPerPage(Number(v)); resetPage() }, opts: [[10,"10"],[20,"20"],[50,"50"],[100,"100"]] },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: textMuted, marginBottom: 6 }}>{f.label}</label>
                      <select value={f.val} onChange={e => f.set(e.target.value)} style={selectStyle}>
                        {f.opts.map(([v, l]) => <option key={String(v)} value={v}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: textMuted }}>
            <span>
              Showing <strong style={{ color: text }}>{paginatedUsers.length > 0 ? startIndex + 1 : 0}</strong>–<strong style={{ color: text }}>{Math.min(endIndex, filteredUsers.length)}</strong> of <strong style={{ color: text }}>{filteredUsers.length}</strong> users
            </span>
            {hasFilters && (
              <button onClick={() => { setRoleFilter("all"); setStatusFilter("all"); setSearchQuery(""); resetPage() }}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "transparent", border: `1px solid ${border}`, color: textMuted, fontSize: 11, cursor: "pointer" }}>
                <X size={12} />Clear
              </button>
            )}
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div style={{ display: "none" }} className="lg:block">
          <div style={{ background: surface, border: `1px solid ${border}`, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)", borderBottom: `1px solid ${border}` }}>
                    {["Name", "Email", "Role", "Status", "Balance", "Joined", "Actions"].map(h => (
                      <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: textMuted, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: "56px 24px", textAlign: "center", color: textSub }}>
                        <AlertCircle size={26} style={{ margin: "0 auto 10px", opacity: 0.35, display: "block" }} />
                        <div style={{ fontSize: 13 }}>No users found</div>
                      </td>
                    </tr>
                  ) : paginatedUsers.map((user, i) => (
                    <motion.tr key={user.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }}
                      style={{ borderBottom: `1px solid ${border}`, transition: "background 0.1s" }}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.018)" : "rgba(0,0,0,0.018)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "13px 14px", fontSize: 13, fontWeight: 600, color: text }}>{user.name || "N/A"}</td>
                      <td style={{ padding: "13px 14px", fontSize: 12, color: textMuted, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</td>
                      <td style={{ padding: "13px 14px" }}>
                        <span style={{
                          display: "inline-block", padding: "3px 8px", fontSize: 11, fontWeight: 700, textTransform: "capitalize",
                          background: user.role === "admin" ? "rgba(139,92,246,0.15)" : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                          color: user.role === "admin" ? "#8b5cf6" : textMuted,
                          border: user.role === "admin" ? "1px solid rgba(139,92,246,0.3)" : `1px solid ${border}`,
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: "13px 14px" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px", fontSize: 11, fontWeight: 700,
                          background: user.is_suspended ? "rgba(245,158,11,0.12)" : "rgba(16,185,129,0.12)",
                          color: user.is_suspended ? "#f59e0b" : "#10b981",
                          border: `1px solid ${user.is_suspended ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)"}`,
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: user.is_suspended ? "#f59e0b" : "#10b981", flexShrink: 0 }} />
                          {user.is_suspended ? "Suspended" : "Active"}
                        </span>
                      </td>
                      <td style={{ padding: "13px 14px", fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: text }}>${user.balance.toFixed(2)}</td>
                      <td style={{ padding: "13px 14px", fontSize: 12, color: textMuted, whiteSpace: "nowrap" }}>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: "13px 14px" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          <AdminUserTopUpDialog userId={user.id} userEmail={user.email} currentBalance={user.balance} />
                          <AdminUserDeductDialog userId={user.id} userEmail={user.email} currentBalance={user.balance} />
                          <AdminUserSuspendDialog userId={user.id} userEmail={user.email} isSuspended={user.is_suspended} />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MOBILE CARDS */}
        <div style={{ display: "block" }} className="lg:hidden">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {paginatedUsers.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", background: surface, border: `1px solid ${border}`, color: textSub }}>
                <AlertCircle size={26} style={{ margin: "0 auto 10px", opacity: 0.35, display: "block" }} />
                <div style={{ fontSize: 13 }}>No users found</div>
              </div>
            ) : paginatedUsers.map((user, i) => (
              <motion.div key={user.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                style={{ padding: 16, background: surface, border: `1px solid ${border}` }}>

                {/* Name + badges row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: text, minWidth: 0 }}>{user.name || "N/A"}</div>
                  <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                    <span style={{
                      padding: "3px 7px", fontSize: 10, fontWeight: 700, textTransform: "capitalize",
                      background: user.role === "admin" ? "rgba(139,92,246,0.15)" : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                      color: user.role === "admin" ? "#8b5cf6" : textMuted,
                      border: user.role === "admin" ? "1px solid rgba(139,92,246,0.3)" : `1px solid ${border}`,
                    }}>{user.role}</span>
                    <span style={{
                      padding: "3px 7px", fontSize: 10, fontWeight: 700,
                      background: user.is_suspended ? "rgba(245,158,11,0.12)" : "rgba(16,185,129,0.12)",
                      color: user.is_suspended ? "#f59e0b" : "#10b981",
                      border: `1px solid ${user.is_suspended ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)"}`,
                    }}>{user.is_suspended ? "Suspended" : "Active"}</span>
                  </div>
                </div>

                {/* Email — full width, wraps */}
                <div style={{ fontSize: 11, color: textSub, marginBottom: 12, wordBreak: "break-all" }}>{user.email}</div>

                {/* Balance + Joined */}
                <div style={{ display: "flex", gap: 16, marginBottom: 12, paddingTop: 10, borderTop: `1px solid ${border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <DollarSign size={12} style={{ color: textSub }} />
                    <span style={{ fontSize: 12, color: textMuted }}>Balance:</span>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: text }}>${user.balance.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Calendar size={12} style={{ color: textSub }} />
                    <span style={{ fontSize: 12, color: textSub }}>{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions — always on their own row */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingTop: 10, borderTop: `1px solid ${border}` }}>
                  <AdminUserTopUpDialog userId={user.id} userEmail={user.email} currentBalance={user.balance} />
                  <AdminUserDeductDialog userId={user.id} userEmail={user.email} currentBalance={user.balance} />
                  <AdminUserSuspendDialog userId={user.id} userEmail={user.email} isSuspended={user.is_suspended} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, padding: "13px 16px", background: surface, border: `1px solid ${border}` }}>
            <span style={{ fontSize: 12, color: textMuted }}>Page <strong style={{ color: text }}>{currentPage}</strong> of <strong style={{ color: text }}>{totalPages}</strong></span>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${border}`, color: text, fontSize: 12, fontWeight: 600, cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.4 : 1 }}>
                <ChevronLeft size={14} />Prev
              </button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${border}`, color: text, fontSize: 12, fontWeight: 600, cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.4 : 1 }}>
                Next<ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}