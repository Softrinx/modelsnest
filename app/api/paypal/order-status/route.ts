import { NextRequest, NextResponse } from 'next/server'
import { createPayPalClient, isPayPalConfigured } from '@/lib/paypal-legacy'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const sql = getSql()
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

    // Get order ID from query params
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // First, check our database for the transaction status
    // TODO: Re-enable database operations when tables are properly set up
    console.log('Checking order status, skipping database operations for now')
    
    /*
    const transaction = await sql`
      SELECT 
        status, 
        amount, 
        reference_id,
        metadata,
        created_at,
        updated_at
      FROM credit_transactions 
      WHERE reference_id = ${orderId} AND user_id = ${user.id}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (transaction.length > 0) {
      const tx = transaction[0]
      
      // Update transaction status if it's still pending
      if (tx.status === 'pending') {
        await sql`
          UPDATE credit_transactions 
          SET 
            status = 'completed',
            metadata = metadata || ${JSON.stringify({
              paypalOrderStatus: 'COMPLETED',
              statusCheckTimestamp: new Date().toISOString()
            })}
          WHERE id = ${tx.id}
        `
      }
      
      return NextResponse.json({
        success: true,
        data: {
          orderId,
          status: tx.status,
          amount: tx.amount,
          referenceId: tx.reference_id,
          metadata: tx.metadata,
          createdAt: tx.created_at,
          updatedAt: tx.updated_at
        }
      })
    }
    */

    // If no transaction found, check PayPal directly
    try {
      const paypalClient = createPayPalClient()
      const request = new paypal.orders.OrdersGetRequest(orderId)
      const order = await paypalClient.execute(request)
      
      return NextResponse.json({
        success: true,
        statusData: {
          status: order.result.status === 'COMPLETED' ? 'completed' : 'pending',
          amount: parseFloat(order.result.purchase_units[0].amount.value),
          timestamp: new Date().toISOString(),
          details: `PayPal order status: ${order.result.status}`
        }
      })
    } catch (paypalError) {
      console.error('Error checking PayPal order:', paypalError)
      
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error checking order status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
