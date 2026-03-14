"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { useTheme } from "@/contexts/themeContext"

const logos = [
  { src: "/logos/logo01.svg", alt: "OpenAI" },
  { src: "/logos/logo02.svg", alt: "Stripe" },
  { src: "/logos/logo03.svg", alt: "Wise" },
  { src: "/logos/logo04.svg", alt: "Retool" },
  { src: "/logos/logo05.svg", alt: "Medium" },
  { src: "/logos/logo06.svg", alt: "Loom" },
  { src: "/logos/logo07.svg", alt: "Cash App" },
  { src: "/logos/logo08.svg", alt: "Linear" },
]

const track = [...logos, ...logos]

export function TrustSignals() {
  const { isDark } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <>
      <style jsx>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .logo-track {
          display: flex;
          width: max-content;
          animation: scroll-left 28s linear infinite;
        }
        .logo-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section
        ref={ref}
        className="relative py-16 overflow-hidden"
        style={{ background: "var(--color-bg)" }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: "var(--color-text-muted)", opacity: 0.6 }}
          >
            Trusted by teams at
          </p>
        </motion.div>

        {/* Logo strip — fade edges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="overflow-hidden"
          style={{
            maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="logo-track" style={{ gap: "0px" }}>
            {track.map((logo, i) => (
              <div
                key={i}
                style={{
                  width: "160px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 32px",
                  borderRight: "1px solid var(--color-border)",
                  height: "60px",
                }}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={80}
                  height={28}
                  style={{
                    objectFit: "contain",
                    filter: isDark
                      ? "brightness(0) invert(1) opacity(0.35)"
                      : "brightness(0) opacity(0.25)",
                    transition: "filter 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = isDark
                      ? "brightness(0) invert(1) opacity(0.8)"
                      : "brightness(0) opacity(0.6)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = isDark
                      ? "brightness(0) invert(1) opacity(0.35)"
                      : "brightness(0) opacity(0.25)"
                  }}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  )
}