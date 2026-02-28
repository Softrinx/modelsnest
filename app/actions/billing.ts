"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function getBillingInfo(targetUserId?: string, teamId?: string) {
  try {
    console.log("getBillingInfo called with targetUserId:", targetUserId, "teamId:", teamId)
    const supabase = await createClient()
    const adminSupabase = await createAdminClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return { success: false, error: "Not authenticated" }
    }

    let userId = targetUserId || user.id

    // If teamId is provided, fetch the team owner's billing info
    if (teamId) {
      // Verify the user is a member of this team
      const { data: membership, error: membershipError } = await supabase
        .from("team_members")
        .select("user_id, status")
        .eq("team_id", teamId)
        .eq("user_id", user.id)
        .maybeSingle()

      if (membershipError) {
        console.error("Error checking team membership:", membershipError)
        return { success: false, error: "Failed to verify team access" }
      }

      if (!membership || membership.status !== "active") {
        return { success: false, error: "You are not an active member of this team" }
      }

      // Fetch the team owner's ID
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .select("owner_id")
        .eq("id", teamId)
        .single()

      if (teamError || !team) {
        console.error("Error fetching team:", teamError)
        return { success: false, error: "Failed to fetch team information" }
      }

      userId = team.owner_id
      console.log("Fetching team owner's billing data for userId:", userId, "(current user:", user.id, ")")
    } else {
      console.log("Fetching billing data for userId:", userId, "(current user:", user.id, ")")
    }

    const { data: creditsRow, error: creditsError } = await adminSupabase
      .from("user_credits")
      .select("balance, total_spent, total_topped_up, created_at, updated_at")
      .eq("user_id", userId)
      .maybeSingle()

    if (creditsError) {
      console.error("Error fetching user credits:", creditsError)
      return { success: false, error: "Failed to load user credits" }
    }

    const { data: transactionsRows, error: transactionsError } = await adminSupabase
      .from("credit_transactions")
      .select("id, type, amount, description, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100)

    if (transactionsError) {
      console.error("Error fetching credit transactions:", transactionsError)
      return { success: false, error: "Failed to load credit transactions" }
    }

    const { data: usageRows, error: usageError } = await adminSupabase
      .from("usage_logs")
      .select("cost, created_at")
      .eq("user_id", userId)
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

    // If fetching for team owner or another user, get their user info
    let userInfo = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name ?? null,
    }

    if (userId !== user.id) {
      const adminSupabase = await createAdminClient()
      const { data: targetUser } = await adminSupabase.auth.admin.getUserById(userId)
      if (targetUser?.user) {
        userInfo = {
          id: targetUser.user.id,
          email: targetUser.user.email ?? "",
          name: targetUser.user.user_metadata?.name ?? null,
        }
      }
    }

    return {
      success: true,
      data: {
        credits,
        transactions,
        monthlyUsage,
        user: userInfo,
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
    const adminSupabase = await createAdminClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return { success: false, error: "Not authenticated" }
    }

    const amount = Number(formData.get("amount"))
    const paymentMethod = String(formData.get("paymentMethod") || "manual").toLowerCase()
    const paypalOrderId = formData.get("paypalOrderId") as string | null
    const paypalCaptureId = formData.get("paypalCaptureId") as string | null
    const coinbaseChargeId = formData.get("coinbaseChargeId") as string | null
    const referenceId = paypalOrderId || paypalCaptureId || coinbaseChargeId || null

    if (!amount || amount <= 0) {
      return { success: false, error: "Invalid amount" }
    }

    if (referenceId) {
      const { data: existingTopUp, error: existingTopUpError } = await adminSupabase
        .from("credit_transactions")
        .select("id, amount, status, created_at")
        .eq("user_id", user.id)
        .eq("type", "topup")
        .eq("reference_id", referenceId)
        .eq("status", "completed")
        .maybeSingle()

      if (existingTopUpError) {
        console.error("Error checking existing top-up transaction:", existingTopUpError)
        return { success: false, error: "Failed to validate payment status" }
      }

      if (existingTopUp) {
        return {
          success: true,
          message: "Payment already processed",
          data: {
            id: existingTopUp.id,
            amount: Number.parseFloat(String(existingTopUp.amount ?? amount)),
            created_at: existingTopUp.created_at,
          },
        }
      }
    }

    const { error: ensureCreditsError } = await adminSupabase
      .from("user_credits")
      .upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true })

    if (ensureCreditsError) {
      console.error("Error initializing user credits:", ensureCreditsError)
      return { success: false, error: "Failed to initialize user credits" }
    }

    const methodLabel = paymentMethod === "paypal"
      ? "PayPal"
      : paymentMethod === "coinbase"
        ? "Coinbase"
        : "Manual"

    const { data: insertedTopUp, error: insertError } = await adminSupabase
      .from("credit_transactions")
      .insert({
        user_id: user.id,
        type: "topup",
        amount,
        description: `${methodLabel} top-up`,
        reference_id: referenceId,
        status: "completed",
        metadata: {
          source: paymentMethod,
          paypalOrderId,
          paypalCaptureId,
          coinbaseChargeId,
        },
      })
      .select("id, amount, created_at")
      .single()

    if (insertError) {
      console.error("Error creating top-up transaction:", insertError)
      return { success: false, error: "Failed to record top-up" }
    }

    return {
      success: true,
      message: `Successfully added $${amount} to your account`,
      data: {
        id: insertedTopUp.id,
        amount: Number.parseFloat(String(insertedTopUp.amount ?? amount)),
        created_at: insertedTopUp.created_at,
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
