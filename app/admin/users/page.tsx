import { getUsers } from "@/app/actions/admin"
import { AdminUsersClient } from "@/components/admin-users-client"

export default async function AdminUsersPage() {
  const users = await getUsers()

  return <AdminUsersClient users={users} />
}