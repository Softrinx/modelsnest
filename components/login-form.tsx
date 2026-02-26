"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Lock, Eye, EyeOff, Smartphone, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { isAdmin } from "@/lib/admin-utils"
import Link from "next/link"

// ── Tiny OTP digit input (same style as security page) ───────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const digits = (value + "      ").slice(0, 6).split("")

  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        maxLength={6}
        inputMode="numeric"
        autoFocus
        style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer", zIndex: 2 }}
      />
      <div onClick={() => inputRef.current?.focus()} className="flex gap-2 cursor-text">
        {digits.map((d, i) => (
          <div
            key={i}
            className="flex-1 h-14 flex items-center justify-center text-2xl font-bold font-mono text-white"
            style={{
              background: "#1A1B1F",
              border: `1px solid ${value.length === i ? "#8C5CF7" : "#202126"}`,
              transition: "border-color 0.15s",
            }}
          >
            {d.trim()}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function LoginForm() {
  const [error, setError]               = useState<string | null>(null)
  const [isLoading, setIsLoading]       = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep]                 = useState<"credentials" | "2fa">("credentials")
  const [otpCode, setOtpCode]           = useState("")
  const [verifying, setVerifying]       = useState(false)
  // Store redirect path between steps
  const redirectRef = useRef<string>("/dashboard")

  const router  = useRouter()
  const supabase = createClient()

  // Timeout guard
  useEffect(() => {
    let t: NodeJS.Timeout
    if (isLoading) t = setTimeout(() => { setIsLoading(false); setError("Request timed out. Please try again.") }, 30000)
    return () => clearTimeout(t)
  }, [isLoading])

  // ── Step 1: email + password ──────────────────────────────────────────────
  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await supabase.auth.signInWithPassword({
        email:    formData.get("email") as string,
        password: formData.get("password") as string,
      })

      if (result.error) {
        // Log failed attempt
        fetch("/api/security/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "failed" }),
        }).catch(() => {})

        setError(result.error.message)
        setIsLoading(false)
        return
      }

      if (result.data?.user) {
        const user        = result.data.user
        const has2FA      = user.user_metadata?.totp_enabled === true
        const userIsAdmin = await isAdmin(supabase, user.id)
        redirectRef.current = userIsAdmin ? "/admin" : "/dashboard"

        if (has2FA) {
          // Don't redirect yet — ask for TOTP code
          setIsLoading(false)
          setStep("2fa")
        } else {
          // No 2FA — log and redirect immediately
          fetch("/api/security/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "success" }),
          }).catch(() => {})

          setIsLoading(false)
          router.push(redirectRef.current)
          router.refresh()
        }
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  // ── Step 2: verify TOTP code ──────────────────────────────────────────────
  async function handleVerify2FA() {
    if (otpCode.length !== 6) return
    setVerifying(true)
    setError(null)

    try {
      const res  = await fetch("/api/security/2fa/verify-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otpCode }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Invalid code — try again")
        setOtpCode("")
        setVerifying(false)
        return
      }

      // Code verified — log session and redirect
      fetch("/api/security/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "success" }),
      }).catch(() => {})

      router.push(redirectRef.current)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
      setVerifying(false)
    }
  }

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (otpCode.length === 6 && step === "2fa" && !verifying) {
      handleVerify2FA()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpCode])

  // ── Sign out and go back to credentials step ──────────────────────────────
  async function handleBack() {
    await supabase.auth.signOut()
    setStep("credentials")
    setOtpCode("")
    setError(null)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Step 1 — credentials
  // ─────────────────────────────────────────────────────────────────────────
  if (step === "credentials") {
    return (
      <div className={`w-full max-w-md mx-auto transition-all duration-300 ${isLoading ? "opacity-90" : "opacity-100"}`}>
        <form
          onSubmit={e => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)) }}
          className="space-y-6"
        >
          {error && (
            <div className="bg-[#1A1B1F] border border-[#EF4444]/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#EF4444] animate-pulse" />
                <p className="text-sm text-[#E0E0E0] font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-[#E0E0E0] flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#8C5CF7]" />
              Email Address
            </Label>
            <Input
              id="email" name="email" type="email" required disabled={isLoading}
              className="bg-[#1A1B1F] border border-[#202126] focus:border-[#8C5CF7]/60 focus:ring-[#8C5CF7]/30 h-14 pl-4 pr-4 rounded-xl transition-all duration-300 hover:border-[#8C5CF7]/30 disabled:opacity-50 text-base text-[#FFFFFF] placeholder-[#5A5A64]"
              placeholder="Enter your email address"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-semibold text-[#E0E0E0] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#8C5CF7]" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password" name="password" type={showPassword ? "text" : "password"} required disabled={isLoading}
                className="bg-[#1A1B1F] border border-[#202126] focus:border-[#8C5CF7]/60 focus:ring-[#8C5CF7]/30 h-14 pl-4 pr-12 rounded-xl transition-all duration-300 hover:border-[#8C5CF7]/30 disabled:opacity-50 text-base text-[#FFFFFF] placeholder-[#5A5A64]"
                placeholder="Enter your password"
              />
              <button
                type="button" onClick={() => setShowPassword(s => !s)} disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A8] hover:text-[#8C5CF7] transition-colors p-1 rounded-md hover:bg-[#202126]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit" disabled={isLoading}
            className={`w-full h-14 text-base font-semibold rounded-xl transition-all duration-300 border shadow-lg text-white ${
              isLoading
                ? "bg-[#1A1B1F] border-[#8C5CF7]/30 cursor-not-allowed"
                : "bg-gradient-to-r from-[#8C5CF7] to-[#3B1F82] hover:from-[#3B1F82] hover:to-[#8C5CF7] border-[#8C5CF7]/30 shadow-[#8C5CF7]/20 hover:shadow-xl hover:shadow-[#8C5CF7]/30"
            }`}
          >
            {isLoading
              ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" />Signing you in...</>
              : <><Lock className="mr-3 h-5 w-5" />Sign In</>}
          </Button>

          {isLoading && (
            <div className="text-center">
              <p className="text-xs text-[#8C5CF7] animate-pulse">Please wait while we sign you in...</p>
            </div>
          )}

          <div className="text-center pt-2">
            <Link href="/forgot-password" className="text-sm text-[#A0A0A8] hover:text-[#8C5CF7] transition-colors underline-offset-4 hover:underline font-medium">
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: Step 2 — 2FA code entry
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.22)" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}>
          <Smartphone className="w-5 h-5 text-[#8C5CF7]" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#E0E0E0]">Two-factor authentication</p>
          <p className="text-xs text-[#A0A0A8] mt-0.5">Enter the 6-digit code from your authenticator app</p>
        </div>
      </div>

      {error && (
        <div className="bg-[#1A1B1F] border border-[#EF4444]/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#EF4444] animate-pulse" />
            <p className="text-sm text-[#E0E0E0] font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* OTP boxes */}
      <OtpInput value={otpCode} onChange={setOtpCode} />

      <p className="text-xs text-center text-[#5A5A64]">
        The code refreshes every 30 seconds — use the current one shown in your app
      </p>

      <Button
        onClick={handleVerify2FA}
        disabled={verifying || otpCode.length !== 6}
        className="w-full h-14 text-base font-semibold rounded-xl transition-all duration-300 border text-white bg-gradient-to-r from-[#8C5CF7] to-[#3B1F82] hover:from-[#3B1F82] hover:to-[#8C5CF7] border-[#8C5CF7]/30 shadow-[#8C5CF7]/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {verifying
          ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" />Verifying...</>
          : <><Lock className="mr-3 h-5 w-5" />Confirm & sign in</>}
      </Button>

      <button
        onClick={handleBack}
        className="w-full flex items-center justify-center gap-2 text-sm text-[#A0A0A8] hover:text-[#8C5CF7] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to sign in
      </button>
    </div>
  )
}