import { NextRequest, NextResponse } from 'next/server'
import { createPayPalClient, isPayPalConfigured, createOrderRequest } from '@/lib/paypal-legacy'
import { getCurrentUser } from '@/lib/auth'
import { getAppUrl } from '@/lib/get-app-url'

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
    const { amount, currency = 'USD' } = await request.json()

    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: 'Minimum amount is $50' },
        { status: 400 }
      )
    }

    // Create PayPal client
    console.log('Creating PayPal client...')
    const paypalClient = createPayPalClient()
    console.log('PayPal client created successfully')

    // Create order request
    console.log('Creating PayPal order request...')

    // Use a single authoritative base URL to avoid accidental localhost redirects in production.
    const appUrl = getAppUrl(request)

    const requestBody = {
      intent: 'CAPTURE',
      purchaseUnits: [{
        amount: {
          currencyCode: currency,
          value: amount.toString()
        },
        description: `Account top-up for ${user.email}`,
        customId: user.id,
        invoiceId: `topup_${Date.now()}_${user.id}`
      }],
      applicationContext: {
        returnUrl: `${appUrl}/api/paypal/return`,
        cancelUrl: `${appUrl}/dashboard/billing#cancelled`,
        brandName: 'Modelsnest',
        landingPage: 'BILLING',
        userAction: 'PAY_NOW',
        shippingPreference: 'NO_SHIPPING'
      }
    }

    console.log('Setting order request body:', JSON.stringify(requestBody, null, 2))

    // Create the order using legacy SDK
    console.log('Executing PayPal order creation...')
    const orderRequest = createOrderRequest(requestBody)
    const order = await paypalClient.execute(orderRequest)
    console.log('PayPal order created:', order)

    if (order.result.status === 'CREATED') {
      console.log('PayPal order created successfully')
      
      return NextResponse.json({
        success: true,
        orderId: order.result.id,
        status: order.result.status,
        links: order.result.links,
        redirectUrl: order.result.links.find((link: any) => link.rel === 'approve')?.href
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to create PayPal order' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('PayPal create order error:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
