import crypto from "crypto"
import { createAdminClient } from "@/lib/supabase/server"

export type AdminApiKeyProvider = "novita" | "models_lab" | "openai" | "anthropic" | "custom"
export type AdminApiKeyStatus = "active" | "error" | "untested"

export interface AdminApiKey {
  id: string
  provider: AdminApiKeyProvider
  label: string
  api_key: string
  status: AdminApiKeyStatus
  is_primary: boolean
  created_at: string
  updated_at: string
}

const KEY_PART_SEPARATOR = ":"

function getEncryptionSecret(): string {
  const secret = process.env.ADMIN_API_KEYS_ENCRYPTION_KEY
  if (!secret) {
    throw new Error("ADMIN_API_KEYS_ENCRYPTION_KEY is not set")
  }
  return secret
}

function deriveAesKey(secret: string): Buffer {
  return crypto.createHash("sha256").update(secret).digest()
}

export function encryptApiKey(plainTextApiKey: string): string {
  const normalized = plainTextApiKey.trim()
  if (!normalized) {
    throw new Error("Cannot encrypt empty API key")
  }

  const iv = crypto.randomBytes(12)
  const key = deriveAesKey(getEncryptionSecret())
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)

  const encrypted = Buffer.concat([cipher.update(normalized, "utf8"), cipher.final()])
  const authTag = cipher.getAuthTag()

  return [iv.toString("hex"), authTag.toString("hex"), encrypted.toString("hex")].join(KEY_PART_SEPARATOR)
}

export function decryptApiKey(cipherTextPayload: string): string {
  const [ivHex, authTagHex, encryptedHex] = cipherTextPayload.split(KEY_PART_SEPARATOR)

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Invalid encrypted API key payload")
  }

  const iv = Buffer.from(ivHex, "hex")
  const authTag = Buffer.from(authTagHex, "hex")
  const encrypted = Buffer.from(encryptedHex, "hex")

  const key = deriveAesKey(getEncryptionSecret())
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
  decipher.setAuthTag(authTag)

  const plain = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return plain.toString("utf8")
}

export async function listAdminApiKeys(): Promise<AdminApiKey[]> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("admin_api_keys")
    .select("id, provider, label, api_key, status, is_primary, created_at, updated_at")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message || "Failed to fetch admin API keys")
  }

  return (data || []) as AdminApiKey[]
}

export async function listAdminApiKeysWithDecryptedValues() {
  const rows = await listAdminApiKeys()
  return rows.map((row) => {
    let decrypted = ""
    try {
      decrypted = decryptApiKey(row.api_key)
    } catch {
      decrypted = ""
    }

    return {
      id: row.id,
      provider: row.provider,
      label: row.label,
      key: decrypted,
      status: row.status,
      isPrimary: row.is_primary,
      addedAt: row.created_at,
    }
  })
}

interface CreateAdminApiKeyInput {
  provider: AdminApiKeyProvider
  label: string
  apiKey: string
  status?: AdminApiKeyStatus
}

export async function createAdminApiKey(input: CreateAdminApiKeyInput) {
  const supabase = await createAdminClient()
  const encrypted = encryptApiKey(input.apiKey)

  const { data: existingPrimary } = await supabase
    .from("admin_api_keys")
    .select("id")
    .eq("provider", input.provider)
    .eq("is_primary", true)
    .limit(1)
    .maybeSingle()

  const shouldBePrimary = !existingPrimary

  const { data, error } = await supabase
    .from("admin_api_keys")
    .insert({
      provider: input.provider,
      label: input.label.trim(),
      api_key: encrypted,
      status: input.status ?? "untested",
      is_primary: shouldBePrimary,
    })
    .select("id, provider, label, api_key, status, is_primary, created_at, updated_at")
    .single()

  if (error || !data) {
    throw new Error(error?.message || "Failed to create admin API key")
  }

  return {
    id: data.id,
    provider: data.provider,
    label: data.label,
    key: decryptApiKey(data.api_key),
    status: data.status,
    isPrimary: data.is_primary,
    addedAt: data.created_at,
  }
}

export async function deleteAdminApiKey(id: string) {
  const supabase = await createAdminClient()
  const { data: deleted, error } = await supabase
    .from("admin_api_keys")
    .delete()
    .select("id, provider, is_primary")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message || "Failed to delete admin API key")
  }

  if (deleted?.provider && deleted?.is_primary) {
    const { data: nextKey } = await supabase
      .from("admin_api_keys")
      .select("id")
      .eq("provider", deleted.provider)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle()

    if (nextKey?.id) {
      await supabase
        .from("admin_api_keys")
        .update({ is_primary: true })
        .eq("id", nextKey.id)
    }
  }
}

export async function setPrimaryAdminApiKey(id: string) {
  const supabase = await createAdminClient()

  const { data: target, error: targetError } = await supabase
    .from("admin_api_keys")
    .select("id, provider")
    .eq("id", id)
    .single()

  if (targetError || !target) {
    throw new Error(targetError?.message || "API key not found")
  }

  const { error: clearError } = await supabase
    .from("admin_api_keys")
    .update({ is_primary: false })
    .eq("provider", target.provider)

  if (clearError) {
    throw new Error(clearError.message || "Failed to clear provider primary key")
  }

  const { data, error } = await supabase
    .from("admin_api_keys")
    .update({ is_primary: true })
    .eq("id", target.id)
    .select("id, provider, label, api_key, status, is_primary, created_at, updated_at")
    .single()

  if (error || !data) {
    throw new Error(error?.message || "Failed to set primary API key")
  }

  return {
    id: data.id,
    provider: data.provider,
    label: data.label,
    key: decryptApiKey(data.api_key),
    status: data.status,
    isPrimary: data.is_primary,
    addedAt: data.created_at,
  }
}

export async function getActiveProviderApiKey(provider: AdminApiKeyProvider): Promise<string | null> {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from("admin_api_keys")
    .select("id, api_key, status, is_primary")
    .eq("provider", provider)
    .order("is_primary", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data?.api_key) {
    return null
  }

  try {
    const decrypted = decryptApiKey(data.api_key)

    const updates: Record<string, unknown> = {}

    if (data.status !== "active") {
      updates.status = "active"
    }

    if (data.is_primary !== true) {
      updates.is_primary = true
    }

    if (Object.keys(updates).length > 0) {
      await supabase
        .from("admin_api_keys")
        .update(updates)
        .eq("id", data.id)
    }

    return decrypted
  } catch {
    return null
  }
}
