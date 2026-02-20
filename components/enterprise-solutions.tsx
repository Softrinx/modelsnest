"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import { useTheme } from "@/contexts/themeContext"
import { Shield, Cloud, Settings, Award, Lock, Headphones } from "lucide-react"

const features = [
  {
    icon: Cloud,
    title: "Custom Deployments",
    description: "Private cloud, on-premises, or hybrid — tailored to your infrastructure.",
  },
  {
    icon: Settings,
    title: "White-Label Solutions",
    description: "Rebrand our APIs as your own. Complete control over the user experience.",
  },
  {
    icon: Shield,
    title: "Enterprise SLAs",
    description: "99.99% uptime guarantees, dedicated support, priority access to new models.",
  },
  {
    icon: Award,
    title: "Compliance",
    description: "SOC 2 Type II, ISO 27001, GDPR, HIPAA. Enterprise-grade certifications.",
  },
  {
    icon: Lock,
    title: "Advanced Security",
    description: "End-to-end encryption, VPC peering, SSO integration, full audit logs.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "24/7 technical support, dedicated account managers, custom integration help.",
  },
]

export function EnterpriseSolutions() {
  const { isDark } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <section
      id="enterprise"
      ref={ref}
      className="relative py-32 overflow-hidden"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Vertical rule lines — decorative, like Novita's bars */}
      <div className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none overflow-hidden hidden lg:flex items-stretch">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.05 * i, ease: [0.25, 0.25, 0, 1] }}
            style={{
              flex: 1,
              borderRight: "1px solid var(--color-border)",
              transformOrigin: "top",
              opacity: 1 - i * 0.1,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: "var(--color-primary)" }}
          >
            Enterprise
          </span>
        </motion.div>

        {/* Main grid — feature list left, detail right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-0"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          {/* Left — feature rows */}
          <div style={{ borderRight: "1px solid var(--color-border)" }}>
            {features.map((f, i) => (
              <motion.button
                key={f.title}
                initial={{ opacity: 0, x: -16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                onClick={() => setActiveFeature(i)}
                className="w-full flex items-start gap-5 px-8 py-7 text-left transition-all duration-150 group"
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  background: activeFeature === i
                    ? `color-mix(in srgb, var(--color-primary) 5%, transparent)`
                    : "transparent",
                }}
              >
                {/* Number */}
                <span
                  className="text-xs font-mono mt-1 flex-shrink-0 w-6"
                  style={{
                    color: activeFeature === i ? "var(--color-primary)" : "var(--color-border)",
                    transition: "color 0.15s",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <f.icon
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{
                    color: activeFeature === i ? "var(--color-primary)" : "var(--color-text-muted)",
                    transition: "color 0.15s",
                  }}
                />

                {/* Text */}
                <div className="flex flex-col gap-1">
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: activeFeature === i ? "var(--color-text)" : "var(--color-text-muted)",
                      transition: "color 0.15s",
                    }}
                  >
                    {f.title}
                  </span>
                  <span
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--color-text-muted)", opacity: activeFeature === i ? 1 : 0.6 }}
                  >
                    {f.description}
                  </span>
                </div>

                {/* Active indicator */}
                {activeFeature === i && (
                  <div
                    className="ml-auto flex-shrink-0 self-center w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--color-primary)" }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Right — big feature callout */}
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col justify-between p-12 lg:p-16"
            style={{
              borderBottom: "1px solid var(--color-border)",
              minHeight: "420px",
            }}
          >
            <div className="flex flex-col gap-8">
              <div
                className="w-16 h-16 flex items-center justify-center"
                style={{
                  border: "1px solid var(--color-primary)",
                  color: "var(--color-primary)",
                }}
              >
                {(() => {
                  const Icon = features[activeFeature].icon
                  return <Icon className="w-7 h-7" />
                })()}
              </div>

              <div className="flex flex-col gap-4">
                <h2
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    color: "var(--color-text)",
                  }}
                >
                  {features[activeFeature].title}
                </h2>
                <p
                  className="text-lg leading-relaxed max-w-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {features[activeFeature].description}
                </p>
              </div>
            </div>

            <Link href="/enterprise">
              <button
                className="self-start flex items-center gap-3 text-sm font-mono font-bold transition-opacity hover:opacity-70 mt-8"
                style={{ color: "var(--color-primary)" }}
              >
                Learn more
                <span>→</span>
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Bottom CTA — split panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ border: "1px solid var(--color-border)", borderTop: "none" }}
        >
          <div
            className="p-10 flex flex-col gap-6"
            style={{ background: "var(--color-primary)" }}
          >
            <p className="text-xs font-mono tracking-widest uppercase text-white opacity-70">
              Enterprise
            </p>
            <h3 className="text-3xl font-black leading-tight text-white">
              Ready to Scale Your AI Infrastructure?
            </h3>
            <Link href="/enterprise">
              <button
                className="self-start px-6 py-3 text-sm font-bold transition-opacity hover:opacity-80"
                style={{ background: "#fff", color: "var(--color-primary)" }}
              >
                Request Enterprise Access
              </button>
            </Link>
          </div>

          <div
            className="p-10 flex flex-col gap-6"
            style={{ background: "var(--color-surface-2)", borderLeft: "1px solid var(--color-border)" }}
          >
            <p className="text-xs font-mono tracking-widest uppercase" style={{ color: "var(--color-text-muted)" }}>
              Fortune 500 trusted
            </p>
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Join enterprises worldwide running mission-critical AI on Outsoor. Dedicated infra, custom contracts, zero compromise.
            </p>
            <Link href="/demo">
              <button
                className="self-start px-6 py-3 text-sm font-bold transition-colors hover:opacity-80"
                style={{
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                  background: "transparent",
                }}
              >
                Schedule Demo
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}