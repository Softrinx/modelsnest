"use server"

import { requireAdmin } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"

export type Endpoint = "chat" | "images" | "audio" | "video" | "tts" | "all"

export interface GlobalRule {
  id: string
  endpoint: Endpoint
  requests_per_minute: number
  requests_per_hour: number
  requests_per_day: number
  max_daily_spend_usd: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface UserOverride {
  id: string
  user_id: string
  user_email: string
  user_name: string
  endpoint: Endpoint
  requests_per_minute: number | null
  requests_per_hour: number | null
  requests_per_day: number | null
  max_daily_spend_usd: number | null
  reason: string
  created_at: string
}

async function listAllAuthUsers(supabase: Awaited<ReturnType<typeof createAdminClient>>) {
  const users = [] as Array<{
    id: string
    email?: string | null
    user_metadata?: Record<string, unknown>
  }>

  const perPage = 1000
  let page = 1

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
    if (error) {
      throw error
    }

    const batch = data?.users || []
    users.push(...batch)

    if (batch.length < perPage) {
      break
    }

    page += 1
  }

  return users
}

export async function getGlobalRules(): Promise<GlobalRule[]> {
  await requireAdmin()
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from("rate_limit_rules")
    .select("id, endpoint, requests_per_minute, requests_per_hour, requests_per_day, max_daily_spend_usd, is_active, created_at, updated_at")
    .order("endpoint", { ascending: true })

  if (error) {
    console.error("Error fetching global rate limit rules:", error)
    return []
  }

  return (data || []) as GlobalRule[]
}

export async function updateGlobalRule(id: string, data: Partial<GlobalRule>): Promise<void> {
  await requireAdmin()
  const supabase = await createAdminClient()

  const payload: Record<string, unknown> = {}

  if (typeof data.requests_per_minute === "number") payload.requests_per_minute = data.requests_per_minute
  if (typeof data.requests_per_hour === "number") payload.requests_per_hour = data.requests_per_hour
  if (typeof data.requests_per_day === "number") payload.requests_per_day = data.requests_per_day
  if (typeof data.max_daily_spend_usd === "number") payload.max_daily_spend_usd = data.max_daily_spend_usd
  if (typeof data.is_active === "boolean") payload.is_active = data.is_active

  const { error } = await supabase
    .from("rate_limit_rules")
    .update(payload)
    .eq("id", id)

  if (error) {
    throw new Error(error.message || "Failed to update global rate limit rule")
  }
}

export async function toggleGlobalRule(id: string, isActive: boolean): Promise<void> {
  await updateGlobalRule(id, { is_active: isActive })
}

export async function getRateLimitOverrides(): Promise<UserOverride[]> {
  await requireAdmin()
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from("rate_limit_overrides")
    .select("id, user_id, endpoint, requests_per_minute, requests_per_hour, requests_per_day, max_daily_spend_usd, reason, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching rate limit overrides:", error)
    return []
  }

  const rows = data || []
  const userIds = Array.from(new Set(rows.map((row) => row.user_id).filter(Boolean)))

  const [profilesData, authUsers] = await Promise.all([
    userIds.length
      ? supabase.from("profiles").select("id, name").in("id", userIds)
      : Promise.resolve({ data: [] as Array<{ id: string; name: string | null }>, error: null }),
    listAllAuthUsers(supabase),
  ])

  const nameById = new Map<string, string>()
  for (const profile of profilesData.data || []) {
    if (profile?.id && profile?.name) {
      nameById.set(profile.id, profile.name)
    }
  }

  const authById = new Map<string, { email: string; userName: string | null }>()
  for (const authUser of authUsers) {
    const metaName = authUser.user_metadata?.name
    const metaFullName = authUser.user_metadata?.full_name

    const userName = typeof metaName === "string"
      ? metaName
      : typeof metaFullName === "string"
        ? metaFullName
        : null

    authById.set(authUser.id, {
      email: authUser.email || "",
      userName,
    })
  }

  return rows.map((row) => {
    const auth = authById.get(row.user_id)
    const profileName = nameById.get(row.user_id)
    const userName = profileName || auth?.userName || auth?.email || "Unknown User"

    return {
      id: row.id,
      user_id: row.user_id,
      user_email: auth?.email || "",
      user_name: userName,
      endpoint: row.endpoint as Endpoint,
      requests_per_minute: row.requests_per_minute,
      requests_per_hour: row.requests_per_hour,
      requests_per_day: row.requests_per_day,
      max_daily_spend_usd: row.max_daily_spend_usd,
      reason: row.reason || "",
      created_at: row.created_at,
    }
  })
}

interface AddRateLimitOverrideInput {
  user_email: string
  endpoint: Endpoint
  requests_per_minute: number | null
  requests_per_hour: number | null
  requests_per_day: number | null
  max_daily_spend_usd: number | null
  reason: string
}

export async function addRateLimitOverride(data: AddRateLimitOverrideInput): Promise<UserOverride> {
  const admin = await requireAdmin()
  const supabase = await createAdminClient()

  const users = await listAllAuthUsers(supabase)
  const normalizedEmail = data.user_email.trim().toLowerCase()
  const authUser = users.find((user) => (user.email || "").toLowerCase() === normalizedEmail)

  if (!authUser) {
    throw new Error("User not found for the provided email")
  }

  const payload = {
    user_id: authUser.id,
    endpoint: data.endpoint,
    requests_per_minute: data.requests_per_minute,
    requests_per_hour: data.requests_per_hour,
    requests_per_day: data.requests_per_day,
    max_daily_spend_usd: data.max_daily_spend_usd,
    reason: data.reason,
    created_by: admin.id,
  }

  const { data: saved, error } = await supabase
    .from("rate_limit_overrides")
    .upsert(payload, { onConflict: "user_id,endpoint" })
    .select("id, user_id, endpoint, requests_per_minute, requests_per_hour, requests_per_day, max_daily_spend_usd, reason, created_at")
    .single()

  if (error || !saved) {
    throw new Error(error?.message || "Failed to save override")
  }

  const metaName = authUser.user_metadata?.name
  const metaFullName = authUser.user_metadata?.full_name
  const userName = typeof metaName === "string"
    ? metaName
    : typeof metaFullName === "string"
      ? metaFullName
      : authUser.email || "Unknown User"

  return {
    id: saved.id,
    user_id: saved.user_id,
    user_email: authUser.email || "",
    user_name: userName,
    endpoint: saved.endpoint as Endpoint,
    requests_per_minute: saved.requests_per_minute,
    requests_per_hour: saved.requests_per_hour,
    requests_per_day: saved.requests_per_day,
    max_daily_spend_usd: saved.max_daily_spend_usd,
    reason: saved.reason || "",
    created_at: saved.created_at,
  }
}

export async function deleteRateLimitOverride(id: string): Promise<void> {
  await requireAdmin()
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from("rate_limit_overrides")
    .delete()
    .eq("id", id)

  if (error) {
    throw new Error(error.message || "Failed to delete override")
  }
}
