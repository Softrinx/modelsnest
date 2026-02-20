"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { useTheme } from "@/contexts/themeContext"
import { Footer } from "@/components/footer"
import { PageTopBar } from "@/components/page-top-bar"
import { Check, Copy, ChevronRight } from "lucide-react"

// ─── Data ───────────────────────────────────────────────────────────────────

const nav = [
  { id: "overview",       label: "Overview" },
  { id: "authentication", label: "Authentication" },
  { id: "endpoints",      label: "Endpoints" },
  { id: "examples",       label: "Examples" },
  { id: "testing",        label: "Testing" },
]

const endpoints = [
  {
    method: "POST",
    path: "/api/verify-token",
    badge: "Public",
    description: "Verify an API token and retrieve token metadata.",
    request: `{\n  "token": "ptr_your_api_token_here"\n}`,
    response: `{\n  "success": true,\n  "message": "API token is valid",\n  "token_info": {\n    "id": 123,\n    "name": "My API Token",\n    "user_email": "user@example.com",\n    "last_used_at": "2024-01-15T10:30:00Z"\n  }\n}`,
  },
  {
    method: "POST",
    path: "/api/chat",
    badge: "Protected",
    description: "Send a message to the AI chat system.",
    request: `{\n  "message": "Your prompt here",\n  "context": "optional context"\n}`,
    response: `{\n  "success": true,\n  "response": "AI response text",\n  "tokens_used": 42\n}`,
  },
  {
    method: "GET",
    path: "/api/auth/me",
    badge: "Protected",
    description: "Retrieve current authenticated user information.",
    request: null,
    response: `{\n  "id": "uuid-here",\n  "name": "Alex Johnson",\n  "email": "alex@company.com",\n  "plan": "enterprise"\n}`,
  },
]

const examples = [
  {
    lang: "Python",
    code: `import outsoor

client = outsoor.Client("ptr_your_token_here")

response = client.text.generate(
  model="gpt-4",
  prompt="Explain quantum entanglement",
  max_tokens=200
)

print(response.text)`,
  },
  {
    lang: "Node.js",
    code: `import outsoor from "outsoor"

const client = new outsoor.Client("ptr_your_token_here")

const response = await client.text.generate({
  model: "gpt-4",
  prompt: "Explain quantum entanglement",
  maxTokens: 200,
})

console.log(response.text)`,
  },
  {
    lang: "cURL",
    code: `curl -X POST https://api.outsoor.com/v1/text \\
  -H "Authorization: Bearer ptr_your_token_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4",
    "prompt": "Explain quantum entanglement",
    "max_tokens": 200
  }'`,
  },
  {
    lang: "PHP",
    code: `<?php
$client = new Outsoor\\Client("ptr_your_token_here");

$response = $client->text->generate([
  "model"      => "gpt-4",
  "prompt"     => "Explain quantum entanglement",
  "max_tokens" => 200,
]);

echo $response->text;`,
  },
]

// ─── Code block ─────────────────────────────────────────────────────────────

function Code({ code, lang }: { code: string; lang?: string }) {
  const { isDark } = useTheme()
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const lines = code.split("\n")

  return (
    <div
      className="relative text-sm font-mono overflow-x-auto"
      style={{ background: isDark ? "#0a0a0b" : "#111", border: "1px solid var(--color-border)" }}
    >
      {lang && (
        <div
          className="px-5 py-2 text-xs border-b flex items-center justify-between"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
        >
          <span style={{ opacity: 0.5 }}>{lang}</span>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
            style={{ color: copied ? "var(--color-success)" : "var(--color-text-muted)" }}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      <div className="p-5 flex flex-col gap-0.5">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-4">
            <span style={{ color: "var(--color-text-muted)", opacity: 0.25, userSelect: "none", minWidth: "1.2rem", textAlign: "right" }}>
              {i + 1}
            </span>
            <span style={{
              color: line.trim().startsWith("#") || line.trim().startsWith("//")
                ? "var(--color-text-muted)"
                : line.trim().startsWith("$") || line.trim().startsWith("curl")
                ? "var(--color-success)"
                : "#e2e8f0",
            }}>
              {line || "\u00A0"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Method badge ────────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET:    "var(--color-success)",
    POST:   "var(--color-primary)",
    PUT:    "var(--color-accent)",
    DELETE: "var(--color-danger)",
  }
  return (
    <span
      className="text-xs font-bold px-2 py-0.5"
      style={{
        background: `color-mix(in srgb, ${colors[method] ?? "var(--color-primary)"} 12%, transparent)`,
        color: colors[method] ?? "var(--color-primary)",
        border: `1px solid color-mix(in srgb, ${colors[method] ?? "var(--color-primary)"} 30%, transparent)`,
      }}
    >
      {method}
    </span>
  )
}

// ─── Sections ────────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-black mb-6"
      style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "var(--color-text)", letterSpacing: "-0.03em" }}
    >
      {children}
    </h2>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wider mb-4 block" style={{ color: "var(--color-primary)" }}>
      {children}
    </span>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const { isDark } = useTheme()
  const [activeSection, setActiveSection] = useState("overview")
  const [activeExample, setActiveExample] = useState(0)
  const [activeEndpoint, setActiveEndpoint] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <PageTopBar breadcrumb="Docs · API Reference" />

      <div className="max-w-7xl mx-auto px-6" ref={ref}>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-16"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <SectionLabel>Documentation</SectionLabel>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "var(--color-text)",
            }}
          >
            API{" "}
            <span style={{
              background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Reference
            </span>
          </h1>
          <p className="text-lg leading-relaxed max-w-xl mt-4" style={{ color: "var(--color-text-muted)" }}>
            Everything you need to integrate Outsoor into your stack. Base URL:{" "}
            <code
              className="text-sm px-2 py-0.5"
              style={{ background: "var(--color-surface-2)", color: "var(--color-primary)", border: "1px solid var(--color-border)" }}
            >
              https://api.outsoor.com/v1
            </code>
          </p>
        </motion.div>

        {/* Main layout — sidebar + content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0" style={{ minHeight: "80vh" }}>

          {/* Sidebar nav */}
          <motion.aside
            initial={{ opacity: 0, x: -12 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden lg:flex flex-col py-10"
            style={{ borderRight: "1px solid var(--color-border)" }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider px-6 mb-4" style={{ color: "var(--color-text-muted)", opacity: 0.5 }}>
              Sections
            </span>
            {nav.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="flex items-center justify-between px-6 py-3 text-sm text-left transition-all duration-150 group"
                style={{
                  background: activeSection === item.id ? `color-mix(in srgb, var(--color-primary) 6%, transparent)` : "transparent",
                  color: activeSection === item.id ? "var(--color-text)" : "var(--color-text-muted)",
                  borderLeft: `2px solid ${activeSection === item.id ? "var(--color-primary)" : "transparent"}`,
                  fontWeight: activeSection === item.id ? 600 : 400,
                }}
              >
                {item.label}
                {activeSection === item.id && <ChevronRight className="w-3.5 h-3.5" style={{ color: "var(--color-primary)" }} />}
              </button>
            ))}

            {/* Rate limit info */}
            <div
              className="mx-6 mt-8 p-4 flex flex-col gap-1"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <span className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>Rate Limits</span>
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>1,000 req / hour</span>
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Enterprise: unlimited</span>
            </div>
          </motion.aside>

          {/* Content pane */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-3 py-10 lg:px-12 flex flex-col gap-12"
          >

            {/* ── Overview ── */}
            {activeSection === "overview" && (
              <div className="flex flex-col gap-8">
                <div>
                  <SectionLabel>Overview</SectionLabel>
                  <SectionHeading>Getting Started</SectionHeading>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-text-muted)" }}>
                    Outsoor provides a unified REST API for 50+ AI models. All requests use HTTPS and return JSON. Authentication is via Bearer token.
                  </p>
                  <div
                    className="grid grid-cols-1 md:grid-cols-3"
                    style={{ border: "1px solid var(--color-border)" }}
                  >
                    {[
                      { label: "Base URL",      value: "api.outsoor.com/v1" },
                      { label: "Format",        value: "JSON" },
                      { label: "Auth",          value: "Bearer token" },
                    ].map((row, i, arr) => (
                      <div
                        key={row.label}
                        className="flex flex-col gap-1 px-6 py-5"
                        style={{ borderRight: i < arr.length - 1 ? "1px solid var(--color-border)" : "none" }}
                      >
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{row.label}</span>
                        <span className="text-sm font-bold font-mono" style={{ color: "var(--color-text)" }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold mb-3" style={{ color: "var(--color-text)" }}>Quick install</h3>
                  <Code code={`pip install outsoor\n# or\nnpm install outsoor`} lang="bash" />
                </div>

                <div>
                  <h3 className="text-base font-bold mb-3" style={{ color: "var(--color-text)" }}>First request</h3>
                  <Code
                    code={`import outsoor\n\nclient = outsoor.Client("ptr_your_token_here")\nresponse = client.text.generate(model="gpt-4", prompt="Hello!")\nprint(response.text)`}
                    lang="Python"
                  />
                </div>
              </div>
            )}

            {/* ── Authentication ── */}
            {activeSection === "authentication" && (
              <div className="flex flex-col gap-8">
                <div>
                  <SectionLabel>Authentication</SectionLabel>
                  <SectionHeading>API Tokens</SectionHeading>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-text-muted)" }}>
                    Every request must include your API token in the Authorization header. Tokens start with <code style={{ color: "var(--color-primary)" }}>ptr_</code>.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-base font-bold" style={{ color: "var(--color-text)" }}>Get your token</h3>
                  <div className="flex flex-col" style={{ border: "1px solid var(--color-border)" }}>
                    {[
                      "Log in to your Outsoor dashboard",
                      "Navigate to Settings → API Keys",
                      "Click Create new key",
                      "Copy the token — it won't be shown again",
                    ].map((step, i) => (
                      <div
                        key={step}
                        className="flex items-center gap-5 px-6 py-4"
                        style={{ borderBottom: i < 3 ? "1px solid var(--color-border)" : "none" }}
                      >
                        <span
                          className="text-xs font-black font-mono w-5 flex-shrink-0"
                          style={{ color: "var(--color-primary)" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-base font-bold" style={{ color: "var(--color-text)" }}>Usage</h3>
                  <Code code={`Authorization: Bearer ptr_your_token_here\nContent-Type: application/json`} lang="Headers" />
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-base font-bold" style={{ color: "var(--color-text)" }}>Security rules</h3>
                  <div className="flex flex-col gap-2">
                    {[
                      "Never commit tokens to version control",
                      "Use environment variables in production",
                      "Rotate tokens every 90 days",
                      "Revoke immediately if compromised",
                    ].map((rule) => (
                      <div key={rule} className="flex items-center gap-3">
                        <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--color-success)" }} />
                        <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Endpoints ── */}
            {activeSection === "endpoints" && (
              <div className="flex flex-col gap-8">
                <div>
                  <SectionLabel>Endpoints</SectionLabel>
                  <SectionHeading>API Reference</SectionHeading>
                </div>

                {/* Endpoint tabs */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0" style={{ border: "1px solid var(--color-border)" }}>
                  <div className="lg:col-span-2 flex flex-col" style={{ borderRight: "1px solid var(--color-border)" }}>
                    {endpoints.map((ep, i) => (
                      <button
                        key={ep.path}
                        onClick={() => setActiveEndpoint(i)}
                        className="flex flex-col gap-1.5 px-5 py-4 text-left transition-all"
                        style={{
                          borderBottom: i < endpoints.length - 1 ? "1px solid var(--color-border)" : "none",
                          background: activeEndpoint === i ? `color-mix(in srgb, var(--color-primary) 5%, transparent)` : "transparent",
                          borderLeft: `2px solid ${activeEndpoint === i ? "var(--color-primary)" : "transparent"}`,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <MethodBadge method={ep.method} />
                          <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>{ep.path}</span>
                        </div>
                        <span
                          className="text-xs"
                          style={{
                            color: ep.badge === "Public" ? "var(--color-success)" : "var(--color-text-muted)",
                            opacity: 0.7,
                          }}
                        >
                          {ep.badge}
                        </span>
                      </button>
                    ))}
                  </div>

                  <motion.div
                    key={activeEndpoint}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="lg:col-span-3 p-6 flex flex-col gap-5"
                  >
                    <div className="flex items-center gap-3">
                      <MethodBadge method={endpoints[activeEndpoint].method} />
                      <code className="text-xs font-mono" style={{ color: "var(--color-text)" }}>
                        {endpoints[activeEndpoint].path}
                      </code>
                    </div>
                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                      {endpoints[activeEndpoint].description}
                    </p>
                    {endpoints[activeEndpoint].request && (
                      <div>
                        <span className="text-xs font-semibold block mb-2" style={{ color: "var(--color-text-muted)" }}>Request body</span>
                        <Code code={endpoints[activeEndpoint].request!} lang="json" />
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-semibold block mb-2" style={{ color: "var(--color-text-muted)" }}>Response</span>
                      <Code code={endpoints[activeEndpoint].response} lang="json" />
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* ── Examples ── */}
            {activeSection === "examples" && (
              <div className="flex flex-col gap-8">
                <div>
                  <SectionLabel>Examples</SectionLabel>
                  <SectionHeading>Code Samples</SectionHeading>
                </div>

                {/* Language tabs */}
                <div className="flex gap-0" style={{ borderBottom: "1px solid var(--color-border)" }}>
                  {examples.map((ex, i) => (
                    <button
                      key={ex.lang}
                      onClick={() => setActiveExample(i)}
                      className="px-5 py-3 text-sm font-medium transition-all"
                      style={{
                        borderBottom: `2px solid ${activeExample === i ? "var(--color-primary)" : "transparent"}`,
                        color: activeExample === i ? "var(--color-text)" : "var(--color-text-muted)",
                        marginBottom: "-1px",
                      }}
                    >
                      {ex.lang}
                    </button>
                  ))}
                </div>

                <motion.div
                  key={activeExample}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Code code={examples[activeExample].code} lang={examples[activeExample].lang} />
                </motion.div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-base font-bold" style={{ color: "var(--color-text)" }}>Install SDK</h3>
                  <Code
                    code={`# Python\npip install outsoor\n\n# Node.js\nnpm install outsoor\n\n# Go\ngo get github.com/outsoor/outsoor-go`}
                    lang="bash"
                  />
                </div>
              </div>
            )}

            {/* ── Testing ── */}
            {activeSection === "testing" && (
              <div className="flex flex-col gap-8">
                <div>
                  <SectionLabel>Testing</SectionLabel>
                  <SectionHeading>Test Your Integration</SectionHeading>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    Use the token verification endpoint before going to production to confirm your credentials are working.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-base font-bold" style={{ color: "var(--color-text)" }}>Verify your token</h3>
                  <Code
                    code={`curl -X POST https://api.outsoor.com/v1/verify-token \\\n  -H "Content-Type: application/json" \\\n  -d '{"token": "ptr_your_token_here"}'`}
                    lang="bash"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-base font-bold" style={{ color: "var(--color-text)" }}>Tips</h3>
                  <div className="flex flex-col" style={{ border: "1px solid var(--color-border)" }}>
                    {[
                      "Test tokens in a staging environment first",
                      "Use the verify-token endpoint to check validity before production calls",
                      "Monitor usage via the dashboard to stay within rate limits",
                      "Rotate tokens every 90 days for security",
                    ].map((tip, i, arr) => (
                      <div
                        key={tip}
                        className="flex items-start gap-4 px-6 py-4"
                        style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--color-border)" : "none" }}
                      >
                        <span className="text-xs font-bold font-mono flex-shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="p-6 flex flex-col gap-3"
                  style={{ border: "1px solid var(--color-border)", background: `color-mix(in srgb, var(--color-primary) 4%, transparent)` }}
                >
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                    Need help with your integration?
                  </p>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Our team is available to help you go from zero to production.
                  </p>
                  <a href="/contact" className="text-sm font-semibold flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: "var(--color-primary)" }}>
                    Talk to an engineer <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Mobile section nav */}
            <div className="flex flex-wrap gap-2 lg:hidden">
              {nav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="px-4 py-2 text-sm transition-all"
                  style={{
                    border: `1px solid ${activeSection === item.id ? "var(--color-primary)" : "var(--color-border)"}`,
                    color: activeSection === item.id ? "var(--color-primary)" : "var(--color-text-muted)",
                    background: "transparent",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}