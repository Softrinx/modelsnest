import crypto from 'crypto'

const PAYSTACK_API_URL = 'https://api.paystack.co'
const PAYSTACK_AMOUNT_MULTIPLIER = 100

function getConvertedChargeAmount(
  amountUsd: number,
  chargeCurrency: string,
  usdToChargeRate?: number
) {
  if (chargeCurrency === 'USD') {
    return amountUsd
  }

  if (!usdToChargeRate || !Number.isFinite(usdToChargeRate) || usdToChargeRate <= 0) {
    throw new Error(
      `PAYSTACK_USD_TO_CHARGE_RATE must be set to a positive number when PAYSTACK_CURRENCY is ${chargeCurrency}`
    )
  }

  return amountUsd * usdToChargeRate
}

export const getPaystackConfig = () => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  const webhookSecret = process.env.PAYSTACK_SECRET_KEY // Paystack uses same key for webhook verification
  const chargeCurrency = (process.env.PAYSTACK_CURRENCY ?? 'USD').trim().toUpperCase()
  const usdToChargeRateValue = process.env.PAYSTACK_USD_TO_CHARGE_RATE?.trim()
  const usdToChargeRate = usdToChargeRateValue ? Number(usdToChargeRateValue) : undefined

  if (!secretKey) {
    console.warn('Paystack environment variables are missing')
  }

  return {
    secretKey,
    webhookSecret,
    chargeCurrency,
    usdToChargeRate,
  }
}

interface InitializeTransactionParams {
  email: string
  amountUsd: number
  reference: string
  callback_url?: string
  metadata?: Record<string, unknown>
}

interface VerifiedPaystackTransaction {
  reference: string
  status: string
  amount: number
  currency?: string
  metadata?: Record<string, unknown>
}

export async function initializePaystackTransaction(params: InitializeTransactionParams) {
  const { secretKey, chargeCurrency, usdToChargeRate } = getPaystackConfig()

  if (!secretKey) {
    throw new Error('Paystack secret key is not configured')
  }

  const chargeAmount = getConvertedChargeAmount(params.amountUsd, chargeCurrency, usdToChargeRate)
  const amountInSmallestUnit = Math.round(chargeAmount * PAYSTACK_AMOUNT_MULTIPLIER)

  const body = {
    email: params.email,
    amount: amountInSmallestUnit,
    reference: params.reference,
    currency: chargeCurrency,
    callback_url: params.callback_url,
    metadata: {
      ...params.metadata,
      creditAmountUsd: params.amountUsd,
      chargeAmount,
      chargeCurrency,
    },
  }

  const response = await fetch(`${PAYSTACK_API_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    if (errorBody.includes('unsupported_currency')) {
      throw new Error(
        `Paystack currency ${chargeCurrency} is not enabled on this merchant account. Enable that currency in Paystack or set PAYSTACK_CURRENCY to a supported currency.`
      )
    }

    throw new Error(`Paystack API error: ${response.statusText} - ${errorBody}`)
  }

  const data = await response.json()
  return data.data as { authorization_url: string; access_code: string; reference: string }
}

export async function verifyPaystackTransaction(reference: string): Promise<VerifiedPaystackTransaction> {
  const { secretKey } = getPaystackConfig()

  if (!secretKey) {
    throw new Error('Paystack secret key is not configured')
  }

  const response = await fetch(`${PAYSTACK_API_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Paystack verify error: ${response.statusText} - ${errorBody}`)
  }

  const data = await response.json()
  return data.data as VerifiedPaystackTransaction
}

export function verifyPaystackWebhook(
  rawBody: string,
  signature: string,
  secretKey: string
): boolean {
  const hash = crypto
    .createHmac('sha512', secretKey)
    .update(rawBody)
    .digest('hex')

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(hash))
  } catch {
    return false
  }
}
