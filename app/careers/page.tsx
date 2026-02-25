"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Globe, TrendingUp, FileText, Clock } from "lucide-react"
import { Footer } from "@/components/footer"
import { PageTopBar } from "@/components/page-top-bar"

const howWeWork = [
  {
    icon: Globe,
    text: "Remote-friendly with hubs where people can meet in person",
  },
  {
    icon: TrendingUp,
    text: "Small, senior teams with lots of ownership and autonomy",
  },
  {
    icon: FileText,
    text: "Bias for shipping, observability and learning from real usage",
  },
  {
    icon: Clock,
    text: "Direct access to customers and real production workloads",
  },
]

const roles = [
  {
    title: "Founding Engineer, Full-Stack",
    department: "Engineering",
    location: "Remote",
    description:
      "Help design and build the core dashboard and developer experience for Modelsnest customers, from onboarding flows to usage analytics.",
  },
  {
    title: "Senior Infrastructure Engineer",
    department: "Engineering",
    location: "Remote",
    description:
      "Own core pieces of the API platform: routing, rate limiting, observability and on-call reliability.",
  },
]

function RoleCard({ role, index, isInView }: { role: typeof roles[0]; index: number; isInView: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center justify-between gap-6 p-8 cursor-pointer"
      style={{
        borderBottom: "1px solid var(--color-border)",
        background: hovered ? "color-mix(in srgb, var(--color-primary) 4%, transparent)" : "transparent",
        transition: "background 0.2s ease",
      }}
    >
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2">
          <span
            className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5"
            style={{
              border: "1px solid var(--color-border)",
              color: "var(--color-primary)",
            }}
          >
            {role.department}
          </span>
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {role.location}
          </span>
        </div>
        <h3 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
          {role.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {role.description}
        </p>
      </div>
      <motion.div
        animate={{ x: hovered ? 4 : 0 }}
        transition={{ duration: 0.15 }}
        className="w-10 h-10 flex items-center justify-center flex-shrink-0"
        style={{ border: "1px solid var(--color-border)", color: "var(--color-primary)" }}
      >
        <ArrowRight className="w-4 h-4" />
      </motion.div>
    </motion.div>
  )
}

export default function CareersPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <PageTopBar breadcrumb="Company · Careers" />

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
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--color-success)" }}
              />
              <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                We&apos;re hiring
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "var(--color-text)",
              }}
            >
              Build the future of{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AI infrastructure
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              We&apos;re building the AI infrastructure layer for modern software companies.
              If you care deeply about reliability, developer experience and thoughtful AI,
              you&apos;ll probably enjoy working with us.
            </p>
          </motion.div>
        </div>

        {/* How we work */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {howWeWork.map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col gap-4 p-8"
              style={{ borderRight: i < howWeWork.length - 1 ? "1px solid var(--color-border)" : "none" }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ border: "1px solid var(--color-border)", color: "var(--color-primary)" }}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Open roles */}
        <div style={{ borderBottom: "1px solid var(--color-border)" }}>
          <div className="px-0 py-10 lg:py-14 flex flex-col gap-6">
            <span
              className="text-xs uppercase tracking-wider font-semibold px-8"
              style={{ color: "var(--color-text-muted)" }}
            >
              Open roles
            </span>
            {roles.map((role, i) => (
              <RoleCard key={role.title} role={role} index={i} isInView={isInView} />
            ))}
          </div>
        </div>

        {/* Don't see a fit */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-between gap-6 flex-wrap py-12"
        >
          <div className="flex flex-col gap-1">
            <span className="font-bold" style={{ color: "var(--color-text)" }}>
              Don&apos;t see a fit?
            </span>
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              We read every message. Reach out if you care about what we&apos;re building.
            </span>
          </div>
          <Link
            href="mailto:modelsnest3@gmail.com"
            className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: "var(--color-primary)", color: "#fff" }}
          >
            modelsnest3@gmail.com
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
      <Footer />
    </div>
  )
}