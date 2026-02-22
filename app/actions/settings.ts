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
    const bio = formData.get("bio") as string
    const location = formData.get("location") as string

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

    // Update bio and location in profiles table
    const profileUpdates: any = {}
    if (bio !== undefined) profileUpdates.bio = bio || null
    if (location !== undefined) profileUpdates.location = location || null

    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update(profileUpdates)
        .eq("id", user.id)

      if (profileError) {
        return { success: false, error: `Failed to update profile: ${profileError.message}` }
      }
      updates.bio = bio
      updates.location = location
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
  chat_messages: boolean
  security_push_alerts: boolean
  in_app_notifications: boolean
  chat_notifications: boolean
  tips: boolean
  quiet_hours: boolean
  quiet_hours_start: string
  quiet_hours_end: string
  bio: string | null
  location: string | null
  dark_theme: boolean
  profile_image: string | null
}

type ProfileNotificationUpdates = Partial<Omit<ProfileRow, "id">>

const profileSelectFields =
  "id, email_notifications, push_notifications, security_alerts, billing_notifications, product_updates, marketing_updates, chat_messages, security_push_alerts, in_app_notifications, chat_notifications, tips, quiet_hours, quiet_hours_start, quiet_hours_end, bio, location, dark_theme, profile_image"

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

export async function uploadProfileImage(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, error: "No file selected" }
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Please upload an image file" }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "Image must be less than 5MB" }
    }

    // Generate unique filename
    const extension = file.type.split("/")[1] || "jpg"
    const timestamp = Date.now()
    const filename = `${user.id}/profile-${timestamp}.${extension}`

    // Delete old image if it exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("profile_image")
      .eq("id", user.id)
      .single()

    if (profile?.profile_image) {
      await supabase.storage
        .from("profile_images")
        .remove([profile.profile_image])
    }

    // Upload new image
    const { error: uploadError } = await supabase.storage
      .from("profile_images")
      .upload(filename, file, { upsert: false })

    if (uploadError) {
      return { success: false, error: `Upload failed: ${uploadError.message}` }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("profile_images")
      .getPublicUrl(filename)

    // Update profile with image path
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ profile_image: filename })
      .eq("id", user.id)

    if (profileError) {
      return { success: false, error: `Failed to update profile: ${profileError.message}` }
    }

    return { 
      success: true, 
      message: "Profile image updated successfully",
      data: { profile_image: filename, url: publicUrl }
    }
  } catch (error) {
    console.error("Profile image upload error:", error)
    return { success: false, error: "Failed to upload profile image" }
  }
}

export async function logoutUser() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
