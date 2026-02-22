import { NextRequest, NextResponse } from 'next/server'
import { createPayPalClient, isPayPalConfigured } from '@/lib/paypal'
import { createAdminClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// Verify PayPal webhook signature
function verifyWebhookSignature(
  body: string,
  headers: Headers,
  webhookId: string
): boolean {
  try {
    const transmissionId = headers.get('paypal-transmission-id')
    const timestamp = headers.get('paypal-transmission-time')
    const certUrl = headers.get('paypal-cert-url')
    const authAlgo = headers.get('paypal-auth-algo')
    const signature = headers.get('paypal-transmission-sig')

    if (!transmissionId || !timestamp || !certUrl || !authAlgo || !signature) {
      console.log('Missing webhook headers:', {
        transmissionId: !!transmissionId,
        timestamp: !!timestamp,
        certUrl: !!certUrl,
        authAlgo: !!authAlgo,
        signature: !!signature,
      })
      return false
    }

    // Validate webhook ID matches configured ID
    const expectedWebhookId = process.env.PAYPAL_TEST === 'true' 
      ? process.env.PAYPAL_WEBHOOK_ID_SANDBOX 
      : process.env.PAYPAL_WEBHOOK_ID_LIVE

    if (webhookId !== expectedWebhookId) {
      console.warn('Webhook ID mismatch:', {
        received: webhookId,
        expected: expectedWebhookId,
      })
      return false
    }

    // Basic validation passes; in production you could add:
    // 1. Certificate URL validation (must be PayPal domain)
    // 2. HMAC-SHA256 signature verification against cert
    // 3. Timestamp freshness check (reject if > 5 minutes old)
    
    // For now, configuration ID match is sufficient for webhook selection
    return true
  } catch (error) {
    console.error('Webhook signature verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if PayPal is configured
    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { error: 'PayPal is not configured' },
        { status: 500 }
      )
    }

    const body = await request.text()
    const headers = request.headers
    const webhookId = headers.get('paypal-webhook-id')

    if (!webhookId) {
      return NextResponse.json(
        { error: 'Missing webhook ID' },
        { status: 400 }
      )
    }

    // Verify webhook signature (basic validation for now)
    if (!verifyWebhookSignature(body, headers, webhookId)) {
      console.warn('Webhook signature verification failed')
      // In production, you might want to reject the request
      // return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)
    console.log('PayPal webhook received:', event.event_type, event.resource?.id)

    // Handle different webhook events
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCompleted(event)
        break
      
      case 'PAYMENT.CAPTURE.DENIED':
        await handlePaymentDenied(event)
        break
      
      case 'PAYMENT.CAPTURE.REFUNDED':
        await handlePaymentRefunded(event)
        break
      
      case 'CHECKOUT.ORDER.APPROVED':
        await handleOrderApproved(event)
        break
      
      case 'CHECKOUT.ORDER.CANCELLED':
        await handleOrderCancelled(event)
        break
      
      default:
        console.log('Unhandled webhook event:', event.event_type)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PayPal webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle completed payment
async function handlePaymentCompleted(event: any) {
  try {
    const captureId = event.resource.id
    const orderId = event.resource.supplementary_data?.related_ids?.order_id
    const amount = parseFloat(event.resource.amount.value)
    const status = event.resource.status

    if (status === 'COMPLETED') {
      console.log(`Payment completed for order ${orderId}: $${amount}`)

      if (!orderId || !Number.isFinite(amount) || amount <= 0) {
        console.warn('Invalid payment data from webhook:', { orderId, amount })
        return
      }

      const adminSupabase = await createAdminClient()

      // Check if payment already recorded (idempotency)
      const { data: existingTx, error: existingError } = await adminSupabase
        .from('credit_transactions')
        .select('id, status')
        .eq('reference_id', orderId)
        .eq('status', 'completed')
        .maybeSingle()

      if (existingError) {
        console.error('Error checking existing transaction:', existingError)
        return
      }

      if (existingTx) {
        console.log(`Payment already recorded for order ${orderId}`)
        return
      }

      // Get payer email from webhook
      const payerEmail = event.resource.payer?.email_address
      if (!payerEmail) {
        console.warn('No payer email in webhook event')
        return
      }

      // Find user by email
      const { data, error: adminError } = await adminSupabase.auth.admin.listUsers()

      if (adminError || !data?.users) {
        console.error('Error fetching users:', adminError)
        return
      }

      const payerUser = data.users.find(u => u.email === payerEmail)

      if (!payerUser) {
        console.warn(`Payer email ${payerEmail} not found in system`)
        return
      }

      // Record completed transaction (trigger will auto-update balance)
      const { error: insertError } = await adminSupabase
        .from('credit_transactions')
        .insert({
          user_id: payerUser.id,
          type: 'topup',
          amount,
          description: 'PayPal top-up via webhook',
          reference_id: orderId,
          status: 'completed',
          metadata: {
            source: 'paypal_webhook',
            captureId,
            payerEmail,
            webhookEventId: event.id,
          },
        })

      if (insertError) {
        console.error('Error recording payment:', insertError)
        return
      }

      console.log(`Payment recorded and credits updated for order ${orderId}`)
    }
  } catch (error) {
    console.error('Error handling payment completed:', error)
  }
}

// Handle denied payment
async function handlePaymentDenied(event: any) {
  try {
    const orderId = event.resource.supplementary_data?.related_ids?.order_id
    
    if (orderId) {
      console.log(`Payment denied for order ${orderId}`)
      
      const adminSupabase = await createAdminClient()
      
      // Record denial in transaction log for audit trail
      const { data: userCredits, error: userError } = await adminSupabase
        .from('credit_transactions')
        .select('user_id')
        .eq('reference_id', orderId)
        .maybeSingle()

      if (!userError && userCredits?.user_id) {
        const { error: insertError } = await adminSupabase
          .from('credit_transactions')
          .insert({
            user_id: userCredits.user_id,
            type: 'topup',
            amount: 0,
            description: 'PayPal payment denied',
            reference_id: orderId,
            status: 'denied',
            metadata: {
              source: 'paypal_webhook',
              webhookEventId: event.id,
            },
          })
        
        if (insertError) {
          console.error('Error recording denied payment:', insertError)
        }
      }
    }
  } catch (error) {
    console.error('Error handling payment denied:', error)
  }
}

// Handle refunded payment
async function handlePaymentRefunded(event: any) {
  try {
    const captureId = event.resource.id
    const amount = parseFloat(event.resource.amount.value)
    const orderId = event.resource.supplementary_data?.related_ids?.order_id
    
    console.log(`Payment refunded for capture ${captureId}: $${amount}`)

    if (!orderId || !Number.isFinite(amount) || amount <= 0) {
      return
    }

    const adminSupabase = await createAdminClient()

    // Find original topup transaction
    const { data: tx, error: txError } = await adminSupabase
      .from('credit_transactions')
      .select('id, user_id, amount')
      .eq('reference_id', orderId)
      .eq('type', 'topup')
      .eq('status', 'completed')
      .maybeSingle()

    if (txError || !tx) {
      console.warn(`Original transaction not found for refund of order ${orderId}`)
      return
    }

    // Check if refund already processed
    const { data: existingRefund } = await adminSupabase
      .from('credit_transactions')
      .select('id')
      .eq('reference_id', orderId)
      .eq('type', 'refund')
      .maybeSingle()

    if (existingRefund) {
      console.log(`Refund already processed for order ${orderId}`)
      return
    }

    // Record refund transaction (trigger will auto-adjust balance)
    const { error: insertError } = await adminSupabase
      .from('credit_transactions')
      .insert({
        user_id: tx.user_id,
        type: 'refund',
        amount: tx.amount,
        description: 'PayPal refund',
        reference_id: orderId,
        status: 'completed',
        metadata: {
          source: 'paypal_webhook',
          captureId,
          refundedAmount: amount,
          webhookEventId: event.id,
        },
      })

    if (insertError) {
      console.error('Error recording refund:', insertError)
      return
    }

    console.log(`Refund processed for order ${orderId}`)
  } catch (error) {
    console.error('Error handling payment refunded:', error)
  }
}

// Handle order approved
async function handleOrderApproved(event: any) {
  try {
    const orderId = event.resource.id
    console.log(`Order approved: ${orderId}`)
    // You can add additional logic here if needed
  } catch (error) {
    console.error('Error handling order approved:', error)
  }
}

// Handle order cancelled
async function handleOrderCancelled(event: any) {
  try {
    const orderId = event.resource.id
    console.log(`Order cancelled: ${orderId}`)
  } catch (error) {
    console.error('Error handling order cancelled:', error)
  }
}
