"use client"

import { useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface LogoutButtonProps {
  collapsed?: boolean
}

export function LogoutButton({ collapsed = false }: LogoutButtonProps) {
  const supabase = createClient()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      localStorage.removeItem("activeAccount")
      await supabase.auth.signOut()
      router.push("/login")
    })
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isPending}
      variant="ghost"
      size="sm"
      className={`hover:bg-white/10 ${collapsed ? "w-full justify-center px-0" : ""}`}
      title={collapsed ? "Logout" : undefined}
    >
      <LogOut className={`h-4 w-4 ${!collapsed ? "mr-2" : ""}`} />
      {!collapsed && "Logout"}
    </Button>
  )
}

