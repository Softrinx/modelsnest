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
          animation: scroll-left 40s linear infinite;
        }
        .logo-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <section
        ref={ref}
        className="relative py-20 overflow-hidden"
        style={{
          background: isDark ? "#111113" : "#f4f4f2",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p
            style={{
              fontSize: "11px",
              fontFamily: "monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: isDark ? "#71717a" : "#52525b",
            }}
          >
            Trusted by teams at
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)",
          }}
        >
          <div className="logo-track">
            {track.map((logo, i) => (
              <div
                key={i}
                style={{
                  width: "240px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100px",
                  borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)"}`,
                  cursor: "pointer",
                  opacity: 0.75,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.75"
                }}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={56}
                  style={{
                    objectFit: "contain",
                    maxHeight: "56px",
                    width: "auto",
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