import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayoutClient } from "./admin-layout-client"
import { isAdmin } from "@/lib/admin-utils"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userIsAdmin = user ? await isAdmin(supabase, user.id) : false

  // If not authenticated or not admin, just render children
  // The middleware will handle the redirect to /login if needed
  // This prevents infinite redirect loops
  if (!user || !userIsAdmin) {
    return <>{children}</>
  }

  return (
    <AdminLayoutClient user={user}>
      {children}
    </AdminLayoutClient>
  )
}
