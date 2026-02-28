import { createAdminClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

function getUserTokenEncryptionSecret(): string {
  const secret = process.env.USER_API_TOKENS_ENCRYPTION_KEY || process.env.ADMIN_API_KEYS_ENCRYPTION_KEY
  if (!secret) {
    throw new Error("USER_API_TOKENS_ENCRYPTION_KEY is not set")
  }
  return secret
}

function decryptUserApiToken(payload: string): string {
  const [ivHex, authTagHex, encryptedHex] = payload.split(":")
  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Invalid encrypted token payload")
  }

  const key = crypto.createHash("sha256").update(getUserTokenEncryptionSecret()).digest()
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivHex, "hex"))
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"))
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final(),
  ]).toString("utf8")
}

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
      .select("id, name, token_prefix, token_encrypted, created_at, expires_at, is_active, last_used_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (tokensError) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch API tokens" },
        { status: 500 }
      )
    }

    const hydratedTokens = (tokens || []).map((token) => {
      let decrypted = ""
      try {
        decrypted = decryptUserApiToken(token.token_encrypted)
      } catch {
        decrypted = ""
      }

      return {
        id: token.id,
        name: token.name,
        token: decrypted,
        token_prefix: token.token_prefix,
        created_at: token.created_at,
        expires_at: token.expires_at,
        is_active: token.is_active,
        last_used_at: token.last_used_at,
      }
    })

    return NextResponse.json({
      success: true,
      teamId,
      tokens: hydratedTokens,
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
