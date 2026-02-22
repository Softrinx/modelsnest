"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { useTheme } from "@/contexts/themeContext"

// ── Context — any child can read sidebar state ────────────────────────────────
interface SidebarContextValue {
  collapsed: boolean
  isMobile: boolean
  sidebarWidth: number
}
const AdminSidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  isMobile: false,
  sidebarWidth: 256,
})
export const useAdminSidebar = () => useContext(AdminSidebarContext)

const SIDEBAR_EXPANDED  = 256
const SIDEBAR_COLLAPSED = 72
const MOBILE_BREAKPOINT = 768

interface AdminLayoutControllerProps {
  user: { name: string; email: string; role: string }
  children: React.ReactNode
}

export function AdminLayoutController({ user, children }: AdminLayoutControllerProps) {
  const { isDark } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile]   = useState(false)

  // On mobile the sidebar is a drawer (overlay), so content takes full width
  const sidebarWidth = isMobile ? 0 : (collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED)

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
      if (mobile) setCollapsed(true)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const bg = isDark ? "#0D0D0F" : "#f8f8f6"

  return (
    <AdminSidebarContext.Provider value={{ collapsed, isMobile, sidebarWidth }}>
      <div style={{ display: "flex", minHeight: "100svh", background: bg }}>

        {/* Sidebar mounts itself as position:fixed — we just render it */}
        <AdminSidebar user={user} onSidebarToggle={setCollapsed} />

        {/*
          Content wrapper.
          Desktop → marginLeft = sidebar width, slides with collapse animation.
          Mobile  → marginLeft: 0, sidebar is a drawer overlay so no offset needed.
        */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: "100svh",
            background: bg,
            marginLeft: sidebarWidth,
            transition: "margin-left 0.28s cubic-bezier(0.25,0.25,0,1)",
          }}
        >
          {children}
        </div>
      </div>
    </AdminSidebarContext.Provider>
  )
}