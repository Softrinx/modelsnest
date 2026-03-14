import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createTopUp } from '@/app/actions/billing'
import { getAppUrl } from '@/lib/get-app-url'
import { verifyPaystackTransaction } from '@/lib/paystack'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.redirect(`${getAppUrl(request)}/dashboard/billing?error=unauthorized`)
    }

    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.redirect(`${getAppUrl(request)}/dashboard/billing?error=missing_reference`)
    }

    const transaction = await verifyPaystackTransaction(reference)

    if (transaction.status !== 'success') {
      return NextResponse.redirect(`${getAppUrl(request)}/dashboard/billing?error=payment_failed`)
    }

    const amountUsd = Number(transaction.metadata?.creditAmountUsd ?? 0)
    if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
      return NextResponse.redirect(`${getAppUrl(request)}/dashboard/billing?error=invalid_amount`)
    }

    const formData = new FormData()
    formData.append('amount', amountUsd.toString())
    formData.append('paymentMethod', 'paystack')
    formData.append('paystackReferenceId', reference)

    const topUpResult = await createTopUp(formData)
    if (!topUpResult.success) {
      return NextResponse.redirect(`${getAppUrl(request)}/dashboard/billing?error=topup_failed`)
    }

    return NextResponse.redirect(
      `${getAppUrl(request)}/dashboard/billing?success=true&amount=${amountUsd}&transactionId=${reference}`
    )
  } catch (error) {
    console.error('Paystack return error:', error)
    return NextResponse.redirect(`${getAppUrl(request)}/dashboard/billing?error=internal_error`)
  }
}
