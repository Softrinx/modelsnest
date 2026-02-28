import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/admin-utils"
import {
  AdminApiKeyProvider,
  AdminApiKeyStatus,
  createAdminApiKey,
  listAdminApiKeysWithDecryptedValues,
} from "@/lib/admin-api-keys"

const ALLOWED_PROVIDERS: AdminApiKeyProvider[] = ["novita", "models_lab", "openai", "anthropic", "custom"]
const ALLOWED_STATUSES: AdminApiKeyStatus[] = ["active", "error", "untested"]

async function requireAdminApiAccess() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return { error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) }
  }

  const userIsAdmin = await isAdmin(supabase, data.user.id)
  if (!userIsAdmin) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
  }

  return { error: null }
}

export async function GET() {
  const auth = await requireAdminApiAccess()
  if (auth.error) {
    return auth.error
  }

  try {
    const keys = await listAdminApiKeysWithDecryptedValues()
    return NextResponse.json({ keys })
  } catch (error) {
    console.error("Failed to fetch admin API keys:", error)
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiAccess()
  if (auth.error) {
    return auth.error
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const provider = body.provider
  const label = body.label
  const key = body.key
  const status = body.status

  if (typeof provider !== "string" || !ALLOWED_PROVIDERS.includes(provider as AdminApiKeyProvider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
  }

  if (typeof label !== "string" || label.trim().length === 0) {
    return NextResponse.json({ error: "Label is required" }, { status: 400 })
  }

  if (typeof key !== "string" || key.trim().length === 0) {
    return NextResponse.json({ error: "API key is required" }, { status: 400 })
  }

  if (status !== undefined && (typeof status !== "string" || !ALLOWED_STATUSES.includes(status as AdminApiKeyStatus))) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  try {
    const created = await createAdminApiKey({
      provider: provider as AdminApiKeyProvider,
      label,
      apiKey: key,
      status: (status as AdminApiKeyStatus | undefined) ?? "untested",
    })

    return NextResponse.json({ key: created }, { status: 201 })
  } catch (error) {
    console.error("Failed to create admin API key:", error)
    return NextResponse.json({ error: "Failed to save API key" }, { status: 500 })
  }
}
