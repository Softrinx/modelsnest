import { getAdminStats } from "@/app/actions/admin"
import { AdminPageClient } from "@/components/admin-page-client"

export default async function AdminPage() {
  const stats = await getAdminStats()

  return <AdminPageClient initialStats={stats} />
}