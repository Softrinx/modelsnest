import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { createHmac } from "crypto"

async function makeSupabase() {
  const cookieStore = await cookies()
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

// ── Inline TOTP verify (same algorithm as 2fa/route.ts) ──────────────────────
const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

function base32Decode(str: string): Buffer {
  const clean = str.toUpperCase().replace(/[^A-Z2-7]/g, "")
  const bytes: number[] = []
  let bits = 0, value = 0
  for (const ch of clean) {
    value = (value << 5) | BASE32_CHARS.indexOf(ch)
    bits += 5
    if (bits >= 8) { bytes.push((value >>> (bits - 8)) & 255); bits -= 8 }
  }
  return Buffer.from(bytes)
}

function hotp(secret: string, counter: number): string {
  const key = base32Decode(secret)
  const buf = Buffer.alloc(8)
  buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0)
  buf.writeUInt32BE(counter >>> 0, 4)
  const hmac   = createHmac("sha1", key).update(buf).digest()
  const offset = hmac[19] & 0xf
  const code   = ((hmac[offset] & 0x7f) << 24)
               | ((hmac[offset + 1] & 0xff) << 16)
               | ((hmac[offset + 2] & 0xff) << 8)
               |  (hmac[offset + 3] & 0xff)
  return String(code % 1_000_000).padStart(6, "0")
}

function verifyTotp(token: string, secret: string, window = 1): boolean {
  const counter = Math.floor(Date.now() / 1000 / 30)
  for (let i = -window; i <= window; i++) {
    if (hotp(secret, counter + i) === token) return true
  }
  return false
}

// POST — called after password succeeds, to verify the TOTP code
export async function POST(req: NextRequest) {
  try {
    const supabase = await makeSupabase()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { code } = await req.json()
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 })
    }

    const secret: string | undefined = user.user_metadata?.totp_secret
    const enabled: boolean = user.user_metadata?.totp_enabled === true

    if (!secret || !enabled) {
      // 2FA not set up — let them through (shouldn't reach here normally)
      return NextResponse.json({ success: true })
    }

    const valid = verifyTotp(code.replace(/\s/g, ""), secret)
    if (!valid) {
      return NextResponse.json({ error: "Invalid code — try again" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[2fa/verify-login]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}