"use server"

import { requireAdmin } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/admin-utils"

export interface AdminStats {
  totalUsers: number
  totalRevenue: number
  totalUsageCost: number
}

export interface AdminTransaction {
  id: string
  user_id: string
  user_name: string | null
  user_email: string
  type: 'topup' | 'usage' | 'refund'
  amount: number
  description: string | null
  reference_id: string | null
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  payment_method: string | null
  metadata: any | null
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  name: string | null
  role: string
  created_at: string
  balance: number
  last_sign_in_at: string | null
  is_suspended: boolean
  suspended_until: string | null
}

interface AdminTopUpResult {
  success: boolean
  message?: string
  error?: string
}

interface AdminSuspendResult {
  success: boolean
  message?: string
  error?: string
}

// Get admin stats - fetches real data from Supabase
export async function getAdminStats(): Promise<AdminStats> {
  await requireAdmin()

  try {
    const supabase = await createAdminClient()
    
    // Get total users count using Supabase Admin API
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error("Error fetching users for stats:", error)
      return {
        totalUsers: 0,
        totalRevenue: 0,
        totalUsageCost: 0,
      }
    }

    return {
      totalUsers: users?.length || 0,
      totalRevenue: 0, // TODO: Implement when transactions table is ready
      totalUsageCost: 0, // TODO: Implement when transactions table is ready
    }
  } catch (error) {
    console.error("Error in getAdminStats:", error)
    return {
      totalUsers: 0,
      totalRevenue: 0,
      totalUsageCost: 0,
    }
  }
}

// Get all users - fetches real data from Supabase Auth
export async function getUsers(): Promise<AdminUser[]> {
  await requireAdmin()

  try {
    const supabase = await createAdminClient()
    
    // Fetch all users from Supabase Auth using Admin API
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error("Error fetching users:", error)
      return []
    }

    const userIds = users.map((user) => user.id)
    const { data: creditsData } = userIds.length
      ? await supabase
          .from("user_credits")
          .select("user_id, balance")
          .in("user_id", userIds)
      : { data: [] }

    const balanceByUserId = new Map(
      (creditsData || []).map((credit) => [
        credit.user_id,
        Number.parseFloat(String(credit.balance ?? 0)),
      ])
    )

    // Transform Supabase users to AdminUser format
    const adminUsers: AdminUser[] = await Promise.all(users.map(async (user) => {
      const suspendedUntil = user.banned_until || null
      const suspendedUntilTime = suspendedUntil ? new Date(suspendedUntil).getTime() : null
      const isSuspended = suspendedUntilTime !== null && Number.isFinite(suspendedUntilTime) && suspendedUntilTime > Date.now()
      const userIsAdmin = await isAdmin(supabase, user.id)
      const balance = balanceByUserId.get(user.id)

      return {
        id: user.id,
        email: user.email || 'No email',
        name: user.user_metadata?.name || user.user_metadata?.full_name || null,
        role: userIsAdmin ? 'admin' : 'user',
        created_at: user.created_at,
        balance: Number.isFinite(balance ?? NaN) ? (balance as number) : 0,
        last_sign_in_at: user.last_sign_in_at || null,
        is_suspended: isSuspended,
        suspended_until: suspendedUntil,
      }
    }))

    // Sort by created_at descending (newest first)
    return adminUsers.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  } catch (error) {
    console.error("Error in getUsers:", error)
    return []
  }
}

// Admin manual top-up for a specific user
export async function adminTopUpUserAction(formData: FormData): Promise<AdminTopUpResult> {
  const currentAdmin = await requireAdmin()
  const supabase = await createAdminClient()

  const userId = formData.get("userId") as string | null
  const amountStr = formData.get("amount") as string | null
  const description = (formData.get("description") as string | null)?.trim() || null

  if (!userId) {
    return { success: false, error: "Missing user ID" }
  }

  const amount = amountStr ? Number.parseFloat(amountStr) : NaN

  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: "Amount must be greater than 0" }
  }

  const { error: ensureCreditsError } = await supabase
    .from("user_credits")
    .upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: true })

  if (ensureCreditsError) {
    console.error("Error initializing user credits:", ensureCreditsError)
    return { success: false, error: "Failed to initialize user credits" }
  }

  const { error: insertError } = await supabase
    .from("credit_transactions")
    .insert({
      user_id: userId,
      type: "topup",
      amount,
      description,
      status: "completed",
      metadata: { source: "admin", admin_id: currentAdmin.id },
    })

  if (insertError) {
    console.error("Error adding credits:", insertError)
    return { success: false, error: "Failed to add credits" }
  }

  return { success: true, message: `Successfully added $${amount.toFixed(2)} to user account` }
}

// Admin manual deduction
export async function adminDeductUserCreditsAction(formData: FormData): Promise<AdminTopUpResult> {
  const currentAdmin = await requireAdmin()
  const supabase = await createAdminClient()

  const userId = formData.get("userId") as string | null
  const amountStr = formData.get("amount") as string | null
  const description = (formData.get("description") as string | null)?.trim() || null

  if (!userId) {
    return { success: false, error: "Missing user ID" }
  }

  const amount = amountStr ? Number.parseFloat(amountStr) : NaN

  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: "Amount must be greater than 0" }
  }

  const { error: ensureCreditsError } = await supabase
    .from("user_credits")
    .upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: true })

  if (ensureCreditsError) {
    console.error("Error initializing user credits:", ensureCreditsError)
    return { success: false, error: "Failed to initialize user credits" }
  }

  const { data: creditRow, error: creditFetchError } = await supabase
    .from("user_credits")
    .select("balance")
    .eq("user_id", userId)
    .single()

  if (creditFetchError) {
    console.error("Error fetching current balance:", creditFetchError)
    return { success: false, error: "Failed to fetch current balance" }
  }

  const currentBalance = Number.parseFloat(String(creditRow?.balance ?? 0))
  if (!Number.isFinite(currentBalance) || currentBalance < amount) {
    return { success: false, error: "Insufficient balance to deduct that amount" }
  }

  const { error: insertError } = await supabase
    .from("credit_transactions")
    .insert({
      user_id: userId,
      type: "usage",
      amount,
      description,
      status: "completed",
      metadata: { source: "admin", admin_id: currentAdmin.id },
    })

  if (insertError) {
    console.error("Error deducting credits:", insertError)
    return { success: false, error: "Failed to deduct credits" }
  }

  return { success: true, message: `Successfully deducted $${amount.toFixed(2)} from user account` }
}

// Suspend/deactivate user account
export async function adminSuspendUserAction(formData: FormData): Promise<AdminSuspendResult> {
  const currentAdmin = await requireAdmin()
  const supabase = await createAdminClient()

  const userId = formData.get("userId") as string | null
  const mode = formData.get("mode") as "days" | "indefinite" | null
  const daysValue = formData.get("days") as string | null

  if (!userId) {
    return { success: false, error: "Missing user ID" }
  }

  if (!mode || (mode !== "days" && mode !== "indefinite")) {
    return { success: false, error: "Invalid suspension mode" }
  }

  if (userId === currentAdmin.id) {
    return { success: false, error: "You cannot suspend your own account" }
  }

  const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId)
  if (userError || !userData.user) {
    return { success: false, error: "User not found" }
  }

  const targetIsAdmin = await isAdmin(supabase, userId)
  if (targetIsAdmin) {
    return { success: false, error: "Cannot suspend another admin account" }
  }

  let banDuration: string
  let successMessage: string

  if (mode === "indefinite") {
    banDuration = "876000h"
    successMessage = "User deactivated indefinitely"
  } else {
    const days = daysValue ? Number.parseInt(daysValue, 10) : NaN
    if (!Number.isInteger(days) || days <= 0 || days > 3650) {
      return { success: false, error: "Days must be an integer between 1 and 3650" }
    }

    banDuration = `${days * 24}h`
    successMessage = `User suspended for ${days} day${days > 1 ? "s" : ""}`
  }

  const { error: suspendError } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: banDuration,
  })

  if (suspendError) {
    console.error("Error suspending user:", suspendError)
    return { success: false, error: suspendError.message || "Failed to suspend user" }
  }

  return { success: true, message: successMessage }
}

// Reactivate suspended user account
export async function adminUnsuspendUserAction(formData: FormData): Promise<AdminSuspendResult> {
  await requireAdmin()
  const supabase = await createAdminClient()

  const userId = formData.get("userId") as string | null

  if (!userId) {
    return { success: false, error: "Missing user ID" }
  }

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: "none",
  })

  if (error) {
    console.error("Error reactivating user:", error)
    return { success: false, error: error.message || "Failed to reactivate user" }
  }

  return { success: true, message: "User reactivated successfully" }
}

// Get all transactions from database
export async function getTransactions(): Promise<AdminTransaction[]> {
  await requireAdmin()
  const supabase = await createAdminClient()

  try {
    const { data: transactions, error } = await supabase
      .from("credit_transactions")
      .select("id, user_id, type, amount, description, reference_id, status, metadata, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching transactions:", error)
      return []
    }

    const rows = transactions || []
    const userIds = Array.from(new Set(rows.map((row) => row.user_id).filter(Boolean)))

    const { data: profilesData } = userIds.length
      ? await supabase
          .from("profiles")
          .select("id, name")
          .in("id", userIds)
      : { data: [] }

    const profileNameById = new Map((profilesData || []).map((profile) => [profile.id, profile.name]))

    const { data: authUsersData } = await supabase.auth.admin.listUsers()
    const authUsers = authUsersData?.users || []
    const emailById = new Map(authUsers.map((user) => [user.id, user.email || "Unknown email"]))
    const authNameById = new Map(
      authUsers.map((user) => [
        user.id,
        (user.user_metadata?.name as string | undefined) ||
          (user.user_metadata?.full_name as string | undefined) ||
          null,
      ])
    )

    return rows.map((row) => {
      const metadata = row.metadata as Record<string, unknown> | null
      const metadataPaymentMethod = metadata?.payment_method
      const metadataSource = metadata?.source

      return {
        id: row.id,
        user_id: row.user_id,
        user_name: profileNameById.get(row.user_id) || authNameById.get(row.user_id) || null,
        user_email: emailById.get(row.user_id) || "Unknown email",
        type: row.type,
        amount: Number.parseFloat(String(row.amount ?? 0)),
        description: row.description,
        reference_id: row.reference_id,
        status: row.status,
        payment_method:
          typeof metadataPaymentMethod === "string"
            ? metadataPaymentMethod
            : typeof metadataSource === "string"
              ? metadataSource
              : null,
        metadata: metadata,
        created_at: row.created_at,
        updated_at: row.created_at,
      }
    })
  } catch (error) {
    console.error("Error in getTransactions:", error)
    return []
  }
}

// Get transaction by ID from database
export async function getTransactionById(id: string): Promise<AdminTransaction | null> {
  await requireAdmin()
  const supabase = await createAdminClient()

  try {
    const { data: tx, error } = await supabase
      .from("credit_transactions")
      .select("id, user_id, type, amount, description, reference_id, status, metadata, created_at")
      .eq("id", id)
      .maybeSingle()

    if (error) {
      console.error("Error fetching transaction by ID:", error)
      return null
    }

    if (!tx) {
      return null
    }

    const [{ data: profile }, { data: authUserData }] = await Promise.all([
      supabase.from("profiles").select("id, name").eq("id", tx.user_id).maybeSingle(),
      supabase.auth.admin.getUserById(tx.user_id),
    ])

    const authUser = authUserData?.user
    const metadata = tx.metadata as Record<string, unknown> | null
    const metadataPaymentMethod = metadata?.payment_method
    const metadataSource = metadata?.source

    return {
      id: tx.id,
      user_id: tx.user_id,
      user_name:
        profile?.name ||
        (authUser?.user_metadata?.name as string | undefined) ||
        (authUser?.user_metadata?.full_name as string | undefined) ||
        null,
      user_email: authUser?.email || "Unknown email",
      type: tx.type,
      amount: Number.parseFloat(String(tx.amount ?? 0)),
      description: tx.description,
      reference_id: tx.reference_id,
      status: tx.status,
      payment_method:
        typeof metadataPaymentMethod === "string"
          ? metadataPaymentMethod
          : typeof metadataSource === "string"
            ? metadataSource
            : null,
      metadata,
      created_at: tx.created_at,
      updated_at: tx.created_at,
    }
  } catch (error) {
    console.error("Error in getTransactionById:", error)
    return null
  }
}
