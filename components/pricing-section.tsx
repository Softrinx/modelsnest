"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import { useTheme } from "@/contexts/themeContext"
import { Check, Zap, Building2, Rocket } from "lucide-react"

const plans = [
  {
    key: "starter",
    icon: Rocket,
    label: "Starter",
    price: "Free",
    sub: "10,000 calls to get started",
    features: [
      "10,000 API calls included",
      "Access to 20+ models",
      "Community support",
      "Real-time analytics",
      "Global infrastructure",
    ],
    cta: "Start Free",
    href: "/signup",
    accent: "var(--color-success)",
  },
  {
    key: "usage",
    icon: Zap,
    label: "Pay as you scale",
    price: "$0.001",
    sub: "per 1K tokens, no monthly fees",
    features: [
      "All 50+ models",
      "No monthly commitment",
      "Priority routing",
      "Advanced analytics",
      "Email support",
      "99.99% SLA",
    ],
    cta: "Start Building",
    href: "/signup",
    accent: "var(--color-primary)",
    featured: true,
  },
  {
    key: "enterprise",
    icon: Building2,
    label: "Enterprise",
    price: "Custom",
    sub: "volume discounts + dedicated infra",
    features: [
      "Unlimited volume",
      "Private deployment",
      "Dedicated support",
      "SOC2 / HIPAA / GDPR",
      "Custom SLA",
      "White-label option",
    ],
    cta: "Talk to Sales",
    href: "/enterprise",
    accent: "var(--color-accent)",
  },
]

function PlanCard({ plan, index, isInView }: { plan: typeof plans[0]; index: number; isInView: boolean }) {
  const { isDark } = useTheme()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.25, 0, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col"
      style={{
        background: plan.featured
          ? isDark ? "var(--color-surface-2)" : "var(--color-surface-3)"
          : "transparent",
        border: `1px solid ${hovered || plan.featured ? plan.accent : "var(--color-border)"}`,
        transition: "border-color 0.2s ease",
      }}
    >
      {/* Featured top bar */}
      {plan.featured && (
        <div
          className="h-0.5 w-full absolute top-0 left-0"
          style={{ background: plan.accent }}
        />
      )}

      {/* Corner paint on hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 0% 0%, ${plan.accent}12 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />

      <div className="relative z-10 p-8 flex flex-col gap-8 h-full">

        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{
                border: `1px solid ${plan.accent}`,
                color: plan.accent,
              }}
            >
              <plan.icon className="w-5 h-5" />
            </div>
            {plan.featured && (
              <span
                className="text-xs font-mono px-3 py-1"
                style={{
                  border: `1px solid ${plan.accent}`,
                  color: plan.accent,
                }}
              >
                POPULAR
              </span>
            )}
          </div>

          <div>
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: "var(--color-text-muted)" }}
            >
              {plan.label}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "var(--color-text)",
              }}
            >
              {plan.price}
            </span>
            <span className="text-sm font-mono" style={{ color: "var(--color-text-muted)" }}>
              {plan.sub}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--color-border)" }} />

        {/* Features */}
        <ul className="flex flex-col gap-3 flex-1">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-3">
              <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: plan.accent }} />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link href={plan.href}>
          <button
            className="w-full py-3.5 text-sm font-bold transition-all duration-200"
            style={plan.featured ? {
              background: plan.accent,
              color: "#fff",
            } : {
              border: `1px solid ${hovered ? plan.accent : "var(--color-border)"}`,
              color: hovered ? plan.accent : "var(--color-text-muted)",
              background: "transparent",
              transition: "all 0.2s ease",
            }}
          >
            {plan.cta}
          </button>
        </Link>
      </div>
    </motion.div>
  )
}

export function PricingSection() {
  const { isDark } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      id="pricing"
      ref={ref}
      className="relative py-32 overflow-hidden"
      style={{ background: isDark ? "var(--color-surface-1)" : "var(--color-surface-2)" }}
    >
      {/* Animated vertical rule bars on left — mirror of enterprise */}
      <div className="absolute left-0 top-0 bottom-0 w-48 pointer-events-none overflow-hidden hidden lg:flex items-stretch">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.05 * i, ease: [0.25, 0.25, 0, 1] }}
            style={{
              flex: 1,
              borderLeft: "1px solid var(--color-border)",
              transformOrigin: "bottom",
              opacity: 1 - i * 0.15,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col gap-16">

        {/* Header */}
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
              Pricing
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
              Simple,{" "}
              <span style={{
                background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Transparent
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
            No hidden fees. No monthly commitments. Pay only for what you use — start free and scale to enterprise when you're ready.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px"
          style={{ background: "var(--color-border)" }}
        >
          {plans.map((plan, i) => (
            <div key={plan.key} style={{ background: isDark ? "var(--color-surface-1)" : "var(--color-surface-2)" }}>
              <PlanCard plan={plan} index={i} isInView={isInView} />
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-sm font-mono"
          style={{ color: "var(--color-text-muted)" }}
        >
          All plans include global infrastructure, 99.99% uptime, and end-to-end encryption.
          <Link href="/pricing" className="ml-2 hover:opacity-70 transition-opacity" style={{ color: "var(--color-primary)" }}>
            Full pricing details →
          </Link>
        </motion.p>

      </div>
    </section>
  )
}