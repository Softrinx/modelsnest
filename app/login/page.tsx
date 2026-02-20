"use client"

import { LoginForm } from "@/components/login-form"
import { OutsoorLogo } from "@/components/outsoor-logo"
import Link from "next/link"
import { Brain, Zap, Shield, Globe, Code, Sparkles, Sun, Moon, Check, ArrowRight } from "lucide-react"
import { useTheme } from "@/contexts/themeContext"

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const { isDark, setMode } = useTheme()

  const bg     = isDark ? "#0D0D0F" : "#f8f8f6"
  const card   = isDark ? "#1A1B1F" : "#ffffff"
  const border = isDark ? "#202126" : "#e2e2e0"
  const text   = isDark ? "#ffffff" : "#0a0a0b"
  const muted  = isDark ? "#A0A0A8" : "#52525b"
  const subtle = isDark ? "#5A5A64" : "#a1a1aa"

  const apiModels = [
    { name: "GPT-4 Turbo",       description: "Enhanced reasoning & vision",      icon: Brain,    color: "#6366f1" },
    { name: "Claude 3.5 Sonnet", description: "Anthropic's most capable model",   icon: Sparkles, color: "#8b5cf6" },
    { name: "Gemini Pro",        description: "Google's advanced AI model",        icon: Zap,      color: "#f59e0b" },
    { name: "Llama 3.1 405B",   description: "Meta's open-source powerhouse",     icon: Code,     color: "#10b981" },
    { name: "DALL-E 3",          description: "Text-to-image generation",          icon: Globe,    color: "#ec4899" },
    { name: "Whisper v3",        description: "Audio transcription & translation", icon: Shield,   color: "#06b6d4" },
  ]

  const perks = [
    "One API key for every model",
    "No subscriptions — pay as you go",
    "Sub-200ms median latency",
    "Enterprise SLA & SOC 2 compliance",
  ]

  const testimonial = {
    quote: "Outsoor cut our AI integration time from weeks to hours. One key, every model.",
    author: "Sarah Chen",
    role: "CTO at Buildfast",
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: bg }}>
      {/* Input override for light mode — forces form inputs to be light */}
      {!isDark && (
        <style>{`
          input, textarea, select {
            background-color: #ffffff !important;
            color: #0a0a0b !important;
            border-color: #e2e2e0 !important;
          }
          input::placeholder, textarea::placeholder {
            color: #a1a1aa !important;
          }
          label, [class*="label"] {
            color: #0a0a0b !important;
          }
          [class*="form"] p, [class*="form"] span {
            color: #52525b !important;
          }
        `}</style>
      )}

      {/* Bg glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: isDark
          ? "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 50%)"
          : "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.04) 0%, transparent 60%)",
      }} />

      {/* ── MOBILE ── */}
      <div className="lg:hidden relative z-10 min-h-screen flex flex-col">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${border}` }}>
          <Link href="/"><OutsoorLogo className="h-8 w-auto" /></Link>
          <div className="flex items-center gap-3">
            <button onClick={() => setMode(isDark ? "light" : "dark")}
              className="w-9 h-9 flex items-center justify-center"
              style={{ border: `1px solid ${border}`, background: card }}>
              {isDark ? <Sun className="w-4 h-4" style={{ color: muted }} /> : <Moon className="w-4 h-4" style={{ color: muted }} />}
            </button>
            <Link href="/signup" className="text-xs font-semibold px-3 py-2"
              style={{ border: `1px solid var(--color-primary)`, color: "var(--color-primary)" }}>
              Sign up
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-px" style={{ background: border, borderBottom: `1px solid ${border}` }}>
          {[
            { n: "50+",    l: "AI Models",  color: "var(--color-primary)" },
            { n: "<200ms", l: "Latency",    color: "#10b981" },
            { n: "99.99%", l: "Uptime",     color: "#10b981" },
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
              <h1 className="text-2xl font-black mb-1" style={{ letterSpacing: "-0.04em", color: text }}>Welcome back</h1>
              <p className="text-sm mb-7" style={{ color: muted }}>Sign in to access your dashboard and API keys.</p>
              <LoginForm />
              <div className="mt-5 text-center">
                <p className="text-sm" style={{ color: muted }}>
                  Don't have an account?{" "}
                  <Link href="/signup" className="font-medium hover:underline underline-offset-4"
                    style={{ color: "var(--color-primary)" }}>Sign up</Link>
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
          <button onClick={() => setMode(isDark ? "light" : "dark")}
            className="w-9 h-9 flex items-center justify-center"
            style={{ border: `1px solid ${border}`, background: card }}>
            {isDark ? <Sun className="w-4 h-4" style={{ color: muted }} /> : <Moon className="w-4 h-4" style={{ color: muted }} />}
          </button>
        </div>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

              {/* LEFT */}
              <div className="space-y-8">
                <Link href="/"><OutsoorLogo className="h-10 w-auto" /></Link>

                <div className="space-y-4">
                  <h1 className="text-5xl font-black leading-tight" style={{ letterSpacing: "-0.04em", color: text }}>
                    Welcome back.<br />
                    <span style={{ color: "var(--color-primary)" }}>Keep building.</span>
                  </h1>
                  <p className="text-base leading-relaxed max-w-sm" style={{ color: muted }}>
                    50+ AI models through one API. GPT-4, Claude, Llama, DALL-E, Whisper and more — at $0.001 per 1K tokens.
                  </p>
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

                {/* Model grid — 3 cols, 2 rows */}
                <div className="space-y-2">
                  <p className="text-xs font-mono uppercase tracking-widest" style={{ color: muted, opacity: 0.6 }}>Available models</p>
                  <div className="grid grid-cols-3 gap-px" style={{ background: border, border: `1px solid ${border}` }}>
                    {apiModels.map((model) => (
                      <div key={model.name} className="flex flex-col gap-2 p-4" style={{ background: card }}>
                        <div className="w-8 h-8 flex items-center justify-center"
                          style={{ background: `${model.color}18`, border: `1px solid ${model.color}30` }}>
                          <model.icon className="w-4 h-4" style={{ color: model.color }} />
                        </div>
                        <div>
                          <div className="text-xs font-bold" style={{ color: text }}>{model.name}</div>
                          <div className="text-xs mt-0.5" style={{ color: muted, opacity: 0.7 }}>{model.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


                {/* Stats */}
                <div className="grid grid-cols-4 gap-px" style={{ background: border, border: `1px solid ${border}` }}>
                  {[
                    { n: "50+",    l: "AI Models",      color: "var(--color-primary)" },
                    { n: "<200ms", l: "Latency",         color: "#10b981" },
                    { n: "99.99%", l: "Uptime",          color: "#10b981" },
                    { n: "$0.001", l: "Per 1K tokens",   color: "#f59e0b" },
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
                    <h2 className="text-2xl font-black" style={{ letterSpacing: "-0.04em", color: text }}>Sign in</h2>
                    <p className="text-sm mt-1" style={{ color: muted }}>Access your dashboard, API keys, and usage analytics.</p>
                  </div>
                  <LoginForm />
                  <div className="mt-6 text-center">
                    <p className="text-sm" style={{ color: muted }}>
                      Don't have an account?{" "}
                      <Link href="/signup" className="font-medium hover:underline underline-offset-4"
                        style={{ color: "var(--color-primary)" }}>Sign up</Link>
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