"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function updateUserProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    const name = formData.get("name") as string

    const updates: any = {}

    // Update name in user metadata
    if (name !== (user.user_metadata?.name || "")) {
      const { error: metaError } = await supabase.auth.updateUser({
        data: { name }
      })
      if (metaError) {
        return { success: false, error: `Profile update failed: ${metaError.message}` }
      }
      updates.name = name
    }

    return {
      success: true,
      message: "Profile updated successfully",
      data: updates
    }
  } catch (error) {
    console.error("Profile update error:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

type ProfileRow = {
  id: string
  email_notifications: boolean
  push_notifications: boolean
  security_alerts: boolean
  billing_notifications: boolean
  product_updates: boolean
  marketing_updates: boolean
}

type ProfileNotificationUpdates = Partial<Omit<ProfileRow, "id">>

const profileSelectFields =
  "id, email_notifications, push_notifications, security_alerts, billing_notifications, product_updates, marketing_updates"

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(profileSelectFields)
    .eq("id", user.id)
    .maybeSingle()

  if (error) {
    return { success: false, error: `Profile fetch failed: ${error.message}` }
  }

  if (data) {
    return { success: true, data: data as ProfileRow }
  }

  const { data: created, error: createError } = await supabase
    .from("profiles")
    .insert({ id: user.id })
    .select(profileSelectFields)
    .single()

  if (createError) {
    return { success: false, error: `Profile creation failed: ${createError.message}` }
  }

  return { success: true, data: created as ProfileRow }
}

export async function updateNotificationSettings(updates: ProfileNotificationUpdates) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, ...updates }, { onConflict: "id" })
    .select(profileSelectFields)
    .single()

  if (error) {
    return { success: false, error: `Notification update failed: ${error.message}` }
  }

  return { success: true, data: data as ProfileRow }
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!newPassword || !confirmPassword) {
      return { success: false, error: "Password fields are required" }
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "Passwords do not match" }
    }

    if (newPassword.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" }
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      return { success: false, error: `Password change failed: ${error.message}` }
    }

    return { success: true, message: "Password changed successfully" }
  } catch (error) {
    console.error("Password change error:", error)
    return { success: false, error: "Failed to change password" }
  }
}

export async function logoutUser() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
