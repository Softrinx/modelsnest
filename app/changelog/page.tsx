"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useTheme } from "@/contexts/themeContext"
import { Footer } from "@/components/footer"
import { PageTopBar } from "@/components/page-top-bar"
import {
  Zap, Shield, CreditCard, Code, Mic, Image, Layers,
  MessageSquare, TrendingUp, Bug, Star, ArrowRight,
  ChevronDown, Package, Globe, Lock, Database, Sparkles
} from "lucide-react"

// ─── Types ────

type ChangeType = "new" | "improved" | "fixed" | "security" | "deprecated"

interface Change {
  type: ChangeType
  text: string
}

interface Release {
  version: string
  date: string
  tag?: "Latest" | "Major"
  summary: string
  icon: React.ElementType
  accent: string
  changes: Change[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const typeConfig: Record<ChangeType, { label: string; color: string; bg: string }> = {
  new:        { label: "New",        color: "#10b981", bg: "#10b98114" },
  improved:   { label: "Improved",   color: "#6366f1", bg: "#6366f114" },
  fixed:      { label: "Fixed",      color: "#f59e0b", bg: "#f59e0b14" },
  security:   { label: "Security",   color: "#ef4444", bg: "#ef444414" },
  deprecated: { label: "Deprecated", color: "#6b7280", bg: "#6b728014" },
}

const releases: Release[] = [
  {
    version: "v2.4.0",
    date: "Feb 14, 2025",
    tag: "Latest",
    summary: "Coinbase Commerce crypto payments, streaming upgrades, and new audio models.",
    icon: Zap,
    accent: "#6366f1",
    changes: [
      { type: "new",      text: "Coinbase Commerce integration — pay for credits with ETH, BTC, USDC, and more via crypto checkout." },
      { type: "new",      text: "ElevenLabs v2 Turbo added to the model roster — ultra-low latency text-to-speech at $0.001/1K chars." },
      { type: "new",      text: "Whisper Large v3 now available for audio transcription with improved multilingual accuracy." },
      { type: "improved", text: "SSE streaming now flushes tokens within 8ms — measurable reduction in time-to-first-token across all chat models." },
      { type: "improved", text: "API token creation dialog redesigned — scope selection, expiry picker, and one-click copy on reveal." },
      { type: "fixed",    text: "Balance not updating in dashboard header after a PayPal top-up without page refresh." },
      { type: "fixed",    text: "Chat interface losing scroll position when a streaming response completes on mobile Safari." },
    ],
  },
  {
    version: "v2.3.0",
    date: "Jan 28, 2025",
    summary: "Llama 3.1 family, admin credit controls, and usage analytics overhaul.",
    icon: TrendingUp,
    accent: "#10b981",
    changes: [
      { type: "new",      text: "Meta Llama 3.1 8B, 70B, and 405B added — open-weight models at the lowest per-token price on the platform." },
      { type: "new",      text: "Admin panel: manually add or deduct credits from any user account with an audit log entry." },
      { type: "new",      text: "Usage Analytics page — daily/weekly/monthly token consumption charts broken down by model and endpoint." },
      { type: "improved", text: "Transaction history table now supports CSV export for the past 90 days." },
      { type: "improved", text: "Model selector in chat now groups models by category (Text, Image, Audio, Embeddings) with latency indicators." },
      { type: "fixed",    text: "Webhook delivery for Coinbase Commerce payments occasionally firing twice on confirmation." },
      { type: "fixed",    text: "Pagination breaking on the API Store when filtering by category on page > 1." },
    ],
  },
  {
    version: "v2.2.0",
    date: "Jan 10, 2025",
    tag: "Major",
    summary: "Full SDK release for Python, Node.js, Go, PHP, Java, and C#.",
    icon: Package,
    accent: "#8b5cf6",
    changes: [
      { type: "new",      text: "Official Python SDK v1.2.0 — `pip install outsoor`. Async-first, full type hints, streaming support built in." },
      { type: "new",      text: "Official Node.js SDK v2.1.0 — `npm install outsoor`. Works in both ESM and CJS environments." },
      { type: "new",      text: "Go, PHP, Java, and C# SDKs released as open-source under MIT license. Contributions welcome." },
      { type: "new",      text: "SDK documentation section added to the platform with install commands, quickstarts, and API reference per language." },
      { type: "improved", text: "All SDKs share a consistent interface — same method names, same error shapes, same response types across languages." },
      { type: "improved", text: "API reference page now shows code examples in Python, JavaScript, cURL, and Go with a language switcher." },
      { type: "security", text: "SDK auth no longer accepts API keys passed as URL query parameters — Authorization header only." },
    ],
  },
  {
    version: "v2.1.0",
    date: "Dec 19, 2024",
    summary: "DALL-E 3 HD, image generation pricing, and dashboard redesign.",
    icon: Image,
    accent: "#ec4899",
    changes: [
      { type: "new",      text: "DALL-E 3 HD and Standard available — generate 1024×1024, 1024×1792, and 1792×1024 images via `/v1/images/generations`." },
      { type: "new",      text: "Stable Diffusion XL added as a lower-cost image alternative at $0.004/image." },
      { type: "new",      text: "Image generation history stored for 30 days — accessible from dashboard with re-generation option." },
      { type: "improved", text: "Dashboard sidebar redesigned with collapsible sections, usage mini-chart, and quick-access to recent API tokens." },
      { type: "improved", text: "Billing overview widget now shows projected monthly cost based on trailing 7-day usage rate." },
      { type: "fixed",    text: "PayPal order capture occasionally returning 422 when PayPal's servers were slow to confirm — retry logic added." },
      { type: "fixed",    text: "Invoice print layout clipping on A4 paper in Firefox." },
    ],
  },
  {
    version: "v2.0.0",
    date: "Dec 2, 2024",
    tag: "Major",
    summary: "Platform relaunch — unified API, new pricing model, and real-time chat.",
    icon: Sparkles,
    accent: "#f59e0b",
    changes: [
      { type: "new",      text: "Unified `/v1/` API — single endpoint, single key, 50+ models. GPT-4o, Claude 3.5, Llama, Mistral, Gemini, and more." },
      { type: "new",      text: "Real-time streaming chat interface with model switching, conversation history, and markdown rendering." },
      { type: "new",      text: "Pay-as-you-go pricing at $0.001/1K tokens — no subscriptions, no minimums, no surprises." },
      { type: "new",      text: "API token system — create multiple keys per account with custom scopes and optional expiry dates." },
      { type: "new",      text: "99.99% uptime SLA with sub-200ms median latency across all text generation endpoints." },
      { type: "new",      text: "API Store — 6,000+ pre-built APIs for web scraping, data extraction, and automation, accessible from the dashboard." },
      { type: "security", text: "End-to-end TLS 1.3 enforced on all API traffic. Legacy TLS 1.0/1.1 connections rejected." },
      { type: "security", text: "API keys hashed at rest using bcrypt — plaintext keys never stored, only shown once on creation." },
    ],
  },
  {
    version: "v1.8.2",
    date: "Nov 18, 2024",
    summary: "Security patches and session hardening before v2 launch.",
    icon: Shield,
    accent: "#ef4444",
    changes: [
      { type: "security", text: "Session tokens rotated on every login — previous sessions invalidated on password change." },
      { type: "security", text: "Rate limiting enforced on auth endpoints — 10 attempts/minute per IP before temporary lockout." },
      { type: "fixed",    text: "Password reset tokens were not expiring after use — tokens now marked consumed immediately on first use." },
      { type: "fixed",    text: "Admin panel accessible without role check in one edge-case middleware path — now requires `role = admin` on all routes." },
      { type: "deprecated", text: "Legacy `/api/v0/` endpoints will be removed in v2.0.0. Migrate to `/v1/` before Dec 2, 2024." },
    ],
  },
]

// ─── Change Badge ─────────────────────────────────────────────────────────────

function ChangeBadge({ type }: { type: ChangeType }) {
  const c = typeConfig[type]
  return (
    <span className="text-xs font-mono font-semibold px-2 py-0.5 flex-shrink-0"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}28` }}>
      {c.label}
    </span>
  )
}

// ─── Release Row ──────────────────────────────────────────────────────────────

function ReleaseRow({ release, index }: { release: Release; index: number }) {
  const { isDark } = useTheme()
  const [open, setOpen] = useState(index === 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {/* Release header — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-0 text-left group"
        style={{ borderBottom: open ? "none" : `1px solid var(--color-border)` }}
      >
        {/* Left: version + date column */}
        <div className="flex-shrink-0 flex flex-col gap-1 py-6 pr-8"
          style={{ width: 200, borderRight: `1px solid var(--color-border)` }}>
          <div className="flex items-center gap-2">
            <span className="font-black font-mono text-base" style={{ color: "var(--color-text)", letterSpacing: "-0.03em" }}>
              {release.version}
            </span>
            {release.tag && (
              <span className="text-xs font-mono px-1.5 py-0.5"
                style={{
                  background: release.tag === "Latest" ? `${release.accent}18` : "transparent",
                  color: release.accent,
                  border: `1px solid ${release.accent}35`,
                }}>
                {release.tag}
              </span>
            )}
          </div>
          <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)", opacity: 0.45 }}>{release.date}</span>
        </div>

        {/* Right: summary + icon */}
        <div className="flex-1 flex items-center justify-between gap-6 px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
              style={{ background: `${release.accent}14`, border: `1px solid ${release.accent}28` }}>
              <release.icon className="w-4 h-4" style={{ color: release.accent }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{release.summary}</p>
              <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--color-text-muted)", opacity: 0.45 }}>
                {release.changes.length} changes
              </p>
            </div>
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-text-muted)", opacity: 0.4 }} />
          </motion.div>
        </div>
      </button>

      {/* Expanded change list */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.25, 0, 1] }}
            style={{ overflow: "hidden", borderBottom: `1px solid var(--color-border)` }}
          >
            <div className="flex" style={{ background: isDark ? `${release.accent}04` : `${release.accent}03` }}>
              {/* Left spacer matching the version column */}
              <div className="flex-shrink-0" style={{ width: 200, borderRight: `1px solid var(--color-border)` }}>
                {/* Vertical accent line */}
                <div className="mx-auto mt-0" style={{ width: 2, height: "100%", background: `${release.accent}20` }} />
              </div>

              {/* Change items */}
              <div className="flex-1 px-8 py-4 flex flex-col gap-0">
                {release.changes.map((change, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    className="flex items-start gap-4 py-3"
                    style={{ borderBottom: i < release.changes.length - 1 ? `1px solid var(--color-border)` : "none" }}
                  >
                    <ChangeBadge type={change.type} />
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>
                      {change.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChangelogPage() {
  const { isDark } = useTheme()
  const [filter, setFilter] = useState<ChangeType | "all">("all")

  const border = "var(--color-border)"

  const typeFilters: Array<{ key: ChangeType | "all"; label: string }> = [
    { key: "all",        label: "All" },
    { key: "new",        label: "New" },
    { key: "improved",   label: "Improved" },
    { key: "fixed",      label: "Fixed" },
    { key: "security",   label: "Security" },
    { key: "deprecated", label: "Deprecated" },
  ]

  const filteredReleases = filter === "all"
    ? releases
    : releases.map(r => ({ ...r, changes: r.changes.filter(c => c.type === filter) }))
               .filter(r => r.changes.length > 0)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      <PageTopBar breadcrumb="Docs · Changelog" />

      {/* ── HEADER ── */}
      <section style={{ borderBottom: `1px solid ${border}` }}>
        <div className="max-w-5xl mx-auto px-10 py-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
              <span className="text-xs font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--color-primary)" }}>
                Changelog
              </span>
            </div>
            <h1 className="font-black leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.04em", color: "var(--color-text)" }}>
              What's new in Outsoor.
            </h1>
            <p className="text-sm max-w-md" style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}>
              Every API addition, model release, SDK update, bug fix, and security patch — in one place. Updated with each release.
            </p>
          </motion.div>

          {/* Subscribe nudge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-2 flex-shrink-0"
          >
            <label className="text-xs font-mono" style={{ color: "var(--color-text-muted)", opacity: 0.5 }}>
              Get notified on release
            </label>
            <div className="flex gap-0" style={{ border: `1px solid ${border}` }}>
              <input
                type="email"
                placeholder="you@company.com"
                className="px-4 py-2.5 text-sm outline-none flex-1 min-w-0"
                style={{ background: "transparent", color: "var(--color-text)", borderRight: `1px solid ${border}` }}
              />
              <button className="px-4 py-2.5 text-xs font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-80"
                style={{ background: "var(--color-primary)", color: "#fff", flexShrink: 0 }}>
                <ArrowRight className="w-3.5 h-3.5" /> Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div className="sticky top-0 z-20" style={{ borderBottom: `1px solid ${border}`, background: "var(--color-bg)" }}>
        <div className="max-w-5xl mx-auto px-10">
          <div className="flex items-center gap-0 overflow-x-auto" style={{ height: 44 }}>
            {typeFilters.map(f => {
              const isActive = filter === f.key
              const color = f.key !== "all" ? typeConfig[f.key as ChangeType].color : "var(--color-primary)"
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="px-4 h-full text-xs font-mono font-medium flex-shrink-0 transition-all relative"
                  style={{
                    color: isActive ? (f.key !== "all" ? color : "var(--color-primary)") : "var(--color-text-muted)",
                    opacity: isActive ? 1 : 0.5,
                    borderBottom: `2px solid ${isActive ? (f.key !== "all" ? color : "var(--color-primary)") : "transparent"}`,
                    marginBottom: -1,
                  }}
                >
                  {f.label}
                </button>
              )
            })}
            <div className="ml-auto flex items-center gap-3 pl-6 flex-shrink-0">
              <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)", opacity: 0.35 }}>
                {releases.length} releases
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── RELEASE LIST ── */}
      <div className="max-w-5xl mx-auto w-full px-10 py-10 flex flex-col">
        <div style={{ border: `1px solid ${border}` }}>
          {filteredReleases.map((release, i) => (
            <ReleaseRow key={release.version} release={release} index={i} />
          ))}
        </div>

        {filteredReleases.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-3"
            style={{ border: `1px solid ${border}` }}>
            <Star className="w-8 h-8" style={{ color: "var(--color-text-muted)", opacity: 0.2 }} />
            <p className="text-sm" style={{ color: "var(--color-text-muted)", opacity: 0.4 }}>
              No releases match this filter.
            </p>
          </motion.div>
        )}
      </div>

      {/* ── LEGEND ── */}
      <div className="max-w-5xl mx-auto w-full px-10 pb-16">
        <div className="flex flex-wrap items-center gap-4" style={{ borderTop: `1px solid ${border}`, paddingTop: 20 }}>
          <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)", opacity: 0.4 }}>Legend:</span>
          {Object.entries(typeConfig).map(([key, c]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="text-xs font-mono px-2 py-0.5"
                style={{ background: c.bg, color: c.color, border: `1px solid ${c.color}28` }}>
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-6 text-xs font-mono flex-shrink-0"
        style={{ height: "24px", background: "var(--color-primary)", color: "#fff" }}>
        <div className="flex items-center gap-5">
          <span>Outsoor Changelog</span>
          <span style={{ opacity: 0.7 }}>Latest: v2.4.0 — Feb 14, 2025</span>
        </div>
        <div className="flex items-center gap-4" style={{ opacity: 0.8 }}>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-300" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}