"use client"

import Link from "next/link"
import { ArrowLeft, Sun, Moon } from "lucide-react"
import { useTheme } from "@/contexts/themeContext"

interface PageTopBarProps {
  backLabel?: string
  backHref?: string
  breadcrumb?: string
}

export function PageTopBar({
  backLabel = "Back to Outsoor",
  backHref = "/",
  breadcrumb,
}: PageTopBarProps) {
  const { isDark, setMode } = useTheme()

  return (
    <div style={{ borderBottom: "1px solid var(--color-border)" }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm transition-colors duration-150"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>

        <div className="flex items-center gap-4">
          {breadcrumb && (
            <span className="text-xs hidden sm:block" style={{ color: "var(--color-text-muted)", opacity: 0.5 }}>
              {breadcrumb}
            </span>
          )}
          <button
            onClick={() => setMode(isDark ? "light" : "dark")}
            className="w-8 h-8 flex items-center justify-center transition-colors duration-150"
            style={{
              border: "1px solid var(--color-border)",
              color: "var(--color-text-muted)",
              background: "transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}