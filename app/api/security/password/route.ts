import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

async function makeSupabase() {
  const cookieStore = await cookies()          // ← awaited
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )
}

export async function POST(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const supabase = await makeSupabase()

    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Verify the current password is correct
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })
    if (signInErr) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Update to the new password
    const { error: updateErr } = await supabase.auth.updateUser({ password: newPassword })
    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[security/password]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}