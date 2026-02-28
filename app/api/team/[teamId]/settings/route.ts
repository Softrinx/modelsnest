import { createAdminClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/team/[teamId]/settings
 * Get team settings and member information
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
      .select("team_id, role, status")
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

    const canManage = ["owner", "admin"].includes(membership.role)

    // Get team details
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id, name, description, tier, owner_id, created_at, updated_at")
      .eq("id", teamId)
      .single()

    if (teamError || !team) {
      return NextResponse.json(
        { success: false, error: "Team not found" },
        { status: 404 }
      )
    }

    // Get team members (only if user can manage)
    let members: Array<{
      userId: string
      email: string
      name: string
      role: string
      status: string
      apiAccess: boolean
      joinedAt: string
    }> = []
    if (canManage) {
      const { data: memberData } = await supabase
        .from("team_members")
        .select("user_id, role, status, api_access, created_at")
        .eq("team_id", teamId)
        .neq("status", "suspended")

      // Fetch user details for each member
      if (memberData && memberData.length > 0) {
        members = await Promise.all(
          memberData.map(async (m) => {
            const { data: userData } = await supabase.auth.admin.getUserById(m.user_id)
            return {
              userId: m.user_id,
              email: userData?.user?.email || "unknown",
              name: userData?.user?.user_metadata?.name || userData?.user?.email,
              role: m.role,
              status: m.status,
              apiAccess: m.api_access,
              joinedAt: m.created_at,
            }
          })
        )
      }
    }

    return NextResponse.json({
      success: true,
      team: {
        id: team.id,
        name: team.name,
        description: team.description,
        tier: team.tier,
        ownerId: team.owner_id,
        createdAt: team.created_at,
      },
      members: canManage ? members : [],
      userRole: membership.role,
      canManage,
    })
  } catch (error) {
    console.error("Error fetching team settings:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/team/[teamId]/settings
 * Update team settings (owner/admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const user = await requireAuth()
    const teamId = params.teamId
    const body = await request.json()

    const supabase = await createAdminClient()

    // Verify user has permission to manage this team
    const { data: membership, error: membershipError } = await supabase
      .from("team_members")
      .select("role, status")
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

    if (!["owner", "admin"].includes(membership.role)) {
      return NextResponse.json(
        { success: false, error: "Only owners and admins can update team settings" },
        { status: 403 }
      )
    }

    // Update team details
    const { name, description } = body
    const updateData: Record<string, string> = {}

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description

    const { data: updated, error: updateError } = await supabase
      .from("teams")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("id", teamId)
      .select()
      .single()

    if (updateError || !updated) {
      return NextResponse.json(
        { success: false, error: "Failed to update team" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      team: updated,
    })
  } catch (error) {
    console.error("Error updating team settings:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
