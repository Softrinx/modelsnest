"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// List of admin emails - must match the one in admin-auth.ts
const ADMIN_EMAILS = ["admin@outsoor.com"]

export function AdminLoginForm() {
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
    console.log("Starting admin login process...")
    setIsLoading(true)
    setError(null)

    try {
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      // Check if email is authorized as admin
      if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
        setError("Invalid admin credentials")
        setIsLoading(false)
        return
      }

      console.log("Calling Supabase login...")
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      console.log("Login result:", result)

      if (result.error) {
        console.log("Login failed with error:", result.error)
        setError(result.error.message || "Invalid credentials")
        setIsLoading(false)
      } else if (result.data?.user) {
        console.log("Login successful, redirecting...")
        setIsLoading(false)
        router.push("/admin")
        router.refresh()
      }
    } catch (error) {
      console.error("Admin login error:", error)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111113] p-4">
      <Card className="w-full max-w-md bg-[#1a1b1f] border-[#2d2d32] text-white">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-[#8C5CF7]/10">
              <Lock className="w-6 h-6 text-[#8C5CF7]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            handleSubmit(formData)
          }} className="space-y-4">
            {error && (
              <div className="bg-[#1A1B1F] border border-[#EF4444]/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444] animate-pulse"></div>
                  <p className="text-sm text-[#E0E0E0] font-medium">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8C5CF7]" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@outsoor.com"
                required
                disabled={isLoading}
                className="bg-[#2d2d32] border-none text-white placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
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
                  className="bg-[#2d2d32] border-none text-white pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#8C5CF7] hover:bg-[#7a4ee3] text-white transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Access Admin Panel"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

