import { getTransactionById } from "@/app/actions/admin"
import { notFound } from "next/navigation"
import { InvoiceDetailClient } from "@/components/invoice-detail-client"

interface Props { params: { id: string } }

export default async function InvoicePage({ params }: Props) {
  const transaction = await getTransactionById(params.id)
  if (!transaction) notFound()
  return <InvoiceDetailClient transaction={transaction} />
}