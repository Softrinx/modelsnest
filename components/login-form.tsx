"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { login } from "@/app/actions/auth"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

const ADMIN_EMAILS = ["admin@outsoor.com"]

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setIsLoading(false)
        setError("Request timed out. Please try again.")
      }, 30000) // 30 second timeout
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isLoading])

  async function handleSubmit(formData: FormData) {
    console.log("Starting login process...")
    setIsLoading(true)
    setError(null)

    try {
      console.log("Calling login action...")
      const result = await supabase.auth.signInWithPassword({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      })
      console.log("Login result:", result)

      if (result.error) {
        console.log("Login failed with error:", result.error)
        setError(result.error.message)
        setIsLoading(false)
      } else {
        const loggedInEmail = result.data.user?.email?.toLowerCase()
        const redirectPath = loggedInEmail && ADMIN_EMAILS.includes(loggedInEmail)
          ? "/admin"
          : "/dashboard"

        console.log("Login successful, redirecting to:", redirectPath)
        setIsLoading(false)
        router.push(redirectPath)
        router.refresh()
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className={`w-full max-w-md mx-auto transition-all duration-300 ${isLoading ? 'opacity-90' : 'opacity-100'}`}>
      <form onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        handleSubmit(formData)
      }} className="space-y-6">
        {error && (
          <div className="bg-[#1A1B1F] border border-[#EF4444]/30 rounded-xl p-4 hover:shadow-lg hover:shadow-[#EF4444]/10 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#EF4444] animate-pulse"></div>
              <p className="text-sm text-[#E0E0E0] font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-semibold text-[#E0E0E0] flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#8C5CF7]" />
            Email Address
          </Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              required
              disabled={isLoading}
              className="bg-[#1A1B1F] border border-[#202126] focus:border-[#8C5CF7]/60 focus:ring-[#8C5CF7]/30 h-14 pl-4 pr-4 rounded-xl transition-all duration-300 hover:border-[#8C5CF7]/30 disabled:opacity-50 disabled:cursor-not-allowed text-base text-[#FFFFFF] placeholder-[#5A5A64]"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="password" className="text-sm font-semibold text-[#E0E0E0] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#8C5CF7]" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              disabled={isLoading}
              className="bg-[#1A1B1F] border border-[#202126] focus:border-[#8C5CF7]/60 focus:ring-[#8C5CF7]/30 h-14 pl-4 pr-12 rounded-xl transition-all duration-300 hover:border-[#8C5CF7]/30 disabled:opacity-50 disabled:cursor-not-allowed text-base text-[#FFFFFF] placeholder-[#5A5A64]"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A8] hover:text-[#8C5CF7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed p-1 rounded-md hover:bg-[#202126]"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className={`w-full h-14 text-base font-semibold rounded-xl transition-all duration-300 border shadow-lg text-white ${
            isLoading 
              ? 'bg-[#1A1B1F] border-[#8C5CF7]/30 shadow-[#8C5CF7]/10 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#8C5CF7] to-[#3B1F82] hover:from-[#3B1F82] hover:to-[#8C5CF7] border-[#8C5CF7]/30 shadow-[#8C5CF7]/20 hover:shadow-xl hover:shadow-[#8C5CF7]/30'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Signing you in...
            </>
          ) : (
            <>
              <Lock className="mr-3 h-5 w-5" />
              Sign In
            </>
          )}
        </Button>
        
        {isLoading && (
          <div className="text-center">
            <p className="text-xs text-[#8C5CF7] animate-pulse">
              Please wait while we sign you in...
            </p>
          </div>
        )}

        <div className="text-center pt-2">
          <Link
            href="/forgot-password"
            className="text-sm text-[#A0A0A8] hover:text-[#8C5CF7] transition-colors underline-offset-4 hover:underline font-medium"
          >
            Forgot your password?
          </Link>
        </div>
      </form>
    </div>
  )
}
