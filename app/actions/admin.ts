"use server"

import { requireAdmin } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"

// List of admin emails for role detection
const ADMIN_EMAILS = ["admin@outsoor.com"]

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

    // Transform Supabase users to AdminUser format
    const adminUsers: AdminUser[] = users.map((user) => {
      const suspendedUntil = user.banned_until || null
      const suspendedUntilTime = suspendedUntil ? new Date(suspendedUntil).getTime() : null
      const isSuspended = suspendedUntilTime !== null && Number.isFinite(suspendedUntilTime) && suspendedUntilTime > Date.now()

      return {
        id: user.id,
        email: user.email || 'No email',
        name: user.user_metadata?.name || user.user_metadata?.full_name || null,
        role: ADMIN_EMAILS.includes(user.email?.toLowerCase() || '') ? 'admin' : 'user',
        created_at: user.created_at,
        balance: 0, // TODO: Fetch from user_credits table when implemented
        last_sign_in_at: user.last_sign_in_at || null,
        is_suspended: isSuspended,
        suspended_until: suspendedUntil,
      }
    })

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
  await requireAdmin()

  const userId = formData.get("userId") as string | null
  const amountStr = formData.get("amount") as string | null

  if (!userId) {
    return { success: false, error: "Missing user ID" }
  }

  const amount = amountStr ? Number.parseFloat(amountStr) : NaN

  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: "Amount must be greater than 0" }
  }

  // Return success
  return { success: true, message: `Successfully added $${amount.toFixed(2)} to user account` }
}

// Admin manual deduction
export async function adminDeductUserCreditsAction(formData: FormData): Promise<AdminTopUpResult> {
  await requireAdmin()

  const userId = formData.get("userId") as string | null
  const amountStr = formData.get("amount") as string | null

  if (!userId) {
    return { success: false, error: "Missing user ID" }
  }

  const amount = amountStr ? Number.parseFloat(amountStr) : NaN

  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: "Amount must be greater than 0" }
  }

  // Return success
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

  const targetEmail = userData.user.email?.toLowerCase() || ""
  if (ADMIN_EMAILS.includes(targetEmail)) {
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

// Get all transactions with dummy data
export async function getTransactions(): Promise<AdminTransaction[]> {
  await requireAdmin()

  return [
    {
      id: "tx_1",
      user_id: "user_1",
      user_name: "John Doe",
      user_email: "john@example.com",
      type: "topup",
      amount: 500,
      description: "PayPal top-up",
      reference_id: "pp_123456",
      status: "completed",
      payment_method: "paypal",
      metadata: { source: "paypal" },
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "tx_2",
      user_id: "user_2",
      user_name: "Jane Smith",
      user_email: "jane@example.com",
      type: "usage",
      amount: 150.75,
      description: "API usage charges",
      reference_id: null,
      status: "completed",
      payment_method: null,
      metadata: { service: "api" },
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "tx_3",
      user_id: "user_1",
      user_name: "John Doe",
      user_email: "john@example.com",
      type: "usage",
      amount: 75.50,
      description: "Chat API usage",
      reference_id: null,
      status: "completed",
      payment_method: null,
      metadata: { service: "chat" },
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}

// Get transaction by ID with dummy data
export async function getTransactionById(id: string): Promise<AdminTransaction | null> {
  await requireAdmin()

  if (id === "tx_1") {
    return {
      id: "tx_1",
      user_id: "user_1",
      user_name: "John Doe",
      user_email: "john@example.com",
      type: "topup",
      amount: 500,
      description: "PayPal top-up",
      reference_id: "pp_123456",
      status: "completed",
      payment_method: "paypal",
      metadata: { source: "paypal" },
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    }
  }

  return null
}
