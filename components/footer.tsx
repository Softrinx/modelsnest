"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { useTheme } from "@/contexts/themeContext"
import { OutsoorLogo } from "@/components/outsoor-logo"
import { Twitter, Github, Linkedin, Youtube, MessageCircle } from "lucide-react"

const sections = [
  {
    title: "Contact",
    links: [
      { name: "Contact Support", href: "/contact" },
      { name: "Book a Demo",     href: "/demo" },
      { name: "Enterprise Sales", href: "/enterprise" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation",  href: "/docs" },
      { name: "API Reference",  href: "/reference" },
      { name: "Tutorials",      href: "/tutorials" },
      { name: "Changelog",      href: "/changelog" },
      { name: "Status",         href: "/status" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About",    href: "/about" },
      { name: "Blog",     href: "/blog" },
      { name: "Careers",  href: "/careers" },
      { name: "Press",    href: "/press" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy",   href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Security",         href: "/security" },
      { name: "Compliance",       href: "/compliance" },
      { name: "DPA",              href: "/dpa" },
    ],
  },
]

const socials = [
  { icon: Twitter,       href: "#", label: "X / Twitter" },
  { icon: Github,        href: "#", label: "GitHub" },
  { icon: Linkedin,      href: "#", label: "LinkedIn" },
  { icon: Youtube,       href: "#", label: "YouTube" },
  { icon: MessageCircle, href: "#", label: "Discord" },
]

const VCOLS = 10

export function Footer() {
  const { isDark } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: isDark ? "var(--color-surface-1)" : "var(--color-surface-2)" }}
    >
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--color-primary), var(--color-accent), var(--color-secondary), transparent)",
        }}
      />

      {/* Animated vertical bars — far right, decorative */}
      <div className="absolute right-0 top-0 bottom-0 w-56 pointer-events-none overflow-hidden hidden lg:flex items-stretch opacity-50">
        {[...Array(VCOLS)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.4, delay: i * 0.05, ease: [0.25, 0.25, 0, 1] }}
            style={{
              flex: 1,
              borderRight: "1px solid var(--color-border)",
              transformOrigin: "bottom",
              opacity: 1 - i * 0.08,
            }}
          />
        ))}
      </div>

      {/* Big ghost brand name */}
      <div
        className="absolute bottom-0 left-0 pointer-events-none select-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            fontSize: "clamp(6rem, 18vw, 18rem)",
            fontWeight: 900,
            lineHeight: 0.85,
            letterSpacing: "-0.05em",
            color: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)",
            userSelect: "none",
          }}
        >
          OUTSOOR
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Main grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-6 gap-0"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {/* Brand col */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-8 py-14 pr-12"
            style={{ borderRight: "1px solid var(--color-border)" }}
          >
            <OutsoorLogo />

            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Enterprise-grade AI APIs built for production. One unified platform for 50+ models with the reliability your applications demand.
            </p>

            {/* Status */}
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "var(--color-success)" }}
              />
              <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                All systems operational
              </span>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-4">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="transition-colors duration-150"
                  style={{ color: "var(--color-text-muted)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                >
                  <s.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {sections.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08 * (si + 1) }}
              className="flex flex-col gap-5 py-14 px-8"
              style={{ borderRight: si < sections.length - 1 ? "1px solid var(--color-border)" : "none" }}
            >
              <span
                className="text-xs font-mono tracking-widest uppercase"
                style={{ color: "var(--color-text-muted)", opacity: 0.6 }}
              >
                {section.title}
              </span>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-150"
                      style={{ color: "var(--color-text-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 py-6"
        >
          <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)", opacity: 0.5 }}>
            © 2025 Outsoor. All rights reserved.
          </span>

          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Security"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-xs font-mono transition-colors duration-150"
                style={{ color: "var(--color-text-muted)", opacity: 0.5 }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "var(--color-text)" }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.color = "var(--color-text-muted)" }}
              >
                {item}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}