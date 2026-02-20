"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { useTheme } from "@/contexts/themeContext"

const steps = [
  {
    number: "01",
    label: "Install",
    command: "pip install outsoor",
    lang: "bash",
  },
  {
    number: "02",
    label: "Initialize",
    command: `import outsoor\nclient = outsoor.Client("your-api-key")`,
    lang: "python",
  },
  {
    number: "03",
    label: "Call",
    command: `response = client.text.generate(\n  model="gpt-4",\n  prompt="Hello, world!"\n)`,
    lang: "python",
  },
  {
    number: "04",
    label: "Done",
    command: `# Response in 187ms\nprint(response.text)\n# → "Hello! How can I help?"`,
    lang: "python",
  },
]

const sdks = ["Python", "Node.js", "Go", "PHP", "Ruby", "Rust", "Java", "C#"]

const stats = [
  { value: "0s",   label: "Key generation" },
  { value: "8",    label: "SDK languages" },
  { value: "187ms", label: "Avg response" },
  { value: "100%",  label: "OpenAI compat" },
]

function CodeBlock({ command, lang }: { command: string; lang: string }) {
  const { isDark } = useTheme()
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const lines = command.split("\n")

  return (
    <div
      className="relative font-mono text-sm"
      style={{
        background: isDark ? "#0a0a0b" : "#111",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Lang tag */}
      <div
        className="absolute top-3 right-12 text-xs font-mono px-2 py-0.5"
        style={{ color: "var(--color-text-muted)", opacity: 0.5 }}
      >
        {lang}
      </div>
      {/* Copy */}
      <button
        onClick={copy}
        className="absolute top-2.5 right-3 text-xs px-1.5 py-0.5 transition-colors"
        style={{ color: copied ? "var(--color-success)" : "var(--color-text-muted)" }}
      >
        {copied ? "✓" : "⎘"}
      </button>
      <div className="p-5 overflow-x-auto">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-4">
            <span style={{ color: "var(--color-text-muted)", opacity: 0.3, userSelect: "none", minWidth: "1.5rem" }}>
              {i + 1}
            </span>
            <span style={{ color: line.startsWith("#") ? "var(--color-text-muted)" : line.startsWith("$") ? "var(--color-success)" : "#e2e8f0" }}>
              {line || "\u00A0"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DeveloperExperience() {
  const { isDark } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section
      id="docs"
      ref={ref}
      className="relative py-32 overflow-hidden"
      style={{ background: isDark ? "var(--color-surface-1)" : "var(--color-surface-2)" }}
    >
      {/* Big background number */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[20rem] font-black leading-none select-none pointer-events-none"
        style={{
          color: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)",
          lineHeight: 1,
        }}
      >
        DEVELOPERS
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Top — label + headline side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <span
              className="text-xs font-mono tracking-widest uppercase"
              style={{ color: "var(--color-primary)" }}
            >
              Developer Experience
            </span>
            <h2
              className="text-5xl md:text-6xl font-black leading-none tracking-tighter"
              style={{ color: "var(--color-text)" }}
            >
              Built for
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Developers
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Everything you need to go from zero to production. Instant keys, SDKs in 8 languages, OpenAI-compatible — integrate in minutes, not days.
            </p>
            {/* SDK pills — one row */}
            <div className="flex flex-wrap gap-2">
              {sdks.map((sdk) => (
                <span
                  key={sdk}
                  className="text-xs font-mono px-3 py-1"
                  style={{
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-muted)",
                    background: "transparent",
                  }}
                >
                  {sdk}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats row — horizontal, no cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 mb-20"
          style={{ borderTop: "1px solid var(--color-border)", borderLeft: "1px solid var(--color-border)" }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col gap-1 px-8 py-6"
              style={{ borderRight: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}
            >
              <span
                className="text-3xl font-black font-mono"
                style={{ color: "var(--color-text)" }}
              >
                {s.value}
              </span>
              <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Steps — horizontal tabs + code */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-0"
          style={{ border: "1px solid var(--color-border)" }}
        >
          {/* Step selector — left column */}
          <div
            className="lg:col-span-2 flex flex-col"
            style={{ borderRight: "1px solid var(--color-border)" }}
          >
            {steps.map((step, i) => (
              <button
                key={step.number}
                onClick={() => setActiveStep(i)}
                className="flex items-center gap-5 px-8 py-6 text-left transition-all duration-150 group"
                style={{
                  background: activeStep === i ? (isDark ? "#0a0a0b" : "#111") : "transparent",
                  borderBottom: i < steps.length - 1 ? "1px solid var(--color-border)" : "none",
                }}
              >
                <span
                  className="text-2xl font-black font-mono leading-none"
                  style={{
                    color: activeStep === i ? "var(--color-primary)" : "var(--color-border)",
                    transition: "color 0.15s",
                  }}
                >
                  {step.number}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: activeStep === i ? "#fff" : "var(--color-text-muted)",
                      transition: "color 0.15s",
                    }}
                  >
                    {step.label}
                  </span>
                  <span
                    className="text-xs font-mono truncate max-w-[160px]"
                    style={{ color: "var(--color-text-muted)", opacity: 0.5 }}
                  >
                    {step.command.split("\n")[0]}
                  </span>
                </div>
                {activeStep === i && (
                  <div
                    className="ml-auto w-1 self-stretch"
                    style={{ background: "var(--color-primary)" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Code panel — right */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <CodeBlock
                command={steps[activeStep].command}
                lang={steps[activeStep].lang}
              />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}