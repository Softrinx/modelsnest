import { NextResponse } from "next/server"
import { verifyPaystackWebhook } from "@/lib/paystack"

export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = req.headers.get("x-paystack-signature")
  const secretKey = process.env.PAYSTACK_SECRET_KEY

  if (!signature || !secretKey) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 })
  }

  try {
    const isValid = verifyPaystackWebhook(rawBody, signature, secretKey)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(rawBody)
    const { event: eventType, data } = event

    if (eventType === "charge.success") {
      const { metadata, amount, reference } = data
      const userId = metadata?.userId
      const creditAmountUsd = Number(metadata?.creditAmountUsd ?? 0)
      const settledAmount = amount / 100
      const chargeCurrency = String(metadata?.chargeCurrency ?? data.currency ?? "USD")

      if (userId && creditAmountUsd > 0) {
        console.log(
          `Processed Paystack payment: ${reference} for user ${userId} credits $${creditAmountUsd} via ${chargeCurrency} ${settledAmount}`
        )
        // TODO: credit the user's balance here using your DB/billing logic
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing Paystack webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
