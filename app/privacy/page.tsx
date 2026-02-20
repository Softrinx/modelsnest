"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Shield, Database, Share2, Lock, UserCheck, Mail } from "lucide-react"
import { Footer } from "@/components/footer"
import { PageTopBar } from "@/components/page-top-bar"

const sections = [
  {
    number: "01",
    icon: Shield,
    title: "Introduction",
    content: (
      <p>
        Outsoor ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
        explains how we collect, use, disclose, and safeguard your information when you use our AI API services.
      </p>
    ),
  },
  {
    number: "02",
    icon: Database,
    title: "Information We Collect",
    content: (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--color-primary)" }}>
            Personal Information
          </span>
          <div className="flex flex-col gap-2">
            {["Name and contact information", "Account credentials", "Payment information", "Usage data and API calls"].map((item) => (
              <Row key={item} text={item} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--color-primary)" }}>
            Technical Information
          </span>
          <div className="flex flex-col gap-2">
            {["IP addresses and device information", "Log files and analytics data", "Cookies and similar technologies"].map((item) => (
              <Row key={item} text={item} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    icon: UserCheck,
    title: "How We Use Your Information",
    content: (
      <div className="flex flex-col gap-2">
        {[
          "Provide and maintain our services",
          "Process transactions and billing",
          "Improve our AI models and services",
          "Communicate with you about updates",
          "Ensure security and prevent fraud",
        ].map((item) => (
          <Row key={item} text={item} />
        ))}
      </div>
    ),
  },
  {
    number: "04",
    icon: Share2,
    title: "Data Sharing and Disclosure",
    content: (
      <div className="flex flex-col gap-4">
        <p>We do not sell your personal information. We may share data with:</p>
        <div className="flex flex-col gap-2">
          {["Service providers and partners", "Legal authorities when required", "Business transfers or mergers"].map((item) => (
            <Row key={item} text={item} />
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "05",
    icon: Lock,
    title: "Data Security",
    content: (
      <p>
        We implement industry-standard security measures to protect your data, including
        encryption, access controls, and regular security audits.
      </p>
    ),
  },
  {
    number: "06",
    icon: UserCheck,
    title: "Your Rights",
    content: (
      <div className="flex flex-col gap-4">
        <p>You have the right to:</p>
        <div className="flex flex-col gap-2">
          {[
            "Access your personal data",
            "Correct inaccurate information",
            "Request deletion of your data",
            "Opt-out of marketing communications",
            "Data portability",
          ].map((item) => (
            <Row key={item} text={item} />
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "07",
    icon: Mail,
    title: "Contact Us",
    content: (
      <div className="flex flex-col gap-4">
        <p>If you have questions about this Privacy Policy, please contact us at:</p>
        <div
          className="flex flex-col gap-2 p-6"
          style={{ border: "1px solid var(--color-border)" }}
        >
          {[
            { label: "Email", value: "privacy@outsoor.com" },
            { label: "Address", value: "Nairobi, Kenya" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider font-semibold w-16 flex-shrink-0" style={{ color: "var(--color-primary)" }}>
                {row.label}
              </span>
              <span style={{ color: "var(--color-text-muted)" }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

function Row({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-4 h-4 flex items-center justify-center mt-0.5 flex-shrink-0"
        style={{ border: "1px solid var(--color-primary)", color: "var(--color-primary)" }}
      >
        <svg width="8" height="8" fill="none" viewBox="0 0 8 8">
          <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
        {text}
      </span>
    </div>
  )
}

function SectionBlock({ section, index, isInView }: { section: typeof sections[0]; index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="grid grid-cols-1 lg:grid-cols-5 gap-0"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      {/* Left label */}
      <div
        className="lg:col-span-2 flex items-start gap-5 p-8 lg:p-10"
        style={{ borderRight: "1px solid var(--color-border)" }}
      >
        <span
          className="text-xs font-bold tracking-widest flex-shrink-0 mt-1"
          style={{ color: "var(--color-text-muted)", fontVariantNumeric: "tabular-nums" }}
        >
          {section.number}
        </span>
        <div className="flex flex-col gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center flex-shrink-0"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-primary)" }}
          >
            <section.icon className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
            {section.title}
          </h2>
        </div>
      </div>

      {/* Right content */}
      <div
        className="lg:col-span-3 p-8 lg:p-10 text-sm leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        {section.content}
      </div>
    </motion.div>
  )
}

export default function PrivacyPolicy() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <PageTopBar breadcrumb="Legal · Privacy" />

      <div ref={ref} className="max-w-7xl mx-auto px-6">

        {/* Hero */}
        <div
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
              Legal
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
              Privacy{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Policy
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
              We take your privacy seriously. This policy explains exactly what data we
              collect, why we collect it, and how we keep it safe.
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--color-success)" }}
              />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Last updated: {lastUpdated}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Table of contents strip */}
        <div
          className="hidden lg:grid"
          style={{
            gridTemplateColumns: `repeat(${sections.length}, 1fr)`,
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          {sections.map((s, i) => (
            <motion.a
              key={s.title}
              href={`#section-${i}`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="flex flex-col gap-1 px-5 py-4 transition-colors duration-150"
              style={{
                borderRight: i < sections.length - 1 ? "1px solid var(--color-border)" : "none",
                color: "var(--color-text-muted)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            >
              <span className="text-xs font-bold" style={{ color: "var(--color-primary)", opacity: 0.5 }}>
                {s.number}
              </span>
              <span className="text-xs leading-tight">{s.title}</span>
            </motion.a>
          ))}
        </div>

        {/* Sections */}
        <div>
          {sections.map((section, i) => (
            <div key={section.title} id={`section-${i}`}>
              <SectionBlock section={section} index={i} isInView={isInView} />
            </div>
          ))}
        </div>

        {/* Bottom spacer */}
        <div className="py-8" />

      </div>
      <Footer />
    </div>
  )
}