"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Header } from "./header"
import { useTheme } from "@/contexts/themeContext"
import { AnimatedRocket, AnimatedArrowRight } from "./animated-icons"
import { useEffect, useRef, useState } from "react"

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
    <div className="relative w-full h-full flex items-center justify-center">
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: "var(--color-text-muted)" }}
        >
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
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

export function HeroSection() {
  const { isDark } = useTheme()

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "var(--color-bg)" }}
    >
      <Header />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto w-full px-6 lg:px-12 gap-4 lg:gap-16 items-center py-12 lg:py-0">

        {/* Left — copy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col gap-8 order-1"
        >
          <div className="flex flex-col gap-5">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-display font-black leading-none tracking-tighter"
              style={{ color: "var(--color-text)" }}
            >
              Enterprise
              <br />
              AI APIs
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-secondary))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Built for Scale
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg leading-relaxed max-w-md"
              style={{ color: "var(--color-text-muted)" }}
            >
              One API. 50+ models. Production-ready infrastructure with sub-200ms latency and 99.99% uptime. Ship AI features in minutes, not months.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-3"
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="px-7 py-5 h-auto rounded-xl font-bold text-base gap-2.5 transition-all duration-200 hover:opacity-90"
                style={{
                  background: "var(--color-primary)",
                  color: "#fff",
                  boxShadow: "0 0 28px color-mix(in srgb, var(--color-primary) 40%, transparent)",
                }}
              >
                <AnimatedRocket className="w-4 h-4" />
                Start Building Free
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                size="lg"
                variant="ghost"
                className="px-7 py-5 h-auto rounded-xl font-semibold text-base gap-2 transition-colors duration-200"
                style={{ color: "var(--color-text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
              >
                View Docs
                <AnimatedArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            {["No credit card required", "10,000 free API calls", "Setup in 30 seconds"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "var(--color-success)" }}
                />
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — Lottie animation, no card, no shadow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="order-2 w-full"
          style={{
            height: "clamp(320px, 50vw, 640px)",
          }}
        >
          <LottieAnimation />
        </motion.div>
      </div>
    </section>
  )
}