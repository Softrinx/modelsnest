import * as paypal from '@paypal/paypal-server-sdk'

// PayPal configuration based on environment
const isTestMode = process.env.PAYPAL_TEST === 'true'

// Get PayPal credentials based on environment
export function getPayPalCredentials() {
  if (isTestMode) {
    return {
      clientId: process.env.PAYPAL_CLIENT_ID_SANDBOX!,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET_SANDBOX!,
      environment: 'sandbox' as const,
      baseURL: 'https://api-m.sandbox.paypal.com'
    }
  } else {
    return {
      clientId: process.env.PAYPAL_CLIENT_ID_LIVE!,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET_LIVE!,
      environment: 'live' as const,
      baseURL: 'https://api-m.paypal.com'
    }
  }
}

// Create PayPal client
export function createPayPalClient() {
  const credentials = getPayPalCredentials()
  
  if (!credentials.clientId || !credentials.clientSecret) {
    throw new Error(`PayPal ${credentials.environment} credentials not configured`)
  }

  try {
    const environment = isTestMode 
      ? paypal.Environment.Sandbox
      : paypal.Environment.Production

    return new paypal.Client({
      environment: environment,
      timeout: 0,
      clientCredentialsAuthCredentials: {
        oAuthClientId: credentials.clientId,
        oAuthClientSecret: credentials.clientSecret,
      },
    })
  } catch (error) {
    console.error('Error creating PayPal client:', error)
    throw new Error(`Failed to create PayPal client: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Get PayPal client ID for frontend
export function getPayPalClientId() {
  const credentials = getPayPalCredentials()
  return credentials.clientId
}

// Check if PayPal is properly configured
export function isPayPalConfigured() {
  const credentials = getPayPalCredentials()
  return !!(credentials.clientId && credentials.clientSecret)
}

// Get environment info for debugging
export function getPayPalEnvironmentInfo() {
  const credentials = getPayPalCredentials()
  return {
    environment: credentials.environment,
    isConfigured: isPayPalConfigured(),
    baseURL: credentials.baseURL
  }
}
