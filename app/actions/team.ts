"use server"

import { createAdminClient } from "@/lib/supabase/server"

export type AuthUserSummary = {
  id: string
  email: string | null
  name: string | null
}

export type AuthUserSummaryByEmail = {
  email: string
  id: string | null
  name: string | null
}

export async function getAuthUsersByIds(userIds: string[]): Promise<AuthUserSummary[]> {
  if (!userIds.length) return []

  const supabase = await createAdminClient()
  const uniqueIds = Array.from(new Set(userIds))

  const users = await Promise.all(
    uniqueIds.map(async (id) => {
      const { data, error } = await supabase.auth.admin.getUserById(id)
      if (error || !data?.user) {
        return { id, email: null, name: null }
      }

      const user = data.user
      const name =
        (user.user_metadata?.name as string | undefined) ||
        (user.user_metadata?.full_name as string | undefined) ||
        null

      return {
        id: user.id,
        email: user.email ?? null,
        name,
      }
    })
  )

  return users
}

export async function getAuthUsersByEmails(emails: string[]): Promise<AuthUserSummaryByEmail[]> {
  const normalized = emails
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)

  if (!normalized.length) return []

  const supabase = await createAdminClient()
  const remaining = new Set(normalized)
  const matches = new Map<string, AuthUserSummaryByEmail>()

  const perPage = 1000
  let page = 1

  while (remaining.size > 0) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
    if (error || !data?.users?.length) {
      break
    }

    data.users.forEach((user) => {
      const email = user.email?.toLowerCase()
      if (!email || !remaining.has(email)) return

      const name =
        (user.user_metadata?.name as string | undefined) ||
        (user.user_metadata?.full_name as string | undefined) ||
        null

      matches.set(email, {
        email,
        id: user.id,
        name,
      })
      remaining.delete(email)
    })

    if (data.users.length < perPage) {
      break
    }

    page += 1
  }

  return normalized.map((email) =>
    matches.get(email) ?? {
      email,
      id: null,
      name: null,
    }
  )
}
