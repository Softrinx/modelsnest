"use client"

import { useState, useEffect, useCallback } from "react"
import { useTheme } from "@/contexts/themeContext"

const testimonials = [
  {
    quote: "Modelsnest reduced our AI infrastructure costs by 60% while improving response times by 3x. The unified API saved us weeks of integration work.",
    author: "Alex Rodriguez",
    role: "Lead Developer",
    company: "TechFlow",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  {
    quote: "When we needed custom deployment for compliance, their team worked with us every step of the way. True partnership, not just a vendor.",
    author: "Maria Johnson",
    role: "VP Engineering",
    company: "DataSecure",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  },
  {
    quote: "Millions of API calls daily. The reliability and performance at scale is exactly what production workloads demand. Zero downtime in 18 months.",
    author: "David Kim",
    role: "CTO",
    company: "ScaleAI",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
  },
  {
    quote: "From documentation to SDKs to support — everything just works. Our team was productive from day one. The DX is phenomenal.",
    author: "Emily Zhang",
    role: "Senior Engineer",
    company: "BuildFast",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  },
  {
    quote: "Transparent pricing, no surprise bills. Finally an AI API provider that delivers on every promise. We scaled from 0 to 500K users without a hitch.",
    author: "Michael Brown",
    role: "Product Manager",
    company: "StartupLab",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
  },
]

function getState(index: number, current: number, total: number) {
  const offset = ((index - current) % total + total) % total
  if (offset === 0) return "center"
  if (offset === 1) return "right"
  if (offset === 2) return "far-right"
  if (offset === total - 1) return "left"
  if (offset === total - 2) return "far-left"
  return "hidden"
}

const stateStyles: Record<string, React.CSSProperties> = {
  center: {
    transform: "translateX(0) scale(1) rotateY(0deg)",
    opacity: 1,
    zIndex: 10,
  },
  right: {
    transform: "translateX(280px) scale(0.82) rotateY(-18deg)",
    opacity: 0.35,
    zIndex: 5,
  },
  "far-right": {
    transform: "translateX(430px) scale(0.68) rotateY(-24deg)",
    opacity: 0.12,
    zIndex: 3,
  },
  left: {
    transform: "translateX(-280px) scale(0.82) rotateY(18deg)",
    opacity: 0.35,
    zIndex: 5,
  },
  "far-left": {
    transform: "translateX(-430px) scale(0.68) rotateY(24deg)",
    opacity: 0.12,
    zIndex: 3,
  },
  hidden: {
    transform: "translateX(600px) scale(0.6) rotateY(-30deg)",
    opacity: 0,
    zIndex: 1,
    pointerEvents: "none" as const,
  },
}

export function Testimonials() {
  const { isDark } = useTheme()
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const n = testimonials.length

  const go = useCallback(
    (dir: number) => {
      if (animating) return
      setAnimating(true)
      setCurrent((prev) => ((prev + dir) % n + n) % n)
      setTimeout(() => setAnimating(false), 500)
    },
    [animating, n]
  )

  useEffect(() => {
    const timer = setInterval(() => go(1), 4500)
    return () => clearInterval(timer)
  }, [go])

  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <p
          className="text-xs font-mono tracking-widest uppercase mb-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          Testimonials
        </p>
        <h2
          style={{
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "var(--color-text)",
          }}
        >
          What developers{" "}
          <span
            style={{
              background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            are saying
          </span>
        </h2>
      </div>

      {/* Stage */}
      <div
        className="relative flex justify-center items-center"
        style={{ minHeight: "280px", perspective: "1000px" }}
      >
        {testimonials.map((t, i) => {
          const state = getState(i, current, n)
          const isCenter = state === "center"
          return (
            <div
              key={i}
              onClick={() => {
                if (animating || isCenter) return
                const offset = ((i - current) % n + n) % n
                go(offset > n / 2 ? -1 : 1)
              }}
              style={{
                position: "absolute",
                width: "340px",
                padding: "28px",
                background: "var(--color-surface-2)",
                border: isCenter
                  ? "1px solid var(--color-primary)"
                  : "1px solid var(--color-border)",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                cursor: isCenter ? "default" : "pointer",
                transition:
                  "transform 0.55s cubic-bezier(0.34,1.28,0.64,1), opacity 0.4s ease, border-color 0.3s ease",
                willChange: "transform, opacity",
                ...stateStyles[state],
              }}
            >
              {/* Quote mark */}
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: 900,
                  lineHeight: 0.6,
                  color: "var(--color-primary)",
                  opacity: 0.25,
                  userSelect: "none",
                  fontFamily: "Georgia, serif",
                }}
              >
                "
              </div>

              {/* Quote text */}
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.65,
                  color: "var(--color-text-muted)",
                  flex: 1,
                }}
              >
                {t.quote}
              </p>

              {/* Author */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  paddingTop: "14px",
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                <img
                  src={t.image}
                  alt={t.author}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                    filter: isDark ? "grayscale(20%)" : "grayscale(30%)",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "var(--color-text)",
                    }}
                  >
                    {t.author}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-muted)",
                      fontFamily: "monospace",
                      marginTop: "2px",
                    }}
                  >
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 mt-10">
        <button
          onClick={() => go(-1)}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
            color: "var(--color-text)",
            cursor: "pointer",
            fontSize: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s",
          }}
        >
          ←
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <div
              key={i}
              onClick={() => {
                if (i === current) return
                go(i > current ? 1 : -1)
              }}
              style={{
                height: "6px",
                borderRadius: "3px",
                background:
                  i === current
                    ? "var(--color-primary)"
                    : "var(--color-border)",
                width: i === current ? "20px" : "6px",
                transition: "width 0.3s ease, background 0.3s ease",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
            color: "var(--color-text)",
            cursor: "pointer",
            fontSize: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s",
          }}
        >
          →
        </button>
      </div>
    </section>
  )
}