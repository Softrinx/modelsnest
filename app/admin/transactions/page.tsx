import { getTransactions } from "@/app/actions/admin"
import { AdminTransactionsClient } from "@/components/admin-transactions-client"

export const dynamic = 'force-dynamic'

export default async function AdminTransactionsPage() {
  const transactions = await getTransactions()
  return <AdminTransactionsClient transactions={transactions} />
}