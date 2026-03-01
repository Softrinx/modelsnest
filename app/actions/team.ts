"use server"

import { createAdminClient } from "@/lib/supabase/server"
import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth"

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

export async function deleteTeam(teamId: string) {
  try {
    const user = await requireAuth()
    const supabase = await createAdminClient()

    // Verify team exists and user is the owner
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id, owner_id")
      .eq("id", teamId)
      .single()

    if (teamError || !team) {
      return { success: false, error: "Team not found" }
    }

    // Only the owner can delete the team
    if (team.owner_id !== user.id) {
      return { success: false, error: "Only the team owner can delete the team" }
    }

    // Delete all team members first (cascade delete)
    const { error: membersError } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", teamId)

    if (membersError) {
      console.error("Error deleting team members:", membersError)
      return { success: false, error: "Failed to remove team members" }
    }

    // Delete the team
    const { error: deleteError } = await supabase
      .from("teams")
      .delete()
      .eq("id", teamId)

    if (deleteError) {
      console.error("Error deleting team:", deleteError)
      return { success: false, error: "Failed to delete team" }
    }

    return { success: true, message: "Team deleted successfully" }
  } catch (error) {
    console.error("Error in deleteTeam:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
