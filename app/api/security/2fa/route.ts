import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createHmac, randomBytes } from "crypto"

const admin = createAdminClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

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

async function currentUser() {
  const supabase = await makeSupabase()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

// ── Pure-crypto TOTP (RFC 6238 / RFC 4226) ───────────────────────────────────
// No external library needed — uses Node's built-in crypto module.

const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

function base32Encode(buf: Buffer): string {
  let bits = 0, value = 0, output = ""
  for (let i = 0; i < buf.length; i++) {
    value = (value << 8) | buf[i]
    bits += 8
    while (bits >= 5) {
      output += BASE32_CHARS[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) output += BASE32_CHARS[(value << (5 - bits)) & 31]
  return output
}

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

function generateSecret(length = 20): string {
  return base32Encode(randomBytes(length))
}

function hotp(secret: string, counter: number): string {
  const key  = base32Decode(secret)
  const buf  = Buffer.alloc(8)
  // Write counter as big-endian 64-bit (JS safe up to 2^53)
  buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0)
  buf.writeUInt32BE(counter >>> 0, 4)
  const hmac  = createHmac("sha1", key).update(buf).digest()
  const offset = hmac[19] & 0xf
  const code   = ((hmac[offset] & 0x7f) << 24)
               | ((hmac[offset + 1] & 0xff) << 16)
               | ((hmac[offset + 2] & 0xff) << 8)
               |  (hmac[offset + 3] & 0xff)
  return String(code % 1_000_000).padStart(6, "0")
}

function totp(secret: string, window = 1): string {
  const counter = Math.floor(Date.now() / 1000 / 30)
  return hotp(secret, counter)
}

function verifyTotp(token: string, secret: string, window = 1): boolean {
  const counter = Math.floor(Date.now() / 1000 / 30)
  for (let i = -window; i <= window; i++) {
    if (hotp(secret, counter + i) === token) return true
  }
  return false
}

function buildOtpauthUrl(account: string, secret: string, issuer: string): string {
  const params = new URLSearchParams({ secret, issuer, algorithm: "SHA1", digits: "6", period: "30" })
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?${params}`
}

// ── Route handlers ────────────────────────────────────────────────────────────

// GET — current 2FA status
export async function GET() {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  return NextResponse.json({ enabled: user.user_metadata?.totp_enabled === true })
}

// POST — generate secret + otpauth URL for QR code
export async function POST() {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const secret     = generateSecret(20)
  const appName    = process.env.NEXT_PUBLIC_SITE_NAME ?? "App"
  const otpauthUrl = buildOtpauthUrl(user.email!, secret, appName)

  const { error } = await admin.auth.admin.updateUserById(user.id, {
    user_metadata: {
      ...user.user_metadata,
      totp_secret: secret,
      totp_enabled: false,
      totp_pending: true,
    },
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ secret, otpauthUrl })
}

// PUT — verify 6-digit code and activate 2FA
export async function PUT(req: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { code } = await req.json()
  if (!code) return NextResponse.json({ error: "Verification code required" }, { status: 400 })

  const secret: string | undefined = user.user_metadata?.totp_secret
  if (!secret || !user.user_metadata?.totp_pending) {
    return NextResponse.json({ error: "No 2FA setup in progress" }, { status: 400 })
  }

  if (!verifyTotp(code.replace(/\s/g, ""), secret)) {
    return NextResponse.json({ error: "Invalid code — try again" }, { status: 400 })
  }

  const { error } = await admin.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, totp_enabled: true, totp_pending: false },
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true })
}

// DELETE — disable 2FA
export async function DELETE() {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { error } = await admin.auth.admin.updateUserById(user.id, {
    user_metadata: {
      ...user.user_metadata,
      totp_secret: null,
      totp_enabled: false,
      totp_pending: false,
    },
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true })
}