"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, Layers, Users, TrendingUp, Mail, Palette } from "lucide-react"
import { Footer } from "@/components/footer"
import { PageTopBar } from "@/components/page-top-bar"

const facts = [
  {
    icon: Layers,
    label: "Product",
    value: "AI infrastructure & APIs for language, vision and retrieval",
  },
  {
    icon: Users,
    label: "Customers",
    value: "SaaS companies, marketplaces and internal tools teams",
  },
  {
    icon: TrendingUp,
    label: "Focus",
    value: "Low latency, reliability and clear, predictable pricing",
  },
]

const contacts = [
  {
    icon: Mail,
    title: "Press contact",
    description:
      "For press inquiries, interviews or quotes, reach out directly. We aim to respond within one business day.",
    email: "press@outsoor.com",
  },
  {
    icon: Palette,
    title: "Brand assets",
    description:
      "We provide logo files and brand guidelines on request. Include your organization name and intended use when reaching out.",
    email: "brand@outsoor.com",
  },
]

export default function PressPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <PageTopBar breadcrumb="Company · Press" />

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
              Press & Media
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
              Resources for{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                journalists
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Everything you need to write about Outsoor — fast facts, contact
              details, brand assets and a short boilerplate for attribution.
            </p>
          </motion.div>
        </div>

        {/* Fast facts */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {facts.map((fact, i) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col gap-4 p-8 lg:p-10"
              style={{ borderRight: i < facts.length - 1 ? "1px solid var(--color-border)" : "none" }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ border: "1px solid var(--color-border)", color: "var(--color-primary)" }}
              >
                <fact.icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--color-primary)" }}>
                  {fact.label}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  {fact.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact cards */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {contacts.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="flex flex-col gap-6 p-10 lg:p-14"
              style={{ borderRight: i === 0 ? "1px solid var(--color-border)" : "none" }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ border: "1px solid var(--color-border)", color: "var(--color-primary)" }}
              >
                <c.icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
                  {c.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  {c.description}
                </p>
              </div>
              <Link
                href={`mailto:${c.email}`}
                className="flex items-center justify-between group"
                style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1.25rem" }}
              >
                <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                  {c.email}
                </span>
                <ArrowRight className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Boilerplate */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="py-12 lg:py-16 flex flex-col gap-6"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-muted)" }}>
            Suggested boilerplate
          </span>
          <div
            className="relative p-8 lg:p-12"
            style={{ border: "1px solid var(--color-border)" }}
          >
            <span
              aria-hidden="true"
              className="absolute top-4 left-6 select-none pointer-events-none"
              style={{
                fontSize: "4rem",
                lineHeight: 1,
                color: "var(--color-primary)",
                opacity: 0.15,
                fontFamily: "Georgia, serif",
              }}
            >
              &ldquo;
            </span>
            <p
              className="text-base lg:text-lg leading-relaxed relative"
              style={{ color: "var(--color-text-muted)", maxWidth: "720px" }}
            >
              Outsoor is an AI infrastructure platform that gives product teams low-latency,
              production-ready APIs for language, vision and retrieval. Designed for reliability
              and simplicity, Outsoor handles scaling, observability and billing so engineering
              teams can focus on shipping features.
            </p>
            <span
              className="text-xs mt-4 block"
              style={{ color: "var(--color-text-muted)" }}
            >
              For attribution &amp; publication
            </span>
          </div>
        </motion.div>

        {/* Bottom spacer row */}
        <div className="py-8" />

      </div>
      <Footer />
    </div>
  )
}