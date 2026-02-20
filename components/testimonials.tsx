"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { useTheme } from "@/contexts/themeContext"

const testimonials = [
  {
    quote: "Outsoor reduced our AI infrastructure costs by 60% while improving response times by 3x. The unified API saved us weeks of integration work.",
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
  {
    quote: "Text, image, and audio through one clean API. The multimodal capabilities unlocked product features we thought were years away.",
    author: "Lisa Wang",
    role: "AI Researcher",
    company: "InnovateAI",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
  },
]

// Duplicate tracks for seamless infinite scroll
const trackA = [...testimonials, ...testimonials]
const trackB = [...testimonials.slice(3), ...testimonials.slice(3)]

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  const { isDark } = useTheme()
  return (
    <div
      className="flex-shrink-0 w-80 flex flex-col gap-5 p-7"
      style={{
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
        width: "340px",
      }}
    >
      {/* Quote mark */}
      <div
        className="text-5xl font-black leading-none select-none"
        style={{ color: "var(--color-primary)", opacity: 0.4, lineHeight: 0.8 }}
      >
        "
      </div>

      <p
        className="text-sm leading-relaxed flex-1"
        style={{ color: "var(--color-text)" }}
      >
        {t.quote}
      </p>

      <div
        className="flex items-center gap-3 pt-4"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <img
          src={t.image}
          alt={t.author}
          className="w-10 h-10 object-cover flex-shrink-0"
          style={{ filter: isDark ? "grayscale(20%)" : "grayscale(30%)" }}
        />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
            {t.author}
          </span>
          <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
            {t.role}, {t.company}
          </span>
        </div>
      </div>
    </div>
  )
}

export function Testimonials() {
  const { isDark } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <>
      <style jsx>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .track-left {
          display: flex;
          width: max-content;
          animation: scroll-left 40s linear infinite;
        }
        .track-right {
          display: flex;
          width: max-content;
          animation: scroll-right 34s linear infinite;
        }
        .track-left:hover,
        .track-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section
        ref={ref}
        className="relative py-28 overflow-hidden"
        style={{ background: "var(--color-bg)" }}
      >
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4"
            >
              <span
                className="text-xs font-mono tracking-widest uppercase"
                style={{ color: "var(--color-primary)" }}
              >
                Testimonials
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
                What Developers{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Are Saying
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
              Thousands of developers and enterprises run production AI on Outsoor. Here's what they say.
            </motion.p>
          </div>
        </div>

        {/* Row 1 — scrolls left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 overflow-hidden"
          style={{ maskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)" }}
        >
          <div className="track-left" style={{ gap: "1rem" }}>
            {trackA.map((t, i) => (
              <div key={i} style={{ marginRight: "1rem" }}>
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Row 2 — scrolls right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="overflow-hidden"
          style={{ maskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)" }}
        >
          <div className="track-right" style={{ gap: "1rem" }}>
            {trackB.map((t, i) => (
              <div key={i} style={{ marginRight: "1rem" }}>
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  )
}