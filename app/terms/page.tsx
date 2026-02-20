"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { CheckCircle, XCircle, ArrowRight } from "lucide-react"
import { Footer } from "@/components/footer"
import { PageTopBar } from "@/components/page-top-bar"

// ─── reusable check row ───────────────────────────────────────────────────────
function CheckRow({ text, type = "allow" }: { text: string; type?: "allow" | "deny" }) {
  const isDeny = type === "deny"
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-4 h-4 flex items-center justify-center mt-0.5 flex-shrink-0"
        style={{
          border: `1px solid ${isDeny ? "var(--color-danger)" : "var(--color-primary)"}`,
          color: isDeny ? "var(--color-danger)" : "var(--color-primary)",
        }}
      >
        {isDeny ? (
          <svg width="8" height="8" fill="none" viewBox="0 0 8 8">
            <path d="M2 2l4 4M6 2L2 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="8" height="8" fill="none" viewBox="0 0 8 8">
            <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
        {text}
      </span>
    </div>
  )
}

// ─── sub-label ────────────────────────────────────────────────────────────────
function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-xs uppercase tracking-wider font-semibold mb-2 block"
      style={{ color: "var(--color-primary)" }}
    >
      {children}
    </span>
  )
}

// ─── highlight box ────────────────────────────────────────────────────────────
function HighlightBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-5 text-sm leading-relaxed"
      style={{
        border: "1px solid var(--color-border)",
        background: "color-mix(in srgb, var(--color-primary) 4%, transparent)",
        color: "var(--color-text-muted)",
      }}
    >
      {children}
    </div>
  )
}

// ─── contact box ─────────────────────────────────────────────────────────────
function ContactBox({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div style={{ border: "1px solid var(--color-border)" }}>
      {rows.map((row, i) => (
        <div
          key={row.label}
          className="flex items-center gap-4 px-5 py-4"
          style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--color-border)" : "none" }}
        >
          <span
            className="text-xs uppercase tracking-wider font-semibold w-16 flex-shrink-0"
            style={{ color: "var(--color-primary)" }}
          >
            {row.label}
          </span>
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {row.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── section row ─────────────────────────────────────────────────────────────
function SectionRow({
  num,
  icon,
  title,
  children,
  id,
  index,
  isInView,
}: {
  num: string
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  id?: string
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="grid grid-cols-1 lg:grid-cols-5"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      {/* Left */}
      <div
        className="lg:col-span-2 flex items-start gap-5 p-8 lg:p-10"
        style={{ borderRight: "1px solid var(--color-border)" }}
      >
        <span
          className="text-xs font-bold tracking-widest flex-shrink-0 mt-1"
          style={{ color: "var(--color-text-muted)", fontVariantNumeric: "tabular-nums" }}
        >
          {num}
        </span>
        <div className="flex flex-col gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-primary)" }}
          >
            {icon}
          </div>
          <h2 className="text-base font-bold" style={{ color: "var(--color-text)" }}>
            {title}
          </h2>
        </div>
      </div>

      {/* Right */}
      <div
        className="lg:col-span-3 p-8 lg:p-10 flex flex-col gap-5 text-sm leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        {children}
      </div>
    </motion.div>
  )
}

// ─── TOC strip ────────────────────────────────────────────────────────────────
const tocItems = [
  { num: "01",    label: "Acceptance",            href: "#s0" },
  { num: "02–03", label: "Services & Accounts",   href: "#s1" },
  { num: "04–05", label: "Acceptable Use",        href: "#s2" },
  { num: "06–07", label: "Billing & IP",          href: "#s3" },
  { num: "08–10", label: "Liability & Termination", href: "#s4" },
  { num: "11–12", label: "Law & Contact",         href: "#s5" },
]

// ─── page ─────────────────────────────────────────────────────────────────────
export default function TermsOfService() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  })

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <PageTopBar breadcrumb="Legal · Terms" />

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
              Terms of{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Service
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
              Please read these terms carefully before using Outsoor's AI API services.
              They govern your access and use of our platform.
            </p>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--color-success)" }}
              />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Last updated: {lastUpdated}
              </span>
            </div>
          </motion.div>
        </div>

        {/* TOC */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
          className="hidden lg:grid"
          style={{
            gridTemplateColumns: `repeat(${tocItems.length}, 1fr)`,
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          {tocItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col gap-1 px-5 py-4 transition-colors duration-150 no-underline"
              style={{
                borderRight: i < tocItems.length - 1 ? "1px solid var(--color-border)" : "none",
                color: "var(--color-text-muted)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            >
              <span className="text-xs font-bold" style={{ color: "var(--color-primary)", opacity: 0.5 }}>
                {item.num}
              </span>
              <span className="text-xs leading-tight">{item.label}</span>
            </Link>
          ))}
        </motion.div>

        {/* ── Sections ── */}

        <SectionRow num="01" id="s0" index={0} isInView={isInView} title="Acceptance of Terms"
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.25"/></svg>}
        >
          <p>By accessing or using Outsoor's AI API services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
        </SectionRow>

        <SectionRow num="02" id="s1" index={1} isInView={isInView} title="Description of Services"
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.25"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.25"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.25"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.25"/></svg>}
        >
          <p>Outsoor provides enterprise-grade AI APIs for developers and businesses. Our services include machine learning models, natural language processing, computer vision, and other AI capabilities accessible through REST APIs.</p>
        </SectionRow>

        <SectionRow num="03" index={2} isInView={isInView} title="User Accounts & Registration"
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.25"/><path d="M2 14c0-3 2.69-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>}
        >
          <p>You must register for an account to access our services. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          <div>
            <SubLabel>Account Responsibilities</SubLabel>
            <div className="flex flex-col gap-2">
              {["Provide accurate and complete information", "Keep your account secure", "Notify us immediately of any unauthorized use", "You must be at least 18 years old"].map(t => <CheckRow key={t} text={t} />)}
            </div>
          </div>
        </SectionRow>

        <SectionRow num="04" id="s2" index={3} isInView={isInView} title="Acceptable Use"
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5L8 2z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/></svg>}
        >
          <HighlightBox>You may use our services for lawful purposes in accordance with these terms and applicable laws.</HighlightBox>
          <div>
            <SubLabel>Prohibited Uses</SubLabel>
            <div className="flex flex-col gap-2">
              {["Violating any applicable laws or regulations", "Infringing on intellectual property rights", "Transmitting harmful, offensive, or illegal content", "Attempting to gain unauthorized access to our systems", "Reverse engineering or attempting to extract our models", "Using our services for spam or harassment"].map(t => <CheckRow key={t} text={t} type="deny" />)}
            </div>
          </div>
        </SectionRow>

        <SectionRow num="05" index={4} isInView={isInView} title="API Usage & Limits"
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M2 10l4-4 3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        >
          <div>
            <SubLabel>Rate Limits</SubLabel>
            <p>We may impose rate limits on API usage to ensure fair access and system stability. These limits may vary based on your subscription plan.</p>
          </div>
          <div>
            <SubLabel>Fair Use</SubLabel>
            <p>You agree to use our services reasonably and not to abuse or overload our systems. We reserve the right to throttle or suspend access for excessive usage.</p>
          </div>
        </SectionRow>

        <SectionRow num="06" id="s3" index={5} isInView={isInView} title="Payment & Billing"
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="2" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25"/><path d="M2 7h12" stroke="currentColor" strokeWidth="1.25"/></svg>}
        >
          <p>Our pricing is available on our website and may change with notice. You are responsible for all charges incurred under your account.</p>
          <div>
            <SubLabel>Payment Terms</SubLabel>
            <div className="flex flex-col gap-2">
              {["Payment is due upon receipt of invoice", "Late payments may result in service suspension", "All fees are non-refundable unless otherwise stated", "Taxes may apply based on your location"].map(t => <CheckRow key={t} text={t} />)}
            </div>
          </div>
        </SectionRow>

        <SectionRow num="07" index={6} isInView={isInView} title="Intellectual Property"
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 2L3 4v4c0 3 2.5 5.5 5 6 2.5-.5 5-3 5-6V4L8 2z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/></svg>}
        >
          <p>Our services, including AI models, APIs, and software, are protected by intellectual property laws. You retain ownership of your content, but we may use anonymized data to improve our services.</p>
        </SectionRow>

        <SectionRow num="08" id="s4" index={7} isInView={isInView} title="Privacy & Data"
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><ellipse cx="8" cy="5" rx="5" ry="2.5" stroke="currentColor" strokeWidth="1.25"/><path d="M3 5v6c0 1.38 2.24 2.5 5 2.5s5-1.12 5-2.5V5" stroke="currentColor" strokeWidth="1.25"/><path d="M3 8c0 1.38 2.24 2.5 5 2.5s5-1.12 5-2.5" stroke="currentColor" strokeWidth="1.25"/></svg>}
        >
          <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.</p>
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: "var(--color-primary)" }}
          >
            Read Privacy Policy <ArrowRight className="w-4 h-4" />
          </Link>
        </SectionRow>

        <SectionRow num="09" index={8} isInView={isInView} title="Disclaimers & Limitations"
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v5M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.25"/></svg>}
        >
          <div>
            <SubLabel>Service Availability</SubLabel>
            <p>We strive to provide reliable services but cannot guarantee 100% uptime. Our services are provided "as is" without warranties.</p>
          </div>
          <div>
            <SubLabel>Limitation of Liability</SubLabel>
            <p>Our liability is limited to the amount you paid for services in the 12 months preceding the claim. We are not liable for indirect, incidental, or consequential damages.</p>
          </div>
        </SectionRow>

        <SectionRow num="10" index={9} isInView={isInView} title="Termination"
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M10 8H3M6 5l-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 3v10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>}
        >
          <p>Either party may terminate this agreement with written notice. Upon termination, your access to services will cease, and you remain liable for any outstanding charges.</p>
        </SectionRow>

        <SectionRow num="11" id="s5" index={10} isInView={isInView} title="Governing Law"
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 2a6 6 0 100 12A6 6 0 008 2z" stroke="currentColor" strokeWidth="1.25"/><path d="M8 2c-1.5 2-2 4-2 6s.5 4 2 6M8 2c1.5 2 2 4 2 6s-.5 4-2 6M2 8h12" stroke="currentColor" strokeWidth="1.25"/></svg>}
        >
          <p>These terms are governed by the laws of Kenya. Any disputes will be resolved in the courts of Nairobi, Kenya.</p>
        </SectionRow>

        <SectionRow num="12" index={11} isInView={isInView} title="Contact Information"
          icon={<svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="2" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25"/><path d="M2 5l6 5 6-5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>}
        >
          <p>For questions about these Terms of Service, please contact us at:</p>
          <ContactBox rows={[{ label: "Email", value: "legal@outsoor.com" }, { label: "Address", value: "Nairobi, Kenya" }]} />
        </SectionRow>

        <div className="py-8" />
      </div>
      <Footer />
    </div>
  )
}