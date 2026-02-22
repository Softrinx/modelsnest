import { getTransactions } from "@/app/actions/admin"
import { AdminInvoicesClient } from "@/components/admin-invoices-client"

export const dynamic = 'force-dynamic'

export default async function AdminInvoicesPage() {
  const transactions = await getTransactions()
  return <AdminInvoicesClient transactions={transactions} />
}