"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/themeContext"
import { useSidebar } from "@/components/dashboard-layout-controller"
import Link from "next/link"
import {
  Search, Bot, Mic, Video, Brain, Radio, Zap,
  BookOpen, Code2, ArrowRight, ExternalLink, CreditCard,
  ChevronRight, Sparkles
} from "lucide-react"
import type { DashboardUser } from "@/types/dashboard-user"

interface ModelsDocsIndexProps { user: DashboardUser }

interface ModelDoc {
  slug: string; name: string; provider: string; category: string
  description: string; features: string[]
  pricing: { input: string; output: string; unit: string }
  badge?: string
}

const MODELS: ModelDoc[] = [
  { slug: "gpt-4-turbo",    name: "GPT-4 Turbo",    provider: "OpenAI",    category: "conversational", badge: "Popular",
    description: "Advanced conversational AI with deep context understanding, code generation and creative writing.",
    features: ["Context Memory", "Multi-turn", "Code Gen", "Vision"],
    pricing: { input: "0.010", output: "0.030", unit: "1K tokens" } },
  { slug: "claude-3-opus",  name: "Claude 3 Opus",  provider: "Anthropic", category: "conversational",
    description: "High-performance model with enhanced logical reasoning, document analysis and problem solving.",
    features: ["Reasoning", "Doc Analysis", "Creative", "Safe"],
    pricing: { input: "0.015", output: "0.075", unit: "1K tokens" } },
  { slug: "gemini-pro",     name: "Gemini Pro",     provider: "Google",    category: "conversational", badge: "New",
    description: "Google's multimodal AI with real-time knowledge integration and strong cross-task performance.",
    features: ["Multimodal", "Real-time", "Multilingual", "Safe"],
    pricing: { input: "0.0025", output: "0.010", unit: "1K tokens" } },
  { slug: "whisper-v3",     name: "Whisper V3",     provider: "OpenAI",    category: "voice",
    description: "State-of-the-art speech recognition with noise reduction and 99 language support.",
    features: ["99 Languages", "Noise Reduction", "Timestamps", "Real-time"],
    pricing: { input: "0.006", output: "0.000", unit: "minute" } },
  { slug: "elevenlabs-pro", name: "ElevenLabs Pro", provider: "ElevenLabs", category: "voice", badge: "Popular",
    description: "Hyper-realistic text-to-speech with voice cloning and emotion synthesis.",
    features: ["Voice Cloning", "Emotion", "29 Languages", "Custom"],
    pricing: { input: "0.0005", output: "0.000", unit: "character" } },
  { slug: "runway-gen-3",   name: "Runway Gen-3",   provider: "Runway",    category: "video",
    description: "Professional video generation with granular motion control and cinematic output.",
    features: ["Text-to-Video", "Motion Control", "4K", "Style"],
    pricing: { input: "0.050", output: "0.000", unit: "second" } },
  { slug: "pika-labs",      name: "Pika Labs",      provider: "Pika",      category: "video", badge: "New",
    description: "Creative video generation with artistic style control and seamless animation.",
    features: ["Artistic Styles", "Animation", "Scene Gen", "Prompts"],
    pricing: { input: "0.080", output: "0.000", unit: "second" } },
  { slug: "llama-3-70b",   name: "Llama 3 70B",    provider: "Meta",      category: "llm", badge: "Open Source",
    description: "Meta's open-source flagship with strong reasoning, coding and instruction following.",
    features: ["Open Source", "Custom Training", "Efficient", "Community"],
    pricing: { input: "0.0008", output: "0.0008", unit: "1K tokens" } },
  { slug: "mistral-large",  name: "Mistral Large",  provider: "Mistral",   category: "llm",
    description: "High-performance European LLM with exceptional multilingual and code capabilities.",
    features: ["Multilingual", "Code Gen", "Reasoning", "Efficient"],
    pricing: { input: "0.0012", output: "0.0036", unit: "1K tokens" } },
  { slug: "streamai-pro",   name: "StreamAI Pro",   provider: "Modelsnest", category: "livestreaming", badge: "Exclusive",
    description: "Real-time AI processing built for live streaming — moderation, engagement and analytics.",
    features: ["Real-time", "Moderation", "Analytics", "Live Chat"],
    pricing: { input: "0.020", output: "0.000", unit: "minute" } },
]

const CATEGORIES = [
  { id: "all",            label: "All",           icon: Zap,    color: "#a1a1aa" },
  { id: "conversational", label: "Conversational", icon: Bot,    color: "#6366f1" },
  { id: "voice",          label: "Voice",          icon: Mic,    color: "#10b981" },
  { id: "video",          label: "Video",          icon: Video,  color: "#f59e0b" },
  { id: "llm",            label: "LLMs",           icon: Brain,  color: "#06b6d4" },
  { id: "livestreaming",  label: "Live",           icon: Radio,  color: "#ec4899" },
]

const CAT_COLORS: Record<string, string> = {
  conversational: "#6366f1", voice: "#10b981",
  video: "#f59e0b", llm: "#06b6d4", livestreaming: "#ec4899",
}

const BADGE_COLORS: Record<string, string> = {
  Popular: "#6366f1", New: "#10b981", "Open Source": "#06b6d4", Exclusive: "#f59e0b",
}

export function ModelsDocsIndex({ user }: ModelsDocsIndexProps) {
  const { isDark } = useTheme()
  const { sidebarWidth } = useSidebar()
  const [query, setQuery]   = useState("")
  const [cat, setCat]       = useState("all")
  const [hovered, setHovered] = useState<string | null>(null)

  const bg      = isDark ? "#0d0d10" : "#f8f8f6"
  const surface = isDark ? "#111114" : "#ffffff"
  const border  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const text     = isDark ? "#f4f4f5" : "#09090b"
  const muted    = isDark ? "#52525b" : "#a1a1aa"
  const subtext  = isDark ? "#71717a" : "#71717a"

  const filtered = MODELS.filter(m =>
    (cat === "all" || m.category === cat) &&
    (m.name.toLowerCase().includes(query.toLowerCase()) ||
     m.description.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column" }}>

      {/* ── HERO HEADER ── */}
      <div style={{
        padding: "48px 48px 40px",
        borderBottom: `1px solid ${border}`,
        background: isDark
          ? "linear-gradient(160deg, #0d0d10 0%, #111116 60%, #13101a 100%)"
          : "linear-gradient(160deg, #f8f8f6 0%, #f2f2f0 100%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Grid texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, ${isDark ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.04)"} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }} />
        {/* Glow blob */}
        <div style={{
          position: "absolute", top: -60, right: 80,
          width: 400, height: 300, borderRadius: "50%",
          background: isDark ? "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)" : "transparent",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
            <Link href="/dashboard/models" style={{ textDecoration: "none" }}>
              <span style={{ fontSize: 12, color: muted, cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--color-primary)"}
                onMouseLeave={e => e.currentTarget.style.color = muted}>
                Models
              </span>
            </Link>
            <ChevronRight size={12} style={{ color: muted }} />
            <span style={{ fontSize: 12, color: "var(--color-primary)", fontWeight: 600 }}>Documentation</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "var(--color-primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 16px color-mix(in srgb, var(--color-primary) 40%, transparent)",
                }}>
                  <BookOpen size={18} style={{ color: "#fff" }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-primary)" }}>
                  Modelsnest API Docs
                </span>
              </div>
              <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.04em", color: text, lineHeight: 1, marginBottom: 10 }}>
                Model Reference
              </h1>
              <p style={{ fontSize: 15, color: subtext, maxWidth: 480, lineHeight: 1.6 }}>
                Complete integration guides for every AI model on Modelsnest. Pick a model, read the docs, ship fast.
              </p>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 1, background: border }}>
              {[
                { n: MODELS.length.toString(), l: "Models" },
                { n: "5", l: "Categories" },
                { n: "99.9%", l: "Uptime" },
              ].map(s => (
                <div key={s.l} style={{ padding: "14px 20px", background: surface }}>
                  <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "monospace", color: text, letterSpacing: "-0.04em" }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: muted }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search + filters */}
          <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 280px", maxWidth: 400 }}>
              <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: muted, pointerEvents: "none" }} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search models…"
                style={{
                  width: "100%", height: 40, paddingLeft: 36, paddingRight: 14,
                  background: surface, border: `1px solid ${border}`,
                  borderRadius: 0, color: text, fontSize: 13, outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary)"}
                onBlur={e => e.currentTarget.style.borderColor = border}
              />
            </div>

            <div style={{ display: "flex", gap: 1, background: border }}>
              {CATEGORIES.map(c => {
                const active = cat === c.id
                return (
                  <button key={c.id} onClick={() => setCat(c.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "0 14px", height: 40,
                      background: active ? c.color : surface,
                      border: "none", cursor: "pointer",
                      color: active ? "#fff" : muted,
                      fontSize: 12, fontWeight: 600,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = text }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = muted }}
                  >
                    <c.icon size={13} />
                    <span className="hidden sm:inline">{c.label}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, fontFamily: "monospace",
                      color: active ? "rgba(255,255,255,0.7)" : muted,
                    }}>
                      {c.id === "all" ? MODELS.length : MODELS.filter(m => m.category === c.id).length}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODELS GRID ── */}
      <div style={{ flex: 1, padding: "36px 48px", overflowY: "auto" }}>

        {/* Result count */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <span style={{ fontSize: 12, color: muted, fontWeight: 600 }}>
            {filtered.length} model{filtered.length !== 1 ? "s" : ""} {cat !== "all" ? `in ${CATEGORIES.find(c => c.id === cat)?.label}` : ""}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "80px 0" }}>
              <BookOpen size={40} style={{ color: muted, margin: "0 auto 16px" }} />
              <p style={{ fontSize: 16, fontWeight: 700, color: text, marginBottom: 8 }}>No models found</p>
              <p style={{ fontSize: 13, color: muted, marginBottom: 20 }}>Try a different search or category</p>
              <button onClick={() => { setQuery(""); setCat("all") }}
                style={{ padding: "8px 20px", background: "var(--color-primary)", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 0 }}>
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div key="grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 1, background: border }}>
              {filtered.map((model, i) => {
                const accent = CAT_COLORS[model.category] ?? "var(--color-primary)"
                const isHovered = hovered === model.slug
                return (
                  <motion.div key={model.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04, ease: [0.25, 0.25, 0, 1] }}
                    onMouseEnter={() => setHovered(model.slug)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      background: isHovered
                        ? isDark ? "#14141a" : "#fafafa"
                        : surface,
                      padding: "28px 28px 24px",
                      display: "flex", flexDirection: "column", gap: 18,
                      position: "relative", overflow: "hidden",
                      transition: "background 0.15s",
                      cursor: "pointer",
                    }}
                  >
                    {/* Hover accent line top */}
                    <motion.div
                      animate={{ scaleX: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: accent, transformOrigin: "left" }}
                    />

                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <motion.div
                          animate={{ background: isHovered ? accent : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)" }}
                          style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {model.category === "conversational" && <Bot size={18} style={{ color: isHovered ? "#fff" : accent }} />}
                          {model.category === "voice"          && <Mic size={18} style={{ color: isHovered ? "#fff" : accent }} />}
                          {model.category === "video"          && <Video size={18} style={{ color: isHovered ? "#fff" : accent }} />}
                          {model.category === "llm"            && <Brain size={18} style={{ color: isHovered ? "#fff" : accent }} />}
                          {model.category === "livestreaming"  && <Radio size={18} style={{ color: isHovered ? "#fff" : accent }} />}
                        </motion.div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: text, letterSpacing: "-0.02em", lineHeight: 1 }}>{model.name}</div>
                          <div style={{ fontSize: 11, color: muted, marginTop: 3 }}>{model.provider}</div>
                        </div>
                      </div>
                      {model.badge && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "3px 8px",
                          background: `${BADGE_COLORS[model.badge] ?? accent}18`,
                          color: BADGE_COLORS[model.badge] ?? accent,
                          border: `1px solid ${BADGE_COLORS[model.badge] ?? accent}30`,
                          letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0,
                        }}>
                          {model.badge}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 13, color: subtext, lineHeight: 1.6, margin: 0 }}>
                      {model.description}
                    </p>

                    {/* Features */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {model.features.map(f => (
                        <span key={f} style={{
                          fontSize: 11, padding: "3px 8px",
                          border: `1px solid ${border}`,
                          color: muted, fontWeight: 500,
                        }}>{f}</span>
                      ))}
                    </div>

                    {/* Pricing + CTA */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: `1px solid ${border}` }}>
                      <div style={{ display: "flex", gap: 16 }}>
                        <div>
                          <div style={{ fontSize: 10, color: muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Input</div>
                          <div style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: text }}>${model.pricing.input}</div>
                          <div style={{ fontSize: 10, color: muted }}>/{model.pricing.unit}</div>
                        </div>
                        {model.pricing.output !== "0.000" && (
                          <div>
                            <div style={{ fontSize: 10, color: muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Output</div>
                            <div style={{ fontSize: 13, fontWeight: 800, fontFamily: "monospace", color: text }}>${model.pricing.output}</div>
                            <div style={{ fontSize: 10, color: muted }}>/{model.pricing.unit}</div>
                          </div>
                        )}
                      </div>

                      <Link href={`/dashboard/models/docs/${model.slug}`} style={{ textDecoration: "none" }}>
                        <motion.button
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "8px 14px",
                            background: isHovered ? accent : "transparent",
                            border: `1px solid ${isHovered ? accent : border}`,
                            color: isHovered ? "#fff" : muted,
                            fontSize: 12, fontWeight: 700, cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          <BookOpen size={13} />
                          Docs
                          <ArrowRight size={12} />
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick links strip */}
        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: border }}>
          {[
            { icon: Code2,      label: "API Keys",       sub: "Manage credentials",  href: "/dashboard/apis",    color: "#6366f1" },
            { icon: ExternalLink,label:"API Reference",  sub: "Full REST reference",  href: "/api-docs",          color: "#10b981" },
            { icon: CreditCard, label: "Usage & Billing",sub: "Monitor your spend",   href: "/dashboard/billing", color: "#f59e0b" },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div
                style={{ padding: "20px 24px", background: surface, display: "flex", alignItems: "center", gap: 14, transition: "background 0.15s", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = isDark ? "#14141a" : "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = surface}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${item.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <item.icon size={16} style={{ color: item.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: text }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: muted }}>{item.sub}</div>
                </div>
                <ChevronRight size={14} style={{ color: muted, marginLeft: "auto" }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}