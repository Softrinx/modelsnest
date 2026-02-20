"use client"

import { motion, useInView, useAnimationFrame } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import { useTheme } from "@/contexts/themeContext"
import { Footer } from "@/components/footer"
import { PageTopBar } from "@/components/page-top-bar"
import {
  Shield, Cloud, Lock, Users, Globe, Zap,
  ArrowRight, Check, Building2, Server, FileCheck, Headphones
} from "lucide-react"

const capabilities = [
  {
    icon: Cloud,
    title: "Custom Deployments",
    description: "Private cloud, on-premises, or hybrid infrastructure. Your data never leaves your environment.",
  },
  {
    icon: Shield,
    title: "SOC 2 Type II Certified",
    description: "Fully audited security posture. GDPR, HIPAA, ISO 27001 compliance out of the box.",
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "VPC peering, SSO integration, role-based access control, and complete audit trails.",
  },
  {
    icon: Server,
    title: "Dedicated Infrastructure",
    description: "Reserved compute capacity with guaranteed throughput — no noisy neighbour effects.",
  },
  {
    icon: Globe,
    title: "Global Edge Network",
    description: "Deploy to the region closest to your users. 25+ availability zones worldwide.",
  },
  {
    icon: Headphones,
    title: "White-Glove Support",
    description: "Dedicated account manager, 24/7 technical support, and a Slack channel with our engineers.",
  },
  {
    icon: FileCheck,
    title: "Custom Contracts",
    description: "Volume discounts, custom billing cycles, and enterprise MSAs tailored to procurement needs.",
  },
  {
    icon: Users,
    title: "White-Label Option",
    description: "Rebrand the entire platform as your own. Full API and UI customisation available.",
  },
]

const slas = [
  { label: "Uptime guarantee",       value: "99.99%" },
  { label: "Support response",       value: "15 min" },
  { label: "Onboarding time",        value: "1 day" },
  { label: "Dedicated engineers",    value: "Yes" },
  { label: "Custom billing",         value: "Yes" },
  { label: "Data residency control", value: "Yes" },
]

const trustedBy = [
  "Fortune 500 healthcare provider",
  "Top 10 global bank",
  "Series B AI startup — 2B+ calls/mo",
  "Government defence agency",
  "Leading European fintech",
  "Tier-1 e-commerce platform",
]

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  const startRef = useRef<number | null>(null)

  useAnimationFrame((t) => {
    if (!isInView) return
    if (startRef.current === null) startRef.current = t
    const progress = Math.min((t - startRef.current) / 1600, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    setVal(Math.floor(eased * to))
  })

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

export default function EnterprisePage() {
  const { isDark } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const [form, setForm] = useState({ name: "", email: "", company: "", size: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <PageTopBar breadcrumb="Company · Enterprise" />

      <div ref={ref} className="max-w-7xl mx-auto px-6">

        {/* Hero — full width statement */}
        <div
          className="py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-end"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                Enterprise
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "var(--color-text)",
              }}
            >
              AI at Scale.
              <br />
              <span style={{
                background: "linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-secondary))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                No Compromise.
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Outsoor Enterprise gives large teams private infrastructure, dedicated support, custom compliance, and volume pricing — everything you need to run mission-critical AI in production.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="#contact">
                <button
                  className="px-6 py-3 font-semibold text-sm transition-opacity hover:opacity-80 flex items-center gap-2"
                  style={{ background: "var(--color-primary)", color: "#fff" }}
                >
                  Talk to Sales <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/demo">
                <button
                  className="px-6 py-3 font-semibold text-sm transition-colors hover:opacity-80 flex items-center gap-2"
                  style={{ border: "1px solid var(--color-border)", color: "var(--color-text-muted)", background: "transparent" }}
                >
                  Book a Demo
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Live counters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ borderBottom: "1px solid var(--color-border)", borderLeft: "1px solid var(--color-border)" }}
        >
          {[
            { label: "Enterprise clients",    to: 200,  suffix: "+" },
            { label: "API calls processed",   to: 1200, suffix: "B+" },
            { label: "Countries deployed",    to: 140,  suffix: "+" },
            { label: "Uptime this year",      to: 99,   suffix: ".99%" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-1 px-8 py-7"
              style={{ borderRight: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}
            >
              <span
                className="font-black font-mono"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", color: "var(--color-text)" }}
              >
                <CountUp to={s.to} suffix={s.suffix} />
              </span>
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Interactive capabilities */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {/* Left list */}
          <div style={{ borderRight: "1px solid var(--color-border)" }}>
            {capabilities.map((cap, i) => (
              <motion.button
                key={cap.title}
                initial={{ opacity: 0, x: -12 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => setActiveFeature(i)}
                className="w-full flex items-center gap-5 px-8 py-5 text-left transition-all duration-150"
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  background: activeFeature === i
                    ? `color-mix(in srgb, var(--color-primary) 5%, transparent)`
                    : "transparent",
                }}
              >
                <cap.icon
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: activeFeature === i ? "var(--color-primary)" : "var(--color-border)" }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: activeFeature === i ? "var(--color-text)" : "var(--color-text-muted)" }}
                >
                  {cap.title}
                </span>
                {activeFeature === i && (
                  <div className="ml-auto w-1 self-stretch" style={{ background: "var(--color-primary)" }} />
                )}
              </motion.button>
            ))}
          </div>

          {/* Right detail */}
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="p-12 lg:p-16 flex flex-col gap-6 justify-center"
            style={{ minHeight: "320px" }}
          >
            <div
              className="w-12 h-12 flex items-center justify-center"
              style={{ border: "1px solid var(--color-primary)", color: "var(--color-primary)" }}
            >
              {(() => { const Icon = capabilities[activeFeature].icon; return <Icon className="w-6 h-6" /> })()}
            </div>
            <div className="flex flex-col gap-3">
              <h3
                style={{
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  color: "var(--color-text)",
                }}
              >
                {capabilities[activeFeature].title}
              </h3>
              <p className="text-base leading-relaxed max-w-sm" style={{ color: "var(--color-text-muted)" }}>
                {capabilities[activeFeature].description}
              </p>
            </div>
            <Link href="#contact">
              <button
                className="self-start text-sm font-semibold flex items-center gap-2 transition-opacity hover:opacity-70"
                style={{ color: "var(--color-primary)" }}
              >
                Talk to us about this <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* SLA table + trusted by */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {/* SLA table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-10 lg:p-14 flex flex-col gap-6"
            style={{ borderRight: "1px solid var(--color-border)" }}
          >
            <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)", letterSpacing: "-0.02em" }}>
              Enterprise SLA
            </h2>
            <div className="flex flex-col" style={{ border: "1px solid var(--color-border)" }}>
              {slas.map((row, i) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: i < slas.length - 1 ? "1px solid var(--color-border)" : "none" }}
                >
                  <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{row.label}</span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: row.value === "Yes" ? "var(--color-success)" : "var(--color-text)" }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Trusted by */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-10 lg:p-14 flex flex-col gap-6"
            style={{ background: isDark ? "var(--color-surface-2)" : "var(--color-surface-3)" }}
          >
            <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)", letterSpacing: "-0.02em" }}>
              Trusted by
            </h2>
            <div className="flex flex-col gap-3">
              {trustedBy.map((org, i) => (
                <motion.div
                  key={org}
                  initial={{ opacity: 0, x: 12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--color-success)" }} />
                  <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{org}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)", opacity: 0.5 }}>
              Client names withheld under NDA. References available on request.
            </p>
          </motion.div>
        </div>

        {/* Contact form */}
        <div
          id="contact"
          className="grid grid-cols-1 lg:grid-cols-5"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3 p-10 lg:p-14"
            style={{ borderRight: "1px solid var(--color-border)" }}
          >
            <div className="flex flex-col gap-1 mb-10">
              <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
                Talk to our enterprise team
              </h2>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                We respond within 2 hours. No automated replies.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 py-16"
              >
                <div
                  className="w-10 h-10 flex items-center justify-center"
                  style={{ border: "1px solid var(--color-success)", color: "var(--color-success)" }}
                >
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Message received.</p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  A member of our enterprise team will reach out within 2 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { key: "name",    label: "Full name",   type: "text",  placeholder: "Your name" },
                    { key: "email",   label: "Work email",  type: "email", placeholder: "you@company.com" },
                    { key: "company", label: "Company",     type: "text",  placeholder: "Company name" },
                    { key: "size",    label: "Company size", type: "text", placeholder: "e.g. 500–5000" },
                  ].map((field) => (
                    <div key={field.key} className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        required
                        value={(form as any)[field.key]}
                        onChange={(e) => setForm(s => ({ ...s, [field.key]: e.target.value }))}
                        className="w-full px-4 py-3 text-sm outline-none transition-colors"
                        style={{ background: "transparent", border: "1px solid var(--color-border)", color: "var(--color-text)", borderRadius: 0 }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                    What are you looking to build?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your use case, scale, and any compliance requirements..."
                    required
                    value={form.message}
                    onChange={(e) => setForm(s => ({ ...s, message: e.target.value }))}
                    className="w-full px-4 py-3 text-sm outline-none resize-none transition-colors"
                    style={{ background: "transparent", border: "1px solid var(--color-border)", color: "var(--color-text)", borderRadius: 0 }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-between px-6 py-4 font-semibold text-sm hover:opacity-80 transition-opacity mt-2"
                  style={{ background: "var(--color-primary)", color: "#fff" }}
                >
                  Send to Enterprise Team
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>

          {/* Side info */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 p-10 lg:p-14 flex flex-col gap-8"
            style={{ background: isDark ? "var(--color-surface-2)" : "var(--color-surface-3)" }}
          >
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
                What to expect
              </h3>
              {[
                "Response from a real engineer, not sales",
                "Custom pricing proposal within 24h",
                "Security & compliance review if needed",
                "Dedicated onboarding support",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "var(--color-success)" }} />
                  <span className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1.5rem" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                Prefer a call first?
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
                Book a 30-minute intro with our enterprise team directly.
              </p>
              <Link href="/demo">
                <button
                  className="text-sm font-semibold flex items-center gap-2 hover:opacity-70 transition-opacity"
                  style={{ color: "var(--color-primary)" }}
                >
                  Book a demo <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            <div className="flex items-center gap-2 mt-auto">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--color-success)" }}
              />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Enterprise team available now
              </span>
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.25, 0.25, 0, 1] }}
          className="h-px"
          style={{
            background: "linear-gradient(90deg, var(--color-primary), var(--color-accent), var(--color-secondary), var(--color-success))",
            transformOrigin: "left",
          }}
        />
      </div>

      <Footer />
    </div>
  )
}