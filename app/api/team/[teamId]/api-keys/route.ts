import { createAdminClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/team/[teamId]/api-keys
 * Get API keys for a team (respects user role/permissions)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const user = await requireAuth()
    const teamId = params.teamId

    const supabase = await createAdminClient()

    // Verify user has access to this team
    const { data: membership, error: membershipError } = await supabase
      .from("team_members")
      .select("team_id, role, status, api_access")
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    if (membershipError || !membership) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      )
    }

    // Check if user has API access permission
    if (!membership.api_access) {
      return NextResponse.json(
        { success: false, error: "No API access permission" },
        { status: 403 }
      )
    }

    // Get team ID from team_members (API tokens might be stored per team in future)
    // For now, we'll return the user's API tokens with team context
    const { data: tokens, error: tokensError } = await supabase
      .from("api_tokens")
      .select("id, name, token_prefix, created_at, expires_at, is_active, last_used_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (tokensError) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch API tokens" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      teamId,
      tokens: tokens || [],
      userRole: membership.role,
      canManage: ["owner", "admin"].includes(membership.role),
    })
  } catch (error) {
    console.error("Error fetching team API keys:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
