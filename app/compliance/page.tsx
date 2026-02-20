"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Shield, Star, CreditCard, Globe, Users, FileText, Mail } from "lucide-react"
import { Footer } from "@/components/footer"
import { PageTopBar } from "@/components/page-top-bar"

// ─── primitives ───────────────────────────────────────────────────────────────
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
        <div key={row.label} className="flex items-center gap-4 px-4 py-3"
          style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--color-border)" : "none" }}>
          <span className="text-xs uppercase tracking-wider font-semibold flex-shrink-0"
            style={{ color: "var(--color-primary)", width: "90px" }}>
            {row.label}
          </span>
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{row.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── regulation card ──────────────────────────────────────────────────────────
function RegCard({ name, desc, items, gradientStart, gradientEnd }: {
  name: string; desc: string; items: string[];
  gradientStart?: string; gradientEnd?: string;
}) {
  return (
    <div className="relative flex flex-col gap-3 p-7"
      style={{ background: "var(--color-surface-1)", overflow: "hidden" }}>
      <div className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, ${gradientStart ?? "var(--color-primary)"}, ${gradientEnd ?? "var(--color-secondary)"})` }}
        aria-hidden="true" />
      <span className="text-sm font-bold" style={{ color: "var(--color-text)" }}>{name}</span>
      <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{desc}</p>
      <div className="flex flex-col gap-1.5 mt-1">
        {items.map(item => (
          <div key={item} className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full flex-shrink-0 mt-2"
              style={{ background: "var(--color-primary)" }} />
            <span className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── cert row ─────────────────────────────────────────────────────────────────
function CertRow({ badge, name, desc, meta }: {
  badge: string; name: string; desc: string; meta: { label: string; value: string }[];
}) {
  return (
    <div className="flex items-start gap-5 p-6 lg:p-8"
      style={{ background: "var(--color-surface-1)", borderBottom: "1px solid var(--color-border)" }}>
      <div className="w-11 h-11 flex items-center justify-center flex-shrink-0 font-bold text-sm"
        style={{ border: "1px solid var(--color-border)", color: "var(--color-primary)" }}>
        {badge}
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <span className="font-bold" style={{ color: "var(--color-text)" }}>{name}</span>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{desc}</p>
        <div className="flex flex-wrap gap-4 mt-1">
          {meta.map(m => (
            <span key={m.label} className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              <strong style={{ color: "var(--color-text-muted)" }}>{m.label}:</strong> {m.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── section row ─────────────────────────────────────────────────────────────
function SectionRow({ num, icon, title, children, index, isInView }: {
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

// ─── two-col panel grid ───────────────────────────────────────────────────────
function PanelGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-px"
      style={{ background: "var(--color-border)", border: "1px solid var(--color-border)" }}>
      {children}
    </div>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 p-6" style={{ background: "var(--color-surface-1)" }}>
      {children}
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────
export const dynamic = "force-dynamic"

export default function CompliancePage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <PageTopBar breadcrumb="Legal · Compliance" />

      <div ref={ref} className="max-w-7xl mx-auto px-6">

        {/* Hero */}
        <div className="py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-end"
          style={{ borderBottom: "1px solid var(--color-border)" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} className="flex flex-col gap-4">
            <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>Compliance</span>
            <h1 style={{ fontSize: "clamp(2.8rem,6vw,5rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: "var(--color-text)" }}>
              Meeting the{" "}
              <span style={{ background: "linear-gradient(90deg,var(--color-primary),var(--color-accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                highest standards
              </span>
            </h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col gap-5">
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Outsoor maintains rigorous compliance across global data protection regulations and
              industry certifications so your team can build with confidence.
            </p>
            <div className="flex items-center gap-3">
              <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full" style={{ background: "var(--color-success)" }} />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Compliance programs active · Audits up to date
              </span>
            </div>
          </motion.div>
        </div>

        {/* 01 Data Protection Regulations */}
        <SectionRow num="01" index={0} isInView={isInView} title="Data Protection Regulations"
          icon={<Shield className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px"
            style={{ background: "var(--color-border)", border: "1px solid var(--color-border)" }}>
            <RegCard name="GDPR" desc="EU General Data Protection Regulation — full compliance."
              gradientStart="var(--color-primary)" gradientEnd="var(--color-secondary)"
              items={["Data subject rights implementation", "Lawful basis for processing", "Data protection impact assessments", "Breach notification procedures"]} />
            <RegCard name="CCPA" desc="California Consumer Privacy Act compliance."
              gradientStart="var(--color-secondary)" gradientEnd="var(--color-accent)"
              items={["Consumer rights protection", "Data disclosure requirements", "Opt-out mechanisms", "Non-discrimination practices"]} />
            <RegCard name="LGPD" desc="Brazilian General Data Protection Law compliance."
              gradientStart="var(--color-accent)" gradientEnd="var(--color-primary)"
              items={["Legal basis for processing", "Data subject rights", "Data protection officer", "Incident reporting"]} />
            <RegCard name="PIPEDA" desc="Canadian Personal Information Protection Act."
              gradientStart="var(--color-primary)" gradientEnd="var(--color-accent)"
              items={["Consent requirements", "Limited collection and use", "Safeguards and retention", "Individual access rights"]} />
          </div>
        </SectionRow>

        {/* 02 Certifications */}
        <SectionRow num="02" index={1} isInView={isInView} title="Industry Standards & Certifications"
          icon={<Star className="w-4 h-4" />}>
          <div style={{ border: "1px solid var(--color-border)" }}>
            <CertRow badge="S2" name="SOC 2 Type II"
              desc="Annual audit of security, availability, processing integrity, confidentiality, and privacy controls."
              meta={[{ label: "Report", value: "Available under NDA" }, { label: "Frequency", value: "Annual" }]} />
            <CertRow badge="ISO" name="ISO 27001"
              desc="International standard for information security management systems."
              meta={[{ label: "Scope", value: "AI API Services & Infrastructure" }]} />
            <div className="flex items-start gap-5 p-6 lg:p-8"
              style={{ background: "var(--color-surface-1)" }}>
              <div className="w-11 h-11 flex items-center justify-center flex-shrink-0 font-bold text-sm"
                style={{ border: "1px solid var(--color-border)", color: "var(--color-primary)" }}>
                PCI
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <span className="font-bold" style={{ color: "var(--color-text)" }}>PCI DSS Level 1</span>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  Payment Card Industry Data Security Standard for payment processing.
                </p>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    <strong>Level:</strong> Level 1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SectionRow>

        {/* 03 Healthcare & Financial */}
        <SectionRow num="03" index={2} isInView={isInView} title="Healthcare & Financial Compliance"
          icon={<CreditCard className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px"
            style={{ background: "var(--color-border)", border: "1px solid var(--color-border)" }}>
            <RegCard name="HIPAA" desc="Health Insurance Portability and Accountability Act for healthcare data."
              gradientStart="var(--color-primary)" gradientEnd="var(--color-secondary)"
              items={["Business Associate Agreement (BAA)", "Administrative safeguards", "Physical safeguards", "Technical safeguards"]} />
            <RegCard name="SOX" desc="Sarbanes-Oxley Act compliance for financial reporting controls."
              gradientStart="var(--color-secondary)" gradientEnd="var(--color-accent)"
              items={["Financial controls", "Audit trails", "Data integrity", "Access controls"]} />
          </div>
        </SectionRow>

        {/* 04 Regional Frameworks */}
        <SectionRow num="04" index={3} isInView={isInView} title="Regional & Industry Frameworks"
          icon={<Globe className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px"
            style={{ background: "var(--color-border)", border: "1px solid var(--color-border)" }}>
            {[
              { tag: "In Progress", name: "FedRAMP",  desc: "Federal Risk and Authorization Management Program for U.S. government cloud services." },
              { tag: "Aligned",     name: "NIST CSF", desc: "Alignment with the National Institute of Standards and Technology cybersecurity framework." },
              { tag: "Registered",  name: "CSA STAR", desc: "Cloud Security Alliance Security, Trust & Assurance Registry participation." },
            ].map(fw => (
              <div key={fw.name} className="flex flex-col gap-2 p-6"
                style={{ background: "var(--color-surface-1)" }}>
                <span className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--color-primary)", opacity: 0.7 }}>{fw.tag}</span>
                <span className="font-bold" style={{ color: "var(--color-text)" }}>{fw.name}</span>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{fw.desc}</p>
              </div>
            ))}
          </div>
        </SectionRow>

        {/* 05 Compliance Management */}
        <SectionRow num="05" index={4} isInView={isInView} title="Compliance Management"
          icon={<Users className="w-4 h-4" />}>
          <PanelGrid>
            <Panel>
              <SubLabel>Compliance Team</SubLabel>
              <div className="flex flex-col gap-2">
                {["Chief Compliance Officer", "Data Protection Officer", "Legal & Regulatory Specialists", "Security & Privacy Engineers"].map(t => <CheckRow key={t} text={t} />)}
              </div>
            </Panel>
            <Panel>
              <SubLabel>Compliance Processes</SubLabel>
              <div className="flex flex-col gap-2">
                {["Regular compliance assessments", "Third-party audits", "Continuous monitoring", "Policy updates and training"].map(t => <CheckRow key={t} text={t} />)}
              </div>
            </Panel>
          </PanelGrid>
        </SectionRow>

        {/* 06 Documentation */}
        <SectionRow num="06" index={5} isInView={isInView} title="Compliance Documentation"
          icon={<FileText className="w-4 h-4" />}>
          <p>We provide comprehensive compliance documentation to support your regulatory requirements.</p>
          <PanelGrid>
            <Panel>
              <SubLabel>Available Documents</SubLabel>
              <div className="flex flex-col gap-2">
                {["Compliance certificates", "Security questionnaires", "Data processing agreements", "Privacy impact assessments"].map(t => <CheckRow key={t} text={t} />)}
              </div>
            </Panel>
            <Panel>
              <SubLabel>Request Process</SubLabel>
              <ContactBox rows={[
                { label: "Email",    value: "compliance@outsoor.com" },
                { label: "Response", value: "2–3 business days" },
                { label: "NDA",      value: "Required for sensitive docs" },
              ]} />
            </Panel>
          </PanelGrid>
        </SectionRow>

        {/* 07 Contact */}
        <SectionRow num="07" index={6} isInView={isInView} title="Contact & Support"
          icon={<Mail className="w-4 h-4" />}>
          <p>Our compliance team is ready to help you meet your regulatory requirements.</p>
          <PanelGrid>
            <Panel>
              <SubLabel>Primary Contacts</SubLabel>
              <ContactBox rows={[
                { label: "Compliance", value: "compliance@outsoor.com" },
                { label: "Legal",      value: "legal@outsoor.com" },
                { label: "Security",   value: "security@outsoor.com" },
              ]} />
            </Panel>
            <Panel>
              <SubLabel>Response Times</SubLabel>
              <ContactBox rows={[
                { label: "General",   value: "24 hours" },
                { label: "Documents", value: "2–3 business days" },
                { label: "Urgent",    value: "Same day" },
              ]} />
            </Panel>
          </PanelGrid>
          <div className="p-5 text-sm leading-relaxed"
            style={{ border: "1px solid color-mix(in srgb, var(--color-success) 30%, transparent)", background: "color-mix(in srgb, var(--color-success) 5%, transparent)", color: "var(--color-text-muted)" }}>
            <strong style={{ color: "var(--color-success)" }}>Compliance Support: </strong>
            Our team is here to help you navigate regulatory requirements and provide the documentation
            you need to satisfy auditors and customers.
          </div>
        </SectionRow>

        <div className="py-8" />
      </div>
      <Footer />
    </div>
  )
}