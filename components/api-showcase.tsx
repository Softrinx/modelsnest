"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import { useTheme } from "@/contexts/themeContext"
import {
  AnimatedMessageSquare,
  AnimatedImageIcon,
  AnimatedMic,
  AnimatedVolume2,
  AnimatedBrain,
  AnimatedLayers,
} from "./animated-icons"

const apis = [
  {
    icon: AnimatedMessageSquare,
    category: "Language",
    title: "Text Generation",
    description: "GPT-4, Claude, Llama and more — consistent APIs with intelligent routing across every major LLM.",
    metrics: "< 200ms",
    requests: "2.1M/day",
    models: ["GPT-4", "Claude-3", "Llama-2", "PaLM-2"],
    accent: "var(--color-success)",
  },
  {
    icon: AnimatedImageIcon,
    category: "Vision",
    title: "Text-to-Image",
    description: "DALL-E, Midjourney, Stable Diffusion — unified interface with advanced prompt optimization.",
    metrics: "< 3s",
    requests: "450K/day",
    models: ["DALL-E 3", "Midjourney", "SD-XL", "Firefly"],
    accent: "var(--color-danger)",
  },
  {
    icon: AnimatedMic,
    category: "Audio",
    title: "Speech-to-Text",
    description: "Whisper, AssemblyAI, Deepgram — 100+ languages, speaker diarization, noise reduction.",
    metrics: "< 500ms",
    requests: "1.8M/day",
    models: ["Whisper-v3", "AssemblyAI", "Deepgram", "Rev.ai"],
    accent: "var(--color-primary)",
  },
  {
    icon: AnimatedVolume2,
    category: "Audio",
    title: "AI Voice",
    description: "Natural voice synthesis and cloning — emotional control, real-time streaming.",
    metrics: "< 1s",
    requests: "320K/day",
    models: ["ElevenLabs", "Murf", "Resemble", "Speechify"],
    accent: "var(--color-success)",
  },
  {
    icon: AnimatedBrain,
    category: "ML",
    title: "Embeddings",
    description: "Vector embeddings for RAG, search, similarity — advanced semantic understanding at scale.",
    metrics: "< 100ms",
    requests: "5.2M/day",
    models: ["OpenAI", "Cohere", "Sentence-T", "E5"],
    accent: "var(--color-danger)",
  },
  {
    icon: AnimatedLayers,
    category: "Hybrid",
    title: "Multimodal",
    description: "Vision, audio, text in one API — cross-modal understanding and reasoning.",
    metrics: "< 800ms",
    requests: "180K/day",
    models: ["GPT-4V", "Gemini-Pro", "Claude-3", "LLaVA"],
    accent: "var(--color-primary)",
  },
]

function ApiCard({ api, index, isInView }: { api: typeof apis[0]; index: number; isInView: boolean }) {
  const { isDark } = useTheme()
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [hovered, setHovered]   = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width)  * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.25, 0, 1] }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative", overflow: "hidden", cursor: "default",
          background: "var(--color-surface-2)",
          border: `1px solid ${hovered ? api.accent : "var(--color-border)"}`,
          transition: "border-color 0.2s ease",
        }}
      >
        {/* Mouse-follow spotlight */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, color-mix(in srgb,${api.accent} 12%,transparent) 0%, transparent 65%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }} />

        {/* Top accent line — grows full width */}
        <div style={{
          position: "absolute", top: 0, left: 0, height: "2px",
          width: hovered ? "100%" : "0%",
          background: api.accent,
          transition: "width 0.35s ease",
        }} />
        {/* Left accent line — grows full height */}
        <div style={{
          position: "absolute", top: 0, left: 0, width: "2px",
          height: hovered ? "100%" : "0%",
          background: api.accent,
          transition: "height 0.35s ease",
        }} />

        <div style={{ position: "relative", zIndex: 1, padding: "28px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <motion.div animate={{ color: hovered ? api.accent : "var(--color-text-muted)" }} transition={{ duration: 0.2 }}>
                <api.icon style={{ width: 22, height: 22 }} />
              </motion.div>
              <span style={{
                fontSize: 10, fontFamily: "monospace", fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase", color: api.accent,
              }}>
                {api.category}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-success)" }}
              />
              <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--color-text-muted)" }}>
                {api.metrics}
              </span>
            </div>
          </div>

          {/* Title + description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <h3 style={{
              fontSize: 20, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.03em",
              color: "var(--color-text)", margin: 0,
            }}>
              {api.title}
            </h3>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--color-text-muted)", margin: 0 }}>
              {api.description}
            </p>
          </div>

          {/* Model pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {api.models.map(m => (
              <span key={m} style={{
                fontSize: 11, fontFamily: "monospace", padding: "3px 8px",
                color: "var(--color-text-muted)", border: "1px solid var(--color-border)",
              }}>
                {m}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingTop: 16, borderTop: "1px solid var(--color-border)",
            fontSize: 11, fontFamily: "monospace",
          }}>
            <span style={{ color: "var(--color-text-muted)" }}>{api.requests}</span>
            <motion.span
              animate={{ opacity: hovered ? 1 : 0.5 }}
              style={{ color: api.accent, fontWeight: 700, cursor: "pointer" }}
            >
              LIVE ↗
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ApiShowcase() {
  const { isDark } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      id="apis"
      ref={ref}
      style={{ padding: "120px 24px", background: "var(--color-bg)", position: "relative" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: "column", gap: 64 }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 680 }}
        >
          <span style={{
            fontSize: 11, fontFamily: "monospace", letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--color-primary)",
          }}>
            50+ Models Available
          </span>
          <h2 style={{
            fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, lineHeight: 1.05,
            letterSpacing: "-0.04em", color: "var(--color-text)", margin: 0,
          }}>
            One Platform,{" "}
            <span style={{
              background: "linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-secondary))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Every AI Model
            </span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--color-text-muted)", margin: 0 }}>
            Production-ready APIs with consistent interfaces, transparent pricing, and enterprise-grade reliability.
            Switch models without changing your code.
          </p>
        </motion.div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1px",
          background: "var(--color-border)",
        }}>
          {apis.map((api, i) => (
            <div key={api.title} style={{ background: "var(--color-bg)" }}>
              <ApiCard api={api} index={i} isInView={isInView} />
            </div>
          ))}
        </div>

        {/* CTA — split panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* Left — solid primary fill */}
          <div style={{
            padding: "48px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between",
            gap: 32, background: "var(--color-primary)", position: "relative", overflow: "hidden",
          }}>
            {/* Subtle grid on primary panel */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.08) 1px,transparent 1px)",
              backgroundSize: "22px 22px" }} />
            <h3 style={{
              fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, lineHeight: 1.1,
              letterSpacing: "-0.04em", color: "#ffffff", margin: 0, position: "relative", zIndex: 1,
            }}>
              Ready to integrate any AI model?
            </h3>
            <Link href="/signup" style={{ textDecoration: "none", position: "relative", zIndex: 1, alignSelf: "flex-start" }}>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{
                  padding: "12px 24px", fontWeight: 700, fontSize: 14,
                  background: "#ffffff", color: "var(--color-primary)", border: "none", cursor: "pointer",
                }}
              >
                Get Started Free
              </motion.button>
            </Link>
          </div>

          {/* Right — surface */}
          <div style={{
            padding: "48px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between",
            gap: 32, background: "var(--color-surface-2)",
          }}>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--color-text-muted)", margin: 0 }}>
              Start with <strong style={{ color: "var(--color-text)" }}>10,000 free API calls</strong>. No credit card required.
              Scale to billions when you're ready.
            </p>
            <Link href="/docs" style={{ textDecoration: "none", alignSelf: "flex-start" }}>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{
                  padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer",
                  border: "1px solid var(--color-border)", color: "var(--color-text)", background: "transparent",
                }}
              >
                View API Docs
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}