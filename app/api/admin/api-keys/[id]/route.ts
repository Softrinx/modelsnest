import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/admin-utils"
import { deleteAdminApiKey, setPrimaryAdminApiKey } from "@/lib/admin-api-keys"

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

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdminApiAccess()
  if (auth.error) {
    return auth.error
  }

  if (!params.id) {
    return NextResponse.json({ error: "Missing API key ID" }, { status: 400 })
  }

  try {
    await deleteAdminApiKey(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete admin API key:", error)
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdminApiAccess()
  if (auth.error) {
    return auth.error
  }

  if (!params.id) {
    return NextResponse.json({ error: "Missing API key ID" }, { status: 400 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (body.action !== "set-primary") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  try {
    const updated = await setPrimaryAdminApiKey(params.id)
    return NextResponse.json({ key: updated })
  } catch (error) {
    console.error("Failed to set primary admin API key:", error)
    return NextResponse.json({ error: "Failed to set provider API key" }, { status: 500 })
  }
}
