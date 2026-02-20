"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/themeContext"
import { Footer } from "@/components/footer"
import { ArrowLeft, ArrowRight, Check, Calendar, Users, Zap, Shield } from "lucide-react"
import { PageTopBar } from "@/components/page-top-bar"

const perks = [
  { icon: Calendar, text: "30-min live walkthrough with an engineer" },
  { icon: Users,    text: "Custom setup for your team's use case" },
  { icon: Zap,      text: "See 50+ models in action, live" },
  { icon: Shield,   text: "Enterprise security & compliance overview" },
]

const useCases = [
  "Text generation & LLMs",
  "Image generation",
  "Speech & audio",
  "Embeddings & RAG",
  "Multimodal",
  "Enterprise deployment",
]

export default function DemoPage() {
  const { isDark } = useTheme()
  const router = useRouter()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const [form, setForm] = useState({
    name: "", email: "", company: "", size: "", useCase: "", message: ""
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    // After 2.5s redirect to signup with demo intent
    setTimeout(() => router.push("/signup?intent=demo"), 2500)
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>

      {/* Back bar */}
      <PageTopBar breadcrumb="Demo · Request a Demo" />


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
              Book a Demo
            </span>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "var(--color-text)",
              }}
            >
              See Outsoor
              <br />
              <span style={{
                background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                in Action
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Get a personalised walkthrough of the platform, live model demos, and answers to every question you have — in 30 minutes.
            </p>
            <div className="flex flex-col gap-3">
              {perks.map((perk, i) => (
                <motion.div
                  key={perk.text}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <perk.icon className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-primary)" }} />
                  <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{perk.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Form + sidebar */}
        <div
          className="grid grid-cols-1 lg:grid-cols-5"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 p-10 lg:p-14"
            style={{ borderRight: "1px solid var(--color-border)" }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 py-20 items-start"
              >
                <div
                  className="w-12 h-12 flex items-center justify-center text-lg"
                  style={{ border: "1px solid var(--color-success)", color: "var(--color-success)" }}
                >
                  <Check className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
                  You're booked in.
                </h2>
                <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--color-text-muted)" }}>
                  Our team will reach out within 2 hours to confirm your slot. Taking you to your account setup now...
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-primary)" }}
                  />
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Redirecting to signup...</span>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="flex flex-col gap-1 mb-10">
                  <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
                    Tell us about yourself
                  </h2>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    We'll tailor the demo to your exact needs.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { key: "name",    label: "Full name",    type: "text",  placeholder: "Your name" },
                      { key: "email",   label: "Work email",   type: "email", placeholder: "you@company.com" },
                      { key: "company", label: "Company",      type: "text",  placeholder: "Company name" },
                      { key: "size",    label: "Team size",    type: "text",  placeholder: "e.g. 10–50" },
                    ].map((field) => (
                      <div key={field.key} className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          required
                          value={(form as any)[field.key]}
                          onChange={(e) => setForm(s => ({ ...s, [field.key]: e.target.value }))}
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
                  </div>

                  {/* Use case selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                      Primary use case
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {useCases.map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setForm(s => ({ ...s, useCase: u }))}
                          className="px-4 py-2 text-sm transition-all duration-150"
                          style={{
                            border: `1px solid ${form.useCase === u ? "var(--color-primary)" : "var(--color-border)"}`,
                            background: form.useCase === u ? "color-mix(in srgb, var(--color-primary) 10%, transparent)" : "transparent",
                            color: form.useCase === u ? "var(--color-primary)" : "var(--color-text-muted)",
                          }}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                      Anything specific you'd like to see? (optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. We're building a RAG pipeline and want to compare embedding models..."
                      value={form.message}
                      onChange={(e) => setForm(s => ({ ...s, message: e.target.value }))}
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
                    Book My Demo
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
                    Or{" "}
                    <Link
                      href="/signup"
                      className="transition-colors"
                      style={{ color: "var(--color-primary)" }}
                    >
                      create a free account
                    </Link>
                    {" "}and explore yourself — no demo needed.
                  </p>
                </form>
              </>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="lg:col-span-2 p-10 lg:p-14 flex flex-col gap-8"
            style={{ background: isDark ? "var(--color-surface-2)" : "var(--color-surface-3)" }}
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
                What happens next
              </h3>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                No sales pressure. Just a real demo with real answers.
              </p>
            </div>

            <div className="flex flex-col gap-0" style={{ borderLeft: "2px solid var(--color-border)" }}>
              {[
                { step: "01", title: "We confirm within 2h", desc: "You'll get a calendar invite from our team." },
                { step: "02", title: "30-min live call",      desc: "We walk through the platform for your use case." },
                { step: "03", title: "Custom sandbox",        desc: "We set up a trial environment tailored to you." },
                { step: "04", title: "You ship faster",       desc: "Most teams go live within the same week." },
              ].map((s, i) => (
                <div key={s.step} className="flex gap-4 pl-6 pb-7">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                      {s.step}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                      {s.title}
                    </span>
                    <span className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                      {s.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="p-5 flex flex-col gap-2"
              style={{ border: "1px solid var(--color-border)", background: "color-mix(in srgb, var(--color-primary) 5%, transparent)" }}
            >
              <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                Just want to explore first?
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Start free with 10,000 API calls — no card, no call needed.
              </p>
              <Link href="/signup">
                <button
                  className="mt-2 text-sm font-semibold flex items-center gap-2 transition-opacity hover:opacity-70"
                  style={{ color: "var(--color-primary)" }}
                >
                  Start free <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            <div className="flex items-center gap-2 mt-auto">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--color-success)" }}
              />
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Team available now
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}