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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
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
        className="relative overflow-hidden cursor-default"
        style={{
          background: "var(--color-surface-2)",
          border: `1px solid ${hovered ? api.accent : "var(--color-border)"}`,
          transition: "border-color 0.2s ease",
        }}
      >
        {/* Corner paint fill on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${api.accent}18 0%, transparent 65%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        />

        {/* Top-left corner accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: hovered ? "100%" : "0%",
            height: "2px",
            background: api.accent,
            transition: "width 0.35s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "2px",
            height: hovered ? "100%" : "0%",
            background: api.accent,
            transition: "height 0.35s ease",
          }}
        />

        <div className="relative z-10 p-7 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <api.icon className="w-6 h-6" style={{ color: api.accent }} />
              <span
                className="text-xs font-mono font-bold tracking-widest uppercase"
                style={{ color: api.accent }}
              >
                {api.category}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--color-success)" }}
              />
              <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                {api.metrics}
              </span>
            </div>
          </div>

          {/* Title + description */}
          <div className="flex flex-col gap-2">
            <h3
              className="text-xl font-bold leading-tight"
              style={{ color: "var(--color-text)" }}
            >
              {api.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              {api.description}
            </p>
          </div>

          {/* Models */}
          <div className="flex flex-wrap gap-1.5">
            {api.models.map((m) => (
              <span
                key={m}
                className="text-xs font-mono px-2 py-0.5"
                style={{
                  color: "var(--color-text-muted)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {m}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between pt-4 text-xs font-mono"
            style={{
              borderTop: "1px solid var(--color-border)",
              color: "var(--color-text-muted)",
            }}
          >
            <span>{api.requests}</span>
            <span style={{ color: api.accent }}>LIVE ↗</span>
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
      className="py-32 px-6 relative"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-4 max-w-2xl"
        >
          <span
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: "var(--color-primary)" }}
          >
            50+ Models Available
          </span>
          <h2
            className="text-4xl md:text-5xl font-black leading-tight tracking-tight"
            style={{ color: "var(--color-text)" }}
          >
            One Platform,{" "}
            <span
              style={{
                background: "linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-secondary))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Every AI Model
            </span>
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            Production-ready APIs with consistent interfaces, transparent pricing, and enterprise-grade reliability. Switch models without changing your code.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {apis.map((api, i) => (
            <div key={api.title} style={{ background: "var(--color-bg)" }}>
              <ApiCard api={api} index={i} isInView={isInView} />
            </div>
          ))}
        </div>

        {/* CTA — split panel like Novita */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ border: "1px solid var(--color-border)" }}
        >
          {/* Left — primary color block */}
          <div
            className="p-10 flex flex-col justify-between gap-8"
            style={{ background: "var(--color-primary)" }}
          >
            <h3 className="text-3xl md:text-4xl font-black leading-tight text-white">
              Ready to integrate any AI model?
            </h3>
            <Link href="/signup">
              <button
                className="self-start px-6 py-3 font-bold text-sm transition-opacity hover:opacity-80"
                style={{
                  background: "#fff",
                  color: "var(--color-primary)",
                }}
              >
                Get Started Free
              </button>
            </Link>
          </div>

          {/* Right  */}
          <div
            className="p-10 flex flex-col justify-between gap-8"
            style={{ background: "var(--color-surface-2)" }}
          >
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Start with 10,000 free API calls. No credit card required. Scale to billions when you're ready.
            </p>
            <Link href="/docs">
              <button
                className="self-start px-6 py-3 font-bold text-sm transition-colors hover:opacity-80"
                style={{
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  background: "transparent",
                }}
              >
                View API Docs
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}