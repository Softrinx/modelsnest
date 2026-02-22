"use server"

import { createClient } from "@/lib/supabase/server"

export async function getBillingInfo() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: creditsRow, error: creditsError } = await supabase
      .from("user_credits")
      .select("balance, total_spent, total_topped_up, created_at, updated_at")
      .eq("user_id", user.id)
      .maybeSingle()

    if (creditsError) {
      console.error("Error fetching user credits:", creditsError)
      return { success: false, error: "Failed to load user credits" }
    }

    const { data: transactionsRows, error: transactionsError } = await supabase
      .from("credit_transactions")
      .select("id, type, amount, description, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100)

    if (transactionsError) {
      console.error("Error fetching credit transactions:", transactionsError)
      return { success: false, error: "Failed to load credit transactions" }
    }

    const { data: usageRows, error: usageError } = await supabase
      .from("usage_logs")
      .select("cost, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1000)

    if (usageError) {
      console.error("Error fetching usage logs:", usageError)
      return { success: false, error: "Failed to load usage analytics" }
    }

    const credits = {
      balance: Number.parseFloat(String(creditsRow?.balance ?? 0)),
      total_spent: Number.parseFloat(String(creditsRow?.total_spent ?? 0)),
      total_topped_up: Number.parseFloat(String(creditsRow?.total_topped_up ?? 0)),
      created_at: creditsRow?.created_at ?? new Date().toISOString(),
      updated_at: creditsRow?.updated_at ?? new Date().toISOString(),
    }

    const transactions = (transactionsRows || []).map((tx) => ({
      id: tx.id,
      type: tx.type,
      amount: Number.parseFloat(String(tx.amount ?? 0)),
      description: tx.description ?? null,
      status: tx.status,
      created_at: tx.created_at,
    }))

    const monthlyUsageMap = new Map<string, { total_cost: number; usage_count: number }>()

    for (const usage of usageRows || []) {
      const createdAt = usage.created_at ? new Date(usage.created_at) : null
      if (!createdAt || Number.isNaN(createdAt.getTime())) {
        continue
      }

      const monthKey = new Date(Date.UTC(createdAt.getUTCFullYear(), createdAt.getUTCMonth(), 1)).toISOString()
      const existing = monthlyUsageMap.get(monthKey) || { total_cost: 0, usage_count: 0 }
      existing.total_cost += Number.parseFloat(String(usage.cost ?? 0))
      existing.usage_count += 1
      monthlyUsageMap.set(monthKey, existing)
    }

    const monthlyUsage = Array.from(monthlyUsageMap.entries())
      .map(([month, values]) => ({
        month,
        total_cost: Number(values.total_cost.toFixed(4)),
        usage_count: values.usage_count,
      }))
      .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())

    return {
      success: true,
      data: {
        credits,
        transactions,
        monthlyUsage,
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name ?? null,
        },
      },
    }
  } catch (error) {
    console.error("Error getting billing info:", error)
    return { success: false, error: "Failed to load billing information" }
  }
}

export async function getUsageAnalytics(days: number = 30) {
  try {
    // Return dummy usage analytics
    return {
      success: true,
      data: {
        serviceBreakdown: [
          { service_type: "api_calls", total_cost: 45.50, usage_count: 234, total_tokens: 125000 },
          { service_type: "chat", total_cost: 28.75, usage_count: 89, total_tokens: 87500 },
          { service_type: "embeddings", total_cost: 15.25, usage_count: 156, total_tokens: 62000 },
        ],
        dailyUsage: [
          { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toDateString(), daily_cost: 8.50, daily_requests: 32 },
          { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toDateString(), daily_cost: 12.25, daily_requests: 45 },
          { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toDateString(), daily_cost: 10.75, daily_requests: 38 },
          { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toDateString(), daily_cost: 9.00, daily_requests: 34 },
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toDateString(), daily_cost: 11.50, daily_requests: 42 },
          { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toDateString(), daily_cost: 14.00, daily_requests: 51 },
          { date: new Date().toDateString(), daily_cost: 6.25, daily_requests: 22 },
        ],
        period: days,
      },
    }
  } catch (error) {
    console.error("Error getting usage analytics:", error)
    return { success: false, error: "Failed to load usage analytics" }
  }
}

export async function createTopUp(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return { success: false, error: "Not authenticated" }
    }

    const amount = Number(formData.get("amount"))

    if (!amount || amount <= 0) {
      return { success: false, error: "Invalid amount" }
    }

    // Return success with dummy transaction data
    return {
      success: true,
      message: `Successfully added $${amount} to your account`,
      data: {
        id: `tx_${Date.now()}`,
        amount,
        created_at: new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error("Error creating top-up:", error)
    return { success: false, error: "Failed to process top-up" }
  }
}

export async function recordUsage(usage: any) {
  // This is a placeholder for usage recording via Supabase in future
  return { success: true }
}

export async function getPaymentMethods() {
  return {
    success: true,
    data: [{ id: "paypal", name: "PayPal", type: "digital_wallet" }],
  }
}
