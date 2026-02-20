"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { useTheme } from "@/contexts/themeContext"
import { Globe, Users, Zap, TrendingUp } from "lucide-react"

const stats = [
  { value: "140+", label: "Countries", icon: Globe },
  { value: "10K+", label: "Developers", icon: Users },
  { value: "1.2B+", label: "API calls/mo", icon: Zap },
  { value: "99.99%", label: "Uptime", icon: TrendingUp },
]

const regions = [
  { name: "North America", clients: 4200, x: "22%", y: "32%" },
  { name: "Europe",        clients: 3100, x: "47%", y: "25%" },
  { name: "Asia Pacific",  clients: 2800, x: "74%", y: "36%" },
  { name: "Middle East",   clients: 680,  x: "58%", y: "44%" },
  { name: "Africa",        clients: 420,  x: "50%", y: "58%" },
  { name: "Latam",         clients: 810,  x: "28%", y: "62%" },
]

// Grid lines config
const VCOLS = 12
const HROWS = 8

export function GlobalClients() {
  const { isDark } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: isDark ? "var(--color-surface-1)" : "var(--color-surface-2)",
        paddingTop: "clamp(60px, 8vw, 120px)",
        paddingBottom: "clamp(60px, 8vw, 120px)",
      }}
    >


      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col gap-16">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <span className="text-xs font-mono tracking-widest uppercase" style={{ color: "var(--color-primary)" }}>
              Global Reach
            </span>
            <h2
              style={{
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--color-text)",
              }}
            >
              Trusted by Leaders{" "}
              <span style={{
                background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Worldwide
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            From solo developers to Fortune 500 enterprises — Outsoor powers AI infrastructure across 140+ countries with zero compromise on performance or reliability.
          </motion.p>
        </div>

        {/* Map + stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0"
          style={{ border: "1px solid var(--color-border)" }}
        >
          {/* Map panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="lg:col-span-2 relative overflow-hidden"
            style={{
              borderRight: "1px solid var(--color-border)",
              minHeight: "360px",
            }}
          >
            {/* Grid lines — inside map only */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(VCOLS)].map((_, i) => (
                <motion.div
                  key={`v${i}`}
                  initial={{ scaleY: 0 }}
                  animate={isInView ? { scaleY: 1 } : {}}
                  transition={{ duration: 1.4, delay: i * 0.04, ease: [0.25, 0.25, 0, 1] }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: `${(i / (VCOLS - 1)) * 100}%`,
                    width: "1px",
                    height: "100%",
                    background: "var(--color-border)",
                    transformOrigin: "top",
                    opacity: 0.4,
                  }}
                />
              ))}
              {[...Array(HROWS)].map((_, i) => (
                <motion.div
                  key={`h${i}`}
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 1.4, delay: i * 0.07, ease: [0.25, 0.25, 0, 1] }}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: `${(i / (HROWS - 1)) * 100}%`,
                    height: "1px",
                    width: "100%",
                    background: "var(--color-border)",
                    transformOrigin: "left",
                    opacity: 0.35,
                  }}
                />
              ))}
            </div>

            {/* World map image */}
            <img
              src="/images/globe.png"
              alt="Global map"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: isDark ? 0.12 : 0.08,
                filter: isDark ? "invert(0)" : "invert(1)",
              }}
            />

            {/* Region dots */}
            {regions.map((region, i) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                className="absolute"
                style={{ left: region.x, top: region.y, transform: "translate(-50%, -50%)" }}
              >
                {/* Ping ring */}
                <motion.div
                  animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "var(--color-primary)",
                    width: "10px",
                    height: "10px",
                    transform: "translate(-50%, -50%)",
                    left: "50%",
                    top: "50%",
                  }}
                />
                <div
                  className="w-2.5 h-2.5 rounded-full relative z-10"
                  style={{ background: "var(--color-primary)" }}
                />
                {/* Label */}
                <div
                  className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap"
                  style={{ color: "var(--color-text)", fontSize: "0.65rem", fontFamily: "monospace" }}
                >
                  <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>
                    {region.clients.toLocaleString()}
                  </span>
                  {" "}{region.name}
                </div>
              </motion.div>
            ))}

            {/* Bottom label */}
            <div
              className="absolute bottom-4 left-5 text-xs font-mono"
              style={{ color: "var(--color-text-muted)", opacity: 0.5 }}
            >
              outsoor / infrastructure / global
            </div>
          </motion.div>

          {/* Stats panel */}
          <div className="grid grid-cols-2 lg:grid-cols-1">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                className="flex flex-col gap-2 p-7"
                style={{
                  borderBottom: i < stats.length - 1 ? "1px solid var(--color-border)" : "none",
                  borderRight: "1px solid var(--color-border)",
                }}
              >
                <stat.icon className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                <span
                  className="font-black font-mono"
                  style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: "var(--color-text)" }}
                >
                  {stat.value}
                </span>
                <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-0"
          style={{ border: "1px solid var(--color-border)" }}
        >
          <div
            className="p-10 flex flex-col gap-6"
            style={{ borderRight: "1px solid var(--color-border)" }}
          >
            <div
              className="text-4xl font-black leading-none"
              style={{ color: "var(--color-border)" }}
            >
              "
            </div>
            <p
              className="text-lg font-medium leading-relaxed"
              style={{ color: "var(--color-text)" }}
            >
              Outsoor reduced our AI infrastructure costs by 60% while improving response times by 3×.
            </p>
            <div className="flex flex-col gap-0.5 mt-auto">
              <span className="text-sm font-bold" style={{ color: "var(--color-text)" }}>Sarah Chen</span>
              <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>CTO, StartupAI</span>
            </div>
          </div>

          <div className="p-10 flex flex-col justify-between gap-8">
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Join thousands of teams running production AI on Outsoor. Start free, scale to enterprise when you're ready.
            </p>
            <div className="flex items-center gap-4">
              <a href="/signup">
                <button
                  className="px-6 py-3 text-sm font-bold transition-opacity hover:opacity-80"
                  style={{ background: "var(--color-primary)", color: "#fff" }}
                >
                  Get Started Free
                </button>
              </a>
              <a href="/case-studies">
                <button
                  className="text-sm font-mono transition-opacity hover:opacity-60"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Read case studies →
                </button>
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}