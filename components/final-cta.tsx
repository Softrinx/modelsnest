"use client"

import { motion, useInView, useAnimationFrame } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import { useTheme } from "@/contexts/themeContext"
import { ArrowRight, MessageSquare } from "lucide-react"

// Animated counting number
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  const startRef = useRef<number | null>(null)
  const duration = 1800

  useAnimationFrame((t) => {
    if (!isInView) return
    if (startRef.current === null) startRef.current = t
    const elapsed = t - startRef.current
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    setVal(Math.floor(eased * to))
  })

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

const counters = [
  { label: "Developers",   to: 10000, suffix: "+" },
  { label: "API Calls/mo", to: 1200,  suffix: "M+" },
  { label: "Models",       to: 50,    suffix: "+" },
  { label: "Uptime",       to: 99,    suffix: ".99%" },
]

export function FinalCTA() {
  const { isDark } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null)

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Top separator */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--color-border), transparent)" }}
      />

      {/* Big ghost text background */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.25, 0.25, 0, 1] }}
          style={{
            fontSize: "clamp(8rem, 20vw, 22rem)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.06em",
            color: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.025)",
            whiteSpace: "nowrap",
          }}
        >
          BUILD
        </motion.div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 flex flex-col gap-20">

        {/* Counter row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ borderTop: "1px solid var(--color-border)", borderLeft: "1px solid var(--color-border)" }}
        >
          {counters.map((c) => (
            <div
              key={c.label}
              className="flex flex-col gap-1 px-8 py-6"
              style={{ borderRight: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}
            >
              <span
                className="font-black font-mono"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", color: "var(--color-text)" }}
              >
                <CountUp to={c.to} suffix={c.suffix} />
              </span>
              <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                {c.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Main CTA block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0"
          style={{ border: "1px solid var(--color-border)" }}
        >
          {/* Left — headline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="p-10 lg:p-14 flex flex-col gap-6 justify-between"
            style={{ borderRight: "1px solid var(--color-border)" }}
          >
            <div className="flex flex-col gap-5">
              <span
                className="text-xs font-mono tracking-widest uppercase"
                style={{ color: "var(--color-primary)" }}
              >
                Ready to ship
              </span>
              <h2
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  color: "var(--color-text)",
                }}
              >
                Build Production
                <br />
                AI{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-secondary))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  In Minutes
                </span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-4">
              {["No credit card required", "10,000 free calls", "30 second setup"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "var(--color-success)" }}
                  />
                  <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="p-10 lg:p-14 flex flex-col gap-6 justify-center"
            style={{ background: isDark ? "var(--color-surface-2)" : "var(--color-surface-3)" }}
          >
            <p className="text-base leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Join thousands of developers building the next generation of AI applications with enterprise-grade infrastructure.
            </p>

            <div className="flex flex-col gap-3">
              <Link href="/signup">
                <motion.button
                  onMouseEnter={() => setHoveredBtn("primary")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  className="w-full flex items-center justify-between px-7 py-4 font-bold text-base transition-all duration-200"
                  style={{
                    background: hoveredBtn === "primary" ? "var(--color-accent)" : "var(--color-primary)",
                    color: "#fff",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Start Building Free</span>
                  <motion.span
                    animate={{ x: hoveredBtn === "primary" ? 4 : 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </motion.button>
              </Link>

              <Link href="/contact">
                <motion.button
                  onMouseEnter={() => setHoveredBtn("secondary")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  className="w-full flex items-center justify-between px-7 py-4 font-bold text-base transition-all duration-200"
                  style={{
                    border: `1px solid ${hoveredBtn === "secondary" ? "var(--color-primary)" : "var(--color-border)"}`,
                    color: hoveredBtn === "secondary" ? "var(--color-primary)" : "var(--color-text-muted)",
                    background: "transparent",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Talk to Sales</span>
                  <MessageSquare className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 pt-2">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--color-success)" }}
              />
              <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                All systems operational · 99.99% uptime
              </span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}