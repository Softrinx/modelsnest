"use client"

import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { useState, useRef } from "react"
import { useTheme } from "@/contexts/themeContext"
import { Footer } from "@/components/footer"
import { PageTopBar } from "@/components/page-top-bar"
import {
  Search, Copy, Check, Circle, MessageSquare, FileText,
  Image, Mic, Layers, Github, Download, ExternalLink,
  Play, BookOpen, Terminal
} from "lucide-react"

// ─── Data ─────────────────────────────────────────────────────────────────────

const categories = ["All", "Chat", "Text", "Embeddings", "Images", "Audio"]

const endpoints = [
  { method: "POST", path: "/v1/chat/completions",      desc: "Create a chat completion",      category: "Chat",       status: "Stable", icon: MessageSquare },
  { method: "POST", path: "/v1/completions",           desc: "Create a text completion",      category: "Text",       status: "Stable", icon: FileText },
  { method: "POST", path: "/v1/embeddings",            desc: "Create text embeddings",        category: "Embeddings", status: "Stable", icon: Layers },
  { method: "POST", path: "/v1/images/generations",   desc: "Generate images from prompts",  category: "Images",     status: "Beta",   icon: Image },
  { method: "POST", path: "/v1/audio/transcriptions", desc: "Transcribe audio to text",      category: "Audio",      status: "Stable", icon: Mic },
  { method: "POST", path: "/v1/audio/translations",   desc: "Translate audio to English",    category: "Audio",      status: "Beta",   icon: Mic },
]

const sdks = [
  { name: "Python",     version: "1.2.0", downloads: "45.2K", img: "/images/python.png",  install: "pip install outsoor",               accent: "#3b82f6" },
  { name: "Node.js",    version: "2.1.0", downloads: "67.8K", img: "/images/nodejs.png",  install: "npm install outsoor",               accent: "#22c55e" },
  { name: "Go",         version: "0.9.1", downloads: "12.3K", img: "/images/go.png",      install: "go get github.com/outsoor/go",      accent: "#06b6d4" },
  { name: "PHP",        version: "1.0.3", downloads: "15.7K", img: "/images/php.png",     install: "composer require outsoor/php",      accent: "#8b5cf6" },
  { name: "Java",       version: "1.0.5", downloads: "23.4K", img: "/images/java.png",    install: "implementation 'com.outsoor:sdk'",  accent: "#f59e0b" },
  { name: "C#",         version: "1.1.2", downloads: "18.9K", img: "/images/c.png",  install: "dotnet add package Outsoor",        accent: "#ec4899" },
]

const examples: Record<string, string> = {
  Python: `import requests

url = "https://api.outsoor.com/v1/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "model": "gpt-4",
    "messages": [
        {"role": "user", "content": "Hello!"}
    ]
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`,

  JavaScript: `const response = await fetch(
  "https://api.outsoor.com/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: "Hello!" }],
    }),
  }
)
const data = await response.json()
console.log(data)`,

  cURL: `curl https://api.outsoor.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'`,

  Go: `package main

import (
  "bytes"
  "encoding/json"
  "net/http"
)

func main() {
  payload, _ := json.Marshal(map[string]any{
    "model": "gpt-4",
    "messages": []map[string]string{
      {"role": "user", "content": "Hello!"},
    },
  })
  req, _ := http.NewRequest("POST",
    "https://api.outsoor.com/v1/chat/completions",
    bytes.NewBuffer(payload))
  req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
  req.Header.Set("Content-Type", "application/json")
  http.DefaultClient.Do(req)
}`,
}

// ─── SDK Card ─────────────────────────────────────────────────────────────────

function SDKCard({ sdk, index }: { sdk: typeof sdks[0]; index: number }) {
  const { isDark } = useTheme()
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const copy = () => {
    navigator.clipboard.writeText(sdk.install)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const bg    = isDark ? "var(--color-surface-2)" : "#fff"
  const codeBg= isDark ? "#0a0a0b" : "#f4f4f5"
  const codeC = isDark ? "#a8c4a2" : "#374151"

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.25, 0.25, 0, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col overflow-hidden"
      style={{
        background: bg,
        border: `1px solid ${hovered ? sdk.accent : "var(--color-border)"}`,
        transition: "border-color 0.2s ease",
      }}
    >
      {/* Mouse-follow spotlight */}
      <motion.div
        style={{
          position: "absolute",
          width: "200px", height: "200px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${sdk.accent}1a 0%, transparent 70%)`,
          x: useTransform(mouseX, v => v - 100),
          y: useTransform(mouseY, v => v - 100),
          pointerEvents: "none",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s",
        }}
      />

      {/* Top accent line grows from left */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.25, 0, 1] }}
        style={{ height: "2px", background: sdk.accent, transformOrigin: "left", flexShrink: 0 }}
      />

      <div className="relative z-10 p-6 flex flex-col gap-5">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <motion.div
            animate={{ scale: hovered ? 1.08 : 1, rotate: hovered ? -4 : 0 }}
            transition={{ duration: 0.22 }}
            className="w-10 h-10 flex items-center justify-center"
            style={{ background: `${sdk.accent}18`, border: `1px solid ${sdk.accent}35` }}
          >
            <img src={sdk.img} alt={sdk.name} className="w-6 h-6 object-contain" />
          </motion.div>
          <div className="text-right">
            <div className="text-xs font-mono" style={{ color: "var(--color-text-muted)", opacity: 0.5 }}>v{sdk.version}</div>
            <div className="text-xs" style={{ color: "var(--color-text-muted)", opacity: 0.4 }}>{sdk.downloads} installs</div>
          </div>
        </div>

        {/* Name */}
        <div>
          <div className="text-xl font-black" style={{ color: "var(--color-text)", letterSpacing: "-0.03em" }}>{sdk.name}</div>
          <div className="text-xs font-mono mt-0.5" style={{ color: sdk.accent, opacity: 0.8 }}>official sdk</div>
        </div>

        {/* Install command */}
        <div className="flex items-center justify-between gap-2 px-3 py-2.5 text-xs font-mono"
          style={{ background: codeBg, border: `1px solid ${isDark ? "#1e1e22" : "#e4e4e7"}` }}>
          <span className="truncate" style={{ color: codeC }}>{sdk.install}</span>
          <button onClick={copy} className="flex-shrink-0 transition-opacity hover:opacity-60"
            style={{ color: copied ? "var(--color-success)" : "var(--color-text-muted)" }}>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold flex-1 justify-center transition-all duration-200"
            style={{
              background: hovered ? sdk.accent : "transparent",
              border: `1px solid ${hovered ? sdk.accent : "var(--color-border)"}`,
              color: hovered ? "#fff" : "var(--color-text-muted)",
            }}>
            <Download className="w-3 h-3" /> Install
          </button>
          <button className="p-2 transition-opacity hover:opacity-60"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}>
            <Github className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Code Block ───────────────────────────────────────────────────────────────

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const { isDark } = useTheme()
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  const lines = code.split("\n")

  const bg      = isDark ? "#0a0a0b"  : "#fafaf9"
  const border  = isDark ? "#1e1e22"  : "#e7e5e4"
  const lineCol = isDark ? "#a8c4a2"  : "#374151"
  const gutterC = isDark ? "#2a2a30"  : "#d6d3d1"
  const cmtCol  = isDark ? "#4a4a5a"  : "#9ca3af"
  const keyCol  = isDark ? "var(--color-primary)" : "#7c3aed"

  return (
    <div style={{ background: bg, border: `1px solid ${border}` }}>
      <div className="flex items-center justify-between" style={{ borderBottom: `1px solid ${border}`, background: isDark ? "#0d0d0f" : "#f5f5f4" }}>
        <div className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono"
          style={{ borderRight: `1px solid ${border}`, color: isDark ? "#e2e8f0" : "#374151", borderTop: "2px solid var(--color-primary)" }}>
          <FileText className="w-3 h-3" style={{ color: "var(--color-primary)" }} />
          {lang.toLowerCase()}.example
        </div>
        <button onClick={copy} className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono transition-opacity hover:opacity-70"
          style={{ color: copied ? "var(--color-success)" : isDark ? "#555" : "#9ca3af" }}>
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="flex overflow-x-auto">
        <div className="flex flex-col py-4 px-3 select-none flex-shrink-0" style={{ borderRight: `1px solid ${border}` }}>
          {lines.map((_, i) => (
            <div key={i} className="text-right text-xs font-mono leading-6" style={{ color: gutterC, minWidth: "1.5rem" }}>{i + 1}</div>
          ))}
        </div>
        <pre className="py-4 px-4 text-xs font-mono leading-6 flex-1 overflow-x-auto">
          {lines.map((line, i) => (
            <div key={i} style={{ color: (line.trim().startsWith("#") || line.trim().startsWith("//")) ? cmtCol : line.includes("Authorization") || line.includes("Bearer") ? keyCol : lineCol }}>
              {line || "\u00A0"}
            </div>
          ))}
        </pre>
      </div>
      <div className="flex items-center justify-between px-4 py-1.5 text-xs font-mono"
        style={{ borderTop: `1px solid ${border}`, background: isDark ? "#0d0d0f" : "#f5f5f4" }}>
        <span style={{ color: gutterC }}>UTF-8</span>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-success)" }} />
          <span style={{ color: gutterC }}>Ready</span>
        </div>
      </div>
    </div>
  )
}

// ─── Method Badge ─────────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: string }) {
  const c = method === "GET" ? "var(--color-success)" : "var(--color-primary)"
  return (
    <span className="text-xs font-bold px-2 py-0.5 flex-shrink-0 font-mono"
      style={{ background: `color-mix(in srgb, ${c} 12%, transparent)`, color: c, border: `1px solid color-mix(in srgb, ${c} 25%, transparent)` }}>
      {method}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function APIReferencePage() {
  const { isDark } = useTheme()
  const [query, setQuery] = useState("")
  const [cat, setCat] = useState("All")
  const [activeLang, setActiveLang] = useState("Python")
  const [activeEndpoint, setActiveEndpoint] = useState(0)

  const filtered = endpoints.filter(ep =>
    (cat === "All" || ep.category === cat) &&
    (ep.path.includes(query) || ep.desc.toLowerCase().includes(query.toLowerCase()))
  )

  const surfaceColor = isDark ? "var(--color-surface-1)" : "#fafaf9"
  const borderColor  = "var(--color-border)"

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      <PageTopBar breadcrumb="Docs · API Reference" />

      {/* IDE tab bar */}
      <div className="flex items-center gap-0 flex-shrink-0 overflow-x-auto"
        style={{ borderBottom: `1px solid ${borderColor}`, background: surfaceColor, height: "40px" }}>
        <div className="flex items-center gap-1.5 px-4 flex-shrink-0"
          style={{ borderRight: `1px solid ${borderColor}`, height: "40px" }}>
          <Circle className="w-2.5 h-2.5 fill-red-500 text-red-500" />
          <Circle className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
          <Circle className="w-2.5 h-2.5 fill-green-500 text-green-500" />
        </div>
        <div className="flex items-center gap-2 px-5 text-xs font-mono flex-shrink-0"
          style={{ height: "40px", background: "var(--color-bg)", borderRight: `1px solid ${borderColor}`, color: "var(--color-text)", borderTop: "2px solid var(--color-primary)" }}>
          <BookOpen className="w-3 h-3" style={{ color: "var(--color-primary)" }} />
          reference.md
        </div>
        <span className="ml-4 text-xs font-mono" style={{ color: "var(--color-text-muted)", opacity: 0.3 }}>
          outsoor / api-reference
        </span>
        <div className="ml-auto flex items-center gap-2 px-4 flex-shrink-0"
          style={{ borderLeft: `1px solid ${borderColor}`, height: "40px" }}>
          <Terminal className="w-3.5 h-3.5" style={{ color: "var(--color-text-muted)", opacity: 0.4 }} />
          <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)", opacity: 0.35 }}>v2.4.0</span>
        </div>
      </div>

      {/* ── 3-col IDE layout ── */}
      <div className="flex flex-1" style={{ minHeight: "calc(100vh - 140px)" }}>

        {/* Left — endpoint list */}
        <div className="hidden lg:flex flex-col flex-shrink-0 overflow-y-auto"
          style={{ width: "260px", borderRight: `1px solid ${borderColor}`, background: surfaceColor }}>
          <div className="p-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--color-text-muted)", opacity: 0.5 }} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter endpoints..."
                className="w-full pl-8 pr-3 py-2 text-xs font-mono outline-none"
                style={{ background: "var(--color-bg)", border: `1px solid ${borderColor}`, color: "var(--color-text)", borderRadius: 0 }} />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 p-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCat(c)} className="text-xs px-2.5 py-1 font-mono transition-all"
                style={{ border: `1px solid ${cat === c ? "var(--color-primary)" : borderColor}`, color: cat === c ? "var(--color-primary)" : "var(--color-text-muted)", background: "transparent" }}>
                {c}
              </button>
            ))}
          </div>

          <div className="py-2">
            <div className="px-3 py-2 text-xs font-mono uppercase tracking-wider" style={{ color: "var(--color-text-muted)", opacity: 0.4 }}>
              Endpoints · {filtered.length}
            </div>
            {filtered.map((ep) => {
              const isActive = endpoints.indexOf(ep) === activeEndpoint
              return (
                <button key={ep.path} onClick={() => setActiveEndpoint(endpoints.indexOf(ep))}
                  className="w-full flex flex-col gap-1 px-4 py-3 text-left transition-all"
                  style={{ background: isActive ? `color-mix(in srgb, var(--color-primary) 7%, transparent)` : "transparent", borderLeft: `2px solid ${isActive ? "var(--color-primary)" : "transparent"}` }}>
                  <div className="flex items-center gap-2">
                    <MethodBadge method={ep.method} />
                    <ep.icon className="w-3 h-3 flex-shrink-0" style={{ color: isActive ? "var(--color-primary)" : "var(--color-text-muted)", opacity: 0.7 }} />
                  </div>
                  <span className="text-xs font-mono" style={{ color: isActive ? "var(--color-text)" : "var(--color-text-muted)" }}>{ep.path}</span>
                </button>
              )
            })}
          </div>

          {/* Compact SDK list in sidebar */}
          <div style={{ borderTop: `1px solid ${borderColor}`, marginTop: "auto" }}>
            <div className="px-3 py-2 text-xs font-mono uppercase tracking-wider" style={{ color: "var(--color-text-muted)", opacity: 0.4 }}>SDKs</div>
            {sdks.map(sdk => (
              <div key={sdk.name} className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  <img src={sdk.img} alt={sdk.name} className="w-4 h-4 object-contain" />
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{sdk.name}</span>
                  <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)", opacity: 0.4 }}>v{sdk.version}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:opacity-60 transition-opacity" style={{ color: "var(--color-text-muted)" }}><Download className="w-3 h-3" /></button>
                  <button className="p-1 hover:opacity-60 transition-opacity" style={{ color: "var(--color-text-muted)" }}><Github className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center — scrollable: endpoint detail + SDK cards below */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeEndpoint} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="p-10 lg:p-14 flex flex-col gap-10" style={{ maxWidth: "720px" }}>

              {/* Endpoint header */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <MethodBadge method={endpoints[activeEndpoint].method} />
                  <code className="text-sm font-mono font-bold" style={{ color: "var(--color-text)" }}>{endpoints[activeEndpoint].path}</code>
                  <span className="text-xs px-2 py-0.5 ml-auto"
                    style={{ border: `1px solid ${endpoints[activeEndpoint].status === "Stable" ? "var(--color-success)" : "var(--color-accent)"}`, color: endpoints[activeEndpoint].status === "Stable" ? "var(--color-success)" : "var(--color-accent)" }}>
                    {endpoints[activeEndpoint].status}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  {endpoints[activeEndpoint].desc}. Requires a valid <code style={{ color: "var(--color-primary)" }}>ptr_</code> API token.
                </p>
              </div>

              {/* Request blocks */}
              {[
                { title: "Headers", code: `Authorization: Bearer ptr_your_token_here\nContent-Type: application/json` },
                { title: "Body",    code: `{\n  "model": "gpt-4",\n  "messages": [\n    {"role": "user", "content": "Hello!"}\n  ],\n  "max_tokens": 500\n}` },
              ].map(block => (
                <div key={block.title} className="flex flex-col gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>{block.title}</h3>
                  <CodeBlock code={block.code} lang={block.title} />
                </div>
              ))}

              {/* Response */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>200 Response</h3>
                <CodeBlock code={`{\n  "id": "chatcmpl-abc123",\n  "model": "gpt-4",\n  "choices": [\n    {\n      "message": { "role": "assistant", "content": "Hello!" },\n      "finish_reason": "stop"\n    }\n  ],\n  "usage": { "total_tokens": 21 }\n}`} lang="JSON" />
              </div>

              {/* Parameters */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Parameters</h3>
                <div style={{ border: `1px solid ${borderColor}` }}>
                  <div className="grid grid-cols-4 px-4 py-2 text-xs font-mono"
                    style={{ borderBottom: `1px solid ${borderColor}`, background: isDark ? "var(--color-surface-2)" : "#f5f5f4", color: "var(--color-text-muted)" }}>
                    {["Param", "Type", "Required", "Default"].map(h => <span key={h}>{h}</span>)}
                  </div>
                  {[
                    { p: "model",       t: "string",  r: true,  d: "—" },
                    { p: "messages",    t: "array",   r: true,  d: "—" },
                    { p: "max_tokens",  t: "integer", r: false, d: "256" },
                    { p: "temperature", t: "float",   r: false, d: "1.0" },
                    { p: "stream",      t: "boolean", r: false, d: "false" },
                  ].map((row, i, arr) => (
                    <div key={row.p} className="grid grid-cols-4 px-4 py-3 text-xs font-mono"
                      style={{ borderBottom: i < arr.length - 1 ? `1px solid ${borderColor}` : "none" }}>
                      <span style={{ color: "var(--color-primary)" }}>{row.p}</span>
                      <span style={{ color: "var(--color-text-muted)" }}>{row.t}</span>
                      <span style={{ color: row.r ? "#f87171" : "var(--color-text-muted)" }}>{row.r ? "yes" : "no"}</span>
                      <span style={{ color: "var(--color-text-muted)" }}>{row.d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── SDK Cards section — inline below endpoint detail ── */}
          <div style={{ borderTop: `1px solid ${borderColor}` }}>
            <div className="px-10 lg:px-14 pt-14 pb-6">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-primary)" }}>Official SDKs</span>
              <h2 className="mt-2 text-2xl font-black" style={{ color: "var(--color-text)", letterSpacing: "-0.03em" }}>
                Your language. Our API.
              </h2>
              <p className="mt-2 text-sm max-w-md" style={{ color: "var(--color-text-muted)" }}>
                Open-source, maintained by Outsoor engineering. Same interface across all languages.
              </p>
            </div>

            <div className="px-10 lg:px-14 pb-14">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
                style={{ background: borderColor }}>
                {sdks.map((sdk, i) => (
                  <div key={sdk.name} style={{ background: "var(--color-bg)" }}>
                    <SDKCard sdk={sdk} index={i} />
                  </div>
                ))}
              </div>

              {/* Stats strip */}
              <div className="mt-px grid grid-cols-4 gap-px" style={{ background: borderColor }}>
                {[
                  { n: "8",     l: "Languages" },
                  { n: "180K+", l: "Weekly installs" },
                  { n: "MIT",   l: "License" },
                  { n: "v2.4",  l: "Latest" },
                ].map(s => (
                  <div key={s.l} className="flex flex-col gap-0.5 px-6 py-5" style={{ background: "var(--color-bg)" }}>
                    <span className="text-xl font-black font-mono" style={{ color: "var(--color-text)", letterSpacing: "-0.03em" }}>{s.n}</span>
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right — code examples */}
        <div className="hidden xl:flex flex-col flex-shrink-0 overflow-y-auto"
          style={{ width: "400px", borderLeft: `1px solid ${borderColor}` }}>
          <div className="flex overflow-x-auto flex-shrink-0"
            style={{ borderBottom: `1px solid ${borderColor}`, background: surfaceColor }}>
            {Object.keys(examples).map(lang => (
              <button key={lang} onClick={() => setActiveLang(lang)}
                className="px-4 py-2.5 text-xs font-mono flex-shrink-0 transition-all"
                style={{ borderBottom: `2px solid ${activeLang === lang ? "var(--color-primary)" : "transparent"}`, color: activeLang === lang ? "var(--color-text)" : "var(--color-text-muted)", marginBottom: "-1px" }}>
                {lang}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeLang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="flex-1">
              <CodeBlock code={examples[activeLang]} lang={activeLang} />
            </motion.div>
          </AnimatePresence>

          {/* Try it */}
          <div className="p-5 flex flex-col gap-3 flex-shrink-0" style={{ borderTop: `1px solid ${borderColor}`, background: surfaceColor }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>Try it live</span>
              <div className="flex items-center gap-1">
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-success)" }} />
                <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>Live</span>
              </div>
            </div>
            <input placeholder="ptr_your_api_key_here" className="w-full px-3 py-2 text-xs font-mono outline-none"
              style={{ background: "var(--color-bg)", border: `1px solid ${borderColor}`, color: "var(--color-text)", borderRadius: 0 }} />
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
                style={{ background: "var(--color-primary)", color: "#fff" }}>
                <Play className="w-3 h-3" /> Run
              </button>
              <a href="/docs" className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono transition-opacity hover:opacity-70"
                style={{ border: `1px solid ${borderColor}`, color: "var(--color-text-muted)" }}>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-6 text-xs font-mono flex-shrink-0"
        style={{ height: "24px", background: "var(--color-primary)", color: "#fff" }}>
        <div className="flex items-center gap-5">
          <span>Outsoor API Reference</span>
          <span style={{ opacity: 0.7 }}>{endpoints.length} endpoints · {sdks.length} SDKs</span>
        </div>
        <div className="flex items-center gap-4" style={{ opacity: 0.8 }}>
          <span>REST · JSON</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-300" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}