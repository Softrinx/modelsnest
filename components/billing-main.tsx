"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getBillingInfo } from "@/app/actions/billing"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Download, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { BillingOverview } from "@/components/billing-overview"
import { TopUpDialog } from "@/components/top-up-dialog"
import type { DashboardUser } from "@/types/dashboard-user"

interface BillingMainProps {
  user: DashboardUser
}

export function BillingMain({ user }: BillingMainProps) {
  const searchParams = useSearchParams()
  const [billingData, setBillingData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showTopUp, setShowTopUp] = useState(false)
  
  // Return parameters:
  // - legacy query params (?success=true / ?error=...) kept for backward compatibility
  // - new hash-based status (#success / #cancelled) to keep URLs clean after payment redirects
  const querySuccess = searchParams.get('success')
  const queryError = searchParams.get('error')
  const amount = searchParams.get('amount')
  const transactionId = searchParams.get('transactionId')
  const orderId = searchParams.get('orderId')

  const [hashStatus, setHashStatus] = useState<null | "success" | "cancelled">(null)

  useEffect(() => {
    const raw = window.location.hash?.replace(/^#/, "")
    if (!raw) return

    const normalized = raw === "canceled" ? "cancelled" : raw
    if (normalized === "success" || normalized === "cancelled") {
      setHashStatus(normalized)
      // Clean URL (removes the hash) without reloading
      window.history.replaceState({}, "", "/dashboard/billing")
    }
  }, [])

  const success = querySuccess === "true" || hashStatus === "success"
  const error = queryError || (hashStatus === "cancelled" ? "cancelled" : null)

  useEffect(() => {
    loadBillingData()
  }, [])

  // Refresh billing data when returning from PayPal
  useEffect(() => {
    if (success || error) {
      loadBillingData()
    }
  }, [success, error])

  const loadBillingData = async () => {
    try {
      setLoading(true)
      const billingResult = await getBillingInfo()

      if (billingResult.success) {
        setBillingData(billingResult.data)
      } else {
        console.error("Billing data failed:", billingResult.error)
        // Set default data structure to prevent crashes
        setBillingData({
          credits: { balance: 0, total_spent: 0, total_topped_up: 0 },
          transactions: [],
          monthlyUsage: [],
          user: { id: user.id, email: user.email, name: user.name }
        })
      }
    } catch (error) {
      console.error("Error loading billing data:", error)
      // Set default data structure to prevent crashes
      setBillingData({
        credits: { balance: 0, total_spent: 0, total_topped_up: 0 },
        transactions: [],
        monthlyUsage: [],
        user: { id: user.id, email: user.email, name: user.name }
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTopUpSuccess = () => {
    setShowTopUp(false)
    loadBillingData() // Refresh data after successful top-up
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#0D0D0F] via-[#121214] to-[#1A1B1F]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8C5CF7]"></div>
      </div>
    )
  }

  const credits = billingData?.credits || { balance: 0, total_spent: 0, total_topped_up: 0 }
  const safeCredits = {
    balance: typeof credits.balance === 'number' ? credits.balance : 0,
    total_spent: typeof credits.total_spent === 'number' ? credits.total_spent : 0,
    total_topped_up: typeof credits.total_topped_up === 'number' ? credits.total_topped_up : 0,
  }
  const isLowBalance = safeCredits.balance < 10

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-[#0D0D0F] via-[#121214] to-[#1A1B1F]">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#8C5CF7] via-[#C85CFA] to-[#5567F7] bg-clip-text text-transparent">
              Billing & Usage
            </h1>
            <p className="text-[#A0A0A8] mt-2">Manage your account balance</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-[#202126] text-[#A0A0A8] hover:bg-[#202126] hover:text-white">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => setShowTopUp(true)}
              className="bg-gradient-to-r from-[#8C5CF7] to-[#3B1F82] hover:from-[#7C4CF7] hover:to-[#2B0F72] text-white font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Credits
            </Button>
          </div>
        </div>

        {/* PayPal Success/Error Messages */}
        {success && (
          <Card className="border-[#4ADE80]/20 bg-[#4ADE80]/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-[#4ADE80]" />
                <div className="flex-1">
                  <p className="text-[#4ADE80] font-medium">
                    Payment Successful!
                  </p>
                  <p className="text-[#4ADE80]/80 text-sm">
                    {amount && `$${amount} has been added to your account.`}
                    {transactionId && ` Transaction ID: ${transactionId.slice(0, 8)}...`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.history.replaceState({}, '', '/dashboard/billing')}
                  className="text-[#4ADE80] hover:bg-[#4ADE80]/10"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-[#EF4444]/20 bg-[#EF4444]/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-[#EF4444]" />
                <div className="flex-1">
                  <p className="text-[#EF4444] font-medium">
                    Payment Error
                  </p>
                  <p className="text-[#EF4444]/80 text-sm">
                    {error === 'capture_failed' && 'Payment capture failed. Please try again or contact support.'}
                    {error === 'missing_token' && 'Payment token missing. Please try again.'}
                    {error === 'unauthorized' && 'You are not authorized to complete this payment.'}
                    {error === 'paypal_not_configured' && 'PayPal is not properly configured.'}
                    {error === 'internal_error' && 'An internal error occurred. Please try again.'}
                    {error === 'cancelled' && 'Payment was cancelled.'}
                    {!['capture_failed', 'missing_token', 'unauthorized', 'paypal_not_configured', 'internal_error', 'cancelled'].includes(error) && 
                      `Payment failed: ${error}`
                    }
                  </p>
                  {orderId && (
                    <p className="text-[#EF4444]/60 text-xs mt-1">
                      Order ID: {orderId}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.history.replaceState({}, '', '/dashboard/billing')}
                  className="text-[#EF4444] hover:bg-[#EF4444]/10"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Low Balance Alert */}
        {isLowBalance && (
          <Card className="border-[#EF4444]/20 bg-[#EF4444]/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-[#EF4444] rounded-full animate-pulse"></div>
                <p className="text-[#EF4444] font-medium">
                  Low balance warning: Your account balance is below $10.
                  <Button variant="link" className="text-[#EF4444] p-0 ml-1 h-auto" onClick={() => setShowTopUp(true)}>
                    Top up now
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 bg-[#1A1B1F] border border-[#202126]">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-[#8C5CF7] data-[state=active]:text-white data-[state=active]:border-[#8C5CF7] text-[#A0A0A8] hover:text-white"
            >
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <BillingOverview billingData={billingData} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Top Up Dialog */}
      {showTopUp && (
        <TopUpDialog
          open={showTopUp}
          onOpenChange={setShowTopUp}
          onSuccess={handleTopUpSuccess}
        />
      )}
    </div>
  )
}
