"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Terminal, X } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import { OutsoorLogo } from "@/components/outsoor-logo"
import { useTheme } from "@/contexts/themeContext"

interface AuthUser {
  id: string
  email: string
  name: string | null
}

const navItems = [
  { name: "APIs",       href: "#apis" },
  { name: "Pricing",    href: "#pricing" },
  { name: "Docs",       href: "#docs" },
  { name: "Enterprise", href: "#enterprise" },
]

function scrollTo(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault()
  document.getElementById(href.substring(1))?.scrollIntoView({ behavior: "smooth" })
}

export function Header() {
  const { isDark, setMode } = useTheme()
  const [user, setUser]       = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { setUser(data?.user || null); setLoading(false) })
      .catch(() => { setUser(null); setLoading(false) })
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header
      className="w-full fixed top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? `color-mix(in srgb, var(--color-surface-1) 90%, transparent)`
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid var(--color-border)` : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Left — logo + nav */}
        <div className="flex items-center gap-10">
          <OutsoorLogo size="lg" variant="header" />

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollTo(e, item.href)}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150"
                style={{ color: "var(--color-text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Right — theme toggle + auth */}
        <div className="flex items-center gap-3">

          {/* Theme toggle */}
          <button
            onClick={() => setMode(isDark ? "light" : "dark")}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-150"
            style={{
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-muted)",
            }}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Auth — desktop */}
          <div className="hidden md:flex items-center gap-2">
            {loading ? (
              <div className="w-20 h-8 rounded-lg animate-pulse" style={{ background: "var(--color-surface-2)" }} />
            ) : user ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-sm font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    Dashboard
                  </Button>
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="text-sm font-semibold px-4"
                    style={{
                      background: "var(--color-primary)",
                      color: "#fff",
                    }}
                  >
                    Sign Up Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                style={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              >
                {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 p-6 flex flex-col gap-6"
              style={{
                background: "var(--color-surface-1)",
                borderLeft: "1px solid var(--color-border)",
              }}
            >
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => { scrollTo(e, item.href); setOpen(false) }}
                    className="px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>

              <div className="border-t flex flex-col gap-2 pt-6" style={{ borderColor: "var(--color-border)" }}>
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                        <Terminal className="w-4 h-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <LogoutButton />
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full text-sm">Sign In</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setOpen(false)}>
                      <Button
                        className="w-full text-sm font-semibold"
                        style={{ background: "var(--color-primary)", color: "#fff" }}
                      >
                        Sign Up Free
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}