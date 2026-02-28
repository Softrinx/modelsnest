import { createAdminClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/account/details
 * Get current account details (personal or team owner)
 * Query params:
 *   - teamOwnerId: string (if getting team owner's details)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teamOwnerId = searchParams.get("teamOwnerId")

    if (!teamOwnerId) {
      return NextResponse.json(
        { success: false, error: "Missing teamOwnerId parameter" },
        { status: 400 }
      )
    }

    const supabase = await createAdminClient()

    // Get the team owner's user data
    const { data: ownerData, error: ownerError } = await supabase.auth.admin.getUserById(
      teamOwnerId
    )

    if (ownerError || !ownerData?.user) {
      return NextResponse.json(
        { success: false, error: "Team owner not found" },
        { status: 404 }
      )
    }

    const owner = ownerData.user
    const name =
      (owner.user_metadata?.name as string | undefined) ||
      (owner.user_metadata?.full_name as string | undefined) ||
      null

    // Get team owner's credits
    const { data: creditsData, error: creditsError } = await supabase
      .from("user_credits")
      .select("balance, total_spent, total_topped_up")
      .eq("user_id", teamOwnerId)
      .single()

    const credits = creditsData || {
      balance: 0,
      total_spent: 0,
      total_topped_up: 0,
    }

    return NextResponse.json({
      success: true,
      account: {
        id: owner.id,
        name,
        email: owner.email,
        credits: credits.balance,
      },
    })
  } catch (error) {
    console.error("Error fetching account details:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
