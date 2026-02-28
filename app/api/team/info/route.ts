import { createAdminClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/team/info - Get current account info (personal or team)
 * Query params:
 *   - teamId: string (if switching to team account)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get("teamId")

    if (!teamId) {
      // Return personal account info
      return NextResponse.json({
        success: true,
        account: {
          type: "personal",
          id: user.id,
          name: user.name || user.email,
          email: user.email,
        },
      })
    }

    // Verify user has access to this team
    const supabase = await createAdminClient()
    const { data: membership, error: membershipError } = await supabase
      .from("team_members")
      .select("team_id, role, status")
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()

    if (membershipError || !membership) {
      return NextResponse.json(
        { success: false, error: "Access denied to this team" },
        { status: 403 }
      )
    }

    // Get team details
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id, name, description, tier, owner_id, created_at")
      .eq("id", teamId)
      .single()

    if (teamError || !team) {
      return NextResponse.json(
        { success: false, error: "Team not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      account: {
        type: "team",
        id: team.id,
        name: team.name,
        description: team.description,
        tier: team.tier,
        ownerId: team.owner_id,
        userRole: membership.role,
        createdAt: team.created_at,
      },
    })
  } catch (error) {
    console.error("Error fetching account info:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
