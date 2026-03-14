import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { initializePaystackTransaction } from "@/lib/paystack"
import { getAppUrl } from "@/lib/get-app-url"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount } = await req.json()
    const amountUsd = Number(amount)

    if (!Number.isFinite(amountUsd) || amountUsd < 0.01) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const appUrl = getAppUrl(req)

    // Generate a unique reference for this transaction
    const reference = `mn_${user.id}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`

    const transaction = await initializePaystackTransaction({
      email: user.email,
      amountUsd,
      reference,
      callback_url: `${appUrl}/api/paystack/return`,
      metadata: {
        userId: user.id,
        userEmail: user.email,
        type: "topup",
        amountUsd,
      },
    })

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error("Error initializing Paystack transaction:", error)
    const message = error instanceof Error ? error.message : "Failed to initialize payment"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
