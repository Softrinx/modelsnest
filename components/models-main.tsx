"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/themeContext"
import { useSidebar } from "@/components/dashboard-layout-controller"
import Link from "next/link"
import {
  Bot, Mic, Video, Brain, Radio, Zap, Star,
  BookOpen, Settings, Clock, LayoutGrid, List,
  ChevronRight, Activity, ArrowUpRight
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { DashboardUser } from "@/types/dashboard-user"

interface ModelsMainProps { user: DashboardUser }

interface Model {
  id: string; name: string; provider: string; category: string
  status: "active" | "inactive" | "maintenance"
  performance: number; lastUsed: string; description: string
  features: string[]; isFavorite: boolean; hasDocumentation: boolean
  slug: string
}


const CATEGORIES = [
  { id:"all",            label:"All",           icon: Zap,    color:"#a1a1aa" },
  { id:"conversational", label:"Conversational", icon: Bot,    color:"#6366f1" },
  { id:"voice",          label:"Voice",          icon: Mic,    color:"#10b981" },
  { id:"video",          label:"Video",          icon: Video,  color:"#f59e0b" },
  { id:"llm",            label:"LLMs",           icon: Brain,  color:"#06b6d4" },
  { id:"livestreaming",  label:"Live",           icon: Radio,  color:"#ec4899" },
]

const CAT_COLOR: Record<string, string> = {
  conversational:"#6366f1", voice:"#10b981",
  video:"#f59e0b", llm:"#06b6d4", livestreaming:"#ec4899"
}

const STATUS_CONFIG = {
  active:      { label:"Active",      color:"#10b981", bg:"rgba(16,185,129,0.1)"  },
  inactive:    { label:"Inactive",    color:"#71717a", bg:"rgba(113,113,122,0.1)" },
  maintenance: { label:"Maintenance", color:"#f59e0b", bg:"rgba(245,158,11,0.1)"  },
}

const CategoryIcon = ({ category, size=16, color }: { category: string; size?: number; color?: string }) => {
  const c = color ?? CAT_COLOR[category] ?? "#a1a1aa"
  if (category === "voice")         return <Mic    size={size} style={{ color: c }} />
  if (category === "video")         return <Video  size={size} style={{ color: c }} />
  if (category === "llm")           return <Brain  size={size} style={{ color: c }} />
  if (category === "livestreaming") return <Radio  size={size} style={{ color: c }} />
  return <Bot size={size} style={{ color: c }} />
}

export function ModelsMain({ user }: ModelsMainProps) {
  const { isDark } = useTheme()
  const { sidebarWidth } = useSidebar()
  const [cat, setCat]       = useState("all")
  const [view, setView]     = useState<"grid"|"list">("grid")
  const [models, setModels] = useState<Model[]>([])
  const [favs, setFavs]     = useState<Set<string>>(new Set())
  const [hovered, setHovered] = useState<string|null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const bg      = isDark ? "#0d0d10" : "#f8f8f6"
  const surface = isDark ? "#111114" : "#ffffff"
  const border  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const text     = isDark ? "#f4f4f5" : "#09090b"
  const muted    = isDark ? "#52525b" : "#a1a1aa"
  const subtext  = isDark ? "#71717a" : "#71717a"

  useEffect(() => {
    let isMounted = true

    const loadModels = async () => {
      setIsLoading(true)
      try {
        const supabase = createClient()
        const { data: modelRows, error } = await supabase
          .from("ai_models")
          .select("id, slug, name, provider, category_slug, status, performance, last_used_label, is_favorite_default, has_documentation, card_description")
          .order("sort_order", { ascending: true })

        if (error) {
          throw error
        }

        const ids = modelRows?.map(row => row.id).filter(Boolean) ?? []
        const featuresByModel = new Map<string, string[]>()

        if (ids.length > 0) {
          const { data: featureRows, error: featureError } = await supabase
            .from("ai_model_features")
            .select("model_id, feature_text, sort_order")
            .in("model_id", ids)
            .eq("source", "models_page")
            .order("sort_order", { ascending: true })

          if (featureError) {
            throw featureError
          }

          for (const feature of featureRows ?? []) {
            const current = featuresByModel.get(feature.model_id) ?? []
            current.push(feature.feature_text)
            featuresByModel.set(feature.model_id, current)
          }
        }

        const mapped = (modelRows ?? []).map(row => ({
          id: row.id,
          name: row.name,
          provider: row.provider,
          category: row.category_slug,
          status: row.status,
          performance: row.performance ?? 0,
          lastUsed: row.last_used_label ?? "—",
          description: row.card_description ?? "",
          features: featuresByModel.get(row.id) ?? [],
          isFavorite: Boolean(row.is_favorite_default),
          hasDocumentation: Boolean(row.has_documentation),
          slug: row.slug,
        }))

        if (isMounted) {
          setModels(mapped)
          if (favs.size === 0) {
            setFavs(new Set(mapped.filter(m => m.isFavorite).map(m => m.id)))
          }
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

  const filtered = models.filter(m => cat === "all" || m.category === cat)
  const active   = models.filter(m => m.status === "active").length

  const perfColor = (p: number) => p >= 95 ? "#10b981" : p >= 90 ? "#f59e0b" : "#ef4444"

  return (
    <div style={{ minHeight:"100vh", background: bg, display:"flex", flexDirection:"column" }}>

      {/* ── HEADER ── */}
      <div style={{
        padding:"40px 48px 32px",
        borderBottom:`1px solid ${border}`,
        background: isDark ? "linear-gradient(160deg,#0d0d10,#111118)" : surface,
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage:`radial-gradient(circle,${isDark?"rgba(99,102,241,0.05)":"rgba(99,102,241,0.03)"} 1px,transparent 1px)`,
          backgroundSize:"28px 28px" }} />
        <div style={{ position:"absolute", top:-60, right:120, width:400, height:280, borderRadius:"50%",
          background: isDark ? "radial-gradient(ellipse,rgba(99,102,241,0.1) 0%,transparent 70%)" : "transparent", pointerEvents:"none" }} />

        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:20, flexWrap:"wrap" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:"var(--color-primary)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:"0 4px 14px color-mix(in srgb,var(--color-primary) 40%,transparent)" }}>
                  <Zap size={16} style={{ color:"#fff" }} />
                </div>
                <span style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--color-primary)" }}>
                  Modelsnest
                </span>
              </div>
              <h1 style={{ fontSize:32, fontWeight:900, letterSpacing:"-0.04em", color:text, lineHeight:1, marginBottom:8 }}>
                AI Models
              </h1>
              <p style={{ fontSize:14, color:subtext, maxWidth:440 }}>
                Monitor, manage and access documentation for every AI model on your account.
              </p>
            </div>

            {/* Stats strip */}
            <div style={{ display:"flex", gap:1, background:border, flexShrink:0 }}>
              {[
                { n: models.length.toString(),   l:"Total" },
                { n: active.toString(),           l:"Active" },
                { n: favs.size.toString(),        l:"Favourites" },
                { n: "99.9%",                     l:"Uptime" },
              ].map(s => (
                <div key={s.l} style={{ padding:"14px 20px", background:surface }}>
                  <div style={{ fontSize:20, fontWeight:900, fontFamily:"monospace", color:text, letterSpacing:"-0.04em" }}>{s.n}</div>
                  <div style={{ fontSize:11, color:muted }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls row */}
          <div style={{ marginTop:28, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            {/* Category filters */}
            <div style={{ display:"flex", gap:1, background:border }}>
              {CATEGORIES.map(c => {
                const active = cat === c.id
                return (
                  <button key={c.id} onClick={() => setCat(c.id)}
                    style={{
                      display:"flex", alignItems:"center", gap:6,
                      padding:"0 14px", height:38,
                      background: active ? c.color : surface,
                      border:"none", cursor:"pointer",
                      color: active ? "#fff" : muted,
                      fontSize:12, fontWeight:600, transition:"all 0.15s",
                      flexShrink:0,
                    }}
                    onMouseEnter={e => { if(!active) e.currentTarget.style.color = text }}
                    onMouseLeave={e => { if(!active) e.currentTarget.style.color = muted }}
                  >
                    <c.icon size={13} />
                    <span className="hidden sm:inline">{c.label}</span>
                    <span style={{ fontSize:10, fontFamily:"monospace", color: active ? "rgba(255,255,255,0.65)" : muted }}>
                      {c.id === "all" ? models.length : models.filter(m=>m.category===c.id).length}
                    </span>
                  </button>
                )
              })}
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              {/* View toggle */}
              <div style={{ display:"flex", gap:1, background:border }}>
                {([["grid","Grid",LayoutGrid],["list","List",List]] as const).map(([v,l,Icon]) => (
                  <button key={v} onClick={() => setView(v)}
                    style={{ display:"flex", alignItems:"center", gap:5, padding:"0 12px", height:36, border:"none", cursor:"pointer",
                      background: view===v ? "var(--color-primary)" : surface, color: view===v ? "#fff" : muted, fontSize:12, fontWeight:600 }}>
                    <Icon size={13} /> {l}
                  </button>
                ))}
              </div>

              {/* Docs CTA */}
              <Link href="/dashboard/models/docs" style={{ textDecoration:"none" }}>
                <button style={{
                  display:"flex", alignItems:"center", gap:7, padding:"0 16px", height:36,
                  background:"var(--color-primary)", border:"none", color:"#fff",
                  fontSize:12, fontWeight:700, cursor:"pointer",
                  boxShadow:"0 4px 14px color-mix(in srgb,var(--color-primary) 35%,transparent)",
                }}>
                  <BookOpen size={13} /> All Docs <ArrowUpRight size={12} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex:1, padding:"32px 48px", overflowY:"auto" }}>
        <div style={{ marginBottom:18, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:12, fontWeight:600, color:muted }}>
            {isLoading ? "Loading models..." : `${filtered.length} model${filtered.length!==1?"s":""}${cat!=="all" ? ` · ${CATEGORIES.find(c=>c.id===cat)?.label}` : ""}`}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {/* GRID */}
          {view === "grid" && (
            <motion.div key="grid"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.15 }}
              style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:1, background:border }}>
              {filtered.map((model, i) => {
                const accent  = CAT_COLOR[model.category] ?? "var(--color-primary)"
                const sts     = STATUS_CONFIG[model.status]
                const isHov   = hovered === model.id
                const isFav   = favs.has(model.id)
                return (
                  <motion.div key={model.id}
                    initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                    transition={{ duration:0.25, delay:i*0.04 }}
                    onMouseEnter={() => setHovered(model.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      background: isHov ? (isDark?"#13131a":"#fafafa") : surface,
                      padding:"24px 24px 20px", display:"flex", flexDirection:"column", gap:16,
                      position:"relative", overflow:"hidden", transition:"background 0.15s",
                    }}>
                    {/* Accent top line */}
                    <motion.div animate={{ scaleX: isHov ? 1 : 0 }} transition={{ duration:0.22 }}
                      style={{ position:"absolute", top:0, left:0, right:0, height:2, background:accent, transformOrigin:"left" }} />

                    {/* Header */}
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <motion.div
                          animate={{ background: isHov ? accent : isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)" }}
                          style={{ width:38, height:38, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <CategoryIcon category={model.category} size={17} color={isHov?"#fff":accent} />
                        </motion.div>
                        <div>
                          <div style={{ fontSize:14, fontWeight:800, color:text, letterSpacing:"-0.02em", lineHeight:1 }}>{model.name}</div>
                          <div style={{ fontSize:11, color:muted, marginTop:3 }}>{model.provider}</div>
                        </div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        {/* Status */}
                        <span style={{ fontSize:10, fontWeight:700, padding:"3px 7px", background:sts.bg, color:sts.color, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                          {sts.label}
                        </span>
                        {/* Star */}
                        <button onClick={() => setFavs(f => { const n=new Set(f); isFav?n.delete(model.id):n.add(model.id); return n })}
                          style={{ background:"transparent", border:"none", cursor:"pointer", padding:4, color: isFav ? "#f59e0b" : muted, transition:"color 0.15s" }}>
                          <Star size={14} style={{ fill: isFav ? "#f59e0b" : "none" }} />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize:12, color:subtext, lineHeight:1.6, margin:0 }}>{model.description}</p>

                    {/* Features */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                      {model.features.slice(0,3).map(f => (
                        <span key={f} style={{ fontSize:10, padding:"2px 8px", border:`1px solid ${border}`, color:muted }}>{f}</span>
                      ))}
                      {model.features.length > 3 && (
                        <span style={{ fontSize:10, padding:"2px 8px", border:`1px solid ${border}`, color:muted }}>+{model.features.length-3}</span>
                      )}
                    </div>

                    {/* Footer */}
                    <div style={{ paddingTop:12, borderTop:`1px solid ${border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                        {/* Performance */}
                        <div>
                          <div style={{ fontSize:10, color:muted, marginBottom:3 }}>Performance</div>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <div style={{ width:52, height:3, background:isDark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)", borderRadius:2, overflow:"hidden" }}>
                              <motion.div animate={{ width:`${model.performance}%` }} transition={{ duration:0.6, delay:i*0.05 }}
                                style={{ height:"100%", background:perfColor(model.performance), borderRadius:2 }} />
                            </div>
                            <span style={{ fontSize:11, fontWeight:700, fontFamily:"monospace", color:perfColor(model.performance) }}>{model.performance}%</span>
                          </div>
                        </div>
                        {/* Last used */}
                        <div>
                          <div style={{ fontSize:10, color:muted, marginBottom:3 }}>Last used</div>
                          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                            <Clock size={10} style={{ color:muted }} />
                            <span style={{ fontSize:11, color:subtext }}>{model.lastUsed}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display:"flex", gap:6 }}>
                        {model.hasDocumentation ? (
                          <Link href={`/dashboard/models/docs/${model.slug}`} style={{ textDecoration:"none" }}>
                            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                              style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px",
                                background: isHov ? accent : "transparent", border:`1px solid ${isHov?accent:border}`,
                                color: isHov ? "#fff" : muted, fontSize:11, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}>
                              <BookOpen size={11} /> Docs
                            </motion.button>
                          </Link>
                        ) : (
                          <span style={{ fontSize:11, color:muted, padding:"6px 12px", border:`1px solid ${border}`, opacity:0.5 }}>No docs</span>
                        )}
                        <button style={{ padding:"6px 10px", background:"transparent", border:`1px solid ${border}`, color:muted, cursor:"pointer" }}
                          onMouseEnter={e => e.currentTarget.style.color=text}
                          onMouseLeave={e => e.currentTarget.style.color=muted}>
                          <Settings size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {/* LIST */}
          {view === "list" && (
            <motion.div key="list"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.15 }}
              style={{ display:"flex", flexDirection:"column", gap:1, background:border }}>
              {/* Header row */}
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 120px 100px 120px auto", alignItems:"center",
                padding:"10px 20px", background:isDark?"rgba(255,255,255,0.03)":"#f5f5f4",
                fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:muted }}>
                <span>Model</span><span>Category</span><span>Status</span><span>Performance</span><span>Last Used</span><span></span>
              </div>
              {filtered.map((model, i) => {
                const accent = CAT_COLOR[model.category] ?? "var(--color-primary)"
                const sts    = STATUS_CONFIG[model.status]
                const isHov  = hovered === model.id
                const isFav  = favs.has(model.id)
                return (
                  <motion.div key={model.id}
                    initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.2, delay:i*0.03 }}
                    onMouseEnter={() => setHovered(model.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      display:"grid", gridTemplateColumns:"2fr 1fr 120px 100px 120px auto",
                      alignItems:"center", padding:"14px 20px",
                      background: isHov ? (isDark?"#13131a":"#fafafa") : surface,
                      borderLeft:`2px solid ${isHov?accent:"transparent"}`,
                      transition:"all 0.15s", position:"relative",
                    }}>
                    {/* Name */}
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center",
                        background: isHov ? accent : isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)" }}>
                        <CategoryIcon category={model.category} size={15} color={isHov?"#fff":accent} />
                      </div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:text, display:"flex", alignItems:"center", gap:6 }}>
                          {model.name}
                          {isFav && <Star size={11} style={{ color:"#f59e0b", fill:"#f59e0b" }} />}
                        </div>
                        <div style={{ fontSize:11, color:muted }}>{model.provider}</div>
                      </div>
                    </div>
                    {/* Category */}
                    <span style={{ fontSize:12, color:accent, fontWeight:600, textTransform:"capitalize" }}>{model.category}</span>
                    {/* Status */}
                    <span style={{ fontSize:10, fontWeight:700, padding:"3px 8px", background:sts.bg, color:sts.color, textTransform:"uppercase", letterSpacing:"0.06em", width:"fit-content" }}>
                      {sts.label}
                    </span>
                    {/* Performance */}
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <div style={{ width:40, height:3, background:isDark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)", borderRadius:2, overflow:"hidden" }}>
                        <div style={{ width:`${model.performance}%`, height:"100%", background:perfColor(model.performance) }} />
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, fontFamily:"monospace", color:perfColor(model.performance) }}>{model.performance}%</span>
                    </div>
                    {/* Last used */}
                    <span style={{ fontSize:12, color:subtext }}>{model.lastUsed}</span>
                    {/* Actions */}
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <button onClick={() => setFavs(f => { const n=new Set(f); isFav?n.delete(model.id):n.add(model.id); return n })}
                        style={{ background:"transparent", border:"none", cursor:"pointer", padding:4, color: isFav ? "#f59e0b" : muted }}>
                        <Star size={13} style={{ fill: isFav ? "#f59e0b" : "none" }} />
                      </button>
                      {model.hasDocumentation ? (
                        <Link href={`/dashboard/models/docs/${model.slug}`} style={{ textDecoration:"none" }}>
                          <button style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", background:"transparent", border:`1px solid ${border}`, color:muted, fontSize:11, fontWeight:600, cursor:"pointer" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor=accent; e.currentTarget.style.color=accent }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor=border; e.currentTarget.style.color=muted }}>
                            <BookOpen size={11} /> Docs
                          </button>
                        </Link>
                      ) : (
                        <span style={{ fontSize:11, color:muted, opacity:0.4 }}>No docs</span>
                      )}
                      <button style={{ padding:"5px 8px", background:"transparent", border:`1px solid ${border}`, color:muted, cursor:"pointer" }}>
                        <Settings size={12} />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"80px 0" }}>
            <Bot size={40} style={{ color:muted, margin:"0 auto 14px" }} />
            <p style={{ fontSize:16, fontWeight:700, color:text, marginBottom:6 }}>No models in this category</p>
            <p style={{ fontSize:13, color:muted }}>Try selecting a different filter above</p>
          </div>
        )}
      </div>
    </div>
  )
}