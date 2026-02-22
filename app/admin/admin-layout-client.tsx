"use client"

import { AdminLayoutController } from "@/components/admin-layout-controller"

interface AdminLayoutClientProps {
  children: React.ReactNode
  user: {
    id: string
    email?: string
    user_metadata?: {
      name?: string
      full_name?: string
    }
  }
}

export function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  // Transform user object to match AdminSidebar expectations
  const adminUser = {
    name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin",
    email: user.email || "",
    role: "Administrator"
  }

  return (
    <AdminLayoutController user={adminUser}>
      {children}
    </AdminLayoutController>
  )
}