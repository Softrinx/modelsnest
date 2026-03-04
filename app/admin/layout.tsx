import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayoutClient } from "./admin-layout-client"
import { isAdmin } from "@/lib/admin-utils"
import { Funnel_Display } from "next/font/google"

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  variable: "--font-funnel-display",
  display: "swap",
})

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

  if (!user || !userIsAdmin) {
    return <>{children}</>
  }

  return (
    <div className={`${funnelDisplay.variable} font-[family-name:var(--font-funnel-display)]`}>
      <AdminLayoutClient user={user}>
        {children}
      </AdminLayoutClient>
    </div>
  )
}