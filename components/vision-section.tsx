"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/contexts/themeContext"

const logos = [
  "/logos/logo01.svg",
  "/logos/logo02.svg",
  "/logos/logo03.svg",
  "/logos/logo04.svg",
  "/logos/logo05.svg",
  "/logos/logo06.svg",
  "/logos/logo07.svg",
  "/logos/logo08.svg",
]

const track = [...logos, ...logos, ...logos]

export function VisionSection() {
  const { isDark } = useTheme()

  return (
    <>
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 24s linear infinite;
          align-items: center;
        }
      `}</style>

      <section
        className="relative overflow-hidden"
        style={{
          background: isDark ? "var(--color-surface-1)" : "var(--color-surface-2)",
          marginTop: "-80px",
          paddingTop: "clamp(100px, 14vw, 160px)",
          paddingBottom: "clamp(60px, 8vw, 100px)",
          borderRadius: "3.5rem 3.5rem 0 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-5"
          >
            <h2
              style={{
                color: "var(--color-text)",
                fontSize: "clamp(1.9rem, 4vw, 3.2rem)",
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
              }}
            >
              Making AI{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Accessible
              </span>{" "}
              to Everyone, Everywhere
            </h2>

            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "clamp(0.9rem, 1.8vw, 1.05rem)",
                lineHeight: 1.7,
                maxWidth: "32rem",
              }}
            >
              We believe artificial intelligence should be a force multiplier for every developer, startup, and enterprise. Outsoor breaks down barriers with unified APIs, transparent pricing, and infrastructure that scales from your first API call to billions.
            </p>

            <div
              className="w-16 h-0.5 rounded-full"
              style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-success))" }}
            />
          </motion.div>

          {/* Right — scrolling logos */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="overflow-hidden w-full"
            style={{
              maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
            }}
          >
            <div className="marquee-track">
              {track.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  style={{
                    flexShrink: 0,
                    height: "clamp(1.8rem, 3.5vw, 2.75rem)",
                    width: "auto",
                    objectFit: "contain",
                    marginRight: "clamp(1rem, 2.5vw, 1.5rem)",
                    filter: isDark
                      ? "brightness(0) invert(1) opacity(0.55)"
                      : "brightness(0) opacity(0.4)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}