"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Footer } from "@/components/footer"
import { PageTopBar } from "@/components/page-top-bar"

const posts = [
  {
    tag: "Product · Infrastructure",
    title: "Launching Outsoor: AI infrastructure you can trust in production",
    date: "May 2025",
    excerpt:
      'We built Outsoor after spending years maintaining brittle, home-grown AI stacks. In this post we share what "enterprise-grade" means to us and how we think about reliability, latency and cost.',
    featured: true,
  },
  {
    tag: "Guides · Developers",
    title: "Designing a fault-tolerant AI feature in under an hour",
    date: "April 2025",
    excerpt:
      "A step-by-step walkthrough of how to go from idea to production for a simple AI-powered feature, using Outsoor APIs, observability and built-in safeguards.",
    featured: false,
  },
  {
    tag: "Customers · Stories",
    title: "How teams reduce incident load with Outsoor",
    date: "March 2025",
    excerpt:
      "Teams are replacing ad-hoc scripts and one-off model calls with a managed platform. We share patterns we see across customers and what works well in production.",
    featured: false,
  },
]

const [featured, ...rest] = posts

function PostCard({ post, index, isInView }: { post: typeof rest[0]; index: number; isInView: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col gap-4 p-8 h-full"
      style={{
        borderRight: index === 0 ? "1px solid var(--color-border)" : "none",
        background: hovered ? "color-mix(in srgb, var(--color-primary) 4%, transparent)" : "transparent",
        transition: "background 0.2s ease",
      }}
    >
      <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--color-primary)" }}>
        {post.tag}
      </span>
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-base font-bold leading-snug" style={{ color: "var(--color-text)" }}>
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {post.excerpt}
        </p>
      </div>
      <div className="flex items-center justify-between" style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{post.date}</span>
        <motion.div animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.15 }} style={{ color: "var(--color-primary)" }}>
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function BlogPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const [featuredHovered, setFeaturedHovered] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <PageTopBar breadcrumb="Company · Blog" />

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
              Blog
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
              The{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Outsoor
              </span>{" "}
              Blog
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Product updates, infrastructure deep-dives, and examples of how
              teams are using Outsoor in production.
            </p>
          </motion.div>
        </div>

        {/* Featured post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          onMouseEnter={() => setFeaturedHovered(true)}
          onMouseLeave={() => setFeaturedHovered(false)}
          className="grid grid-cols-1 lg:grid-cols-2 cursor-pointer"
          style={{
            borderBottom: "1px solid var(--color-border)",
            background: featuredHovered ? "color-mix(in srgb, var(--color-primary) 4%, transparent)" : "transparent",
            transition: "background 0.2s ease",
          }}
        >
          {/* Visual panel */}
          <div
            className="min-h-56 flex items-center justify-center"
            style={{
              borderRight: "1px solid var(--color-border)",
              background: "color-mix(in srgb, var(--color-primary) 6%, var(--color-surface-2))",
            }}
          >
            <div
              className="w-16 h-16 flex items-center justify-center"
              style={{
                border: "1px solid var(--color-border)",
                color: "var(--color-primary)",
              }}
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
                <rect x="4" y="4" width="8" height="8" rx="1" fill="var(--color-primary)" opacity="0.8" />
                <rect x="16" y="4" width="8" height="8" rx="1" fill="var(--color-secondary)" opacity="0.6" />
                <rect x="4" y="16" width="8" height="8" rx="1" fill="var(--color-secondary)" opacity="0.6" />
                <rect x="16" y="16" width="8" height="8" rx="1" fill="var(--color-accent)" opacity="0.8" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-5 p-10 lg:p-14 justify-between">
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--color-primary)" }}>
                {featured.tag}
              </span>
              <h2 className="text-xl font-bold leading-snug" style={{ color: "var(--color-text)" }}>
                {featured.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                {featured.excerpt}
              </p>
            </div>
            <div className="flex items-center justify-between" style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{featured.date}</span>
              <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                Read post
                <motion.div animate={{ x: featuredHovered ? 4 : 0 }} transition={{ duration: 0.15 }}>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Post grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {rest.map((post, i) => (
            <PostCard key={post.title} post={post} index={i} isInView={isInView} />
          ))}
        </div>

        {/* Stay updated */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-between gap-6 flex-wrap py-12"
        >
          <div className="flex flex-col gap-1">
            <span className="font-bold" style={{ color: "var(--color-text)" }}>Never miss a post</span>
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              We publish when we launch major features or learn something useful about operating AI in production.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="#"
              className="px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
            >
              Follow on X
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: "var(--color-primary)", color: "#fff" }}
            >
              Subscribe from dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

      </div>
      <Footer />
    </div>
  )
}