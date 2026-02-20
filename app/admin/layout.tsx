import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayoutClient } from "./admin-layout-client"

// List of admin emails - must match the one in other auth files
const ADMIN_EMAILS = ["admin@outsoor.com"]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdmin = user && ADMIN_EMAILS.includes(user.email?.toLowerCase() || "")

  // If not authenticated or not admin, just render children
  // The middleware will handle the redirect to /admin/login if needed
  // This prevents infinite redirect loops
  if (!user || !isAdmin) {
    return <>{children}</>
  }

  return (
    <AdminLayoutClient user={user}>
      {children}
    </AdminLayoutClient>
  )
}
