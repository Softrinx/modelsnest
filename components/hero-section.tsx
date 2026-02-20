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
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-primary)" }}
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
      className="relative flex flex-col overflow-hidden"
      style={{
        background: "var(--color-bg)",
        minHeight: "100svh",
        paddingBottom: "100px", // clearance so vision intrude doesn't cover content
      }}
    >
      <Header />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto w-full px-6 lg:px-12 gap-8 lg:gap-16 items-center pt-24 pb-10 lg:py-0">

        {/* Left — copy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col gap-6 order-1"
        >
          <div className="flex flex-col gap-4">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                color: "var(--color-text)",
                fontSize: "clamp(1.9rem, 6vw, 5.5rem)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
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
              style={{
                color: "var(--color-text-muted)",
                fontSize: "clamp(0.95rem, 2vw, 1.125rem)",
                lineHeight: 1.7,
                maxWidth: "30rem",
              }}
            >
              One API. 50+ models. Production-ready infrastructure with sub-200ms latency and 99.99% uptime. Ship AI features in minutes, not months.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="h-auto rounded-xl font-bold gap-2.5 transition-all duration-200 hover:opacity-90"
                style={{
                  background: "var(--color-primary)",
                  color: "#fff",
                  padding: "clamp(0.6rem, 1.5vw, 0.9rem) clamp(1.2rem, 2.5vw, 1.75rem)",
                  fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
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
                className="h-auto rounded-xl font-semibold gap-2 transition-colors duration-200"
                style={{
                  color: "var(--color-text-muted)",
                  padding: "clamp(0.6rem, 1.5vw, 0.9rem) clamp(1.2rem, 2.5vw, 1.75rem)",
                  fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
                }}
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
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
            style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)", color: "var(--color-text-muted)" }}
          >
            {["No credit card required", "10,000 free API calls", "Setup in 30 seconds"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--color-success)" }} />
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — Lottie */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="order-2 w-full"
          style={{ height: "clamp(260px, 45vw, 600px)" }}
        >
          <LottieAnimation />
        </motion.div>
      </div>
    </section>
  )
}