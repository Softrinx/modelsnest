"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard } from "lucide-react"

interface PaystackButtonProps {
  amount: number
  onError?: (error: string) => void
}

export function PaystackButton({ amount, onError }: PaystackButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      })

      if (!response.ok) {
        throw new Error("Failed to initialize payment")
      }

      const data = await response.json()

      if (data.transaction && data.transaction.authorization_url) {
        // Open Paystack payment page in a new tab.
        // Credits are applied after Paystack redirects back through the server-side return route.
        window.open(data.transaction.authorization_url, "_blank")
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error) {
      console.error("Paystack payment error:", error)
      if (onError) {
        onError(error instanceof Error ? error.message : "Payment failed")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className="w-full h-12 bg-[#00C3F7] hover:bg-[#00C3F7]/90 text-white font-medium text-lg rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(0,195,247,0.15)] hover:shadow-[0_0_30px_rgba(0,195,247,0.25)] relative overflow-hidden group"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <span>Pay with Paystack</span>
        </div>
      )}
    </Button>
  )
}
