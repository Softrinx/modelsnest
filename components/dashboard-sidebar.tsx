"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
import { useTheme } from "@/contexts/themeContext"
import { OutsoorLogo, OutsoorLogoCompact } from "@/components/outsoor-logo"
import {
  Bot, Cpu, Plug2, CreditCard, Bell, ShieldCheck, SlidersHorizontal,
  ChevronRight, Menu, X, Plus, Sun, Moon, User, Sparkles,
  LayoutDashboard
} from "lucide-react"
import type { DashboardUser } from "@/types/dashboard-user"

// ─── types ────────────────────────────────────────────────────────────────────
interface Props { user: DashboardUser; onSidebarToggle?: (c: boolean) => void }
interface Credits { balance: number }

// ─── nav config ───────────────────────────────────────────────────────────────
const NAV_MAIN = [
  { icon: LayoutDashboard,               label: "Dashboard",     sub: "Overview & stats",    href: "/dashboard",                color: "#6366f1" },
  { icon: Cpu,               label: "Models",        sub: "50+ AI models",       href: "/dashboard/models",         color: "#8b5cf6" },
  { icon: Plug2,             label: "APIs",          sub: "Keys & endpoints",    href: "/dashboard/apis",           color: "#06b6d4" },
  { icon: CreditCard,        label: "Billing",       sub: "Credits & invoices",  href: "/dashboard/billing",        color: "#10b981" },
]
const NAV_TOOLS = [
  { icon: Bell,              label: "Notifications", sub: "Alerts & updates",    href: "/dashboard/notifications",  color: "#f59e0b" },
  { icon: ShieldCheck,       label: "Security",      sub: "Auth & tokens",       href: "/dashboard/security",       color: "#ef4444" },
  { icon: SlidersHorizontal, label: "Settings",      sub: "Preferences",         href: "/dashboard/settings",       color: "#a1a1aa" },
]
const ALL_NAV = [...NAV_MAIN, ...NAV_TOOLS]

// ─── Portal tooltip ───────────────────────────────────────────────────────────
// Rendered via portal so z-index always wins over everything
function TooltipPortal({
  label, sub, color, anchorRef, visible,
}: {
  label: string; sub: string; color: string
  anchorRef: React.RefObject<HTMLDivElement | null>; visible: boolean
}) {
  const { isDark } = useTheme()
  const [pos, setPos] = useState({ top: 0 })

  useEffect(() => {
    if (visible && anchorRef.current) {
      const r = anchorRef.current.getBoundingClientRect()
      setPos({ top: r.top + r.height / 2 })
    }
  }, [visible])

  if (typeof document === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -10, scale: 0.9 }}
          animate={{ opacity: 1, x: 0,   scale: 1 }}
          exit={{   opacity: 0, x: -6,   scale: 0.93 }}
          transition={{ duration: 0.16, ease: [0.25, 0.25, 0, 1] }}
          style={{
            position: "fixed",
            top: pos.top,
            left: 84,               // 72px sidebar + 12px gap
            transform: "translateY(-50%)",
            zIndex: 99999,
            pointerEvents: "none",
          }}
        >
          {/* Arrow */}
          <div style={{
            position: "absolute", right: "100%", top: "50%",
            transform: "translateY(-50%)",
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderRight: `7px solid ${isDark ? "#1c1c1f" : "#ffffff"}`,
          }} />
          <div style={{
            background:   isDark ? "#1c1c1f" : "#ffffff",
            border:       `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            boxShadow:    isDark
              ? "0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)"
              : "0 12px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)",
            borderRadius: 10,
            padding:      "10px 14px",
            minWidth:     140,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background: color, boxShadow:`0 0 6px ${color}` }} />
              <span style={{ fontSize:12, fontWeight:700, color: isDark?"#f4f4f5":"#09090b" }}>{label}</span>
            </div>
            <span style={{ fontSize:11, color: isDark?"#71717a":"#a1a1aa", paddingLeft:14 }}>{sub}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

// ─── Single nav item ──────────────────────────────────────────────────────────
function NavItem({
  item, collapsed, active,
}: {
  item: typeof ALL_NAV[0]; collapsed: boolean; active: boolean
}) {
  const { isDark } = useTheme()
  const [hovered, setHovered] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  const showTip = collapsed && hovered

  return (
    <Link href={item.href} style={{ display: "block", textDecoration: "none" }}>
      <div
        ref={anchorRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: collapsed ? "0" : "8px 10px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderRadius: 12,
          cursor: "pointer",
          position: "relative",
          background: active
            ? isDark
              ? `color-mix(in srgb, ${item.color} 16%, transparent)`
              : `color-mix(in srgb, ${item.color} 10%, transparent)`
            : hovered
              ? isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"
              : "transparent",
          transition: "background 0.15s ease",
          height: collapsed ? 44 : "auto",
          width: collapsed ? 44 : "auto",
          margin: collapsed ? "0 auto" : "0",
        }}
      >
        {/* Active left bar */}
        {active && !collapsed && (
          <motion.div
            layoutId="nav-active-bar"
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              marginTop: -10,
              width: 3, height: 20,
              background: item.color,
              borderRadius: "0 3px 3px 0",
              boxShadow: `0 0 10px ${item.color}`,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}

        {/* Icon box */}
        <motion.div
          animate={{
            background: active
              ? item.color
              : isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
            boxShadow: active
              ? `0 4px 16px ${item.color}55, 0 0 0 1px ${item.color}33`
              : "none",
          }}
          transition={{ duration: 0.2 }}
          style={{
            width: 36, height: 36,
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <item.icon
            size={17}
            strokeWidth={active ? 2.5 : 1.8}
            style={{ color: active ? "#fff" : isDark ? "#a1a1aa" : "#71717a" }}
          />
        </motion.div>

        {/* Label + sub */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ display: "flex", flexDirection: "column", minWidth: 0 }}
          >
            <span style={{
              fontSize: 13, fontWeight: 600, lineHeight: 1,
              color: active ? item.color : isDark ? "#d4d4d8" : "#3f3f46",
              whiteSpace: "nowrap",
            }}>
              {item.label}
            </span>
            <span style={{
              fontSize: 11, marginTop: 3, lineHeight: 1,
              color: isDark ? "#52525b" : "#a1a1aa",
              whiteSpace: "nowrap",
            }}>
              {item.sub}
            </span>
          </motion.div>
        )}

        {/* Portal tooltip when collapsed */}
        <TooltipPortal
          label={item.label} sub={item.sub} color={item.color}
          anchorRef={anchorRef} visible={showTip}
        />
      </div>
    </Link>
  )
}

// ─── Sidebar body ─────────────────────────────────────────────────────────────
function SidebarBody({
  collapsed, user, credits, onClose,
}: {
  collapsed: boolean; user: DashboardUser
  credits: Credits | null; onClose?: () => void
}) {
  const { isDark, setMode } = useTheme()
  const pathname = usePathname()

  const bg     = isDark ? "#0d0d10" : "#ffffff"
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const muted  = isDark ? "#52525b" : "#a1a1aa"

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background: bg }}>

      {/* ── Logo row ── */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent: collapsed ? "center" : "space-between",
        padding: collapsed ? "18px 0" : "16px 16px",
        borderBottom: `1px solid ${border}`, flexShrink: 0,
      }}>
        {collapsed ? <OutsoorLogoCompact /> : <OutsoorLogo size="md" variant="sidebar" />}
        {onClose && (
          <button onClick={onClose}
            style={{ padding:6, borderRadius:8, background:"transparent", border:"none", cursor:"pointer", color: muted }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <div style={{ flex:1, overflowY:"auto", padding: collapsed ? "16px 14px" : "16px 12px", display:"flex", flexDirection:"column", gap:24 }}>

        {/* Main group */}
        <div style={{ display:"flex", flexDirection:"column", gap: collapsed ? 8 : 4 }}>
          {!collapsed && (
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color: muted, opacity:0.7, padding:"0 10px", marginBottom:4 }}>
              Main
            </span>
          )}
          {NAV_MAIN.map(item => (
            <NavItem key={item.href} item={item} collapsed={collapsed} active={pathname === item.href} />
          ))}
        </div>

        {/* Divider */}
        <div style={{ height:1, background: border, margin: collapsed ? "0 auto" : "0 10px", width: collapsed ? 28 : undefined }} />

        {/* Tools group */}
        <div style={{ display:"flex", flexDirection:"column", gap: collapsed ? 8 : 4 }}>
          {!collapsed && (
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color: muted, opacity:0.7, padding:"0 10px", marginBottom:4 }}>
              Tools
            </span>
          )}
          {NAV_TOOLS.map(item => (
            <NavItem key={item.href} item={item} collapsed={collapsed} active={pathname === item.href} />
          ))}
        </div>
      </div>

      {/* ── Credits ── */}
      {credits !== null && (
        <div style={{ padding: "12px", borderTop: `1px solid ${border}`, flexShrink:0 }}>
          {!collapsed ? (
            <div style={{ marginBottom:10, padding:"2px 2px" }}>
              <span style={{ fontSize:11, color: muted, display:"block", marginBottom:4 }}>Available balance</span>
              <span style={{ fontSize:20, fontWeight:900, letterSpacing:"-0.04em", color: isDark?"#f4f4f5":"#09090b", fontFamily:"monospace" }}>
                ${credits.balance.toFixed(2)}
              </span>
            </div>
          ) : (
            <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}>
              <span style={{ fontSize:10, color: muted, fontWeight:600 }}>$</span>
            </div>
          )}
          <Link href="/dashboard/billing" style={{ display:"block" }}>
            <button style={{
              width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:6,
              padding: collapsed ? "10px 0" : "9px 0",
              borderRadius:10, border:"none", cursor:"pointer",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
              color:"#fff", fontSize:12, fontWeight:700,
              boxShadow:"0 4px 16px color-mix(in srgb, var(--color-primary) 35%, transparent)",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity="0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity="1"}
            >
              <Plus size={13} />
              {!collapsed && "Add Credits"}
            </button>
          </Link>
        </div>
      )}

      {/* ── Theme toggle + User ── */}
      <div style={{ padding:"12px", borderTop:`1px solid ${border}`, flexShrink:0, display:"flex", flexDirection:"column", gap:4 }}>

        {/* Theme toggle */}
        <button
          onClick={() => setMode(isDark ? "light" : "dark")}
          style={{
            display:"flex", alignItems:"center",
            gap: 10,
            padding: collapsed ? "10px 0" : "9px 10px",
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius:10,
            border:"none", cursor:"pointer",
            background:"transparent",
            width:"100%",
            transition:"background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <motion.div
            animate={{
              background: isDark ? "rgba(251,191,36,0.15)" : "rgba(99,102,241,0.12)",
              boxShadow: isDark ? "0 0 12px rgba(251,191,36,0.25)" : "0 0 12px rgba(99,102,241,0.2)",
            }}
            style={{ width:36, height:36, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}
          >
            {isDark
              ? <Sun  size={16} style={{ color:"#fbbf24" }} />
              : <Moon size={16} style={{ color:"#6366f1" }} />}
          </motion.div>
          {!collapsed && (
            <span style={{ fontSize:13, fontWeight:600, color: isDark?"#d4d4d8":"#3f3f46" }}>
              {isDark ? "Light mode" : "Dark mode"}
            </span>
          )}
        </button>

        {/* User */}
        <div style={{
          display:"flex", alignItems:"center",
          gap:10,
          padding: collapsed ? "10px 0" : "9px 10px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderRadius:10,
          cursor:"pointer",
          transition:"background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          {/* Avatar with gradient + first letter */}
          <div style={{
            width:36, height:36, borderRadius:10, flexShrink:0,
            background:"linear-gradient(135deg, var(--color-primary), var(--color-accent))",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:14, fontWeight:900, color:"#fff",
            boxShadow:"0 4px 12px color-mix(in srgb, var(--color-primary) 40%, transparent)",
          }}>
            {user.name?.charAt(0).toUpperCase() ?? <User size={14} />}
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity:0, x:-4 }}
              animate={{ opacity:1, x:0 }}
              style={{ display:"flex", flexDirection:"column", minWidth:0 }}
            >
              <span style={{ fontSize:12, fontWeight:700, color: isDark?"#f4f4f5":"#09090b", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:140 }}>
                {user.name}
              </span>
              <span style={{ fontSize:11, color: muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:140 }}>
                {user.email}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function DashboardSidebar({ user, onSidebarToggle }: Props) {
  const { isDark } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile]   = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [credits, setCredits]     = useState<Credits | null>(null)
  const pathname = usePathname()

  const W      = collapsed ? 72 : 256
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)"
  const bg     = isDark ? "#0d0d10" : "#ffffff"

  useEffect(() => {
    const check = () => { const m = window.innerWidth < 768; setIsMobile(m); if (m) setCollapsed(true) }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => { onSidebarToggle?.(collapsed) }, [collapsed])
  useEffect(() => { setDrawerOpen(false) }, [pathname])

  useEffect(() => {
    fetch("/api/user/credits")
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.success && setCredits(d.credits))
      .catch(() => {})
  }, [])

  return (
    <>
      {/* ── Mobile hamburger ── */}
      {isMobile && (
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setDrawerOpen(true)}
          style={{
            position:"fixed", top:16, left:16, zIndex:50,
            width:40, height:40, borderRadius:12,
            background: bg, border:`1px solid ${border}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer",
            boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.1)",
            color: isDark ? "#d4d4d8" : "#3f3f46",
          }}
        >
          <Menu size={16} />
        </motion.button>
      )}

      {/* ── Mobile overlay + slide-in drawer ── */}
      <AnimatePresence>
        {isMobile && drawerOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.2 }}
              onClick={() => setDrawerOpen(false)}
              style={{ position:"fixed", inset:0, zIndex:60, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }}
            />
            <motion.div
              key="drawer"
              initial={{ x:"-100%" }} animate={{ x:0 }} exit={{ x:"-100%" }}
              transition={{ duration:0.32, ease:[0.25,0.25,0,1] }}
              style={{
                position:"fixed", left:0, top:0, bottom:0, zIndex:70,
                width:260,
                background: bg,
                borderRight:`1px solid ${border}`,
                borderTopRightRadius:20,
                borderBottomRightRadius:20,
                overflow:"hidden",
                boxShadow:"12px 0 48px rgba(0,0,0,0.4)",
              }}
            >
              <SidebarBody collapsed={false} user={user} credits={credits} onClose={() => setDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ── */}
      {!isMobile && (
        <>
          <motion.div
            animate={{ width: W }}
            transition={{ duration:0.28, ease:[0.25,0.25,0,1] }}
            style={{
              position:"fixed", left:0, top:0, bottom:0, zIndex:40,
              borderTopRightRadius:20,
              borderBottomRightRadius:20,
              overflow:"visible",
              boxShadow: isDark ? "8px 0 48px rgba(0,0,0,0.4)" : "8px 0 48px rgba(0,0,0,0.07)",
            }}
          >
            {/* Inner clip — overflow hidden for content but outer keeps border-radius visible */}
            <div style={{
              width:"100%", height:"100%",
              background: bg,
              border:`1px solid ${border}`,
              borderTopRightRadius:20,
              borderBottomRightRadius:20,
              overflow:"hidden",
            }}>
              <SidebarBody collapsed={collapsed} user={user} credits={credits} />
            </div>
          </motion.div>

          {/* ── Collapse button — perfectly on the right edge, always visible ── */}
          <motion.div
            animate={{ left: W - 13 }}
            transition={{ duration:0.28, ease:[0.25,0.25,0,1] }}
            style={{ position:"fixed", top:28, zIndex:50 }}
          >
            <motion.button
              onClick={() => setCollapsed(c => !c)}
              whileHover={{ scale:1.1 }}
              whileTap={{ scale:0.92 }}
              style={{
                width:26, height:26,
                borderRadius:"50%",
                background: bg,
                border:`2px solid var(--color-primary)`,
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer",
                boxShadow: `0 0 0 4px ${bg}, 0 4px 16px rgba(0,0,0,0.3), 0 0 12px color-mix(in srgb, var(--color-primary) 40%, transparent)`,
                color:"var(--color-primary)",
              }}
            >
              <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration:0.28 }}>
                <ChevronRight size={13} strokeWidth={2.5} />
              </motion.div>
            </motion.button>
          </motion.div>
        </>
      )}
    </>
  )
}