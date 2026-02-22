import { NextRequest, NextResponse } from 'next/server'
import { createPayPalClient, isPayPalConfigured } from '@/lib/paypal-legacy'
import { getCurrentUser } from '@/lib/auth'
import { createTopUp } from '@/app/actions/billing'
import { getAppUrl } from '@/lib/get-app-url'

export async function GET(request: NextRequest) {
  try {
    // Check if PayPal is configured
    if (!isPayPalConfigured()) {
      return NextResponse.redirect(`${getAppUrl(request)}/dashboard/billing?error=paypal_not_configured`)
    }

    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.redirect(`${getAppUrl(request)}/dashboard/billing?error=unauthorized`)
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token') // PayPal order ID

    if (!token) {
      return NextResponse.redirect(`${getAppUrl(request)}/dashboard/billing?error=missing_token`)
    }

    // Capture the payment
    const paypalClient = createPayPalClient()
    const captureRequest = new (await import('@paypal/checkout-server-sdk')).orders.OrdersCaptureRequest(token)
    captureRequest.prefer("return=representation")
    const capture = await paypalClient.execute(captureRequest)

    if (capture.result.status === 'COMPLETED') {
      // Payment completed successfully - now update user credits
      console.log('Payment completed successfully, updating user credits')
      
      try {
        // Get the payment amount from PayPal
        const amount = Number.parseFloat(
          String(
            capture.result.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value
              ?? capture.result.purchase_units?.[0]?.amount?.value
              ?? 0
          )
        )

        if (!Number.isFinite(amount) || amount <= 0) {
          console.error('Invalid captured amount from PayPal return flow')
          return NextResponse.redirect(`${getAppUrl(request)}/dashboard/billing?error=invalid_amount`)
        }
        
        // Create a FormData object to call createTopUp
        const formData = new FormData()
        formData.append('amount', amount.toString())
        formData.append('paymentMethod', 'paypal')
        formData.append('paypalOrderId', token)
        formData.append('paypalCaptureId', capture.result.id)
        
        // Call createTopUp to update user credits in memory
        const topUpResult = await createTopUp(formData)
        
        if (topUpResult.success) {
          console.log('User credits updated successfully:', topUpResult.message)
        } else {
          console.error('Failed to update user credits:', topUpResult.error)
          return NextResponse.redirect(`${getAppUrl(request)}/dashboard/billing?error=topup_failed`)
        }
      } catch (topUpError) {
        console.error('Error updating user credits:', topUpError)
        return NextResponse.redirect(`${getAppUrl(request)}/dashboard/billing?error=topup_failed`)
      }

      // Redirect back to billing using a canonical base URL (avoid localhost in production)
      return NextResponse.redirect(`${getAppUrl(request)}/dashboard/billing#success`)
    } else {
      // TODO: Re-enable database operations when tables are properly set up
      console.log('Payment failed, skipping database operations for now')
      
      /*
      // Update transaction status to failed
      await sql`
        UPDATE credit_transactions 
        SET 
          status = 'failed',
          metadata = metadata || ${JSON.stringify({
            paypalCaptureId: capture.result.id,
            paypalCaptureStatus: capture.result.status,
            failureTimestamp: new Date().toISOString()
          })}
        WHERE reference_id = ${token} AND status = 'pending'
      `
      */

      return NextResponse.redirect(`${getAppUrl(request)}/dashboard/billing?error=payment_failed`)
    }
  } catch (error) {
    console.error('PayPal return error:', error)
    return NextResponse.redirect(`${getAppUrl(request)}/dashboard/billing?error=internal_error`)
  }
}
