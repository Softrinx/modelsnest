"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import { useTheme } from "@/contexts/themeContext"
import {
  Zap,
  Building2,
  Check,
  ArrowRight,
  Shield,
  Globe,
  Clock,
  BarChart3,
  Headphones,
  Lock,
  RefreshCw,
  ChevronDown,
} from "lucide-react"
import { Footer } from "@/components/footer"
import { PageTopBar } from "@/components/page-top-bar"

// ─── Data ────────────────────────────────────────────────────────────────────

const tiers = [
  {
    key: "usage",
    icon: Zap,
    label: "Pay as you scale",
    price: "$50",
    billing: "per 1K tokens, no monthly fees",
    description: "Scale from prototype to production. Only pay for what you consume — no commitments.",
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
    billing: "volume discounts + dedicated infra",
    description: "For teams that need scale, compliance, and white-glove support.",
    features: [
      "Unlimited volume",
      "Private deployment",
      "Dedicated support",
      "SOC2 / HIPAA / GDPR",
      "Custom SLA",
      "White-label option",
    ],
    cta: "Talk to Sales",
    href: "/contact",
    accent: "var(--color-accent)",
    featured: false,
  },
]

const faqs = [
  {
    q: "What counts as a token?",
    a: "A token is roughly 4 characters of text. A page of English prose is approximately 750 tokens. Images and audio have their own token equivalents depending on the model provider.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Every new account gets $10 in free credits to use across any model — no credit card required for the first 7 days.",
  },
  {
    q: "How does billing work?",
    a: "You're billed monthly for the tokens consumed during that period. We support credit card, wire transfer, and invoicing for enterprise customers.",
  },
  {
    q: "Can I switch plans at any time?",
    a: "Absolutely. You can upgrade, downgrade, or cancel at any time from your dashboard. Unused credits are never lost.",
  },
  {
    q: "What is priority routing?",
    a: "Priority routing ensures your requests are served first during high-traffic periods, reducing latency and avoiding rate-limit queues.",
  },
  {
    q: "Do you offer academic or non-profit discounts?",
    a: "Yes. Reach out to our sales team with proof of status and we'll apply appropriate discounts to your account.",
  },
]

const infra = [
  { icon: Globe,      label: "Global infrastructure", detail: "12 regions worldwide" },
  { icon: Shield,     label: "End-to-end encryption",  detail: "TLS 1.3 + at-rest AES-256" },
  { icon: RefreshCw,  label: "99.99% uptime",          detail: "Backed by SLA" },
  { icon: Clock,      label: "< 200ms p50 latency",    detail: "For standard requests" },
  { icon: BarChart3,  label: "Real-time analytics",    detail: "Usage, cost & latency" },
  { icon: Headphones, label: "Human support",          detail: "No bots, ever" },
  { icon: Lock,       label: "SOC2 Type II",           detail: "Audit available on request" },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function TierCard({
  tier,
  index,
  isInView,
}: {
  tier: (typeof tiers)[0]
  index: number
  isInView: boolean
}) {
  const { isDark } = useTheme()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.25, 0, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col h-full"
      style={{
        background: tier.featured
          ? isDark ? "var(--color-surface-2)" : "var(--color-surface-3)"
          : "transparent",
        border: `1px solid ${hovered || tier.featured ? tier.accent : "var(--color-border)"}`,
        transition: "border-color 0.2s ease",
      }}
    >
      {tier.featured && (
        <div className="h-0.5 w-full absolute top-0 left-0" style={{ background: tier.accent }} />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 0% 0%, ${tier.accent}12 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />

      <div className="relative z-10 p-8 flex flex-col gap-8 h-full">
        {/* Icon + badge */}
        <div className="flex items-center justify-between">
          <div
            className="w-10 h-10 flex items-center justify-center"
            style={{ border: `1px solid ${tier.accent}`, color: tier.accent }}
          >
            <tier.icon className="w-5 h-5" />
          </div>
          {tier.featured && (
            <span
              className="text-xs font-mono px-3 py-1"
              style={{ border: `1px solid ${tier.accent}`, color: tier.accent }}
            >
              POPULAR
            </span>
          )}
        </div>

        {/* Label + price */}
        <div className="flex flex-col gap-3">
          <span
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            {tier.label}
          </span>
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
              {tier.price}
            </span>
            <span className="text-sm font-mono" style={{ color: "var(--color-text-muted)" }}>
              {tier.billing}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            {tier.description}
          </p>
        </div>

        <div style={{ height: "1px", background: "var(--color-border)" }} />

        {/* Features */}
        <ul className="flex flex-col gap-3 flex-1">
          {tier.features.map((f) => (
            <li key={f} className="flex items-center gap-3">
              <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tier.accent }} />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link href={tier.href}>
          <button
            className="w-full py-3.5 text-sm font-bold transition-all duration-200"
            style={
              tier.featured
                ? { background: tier.accent, color: "#fff" }
                : {
                    border: `1px solid ${hovered ? tier.accent : "var(--color-border)"}`,
                    color: hovered ? tier.accent : "var(--color-text-muted)",
                    background: "transparent",
                    transition: "all 0.2s ease",
                  }
            }
          >
            {tier.cta}
          </button>
        </Link>
      </div>
    </motion.div>
  )
}

function FaqItem({
  faq,
  index,
  isInView,
}: {
  faq: (typeof faqs)[0]
  index: number
  isInView: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-sm font-semibold pr-8" style={{ color: "var(--color-text)" }}>
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: "var(--color-text-muted)", flexShrink: 0 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        style={{ overflow: "hidden" }}
      >
        <p className="text-sm leading-relaxed pb-5" style={{ color: "var(--color-text-muted)" }}>
          {faq.a}
        </p>
      </motion.div>
    </motion.div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const { isDark } = useTheme()
  const heroRef  = useRef(null)
  const tiersRef = useRef(null)
  const infraRef = useRef(null)
  const faqRef   = useRef(null)
  const ctaRef   = useRef(null)

  const heroInView  = useInView(heroRef,  { once: true, margin: "-60px" })
  const tiersInView = useInView(tiersRef, { once: true, margin: "-60px" })
  const infraInView = useInView(infraRef, { once: true, margin: "-60px" })
  const faqInView   = useInView(faqRef,   { once: true, margin: "-60px" })
  const ctaInView   = useInView(ctaRef,   { once: true, margin: "-60px" })

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <PageTopBar breadcrumb="Pricing · Plans & usage" />

      <div className="max-w-7xl mx-auto px-6">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div
          ref={heroRef}
          className="py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-end"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
              Pricing
            </span>
            <h1
              style={{
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "var(--color-text)",
              }}
            >
              Simple,{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Transparent
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              No hidden fees. No monthly commitments. Pay only for what you use — start free
              and scale to enterprise when you're ready.
            </p>
            <div className="flex items-center gap-6">
              {[
                { val: "50+",    lab: "Models" },
                { val: "12",     lab: "Regions" },
                { val: "99.99%", lab: "Uptime" },
              ].map((s) => (
                <div key={s.lab} className="flex flex-col gap-0.5">
                  <span
                    className="text-xl font-black"
                    style={{ color: "var(--color-text)", letterSpacing: "-0.03em" }}
                  >
                    {s.val}
                  </span>
                  <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                    {s.lab}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Tier cards ───────────────────────────────────────────────────── */}
        <div
          ref={tiersRef}
          className="py-20 flex flex-col gap-10"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={tiersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: "var(--color-primary)" }}
            >
              Plans
            </span>
          </motion.div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-px"
            style={{ background: "var(--color-border)" }}
          >
            {tiers.map((tier, i) => (
              <div
                key={tier.key}
                style={{ background: isDark ? "var(--color-surface-1)" : "var(--color-bg)" }}
              >
                <TierCard tier={tier} index={i} isInView={tiersInView} />
              </div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={tiersInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center text-sm font-mono"
            style={{ color: "var(--color-text-muted)" }}
          >
            All plans include global infrastructure, 99.99% uptime, and end-to-end encryption.
          </motion.p>
        </div>

        {/* ── Infrastructure guarantees ─────────────────────────────────────── */}
        <div
          ref={infraRef}
          className="py-20 flex flex-col gap-10"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={infraInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-3"
            >
              <span
                className="text-xs font-mono tracking-widest uppercase"
                style={{ color: "var(--color-primary)" }}
              >
                Included in every plan
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: "var(--color-text)",
                }}
              >
                Built for{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Production
                </span>
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={infraInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              Every request, on every plan, benefits from the same global infrastructure.
              There are no cheap-tier shortcuts — quality is non-negotiable.
            </motion.p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ background: "var(--color-border)" }}
          >
            {infra.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={infraInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="flex flex-col gap-4 p-7 hover:opacity-80 transition-opacity"
                style={{ background: isDark ? "var(--color-surface-1)" : "var(--color-bg)" }}
              >
                <div
                  className="w-9 h-9 flex items-center justify-center"
                  style={{ border: "1px solid var(--color-border)", color: "var(--color-primary)" }}
                >
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                    {item.label}
                  </span>
                  <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                    {item.detail}
                  </span>
                </div>
              </motion.div>
            ))}
            {/* filler cell */}
            <div style={{ background: isDark ? "var(--color-surface-1)" : "var(--color-bg)" }} />
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <div
          ref={faqRef}
          className="py-20 grid grid-cols-1 lg:grid-cols-5 gap-16"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: "var(--color-primary)" }}
            >
              FAQ
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--color-text)",
              }}
            >
              Common questions
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Still have questions?{" "}
              <Link
                href="/contact"
                className="hover:opacity-70 transition-opacity"
                style={{ color: "var(--color-primary)" }}
              >
                Reach out →
              </Link>
            </p>
          </motion.div>

          <div
            className="lg:col-span-3 flex flex-col"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            {faqs.map((faq, i) => (
              <FaqItem key={faq.q} faq={faq} index={i} isInView={faqInView} />
            ))}
          </div>
        </div>

        {/* ── CTA banner ───────────────────────────────────────────────────── */}
        <div ref={ctaRef} className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 p-12"
            style={{ border: "1px solid var(--color-border)" }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 80% 50%, var(--color-primary)10 0%, transparent 60%), radial-gradient(circle at 20% 50%, var(--color-accent)0a 0%, transparent 60%)",
                pointerEvents: "none",
              }}
            />

            <div className="relative z-10 flex flex-col gap-3 max-w-lg">
              <h2
                style={{
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  color: "var(--color-text)",
                }}
              >
                Ready to start building?
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Join thousands of developers who ship AI-powered products on Modelsnest. No
                credit card required to get started.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-4 flex-shrink-0">
              <Link href="/signup">
                <button
                  className="px-7 py-3.5 text-sm font-bold flex items-center gap-2 transition-opacity hover:opacity-80"
                  style={{ background: "var(--color-primary)", color: "#fff" }}
                >
                  Get started free
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/contact">
                <button
                  className="px-7 py-3.5 text-sm font-bold transition-all duration-200"
                  style={{
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-muted)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-primary)"
                    e.currentTarget.style.color = "var(--color-primary)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)"
                    e.currentTarget.style.color = "var(--color-text-muted)"
                  }}
                >
                  Talk to sales
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
      <Footer />
    </div>
  )
}