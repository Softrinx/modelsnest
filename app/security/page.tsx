"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Server, Shield, Lock, Code, AlertTriangle, Star, Mail } from "lucide-react"
import { Footer } from "@/components/footer"
import { PageTopBar } from "@/components/page-top-bar"

// ─── shared primitives ────────────────────────────────────────────────────────
function CheckRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-4 h-4 flex items-center justify-center mt-0.5 flex-shrink-0"
        style={{ border: "1px solid var(--color-primary)", color: "var(--color-primary)" }}>
        <svg width="8" height="8" fill="none" viewBox="0 0 8 8">
          <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{text}</span>
    </div>
  )
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs uppercase tracking-wider font-semibold mb-2 block"
      style={{ color: "var(--color-primary)" }}>
      {children}
    </span>
  )
}

function ContactBox({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div style={{ border: "1px solid var(--color-border)" }}>
      {rows.map((row, i) => (
        <div key={row.label} className="flex items-center gap-4 px-5 py-4"
          style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--color-border)" : "none" }}>
          <span className="text-xs uppercase tracking-wider font-semibold w-24 flex-shrink-0"
            style={{ color: "var(--color-primary)" }}>
            {row.label}
          </span>
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{row.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── section row ─────────────────────────────────────────────────────────────
function SectionRow({
  num, icon, title, children, index, isInView,
}: {
  num: string; icon: React.ReactNode; title: string; children: React.ReactNode; index: number; isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="grid grid-cols-1 lg:grid-cols-5"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <div className="lg:col-span-2 flex items-start gap-5 p-8 lg:p-10"
        style={{ borderRight: "1px solid var(--color-border)" }}>
        <span className="text-xs font-bold tracking-widest flex-shrink-0 mt-1"
          style={{ color: "var(--color-text-muted)", fontVariantNumeric: "tabular-nums" }}>
          {num}
        </span>
        <div className="flex flex-col gap-3">
          <div className="w-9 h-9 flex items-center justify-center"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-primary)" }}>
            {icon}
          </div>
          <h2 className="text-base font-bold" style={{ color: "var(--color-text)" }}>{title}</h2>
        </div>
      </div>
      <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col gap-5 text-sm leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}>
        {children}
      </div>
    </motion.div>
  )
}

// ─── certs ────────────────────────────────────────────────────────────────────
const certs = [
  { badge: "Certified",  name: "SOC 2 Type II", desc: "Annual audit of security controls and practices" },
  { badge: "Certified",  name: "ISO 27001",     desc: "International information security management standard" },
  { badge: "Compliant",  name: "GDPR",          desc: "European data protection regulation" },
  { badge: "Compliant",  name: "CCPA",          desc: "California consumer privacy regulation" },
]

// ─── best practices ───────────────────────────────────────────────────────────
const bestPractices = [
  "Keep your API keys secure and rotate them regularly",
  "Use HTTPS for all API communications",
  "Implement proper error handling in your applications",
  "Monitor your API usage for unusual patterns",
  "Keep your integration libraries updated",
]

// ─── page ─────────────────────────────────────────────────────────────────────
export default function SecurityPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <PageTopBar breadcrumb="Security" />

      <div ref={ref} className="max-w-7xl mx-auto px-6">

        {/* Hero */}
        <div className="py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-end"
          style={{ borderBottom: "1px solid var(--color-border)" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} className="flex flex-col gap-4">
            <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>Security</span>
            <h1 style={{ fontSize: "clamp(2.8rem,6vw,5rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: "var(--color-text)" }}>
              Built secure{" "}
              <span style={{ background: "linear-gradient(90deg,var(--color-primary),var(--color-accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                by default
              </span>
            </h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col gap-5">
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Your data security is our top priority. Learn about the comprehensive measures
              we take to protect your information and keep your systems safe.
            </p>
            <div className="flex items-center gap-3">
              <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full" style={{ background: "var(--color-success)" }} />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                All systems operational · 99.99% uptime
              </span>
            </div>
          </motion.div>
        </div>

        {/* Cert strip */}
        <motion.div
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {certs.map((c, i) => (
            <div key={c.name} className="flex flex-col gap-1 px-6 lg:px-8 py-6"
              style={{ borderRight: i < certs.length - 1 ? "1px solid var(--color-border)" : "none" }}>
              <span className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--color-primary)", opacity: 0.6 }}>
                {c.badge}
              </span>
              <span className="text-base font-bold" style={{ color: "var(--color-text)" }}>{c.name}</span>
              <span className="text-xs leading-snug" style={{ color: "var(--color-text-muted)" }}>{c.desc}</span>
            </div>
          ))}
        </motion.div>

        {/* 01 Infrastructure */}
        <SectionRow num="01" index={0} isInView={isInView} title="Infrastructure Security"
          icon={<Server className="w-4 h-4" />}>
          <div>
            <SubLabel>Cloud Security</SubLabel>
            <p>We leverage industry-leading cloud providers with enterprise-grade security certifications including SOC 2 Type II, ISO 27001, and PCI DSS compliance.</p>
          </div>
          <div>
            <SubLabel>Network Security</SubLabel>
            <div className="flex flex-col gap-2">
              {["DDoS protection and mitigation", "Web Application Firewall (WAF)", "Intrusion Detection and Prevention Systems", "Regular security audits and penetration testing"].map(t => <CheckRow key={t} text={t} />)}
            </div>
          </div>
        </SectionRow>

        {/* 02 Data Protection */}
        <SectionRow num="02" index={1} isInView={isInView} title="Data Protection"
          icon={<Shield className="w-4 h-4" />}>
          <div>
            <SubLabel>Encryption</SubLabel>
            <div className="flex flex-col gap-2">
              {["Data encrypted in transit using TLS 1.3", "Data encrypted at rest using AES-256", "API keys and secrets encrypted with industry-standard algorithms", "End-to-end encryption for sensitive communications"].map(t => <CheckRow key={t} text={t} />)}
            </div>
          </div>
          <div>
            <SubLabel>Data Handling</SubLabel>
            <div className="flex flex-col gap-2">
              {["Strict data retention policies", "Automatic data deletion for inactive accounts", "Data anonymization for analytics and improvement", "Compliance with GDPR, CCPA, and other privacy regulations"].map(t => <CheckRow key={t} text={t} />)}
            </div>
          </div>
        </SectionRow>

        {/* 03 Access Control */}
        <SectionRow num="03" index={2} isInView={isInView} title="Access Control"
          icon={<Lock className="w-4 h-4" />}>
          <div>
            <SubLabel>Authentication</SubLabel>
            <div className="flex flex-col gap-2">
              {["Multi-factor authentication (MFA) support", "Strong password requirements and policies", "OAuth 2.0 and SAML integration", "Session management and timeout controls"].map(t => <CheckRow key={t} text={t} />)}
            </div>
          </div>
          <div>
            <SubLabel>Authorization</SubLabel>
            <div className="flex flex-col gap-2">
              {["Role-based access control (RBAC)", "Principle of least privilege", "Regular access reviews and audits", "API key rotation and management"].map(t => <CheckRow key={t} text={t} />)}
            </div>
          </div>
        </SectionRow>

        {/* 04 API Security */}
        <SectionRow num="04" index={3} isInView={isInView} title="API Security"
          icon={<Code className="w-4 h-4" />}>
          <div>
            <SubLabel>API Protection</SubLabel>
            <div className="flex flex-col gap-2">
              {["Rate limiting and abuse prevention", "Input validation and sanitization", "SQL injection and XSS protection", "API versioning and deprecation policies"].map(t => <CheckRow key={t} text={t} />)}
            </div>
          </div>
          <div>
            <SubLabel>Monitoring & Logging</SubLabel>
            <div className="flex flex-col gap-2">
              {["Real-time security monitoring", "Comprehensive audit logging", "Anomaly detection and alerting", "24/7 security operations center"].map(t => <CheckRow key={t} text={t} />)}
            </div>
          </div>
        </SectionRow>

        {/* 05 Incident Response */}
        <SectionRow num="05" index={4} isInView={isInView} title="Incident Response"
          icon={<AlertTriangle className="w-4 h-4" />}>
          <div>
            <SubLabel>Response Plan</SubLabel>
            <div className="flex flex-col gap-2">
              {["24/7 incident response team", "Automated threat detection and response", "Customer notification within 24 hours", "Post-incident analysis and improvement"].map(t => <CheckRow key={t} text={t} />)}
            </div>
          </div>
          <div>
            <SubLabel>Business Continuity</SubLabel>
            <div className="flex flex-col gap-2">
              {["99.99% uptime SLA commitment", "Automated failover and disaster recovery", "Regular backup testing and validation", "Geographic redundancy and distribution"].map(t => <CheckRow key={t} text={t} />)}
            </div>
          </div>
        </SectionRow>

        {/* 06 Best Practices */}
        <SectionRow num="06" index={5} isInView={isInView} title="Security Best Practices"
          icon={<Star className="w-4 h-4" />}>
          <p>Recommended steps for customers integrating with our APIs:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px"
            style={{ background: "var(--color-border)", border: "1px solid var(--color-border)" }}>
            {bestPractices.map((text, i) => (
              <div key={text} className="flex items-start gap-3 p-5"
                style={{
                  background: "var(--color-surface-1)",
                  gridColumn: i === bestPractices.length - 1 && bestPractices.length % 2 !== 0 ? "1 / -1" : undefined,
                }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                  style={{ background: "var(--color-primary)" }} />
                <span className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{text}</span>
              </div>
            ))}
          </div>
        </SectionRow>

        {/* 07 Security Contact */}
        <SectionRow num="07" index={6} isInView={isInView} title="Security Contact"
          icon={<Mail className="w-4 h-4" />}>
          <p>For security-related inquiries, vulnerability reports, or responsible disclosure, please contact our security team:</p>
          <ContactBox rows={[
            { label: "Email",      value: "security@outsoor.com" },
            { label: "Response",   value: "Within 24 hours" },
            { label: "Bug Bounty", value: "outsoor.com/security/bounty" },
          ]} />
          <div className="p-5 text-sm leading-relaxed"
            style={{ border: "1px solid color-mix(in srgb, var(--color-success) 30%, transparent)", background: "color-mix(in srgb, var(--color-success) 5%, transparent)", color: "var(--color-text-muted)" }}>
            <strong style={{ color: "var(--color-success)" }}>Security First: </strong>
            We invest heavily in security infrastructure and regularly conduct third-party security audits
            to ensure the highest level of protection for your data.
          </div>
        </SectionRow>

        <div className="py-8" />
      </div>
      <Footer />
    </div>
  )
}