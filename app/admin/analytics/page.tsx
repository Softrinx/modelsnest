import { getUsers, getTransactions } from "@/app/actions/admin"
import { AdminAnalyticsClient } from "@/components/admin-analytics-client"

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  const [users, transactions] = await Promise.all([getUsers(), getTransactions()])
  return <AdminAnalyticsClient users={users} transactions={transactions} />
}