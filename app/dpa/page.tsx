"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { FileText, Clock, Database, User, Shield, CheckCircle, AlertTriangle, Globe, Search, LogOut, Mail } from "lucide-react"
import { Footer } from "@/components/footer"
import { PageTopBar } from "@/components/page-top-bar"

export const dynamic = "force-dynamic"

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

// ─── panel grid helpers ───────────────────────────────────────────────────────
function PanelGrid({ cols = 2, children }: { cols?: number; children: React.ReactNode }) {
  return (
    <div className={`grid grid-cols-1 ${cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-px`}
      style={{ background: "var(--color-border)", border: "1px solid var(--color-border)" }}>
      {children}
    </div>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 p-6" style={{ background: "var(--color-surface-1)" }}>
      {children}
    </div>
  )
}

// ─── definition card ──────────────────────────────────────────────────────────
function DefCard({ term, desc }: { term: string; desc: string }) {
  return (
    <div className="flex flex-col gap-2 p-6" style={{ background: "var(--color-surface-1)" }}>
      <span className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>{term}</span>
      <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{desc}</p>
    </div>
  )
}

// ─── retention table ──────────────────────────────────────────────────────────
function RetentionTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div style={{ border: "1px solid var(--color-border)" }}>
      {rows.map((row, i) => (
        <div key={row.label} className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--color-border)" : "none" }}>
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{row.label}</span>
          <span className="text-sm font-bold" style={{ color: "var(--color-text)" }}>{row.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── highlight box ────────────────────────────────────────────────────────────
function HighlightBox({ variant = "primary", children }: { variant?: "primary" | "success"; children: React.ReactNode }) {
  const isPrimary = variant === "primary"
  return (
    <div className="p-5 text-sm leading-relaxed"
      style={{
        border: `1px solid color-mix(in srgb, ${isPrimary ? "var(--color-primary)" : "var(--color-success)"} 30%, transparent)`,
        background: `color-mix(in srgb, ${isPrimary ? "var(--color-primary)" : "var(--color-success)"} 5%, transparent)`,
        color: "var(--color-text-muted)",
      }}>
      {children}
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

// ─── page ─────────────────────────────────────────────────────────────────────
export default function DataProcessingAgreement() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <PageTopBar breadcrumb="Legal · DPA" />

      <div ref={ref} className="max-w-7xl mx-auto px-6">

        {/* Hero */}
        <div className="py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-end"
          style={{ borderBottom: "1px solid var(--color-border)" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} className="flex flex-col gap-4">
            <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>Legal</span>
            <h1 style={{ fontSize: "clamp(2.8rem,6vw,5rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em", color: "var(--color-text)" }}>
              Data Processing{" "}
              <span style={{ background: "linear-gradient(90deg,var(--color-primary),var(--color-accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Agreement
              </span>
            </h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col gap-5">
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              This DPA governs how Outsoor processes personal data on behalf of our customers
              and forms an integral part of our Terms of Service.
            </p>
            <div className="flex items-center gap-3">
              <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full" style={{ background: "var(--color-success)" }} />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Automatically incorporated into Terms of Service
              </span>
            </div>
          </motion.div>
        </div>

        {/* 01 Definitions */}
        <SectionRow num="01" index={0} isInView={isInView} title="Definitions"
          icon={<FileText className="w-4 h-4" />}>
          <PanelGrid>
            <DefCard term='"Controller"' desc="The entity that determines the purposes and means of processing personal data." />
            <DefCard term='"Processor"' desc="Outsoor, the entity that processes personal data on behalf of the controller." />
            <DefCard term='"Personal Data"' desc="Any information relating to an identified or identifiable natural person." />
            <DefCard term='"Processing"' desc="Any operation performed on personal data, such as collection, storage, or analysis." />
          </PanelGrid>
        </SectionRow>

        {/* 02 Scope */}
        <SectionRow num="02" index={1} isInView={isInView} title="Scope & Application"
          icon={<Clock className="w-4 h-4" />}>
          <p>This DPA applies to all personal data processing activities carried out by Outsoor when providing AI API services to customers. It is automatically incorporated by reference into our Terms of Service.</p>
          <div>
            <SubLabel>Covered Services</SubLabel>
            <div className="flex flex-col gap-2">
              {["AI model inference and processing", "Data storage and caching", "Analytics and usage monitoring", "Customer support and communication", "Service improvement and optimization"].map(t => <CheckRow key={t} text={t} />)}
            </div>
          </div>
        </SectionRow>

        {/* 03 Processing Details */}
        <SectionRow num="03" index={2} isInView={isInView} title="Data Processing Details"
          icon={<Database className="w-4 h-4" />}>
          <PanelGrid>
            <Panel>
              <SubLabel>Primary Purposes</SubLabel>
              <div className="flex flex-col gap-2">
                {["Providing AI API services", "Processing customer requests", "Billing and account management", "Service improvement"].map(t => <CheckRow key={t} text={t} />)}
              </div>
            </Panel>
            <Panel>
              <SubLabel>Data Categories</SubLabel>
              <div className="flex flex-col gap-2">
                {["Account information", "API usage data", "Technical logs", "Communication records"].map(t => <CheckRow key={t} text={t} />)}
              </div>
            </Panel>
          </PanelGrid>
          <div>
            <SubLabel>Retention Periods</SubLabel>
            <RetentionTable rows={[
              { label: "Active account data", value: "Duration of service" },
              { label: "Usage logs",          value: "12 months" },
              { label: "Billing records",     value: "7 years" },
              { label: "Deleted account data", value: "30 days" },
            ]} />
          </div>
        </SectionRow>

        {/* 04 Controller Obligations */}
        <SectionRow num="04" index={3} isInView={isInView} title="Controller Obligations"
          icon={<User className="w-4 h-4" />}>
          <p>As the data controller, you are responsible for:</p>
          <PanelGrid>
            <Panel>
              <SubLabel>Legal Basis</SubLabel>
              <div className="flex flex-col gap-2">
                {["Ensuring lawful basis for processing", "Obtaining necessary consents", "Providing privacy notices", "Handling data subject requests"].map(t => <CheckRow key={t} text={t} />)}
              </div>
            </Panel>
            <Panel>
              <SubLabel>Data Quality</SubLabel>
              <div className="flex flex-col gap-2">
                {["Providing accurate data", "Updating outdated information", "Minimizing data collection", "Ensuring data relevance"].map(t => <CheckRow key={t} text={t} />)}
              </div>
            </Panel>
          </PanelGrid>
        </SectionRow>

        {/* 05 Processor Obligations */}
        <SectionRow num="05" index={4} isInView={isInView} title="Processor Obligations"
          icon={<Shield className="w-4 h-4" />}>
          <PanelGrid>
            {[
              { title: "Processing Instructions", desc: "We process personal data only on documented instructions from you, including for international transfers." },
              { title: "Confidentiality",         desc: "All personnel processing personal data are bound by strict confidentiality obligations." },
              { title: "Security Measures",       desc: "We implement appropriate technical and organizational security measures to protect personal data." },
              { title: "Sub-processors",          desc: "We may engage sub-processors with your prior written consent, ensuring they meet the same obligations." },
            ].map(item => (
              <Panel key={item.title}>
                <span className="text-sm font-bold" style={{ color: "var(--color-text)" }}>{item.title}</span>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{item.desc}</p>
              </Panel>
            ))}
          </PanelGrid>
        </SectionRow>

        {/* 06 Data Subject Rights */}
        <SectionRow num="06" index={5} isInView={isInView} title="Data Subject Rights"
          icon={<CheckCircle className="w-4 h-4" />}>
          <p>We will assist you in fulfilling data subject rights requests:</p>
          <PanelGrid cols={3}>
            <Panel>
              <SubLabel>Access & Portability</SubLabel>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>Provide access to personal data and support data portability requests.</p>
            </Panel>
            <Panel>
              <SubLabel>Rectification & Erasure</SubLabel>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>Correct inaccurate data and delete personal data upon request.</p>
            </Panel>
            <Panel>
              <SubLabel>Restriction & Objection</SubLabel>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>Restrict processing and honor objection requests as appropriate.</p>
            </Panel>
          </PanelGrid>
          <HighlightBox>
            <strong style={{ color: "var(--color-primary)" }}>Response Time: </strong>
            We respond to data subject requests within 30 days, with possible extension for complex requests.
          </HighlightBox>
        </SectionRow>

        {/* 07 Breach Notification */}
        <SectionRow num="07" index={6} isInView={isInView} title="Data Breach Notification"
          icon={<AlertTriangle className="w-4 h-4" />}>
          <p>We have implemented systems to detect and respond to personal data breaches promptly.</p>
          <PanelGrid>
            <Panel>
              <SubLabel>Immediate Actions</SubLabel>
              <div className="flex flex-col gap-2">
                {["Contain the breach", "Assess the scope", "Document the incident", "Notify you within 72 hours"].map(t => <CheckRow key={t} text={t} />)}
              </div>
            </Panel>
            <Panel>
              <SubLabel>Follow-up Actions</SubLabel>
              <div className="flex flex-col gap-2">
                {["Investigate root cause", "Implement remediation", "Provide detailed report", "Update security measures"].map(t => <CheckRow key={t} text={t} />)}
              </div>
            </Panel>
          </PanelGrid>
        </SectionRow>

        {/* 08 International Transfers */}
        <SectionRow num="08" index={7} isInView={isInView} title="International Data Transfers"
          icon={<Globe className="w-4 h-4" />}>
          <p>When transferring personal data outside the EEA, we rely on appropriate safeguards:</p>
          <PanelGrid>
            <Panel>
              <SubLabel>Standard Contractual Clauses</SubLabel>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>We use EU-approved Standard Contractual Clauses for international transfers.</p>
            </Panel>
            <Panel>
              <SubLabel>Adequacy Decisions</SubLabel>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>We transfer data to countries with adequacy decisions where applicable.</p>
            </Panel>
          </PanelGrid>
          <div>
            <SubLabel>Current Transfer Locations</SubLabel>
            <div className="flex flex-wrap gap-px"
              style={{ background: "var(--color-border)", border: "1px solid var(--color-border)" }}>
              {["United States", "European Union", "United Kingdom", "Canada", "Australia"].map(loc => (
                <div key={loc} className="px-5 py-3 text-sm font-semibold"
                  style={{ background: "var(--color-surface-1)", color: "var(--color-text-muted)" }}>
                  {loc}
                </div>
              ))}
            </div>
          </div>
        </SectionRow>

        {/* 09 Audit Rights */}
        <SectionRow num="09" index={8} isInView={isInView} title="Audit Rights"
          icon={<Search className="w-4 h-4" />}>
          <p>We will cooperate with reasonable audit requests from you or your designated auditor.</p>
          <PanelGrid>
            <Panel>
              <SubLabel>Audit Scope</SubLabel>
              <div className="flex flex-col gap-2">
                {["Data processing activities", "Security measures", "Compliance documentation", "Sub-processor arrangements"].map(t => <CheckRow key={t} text={t} />)}
              </div>
            </Panel>
            <Panel>
              <SubLabel>Audit Process</SubLabel>
              <div className="flex flex-col gap-2">
                {["30 days advance notice", "During business hours", "Confidentiality maintained", "Reasonable frequency limits"].map(t => <CheckRow key={t} text={t} />)}
              </div>
            </Panel>
          </PanelGrid>
        </SectionRow>

        {/* 10 Termination */}
        <SectionRow num="10" index={9} isInView={isInView} title="Termination & Data Return"
          icon={<LogOut className="w-4 h-4" />}>
          <p>Upon termination of services, we will:</p>
          <PanelGrid>
            <Panel>
              <SubLabel>Data Return</SubLabel>
              <div className="flex flex-col gap-2">
                {["Return all personal data", "Provide data in structured format", "Complete within 30 days", "Confirm deletion of copies"].map(t => <CheckRow key={t} text={t} />)}
              </div>
            </Panel>
            <Panel>
              <SubLabel>Ongoing Obligations</SubLabel>
              <div className="flex flex-col gap-2">
                {["Maintain confidentiality", "Comply with legal requirements", "Support legal proceedings", "Provide compliance certificates"].map(t => <CheckRow key={t} text={t} />)}
              </div>
            </Panel>
          </PanelGrid>
        </SectionRow>

        {/* 11 Contact */}
        <SectionRow num="11" index={10} isInView={isInView} title="Contact Information"
          icon={<Mail className="w-4 h-4" />}>
          <p>For questions about this DPA or to request a signed copy, please contact us:</p>
          <PanelGrid>
            <Panel>
              <SubLabel>Primary Contacts</SubLabel>
              <ContactBox rows={[
                { label: "Legal",      value: "legal@outsoor.com" },
                { label: "DPO",        value: "dpo@outsoor.com" },
                { label: "Compliance", value: "compliance@outsoor.com" },
              ]} />
            </Panel>
            <Panel>
              <SubLabel>Response Times</SubLabel>
              <ContactBox rows={[
                { label: "General",    value: "2 business days" },
                { label: "Signed DPA", value: "5 business days" },
                { label: "Urgent",     value: "Same day" },
              ]} />
            </Panel>
          </PanelGrid>
          <HighlightBox variant="success">
            <strong style={{ color: "var(--color-success)" }}>Note: </strong>
            This DPA is automatically incorporated into our Terms of Service. Enterprise customers requiring
            a signed DPA should contact our legal team directly.
          </HighlightBox>
        </SectionRow>

        <div className="py-8" />
      </div>
      <Footer />
    </div>
  )
}