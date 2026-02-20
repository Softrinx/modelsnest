"use client"

import { useEffect, useRef, useState } from "react"
import { OutsoorLogo } from "@/components/outsoor-logo"

function LottieLoader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let anim: any
    let cancelled = false

    import("lottie-web").then((lottie) => {
      if (cancelled || !containerRef.current) return
      anim = lottie.default.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/animations/loading.json",
      })
      anim.addEventListener("DOMLoaded", () => {
        if (!cancelled) setLoaded(true)
      })
    })

    return () => {
      cancelled = true
      anim?.destroy()
    }
  }, [])

  return (
    <div className="relative w-24 h-24">
      {/* Fallback spinner while lottie fetches */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{
              borderColor: "var(--color-border)",
              borderTopColor: "var(--color-primary)",
            }}
          />
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
      />
    </div>
  )
}

export default function Loading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8"
      style={{ background: "var(--color-bg)" }}
    >
      <OutsoorLogo size="xl" variant="header" />
      <LottieLoader />
      <p
        className="text-sm font-mono"
        style={{ color: "var(--color-text-muted)" }}
      >
        Loading...
      </p>
    </div>
  )
}