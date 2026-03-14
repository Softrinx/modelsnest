"use client"

import { SignupForm } from "@/components/signup-form"
import { ModelsnestLogo } from "@/components/Modelsnest-logo"
import Link from "next/link"
import { Brain, Zap, Shield, Globe, Code, Sparkles, Sun, Moon, Check } from "lucide-react"
import { useTheme } from "@/contexts/themeContext"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export const dynamic = 'force-dynamic'

function LottieAnimation() {
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
        path: "/animations/hero-animation.json",
      })
      anim.addEventListener("DOMLoaded", () => { if (!cancelled) setLoaded(true) })
    })
    return () => { cancelled = true; anim?.destroy() }
  }, [])

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-primary)" }} />
        </div>
      )}
      <div ref={containerRef} className="w-full h-full"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }} />
    </div>
  )
}

export default function SignupPage() {
  const { isDark, setMode } = useTheme()

  const bg     = isDark ? "#0D0D0F" : "#f8f8f6"
  const card   = isDark ? "#1A1B1F" : "#ffffff"
  const border = isDark ? "#202126" : "#e2e2e0"
  const text   = isDark ? "#ffffff" : "#0a0a0b"
  const muted  = isDark ? "#A0A0A8" : "#52525b"
  const subtle = isDark ? "#5A5A64" : "#a1a1aa"

  const apiModels = [
    { name: "GPT-4 Turbo",       icon: Brain,    color: "#6366f1" },
    { name: "Claude 3.5 Sonnet", icon: Sparkles, color: "#8b5cf6" },
    { name: "Gemini Pro",        icon: Zap,      color: "#f59e0b" },
    { name: "Llama 3.1 405B",   icon: Code,     color: "#10b981" },
    { name: "DALL-E 3",          icon: Globe,    color: "#ec4899" },
    { name: "Whisper v3",        icon: Shield,   color: "#06b6d4" },
  ]

  const perks = [
    "No credit card required",
    "Access all 50+ models instantly",
    "Cancel or upgrade anytime",
  ]

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: bg }}>
      {!isDark && (
        <style>{`
          input, textarea, select {
            background-color: #ffffff !important;
            color: #0a0a0b !important;
            border-color: #e2e2e0 !important;
          }
          input::placeholder, textarea::placeholder { color: #a1a1aa !important; }
          label { color: #0a0a0b !important; }
        `}</style>
      )}

      {/* ── MOBILE ── */}
      <div className="lg:hidden relative z-10 min-h-screen flex flex-col">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${border}` }}>
          <Link href="/"><ModelsnestLogo className="h-8 w-auto" /></Link>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setMode(isDark ? "light" : "dark")}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 flex items-center justify-center"
              style={{ border: `1px solid var(--color-primary)`, background: "color-mix(in srgb, var(--color-primary) 10%, transparent)" }}>
              <motion.div
                key={isDark ? "sun" : "moon"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}>
                {isDark ? <Sun className="w-4 h-4" style={{ color: "var(--color-primary)" }} /> : <Moon className="w-4 h-4" style={{ color: "var(--color-primary)" }} />}
              </motion.div>
            </motion.button>
            <Link href="/login" className="text-xs font-semibold px-3 py-2"
              style={{ border: `1px solid var(--color-primary)`, color: "var(--color-primary)" }}>
              Sign in
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-px" style={{ background: border, borderBottom: `1px solid ${border}` }}>
          {[
            { n: "50+",  l: "AI Models",  color: "var(--color-primary)" },
            { n: "10K",  l: "Free calls", color: "#10b981" },
            { n: "Free", l: "To start",   color: "#f59e0b" },
          ].map(s => (
            <div key={s.l} className="flex flex-col items-center py-4" style={{ background: bg }}>
              <span className="font-black font-mono text-xl" style={{ color: s.color, letterSpacing: "-0.04em" }}>{s.n}</span>
              <span className="text-xs mt-0.5" style={{ color: muted }}>{s.l}</span>
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center px-5 py-8">
          <div className="w-full max-w-sm mx-auto">
            <div className="p-7" style={{ background: card, border: `1px solid ${border}` }}>
              <h1 className="text-2xl font-black mb-1" style={{ letterSpacing: "-0.04em", color: text }}>Create account</h1>
              <p className="text-sm mb-7" style={{ color: muted }}>10,000 free calls. No credit card needed.</p>
              <SignupForm />
              <div className="mt-5 text-center">
                <p className="text-sm" style={{ color: muted }}>
                  Already have an account?{" "}
                  <Link href="/login" className="font-medium hover:underline underline-offset-4"
                    style={{ color: "var(--color-primary)" }}>Sign in</Link>
                </p>
              </div>
              <div className="mt-3 text-center">
                <Link href="/" className="text-xs hover:underline underline-offset-4" style={{ color: subtle }}>← Back to home</Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${border}` }}>
          <div className="px-5 py-5 flex flex-col gap-2.5">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-3">
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0"
                  style={{ background: "color-mix(in srgb, var(--color-primary) 15%, transparent)", border: "1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)" }}>
                  <Check className="w-2.5 h-2.5" style={{ color: "var(--color-primary)" }} />
                </div>
                <span className="text-xs" style={{ color: muted }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden lg:block relative z-10 min-h-screen">

        <div className="absolute top-5 right-6 z-20">
          <motion.button
            onClick={() => setMode(isDark ? "light" : "dark")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold"
            style={{
              border: `1px solid var(--color-primary)`,
              background: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
              color: "var(--color-primary)",
            }}>
            <motion.div
              key={isDark ? "sun" : "moon"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}>
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </motion.div>
            {isDark ? "Light mode" : "Dark mode"}
          </motion.button>
        </div>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

              {/* LEFT */}
              <div className="space-y-8">
                <Link href="/"><ModelsnestLogo className="h-10 w-auto" /></Link>

                <div className="space-y-3">
                  <h1 className="text-5xl font-black leading-tight" style={{ letterSpacing: "-0.04em", color: text }}>
                    Build the future.<br />
                    <span style={{ color: "var(--color-primary)" }}>Start for free.</span>
                  </h1>
                  <p className="text-base leading-relaxed max-w-sm" style={{ color: muted }}>
                    Join thousands of developers using 50+ AI models through one unified API. No vendor lock-in, transparent pricing.
                  </p>
                </div>

                {/* Lottie */}
                <div style={{ height: 220, width: "100%" }}>
                  <LottieAnimation />
                </div>

                {/* Model pills */}
                <div className="space-y-2">
                  <p className="text-xs font-mono uppercase tracking-widest" style={{ color: muted, opacity: 0.55 }}>Available models</p>
                  <div className="flex flex-wrap gap-2">
                    {apiModels.map((m) => (
                      <div key={m.name} className="flex items-center gap-2 px-3 py-1.5"
                        style={{ background: `${m.color}14`, border: `1px solid ${m.color}30` }}>
                        <m.icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                        <span className="text-xs font-medium" style={{ color: text }}>{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Perks */}
                <div className="flex flex-col gap-2.5">
                  {perks.map(p => (
                    <div key={p} className="flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                        style={{ background: "color-mix(in srgb, var(--color-primary) 15%, transparent)", border: "1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)" }}>
                        <Check className="w-3 h-3" style={{ color: "var(--color-primary)" }} />
                      </div>
                      <span className="text-sm font-medium" style={{ color: muted }}>{p}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-px" style={{ background: border, border: `1px solid ${border}` }}>
                  {[
                    { n: "50+",  l: "AI Models",  color: "var(--color-primary)" },
                    { n: "10K",  l: "Free calls", color: "#10b981" },
                    { n: "<200ms", l: "Latency",  color: "#06b6d4" },
                    { n: "99.99%", l: "Uptime",   color: "#10b981" },
                  ].map(s => (
                    <div key={s.l} className="flex flex-col items-center py-4" style={{ background: card }}>
                      <div className="text-lg font-black font-mono" style={{ color: s.color, letterSpacing: "-0.04em" }}>{s.n}</div>
                      <div className="text-xs mt-0.5 text-center" style={{ color: muted }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — form */}
              <div className="w-full max-w-md mx-auto lg:mx-0">
                <div className="p-8" style={{ background: card, border: `1px solid ${border}` }}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-black" style={{ letterSpacing: "-0.04em", color: text }}>Create account</h2>
                    <p className="text-sm mt-1" style={{ color: muted }}>10,000 free API calls. No credit card required.</p>
                  </div>
                  <SignupForm />
                  <div className="mt-6 text-center">
                    <p className="text-sm" style={{ color: muted }}>
                      Already have an account?{" "}
                      <Link href="/login" className="font-medium hover:underline underline-offset-4"
                        style={{ color: "var(--color-primary)" }}>Sign in</Link>
                    </p>
                  </div>
                  <div className="mt-3 text-center">
                    <Link href="/" className="text-xs hover:underline underline-offset-4" style={{ color: subtle }}>← Back to home</Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}