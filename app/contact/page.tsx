"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import { useTheme } from "@/contexts/themeContext"
import { Mail, Shield, Users, Handshake, ArrowRight, MapPin, Clock, ArrowLeft } from "lucide-react"
import { Footer } from "@/components/footer"
import { PageTopBar } from "@/components/page-top-bar"

const contacts = [
  {
    icon: Users,
    category: "Sales & Product",
    description: "Demos, pricing questions, and enterprise evaluations.",
    email: "sales@outsoor.com",
    response: "2h response",
  },
  {
    icon: Mail,
    category: "Support",
    description: "Technical issues or questions about your account.",
    email: "support@outsoor.com",
    response: "1h response",
  },
  {
    icon: Shield,
    category: "Security",
    description: "Report a vulnerability or security concern responsibly.",
    email: "security@outsoor.com",
    response: "24h response",
  },
  {
    icon: Handshake,
    category: "Partnerships",
    description: "Integrations, co-marketing, or other partnership opportunities.",
    email: "partners@outsoor.com",
    response: "48h response",
  },
]

function ContactCard({ contact, index, isInView }: { contact: typeof contacts[0]; index: number; isInView: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col p-8 gap-6 h-full"
      style={{
        borderBottom: "1px solid var(--color-border)",
        background: hovered ? "color-mix(in srgb, var(--color-primary) 4%, transparent)" : "transparent",
        transition: "background 0.2s ease",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 flex items-center justify-center"
          style={{ border: "1px solid var(--color-border)", color: "var(--color-primary)" }}
        >
          <contact.icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-success)" }} />
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {contact.response}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-muted)" }}>
          {contact.category}
        </span>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {contact.description}
        </p>
      </div>

      <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1.25rem" }}>
        <a
          href={`mailto:${contact.email}`}
          className="flex items-center justify-between"
        >
          <span
            className="text-sm font-semibold"
            style={{ color: hovered ? "var(--color-primary)" : "var(--color-text)", transition: "color 0.2s" }}
          >
            {contact.email}
          </span>
          <motion.div
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ duration: 0.15 }}
            style={{ color: "var(--color-primary)" }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </a>
      </div>
    </motion.div>
  )
}

export default function ContactPage() {
  const { isDark } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>

      {/* Simple back bar */}
      <PageTopBar breadcrumb="Contact · Reach out" />
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
              Contact
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
              Let's{" "}
              <span style={{
                background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Talk
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
              Reach the right team at Outsoor. We typically respond fast — pick your channel below or send us a message directly.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Nairobi, Kenya · Remote-first</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>Mon–Fri, 09:00–18:00 EAT</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {contacts.map((c, i) => (
            <div
              key={c.category}
              style={{ borderRight: i < contacts.length - 1 ? "1px solid var(--color-border)" : "none" }}
            >
              <ContactCard contact={c} index={i} isInView={isInView} />
            </div>
          ))}
        </div>

        {/* Form + info */}
        <div
          className="grid grid-cols-1 lg:grid-cols-5"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3 p-10 lg:p-14"
            style={{ borderRight: "1px solid var(--color-border)" }}
          >
            <div className="flex flex-col gap-1 mb-10">
              <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
                Send a message
              </h2>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                We'll get back to you as soon as possible.
              </p>
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 py-16"
              >
                <div
                  className="w-10 h-10 flex items-center justify-center text-lg"
                  style={{ border: "1px solid var(--color-success)", color: "var(--color-success)" }}
                >
                  ✓
                </div>
                <p className="text-lg font-bold" style={{ color: "var(--color-text)" }}>Message sent.</p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>We'll be in touch shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {[
                  { key: "name",    label: "Full name",   type: "text",  placeholder: "Your name" },
                  { key: "email",   label: "Work email",  type: "email", placeholder: "you@company.com" },
                  { key: "subject", label: "Subject",     type: "text",  placeholder: "How can we help?" },
                ].map((field) => (
                  <div key={field.key} className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      required
                      value={(formState as any)[field.key]}
                      onChange={(e) => setFormState(s => ({ ...s, [field.key]: e.target.value }))}
                      className="w-full px-4 py-3 text-sm outline-none transition-colors duration-150"
                      style={{
                        background: "transparent",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text)",
                        borderRadius: 0,
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us what you need..."
                    required
                    value={formState.message}
                    onChange={(e) => setFormState(s => ({ ...s, message: e.target.value }))}
                    className="w-full px-4 py-3 text-sm outline-none resize-none transition-colors duration-150"
                    style={{
                      background: "transparent",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text)",
                      borderRadius: 0,
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-between px-6 py-4 font-semibold text-sm transition-opacity hover:opacity-80 mt-2"
                  style={{ background: "var(--color-primary)", color: "#fff" }}
                >
                  Send Message
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>

          {/* Info panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 p-10 lg:p-14 flex flex-col gap-8"
            style={{ background: isDark ? "var(--color-surface-2)" : "var(--color-surface-3)" }}
          >
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
                We respond fast.
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Our team is distributed across timezones so someone is always available. Sales and support queries rarely wait long.
              </p>
            </div>

            <div className="flex flex-col" style={{ border: "1px solid var(--color-border)" }}>
              {[
                { label: "Sales response",        value: "2 hours" },
                { label: "Support response",      value: "1 hour" },
                { label: "Enterprise onboarding", value: "1 day" },
                { label: "Uptime SLA",            value: "99.99%" },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--color-border)" : "none" }}
                >
                  <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{row.label}</span>
                  <span className="text-sm font-bold" style={{ color: "var(--color-text)" }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-auto">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--color-success)" }}
              />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                All systems operational
              </span>
            </div>
          </motion.div>
        </div>

      </div>
      <Footer />
    </div>
  )
}