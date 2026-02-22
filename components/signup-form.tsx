"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { signup } from "@/app/actions/auth"
import { Loader2, User, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function SignupForm() {
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
    console.log("Starting signup process...")
    setIsLoading(true)
    setError(null)

    try {
      console.log("Calling signup action...")
      const result = await supabase.auth.signUp({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        options: {
          data: {
            name: formData.get("name") as string,
          },
        },
      })
      console.log("Signup result:", result)

      if (result.error) {
        console.log("Signup failed with error:", result.error)
        setError(result.error.message)
        setIsLoading(false)
      } else {
        const userId = result.data.user?.id
        const hasSession = Boolean(result.data.session)

        if (userId && hasSession) {
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert({ id: userId }, { onConflict: "id" })

          if (profileError) {
            console.error("Profile creation error:", profileError)
            setError("Account created, but profile setup failed. Please try signing in again.")
            setIsLoading(false)
            return
          }
        }

        console.log("Signup successful, redirecting...")
        setIsLoading(false)
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Signup error:", error)
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
          <Label htmlFor="name" className="text-sm font-semibold text-[#E0E0E0] flex items-center gap-2">
            <User className="w-4 h-4 text-[#8C5CF7]" />
            Full Name
          </Label>
          <div className="relative">
            <Input
              id="name"
              name="name"
              type="text"
              required
              disabled={isLoading}
              className="bg-[#1A1B1F] border border-[#202126] focus:border-[#8C5CF7]/60 focus:ring-[#8C5CF7]/30 h-14 pl-4 pr-4 rounded-xl transition-all duration-300 hover:border-[#8C5CF7]/30 disabled:opacity-50 disabled:cursor-not-allowed text-base text-[#FFFFFF] placeholder-[#5A5A64]"
              placeholder="Enter your full name"
            />
          </div>
        </div>

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
              placeholder="Create a secure password"
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
          <p className="text-xs text-[#5A5A64]">Minimum 8 characters required</p>
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
              <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#8C5CF7]" />
              <span className="text-[#8C5CF7]">Creating your account...</span>
            </>
          ) : (
            <>
              <Shield className="mr-3 h-5 w-5" />
              Create Account
            </>
          )}
        </Button>
        
        {isLoading && (
          <div className="text-center">
            <p className="text-xs text-[#8C5CF7] animate-pulse">
              Please wait while we set up your account...
            </p>
          </div>
        )}

        <div className="text-center pt-2">
          <p className="text-xs text-[#5A5A64]">
            By creating an account, you agree to our{" "}
            <button className="text-[#8C5CF7] hover:text-[#C85CFA] hover:underline underline-offset-4 font-medium">Terms of Service</button> and{" "}
            <button className="text-[#8C5CF7] hover:text-[#C85CFA] hover:underline underline-offset-4 font-medium">Privacy Policy</button>
          </p>
        </div>
      </form>
    </div>
  )
}
