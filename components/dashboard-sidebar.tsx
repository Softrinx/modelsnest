"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  MessageSquare, 
  Settings, 
  ChevronLeft, 
  Search, 
  Key, 
  User, 
  CreditCard, 
  Bot,
  Home,
  Hash,
  Users,
  Bell,
  Shield,
  Brain,
  Plus
} from "lucide-react"
import { OutsoorLogo, OutsoorLogoCompact } from "@/components/outsoor-logo"
import type { DashboardUser } from "@/types/dashboard-user"

interface DashboardSidebarProps {
  user: DashboardUser
  onSidebarToggle?: (isCollapsed: boolean) => void
}

interface UserCredits {
  balance: number
  total_spent: number
  total_topped_up: number
}

export function DashboardSidebar({ user, onSidebarToggle }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true) // Start collapsed on mobile
  const [credits, setCredits] = useState<UserCredits | null>(null)
  const pathname = usePathname()

  // Auto-collapse on mobile, expand on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      } else {
        setIsCollapsed(false)
      }
    }

    // Set initial state
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Notify parent component when sidebar state changes
  useEffect(() => {
    onSidebarToggle?.(isCollapsed)
  }, [isCollapsed, onSidebarToggle])

  // Fetch user credits
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const creditsRes = await fetch("/api/user/credits")
        if (creditsRes.ok) {
          const creditsData = await creditsRes.json()
          if (creditsData.success) {
            setCredits(creditsData.credits)
          }
        }
      } catch (error) {
        console.error("Failed to fetch user credits:", error)
      }
    }

    fetchCredits()
  }, [])

  const refreshCredits = async () => {
    try {
      const creditsRes = await fetch("/api/user/credits")
      if (creditsRes.ok) {
        const creditsData = await creditsRes.json()
        if (creditsData.success) {
          setCredits(creditsData.credits)
        }
      }
    } catch (error) {
      console.error("Failed to refresh user credits:", error)
    }
  }

  const mainItems = [
    {
      icon: Bot,
      label: "Dashboard",
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      icon: Brain,
      label: "Models",
      href: "/dashboard/models",
      active: pathname === "/dashboard/models",
    },
    {
      icon: Hash,
      label: "APIs",
      href: "/dashboard/apis",
      active: pathname === "/dashboard/apis",
    },
    {
      icon: Users,
      label: "Billing",
      href: "/dashboard/billing",
      active: pathname === "/dashboard/billing",
    },
  ]

  const toolsItems = [
    {
      icon: Bell,
      label: "Notifications",
      href: "/dashboard/notifications",
      active: pathname === "/dashboard/notifications",
    },
    {
      icon: Shield,
      label: "Security",
      href: "/dashboard/security",
      active: pathname === "/dashboard/security",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ]

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-[#1a1b1f] to-[#111113] border-r border-[#2d2d32] transition-all duration-300 ease-in-out z-50 ${
        isCollapsed ? "w-[70px] rounded-r-2xl" : "w-[250px] rounded-r-2xl"
      }`}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 border-b border-[#2d2d32]">
        {!isCollapsed ? (
          <OutsoorLogo size="md" variant="sidebar" />
        ) : (
          <OutsoorLogoCompact />
        )}
        
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className="p-2 text-[#d1d5db] hover:text-white hover:bg-[#2d2d32] rounded-lg transition-all duration-200"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {/* Search Section */}
      <div className="p-3 border-b border-[#2d2d32]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
          <Input
            placeholder={isCollapsed ? "" : "Search..."}
            className={`pl-10 bg-[#2d2d32] border-[#2d2d32] text-[#d1d5db] placeholder-[#9ca3af] focus:border-[#6d28d9] focus:ring-[#6d28d9]/20 transition-all duration-200 ${
              isCollapsed ? "w-10 h-10 p-0" : "w-full"
            }`}
          />
        </div>
      </div>

      {/* Main Navigation */}
      <div className="p-3">
        <div className="space-y-1">
          {mainItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#d1d5db] hover:text-white hover:bg-[#2d2d32] transition-all duration-200 group ${
                item.active ? "bg-[#6d28d9] text-white" : ""
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium truncate">{item.label}</span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Tools Section */}
      <div className="p-3 border-t border-[#2d2d32]">
        <div className="space-y-1">
          {toolsItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#d1d5db] hover:text-white hover:bg-[#2d2d32] transition-all duration-200 group ${
                item.active ? "bg-[#6d28d9] text-white" : ""
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium truncate">{item.label}</span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Credits Section - Above User Profile */}
      {credits && (
        <div className="absolute bottom-20 left-0 right-0 p-3 border-t border-[#2d2d32] bg-gradient-to-b from-transparent to-[#111113]">
          {/* Credits Display */}
          <div 
            className={`flex items-center gap-2 px-3 py-2 bg-[#1A1B1F] border border-[#2D2D32] rounded-lg cursor-pointer hover:bg-[#2D2D32] transition-colors duration-200 mb-3 ${
              isCollapsed ? "justify-center" : ""
            }`}
            onClick={refreshCredits}
            title="Click to refresh"
          >
            <div className="w-2 h-2 bg-[#00ff88] rounded-full flex-shrink-0"></div>
            {!isCollapsed && (
              <span className="text-sm text-[#A0A0A8] truncate">
                ${credits.balance.toFixed(2)} available
              </span>
            )}
          </div>
          
          {/* Add Credit Button */}
          <Link href="/dashboard/billing" className="block">
            <Button 
              variant="outline" 
              size="sm" 
              className={`w-full border-[#8C5CF7]/30 text-[#8C5CF7] hover:bg-[#8C5CF7]/10 hover:border-[#8C5CF7]/50 ${
                isCollapsed ? "px-2" : ""
              }`}
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="ml-2">Add Credit</span>}
            </Button>
          </Link>
        </div>
      )}

      {/* User Profile Section - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[#2d2d32] bg-gradient-to-b from-transparent to-[#111113]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#6d28d9] to-[#8b5cf6] rounded-lg flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[#d1d5db] truncate">{user.name}</div>
              <div className="text-xs text-[#9ca3af] truncate">{user.email}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
