"use server"

import crypto from "crypto"
import { createAdminClient, createClient } from "@/lib/supabase/server"

const TOKEN_PREFIX = "ptr_"
const TOKEN_NAME_FALLBACK = "Default API token"

function generateApiToken() {
  return `${TOKEN_PREFIX}${crypto.randomBytes(24).toString("hex")}`
}

function hashApiToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex")
}

function getTokenPrefix(token: string) {
  return token.slice(0, 16)
}

async function requireAuthUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { supabase, user: null as null, error: "Not authenticated" }
  }

  return { supabase, user, error: null as null }
}

export async function getUserTokens() {
  try {
    const { supabase, user, error: authError } = await requireAuthUser()
    if (authError || !user) return { success: false, error: authError, data: [] }

    const { data, error } = await supabase
      .from("api_tokens")
      .select("id, name, token_prefix, last_used_at, created_at, expires_at, is_active")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error querying tokens:", error)
      return { success: false, error: "Failed to load API tokens", data: [] }
    }

    return {
      success: true,
      data: data ?? [],
    }
  } catch (error) {
    console.error("Error getting tokens:", error)
    return { success: false, error: "Failed to load API tokens", data: [] }
  }
}

export async function createApiToken(formData: FormData) {
  try {
    const { supabase, user, error: authError } = await requireAuthUser()
    if (authError || !user) return { success: false, error: authError }

    const inputName = formData.get("name")
    const name =
      typeof inputName === "string" && inputName.trim().length > 0
        ? inputName.trim().slice(0, 255)
        : TOKEN_NAME_FALLBACK

    let createdToken: string | null = null
    let insertError: unknown = null
    let insertedRow: { id: string; name: string; created_at: string } | null = null

    for (let attempt = 0; attempt < 3; attempt++) {
      const token = generateApiToken()
      const tokenHash = hashApiToken(token)
      const tokenPrefix = getTokenPrefix(token)

      const { data, error } = await supabase
        .from("api_tokens")
        .insert({
          user_id: user.id,
          name,
          token_hash: tokenHash,
          token_prefix: tokenPrefix,
          is_active: true,
        })
        .select("id, name, created_at")
        .single()

      if (!error && data) {
        createdToken = token
        insertedRow = data
        insertError = null
        break
      }

      insertError = error
      const code = (error as { code?: string })?.code
      if (code !== "23505") break
    }

    if (!createdToken || !insertedRow) {
      console.error("Error creating token:", insertError)
      return { success: false, error: "Failed to create API token" }
    }

    return {
      success: true,
      message: "API token created successfully",
      token: createdToken,
      data: {
        id: insertedRow.id,
        name: insertedRow.name,
        created_at: insertedRow.created_at,
      },
    }
  } catch (error) {
    console.error("Error creating token:", error)
    return { success: false, error: "Failed to create API token" }
  }
}

export async function regenerateToken(formData: FormData) {
  try {
    const { supabase, user, error: authError } = await requireAuthUser()
    if (authError || !user) return { success: false, error: authError }

    const tokenId = formData.get("tokenId") as string

    if (!tokenId) {
      return { success: false, error: "Token ID is required" }
    }

    const normalizedTokenId = tokenId.trim()
    if (!normalizedTokenId) {
      return { success: false, error: "Invalid token ID" }
    }

    let regeneratedToken: string | null = null
    let updatedAt: string | null = null
    let updateError: unknown = null

    for (let attempt = 0; attempt < 3; attempt++) {
      const token = generateApiToken()
      const tokenHash = hashApiToken(token)
      const tokenPrefix = getTokenPrefix(token)

      const { data, error } = await supabase
        .from("api_tokens")
        .update({
          token_hash: tokenHash,
          token_prefix: tokenPrefix,
          is_active: true,
          last_used_at: null,
        })
        .eq("id", normalizedTokenId)
        .eq("user_id", user.id)
        .select("id, updated_at")
        .single()

      if (!error && data) {
        regeneratedToken = token
        updatedAt = data.updated_at
        updateError = null
        break
      }

      updateError = error
      const code = (error as { code?: string })?.code
      if (code !== "23505") break
    }

    if (!regeneratedToken) {
      console.error("Error regenerating token:", updateError)
      return { success: false, error: "Failed to regenerate API token" }
    }

    return {
      success: true,
      message: "API token regenerated successfully",
      token: regeneratedToken,
      data: {
        id: normalizedTokenId,
        created_at: updatedAt ?? new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error("Error regenerating token:", error)
    return { success: false, error: "Failed to regenerate API token" }
  }
}

export async function deleteToken(formData: FormData) {
  try {
    const { supabase, user, error: authError } = await requireAuthUser()
    if (authError || !user) return { success: false, error: authError }

    const tokenId = formData.get("tokenId") as string

    if (!tokenId) {
      return { success: false, error: "Token ID is required" }
    }

    const normalizedTokenId = tokenId.trim()
    if (!normalizedTokenId) {
      return { success: false, error: "Invalid token ID" }
    }

    const { error } = await supabase
      .from("api_tokens")
      .delete()
      .eq("id", normalizedTokenId)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error deleting token:", error)
      return { success: false, error: "Failed to delete API token" }
    }

    return {
      success: true,
      message: "API token deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting token:", error)
    return { success: false, error: "Failed to delete API token" }
  }
}

export async function getUserIntegrations() {
  try {
    const { supabase, user, error: authError } = await requireAuthUser()
    if (authError || !user) return { success: false, error: authError, data: [] }

    const { data, error } = await supabase
      .from("user_integrations")
      .select("id, integration_type, integration_name, external_account_id, is_active, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error querying integrations:", error)
      return { success: false, error: "Failed to load integrations", data: [] }
    }

    return {
      success: true,
      data: data ?? [],
    }
  } catch (error) {
    console.error("Error getting integrations:", error)
    return { success: false, error: "Failed to load integrations", data: [] }
  }
}

export async function verifyApiToken(token: string) {
  try {
    if (typeof token !== "string" || !token.startsWith(TOKEN_PREFIX)) {
      return null
    }

    const tokenHash = hashApiToken(token)
    const supabaseAdmin = await createAdminClient()

    const { data: tokenRow, error: tokenError } = await supabaseAdmin
      .from("api_tokens")
      .select("id, user_id, name, last_used_at, expires_at, is_active")
      .eq("token_hash", tokenHash)
      .eq("is_active", true)
      .maybeSingle()

    if (tokenError || !tokenRow) {
      if (tokenError) console.error("Error verifying token:", tokenError)
      return null
    }

    if (tokenRow.expires_at && new Date(tokenRow.expires_at).getTime() <= Date.now()) {
      return null
    }

    await supabaseAdmin
      .from("api_tokens")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", tokenRow.id)

    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(tokenRow.user_id)

    return {
      id: tokenRow.id,
      user_id: tokenRow.user_id,
      name: tokenRow.name,
      email: authUser?.user?.email ?? null,
      user_name:
        (authUser?.user?.user_metadata?.name as string | undefined) ??
        (authUser?.user?.user_metadata?.full_name as string | undefined) ??
        null,
      last_used_at: tokenRow.last_used_at,
    }
  } catch (error) {
    console.error("Error in verifyApiToken:", error)
    return null
  }
}

export async function getFirstApiTokenForPlayground() {
  try {
    const { supabase, user, error: authError } = await requireAuthUser()
    if (authError || !user) {
      return { success: false, error: authError ?? "Not authenticated", code: "UNAUTHENTICATED" }
    }

    const { data: firstToken, error: tokenError } = await supabase
      .from("api_tokens")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle()

    if (tokenError) {
      console.error("Error loading first token:", tokenError)
      return { success: false, error: "Failed to load API tokens", code: "TOKEN_QUERY_FAILED" }
    }

    if (!firstToken) {
      return { success: false, error: "No API token found. Generate one first.", code: "NO_API_TOKENS" }
    }

    const token = generateApiToken()
    const tokenHash = hashApiToken(token)
    const tokenPrefix = getTokenPrefix(token)

    const { error: updateError } = await supabase
      .from("api_tokens")
      .update({
        token_hash: tokenHash,
        token_prefix: tokenPrefix,
        is_active: true,
      })
      .eq("id", firstToken.id)
      .eq("user_id", user.id)

    if (updateError) {
      console.error("Error rotating first token:", updateError)
      return { success: false, error: "Failed to prepare API token", code: "TOKEN_ROTATE_FAILED" }
    }

    return {
      success: true,
      token,
      tokenId: firstToken.id,
    }
  } catch (error) {
    console.error("Error preparing first token for playground:", error)
    return { success: false, error: "Failed to prepare API token", code: "PLAYGROUND_TOKEN_ERROR" }
  }
}
