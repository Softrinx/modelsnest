import { NextRequest, NextResponse } from 'next/server'
import { createPayPalClient, isPayPalConfigured } from '@/lib/paypal-legacy'
import { getCurrentUser } from '@/lib/auth'
import { createTopUp } from '@/app/actions/billing'

export async function POST(request: NextRequest) {
  try {
    // Check if PayPal is configured
    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { error: 'PayPal is not configured' },
        { status: 500 }
      )
    }

    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Create PayPal client
    const paypalClient = createPayPalClient()

    // Create capture request
    const captureRequest = new (await import('@paypal/checkout-server-sdk')).orders.OrdersCaptureRequest(orderId)
    captureRequest.prefer("return=representation")
    
    // Capture the payment
    const capture = await paypalClient.execute(captureRequest)

    if (capture.result.status === 'COMPLETED') {
      const amount = Number.parseFloat(
        String(
          capture.result.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value
            ?? capture.result.purchase_units?.[0]?.amount?.value
            ?? 0
        )
      )

      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json(
          { error: 'Invalid captured amount from PayPal' },
          { status: 500 }
        )
      }

      const formData = new FormData()
      formData.append('amount', amount.toString())
      formData.append('paymentMethod', 'paypal')
      formData.append('paypalOrderId', orderId)
      formData.append('paypalCaptureId', capture.result.id)

      const topUpResult = await createTopUp(formData)

      if (!topUpResult.success) {
        return NextResponse.json(
          { error: topUpResult.error || 'Failed to record PayPal top-up' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: topUpResult.message || 'Payment captured successfully',
        data: {
          orderId,
          status: capture.result.status,
          captureId: capture.result.id,
          amount
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Payment capture failed' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('PayPal capture order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
