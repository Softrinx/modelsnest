import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const admin = createAdminClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

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

function parseUA(ua: string): string {
  if (!ua) return "Unknown device"
  const browsers: [RegExp, string][] = [
    [/Edg\//i, "Edge"],
    [/Chrome\//i, "Chrome"],
    [/Firefox\//i, "Firefox"],
    [/Safari\//i, "Safari"],
    [/OPR\//i, "Opera"],
  ]
  const oses: [RegExp, string][] = [
    [/Windows/i, "Windows"],
    [/Macintosh|Mac OS X/i, "Mac"],
    [/iPhone/i, "iPhone"],
    [/iPad/i, "iPad"],
    [/Android/i, "Android"],
    [/Linux/i, "Linux"],
  ]
  let browser = "Browser", os = "Unknown"
  for (const [re, name] of browsers) if (re.test(ua)) { browser = name; break }
  for (const [re, name] of oses)    if (re.test(ua)) { os = name; break }
  return `${browser} on ${os}`
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const m = Math.floor(ms / 60000)
  if (m < 2)  return "Just now"
  if (m < 60) return `${m} minutes ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`
  const d = Math.floor(h / 24)
  return `${d} day${d > 1 ? "s" : ""} ago`
}

// GET — current session + login history
export async function GET(req: NextRequest) {
  const supabase = await makeSupabase()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const ua = req.headers.get("user-agent") ?? ""
  const history: any[] = user.user_metadata?.login_history ?? []

  const sessions = [
    {
      id: "current",
      device: parseUA(ua),
      location: "Current session",
      time: "Active now",
      status: "success",
      current: true,
    },
    ...history.slice(0, 9).map((e: any, i: number) => ({
      id: `h${i}`,
      device: e.device ?? "Unknown device",
      location: e.location ?? "Unknown",
      time: e.time ? timeAgo(e.time) : "Unknown",
      status: e.status ?? "success",
      current: false,
    })),
  ]

  return NextResponse.json({ sessions })
}

// POST — log a login event (call from auth callback)
export async function POST(req: NextRequest) {
  const supabase = await makeSupabase()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const ua = req.headers.get("user-agent") ?? ""
  const body = await req.json().catch(() => ({}))

  const entry = {
    device: parseUA(ua),
    location: body.location ?? "Unknown",
    time: new Date().toISOString(),
    status: body.status ?? "success",
  }

  const existing: any[] = user.user_metadata?.login_history ?? []
  const updated = [entry, ...existing].slice(0, 20)

  await admin.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, login_history: updated },
  })

  return NextResponse.json({ success: true })
}

// DELETE — sign out all other sessions
export async function DELETE() {
  const supabase = await makeSupabase()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { error: soErr } = await supabase.auth.signOut({ scope: "others" })
  if (soErr) return NextResponse.json({ error: soErr.message }, { status: 400 })

  await admin.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, login_history: [] },
  })

  return NextResponse.json({ success: true })
}