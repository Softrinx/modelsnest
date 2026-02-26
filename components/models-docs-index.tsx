"use client"

import { useEffect, useState, type ComponentType, type CSSProperties } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/themeContext"
import { useSidebar } from "@/components/dashboard-layout-controller"
import Link from "next/link"
import {
  Search, Bot, Mic, Video, Zap, Type, Image as ImageIcon, Volume2,
  BookOpen, Code2, ArrowRight, ExternalLink, CreditCard,
  ChevronRight
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { DashboardUser } from "@/types/dashboard-user"

interface ModelsDocsIndexProps { user: DashboardUser }

interface ModelDoc {
  slug: string; name: string; provider: string; category: string
  description: string; features: string[]
  pricing: { input: string; output: string; unit: string }
  badge?: string
}

interface CategoryFilter {
  id: string
  label: string
  icon: ComponentType<{ size?: number; style?: CSSProperties }>
  color: string
}

const DEFAULT_CATEGORY_COLOR = "#a1a1aa"

const resolveCategoryIcon = (iconName?: string) => {
  const normalized = (iconName ?? "").toLowerCase()
  if (normalized.includes("text") || normalized.includes("type")) return Type
  if (normalized.includes("image") || normalized.includes("photo")) return ImageIcon
  if (normalized.includes("video") || normalized.includes("videocam")) return Video
  if (normalized.includes("volume") || normalized.includes("voice") || normalized.includes("tts")) return Volume2
  if (normalized.includes("record") || normalized.includes("mic") || normalized.includes("transcription") || normalized.includes("stt")) return Mic
  if (normalized.includes("chat") || normalized.includes("bot") || normalized.includes("llm")) return Bot
  return Bot
}

const CategoryIcon = ({
  category,
  categoriesById,
  size = 16,
  color,
}: {
  category: string
  categoriesById: Map<string, CategoryFilter>
  size?: number
  color?: string
}) => {
  const meta = categoriesById.get(category)
  const Icon = meta?.icon ?? Bot
  const iconColor = color ?? meta?.color ?? DEFAULT_CATEGORY_COLOR
  return <Icon size={size} style={{ color: iconColor }} />
}

const BADGE_COLORS: Record<string, string> = {
  Popular: "#6366f1", New: "#10b981", "Open Source": "#06b6d4", Exclusive: "#f59e0b",
}

export function ModelsDocsIndex({ user }: ModelsDocsIndexProps) {
  const { isDark } = useTheme()
  const { sidebarWidth } = useSidebar()
  const [query, setQuery]   = useState("")
  const [cat, setCat]       = useState("all")
  const [categories, setCategories] = useState<CategoryFilter[]>([
    { id: "all", label: "All", icon: Zap, color: DEFAULT_CATEGORY_COLOR },
  ])
  const [hovered, setHovered] = useState<string | null>(null)
  const [models, setModels] = useState<ModelDoc[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadModels = async () => {
      setIsLoading(true)
      try {
        const supabase = createClient()
        const { data: categoryRows, error: categoriesError } = await supabase
          .from("ai_model_categories")
          .select("slug, name, short_name, color, icon_name")
          .order("display_order", { ascending: true })

        if (categoriesError) {
          throw categoriesError
        }

        const { data: modelRows, error } = await supabase
          .from("ai_models")
          .select("id, slug, name, provider, category_slug, badge, docs_index_description")
          .order("sort_order", { ascending: true })

        if (error) {
          throw error
        }

        const ids = modelRows?.map(row => row.id).filter(Boolean) ?? []
        const featuresByModel = new Map<string, string[]>()
        const pricingByModel = new Map<string, any>()

        if (ids.length > 0) {
          const { data: featureRows, error: featureError } = await supabase
            .from("ai_model_features")
            .select("model_id, feature_text, sort_order")
            .in("model_id", ids)
            .eq("source", "docs_index")
            .order("sort_order", { ascending: true })

          if (featureError) {
            throw featureError
          }

          for (const feature of featureRows ?? []) {
            const current = featuresByModel.get(feature.model_id) ?? []
            current.push(feature.feature_text)
            featuresByModel.set(feature.model_id, current)
          }

          const { data: pricingRows, error: pricingError } = await supabase
            .from("ai_model_pricing")
            .select("model_id, input_price, output_price, price_unit")
            .in("model_id", ids)

          if (pricingError) {
            throw pricingError
          }

          for (const pricing of pricingRows ?? []) {
            pricingByModel.set(pricing.model_id, {
              input: String(pricing.input_price),
              output: String(pricing.output_price),
              unit: pricing.price_unit ?? "1K tokens",
            })
          }
        }

        const mapped = (modelRows ?? []).map(row => ({
          slug: row.slug,
          name: row.name,
          provider: row.provider,
          category: row.category_slug,
          description: row.docs_index_description ?? "",
          features: featuresByModel.get(row.id) ?? [],
          pricing: pricingByModel.get(row.id) ?? { input: "0", output: "0", unit: "1K tokens" },
          ...(row.badge ? { badge: row.badge } : {}),
        }))

        const mappedCategories: CategoryFilter[] = [
          { id: "all", label: "All", icon: Zap, color: DEFAULT_CATEGORY_COLOR },
          ...(categoryRows ?? []).map(row => ({
            id: row.slug,
            label: row.short_name || row.name,
            color: row.color || DEFAULT_CATEGORY_COLOR,
            icon: resolveCategoryIcon(row.icon_name),
          })),
        ]

        if (isMounted) {
          setCategories(mappedCategories)
          setModels(mapped)
        }
      } catch (err) {
        console.error("Failed to load models", err)
        if (isMounted) {
          setModels([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadModels()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!categories.some(c => c.id === cat)) {
      setCat("all")
    }
  }, [categories, cat])

  const bg      = isDark ? "#0d0d10" : "#f8f8f6"
  const surface = isDark ? "#111114" : "#ffffff"
  const border  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const text     = isDark ? "#f4f4f5" : "#09090b"
  const muted    = isDark ? "#52525b" : "#a1a1aa"
  const subtext  = isDark ? "#71717a" : "#71717a"
  const categoriesById = new Map(categories.map(category => [category.id, category] as const))

  const filtered = models.filter(m =>
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
                { n: models.length.toString(), l: "Models" },
                { n: Math.max(categories.length - 1, 0).toString(), l: "Categories" },
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
              {categories.map(c => {
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
                      {c.id === "all" ? models.length : models.filter(m => m.category === c.id).length}
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

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{
              width: 40, height: 40, margin: "0 auto 16px",
              border: `2px solid ${border}`, borderTop: "2px solid var(--color-primary)",
              borderRadius: "50%", animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--color-primary)" }}>Loading models...</p>
          </div>
        ) : (
          <>
            {/* Result count */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <span style={{ fontSize: 12, color: muted, fontWeight: 600 }}>
                {filtered.length} model{filtered.length !== 1 ? "s" : ""} {cat !== "all" ? `in ${categories.find(c => c.id === cat)?.label}` : ""}
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
                const accent = categoriesById.get(model.category)?.color ?? "var(--color-primary)"
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
                          <CategoryIcon category={model.category} categoriesById={categoriesById} size={18} color={isHovered ? "#fff" : accent} />
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
          </>
        )}

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