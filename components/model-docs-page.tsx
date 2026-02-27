"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/themeContext"
import { useSidebar } from "@/components/dashboard-layout-controller"
import Link from "next/link"
import {
  ArrowLeft, Copy, Check, Code2, Zap, FileText,
  Play, Download, ChevronRight, Terminal, BookOpen,
  Bot, Mic, Video, Brain, Radio, DollarSign, Settings,
  Send, RotateCcw, ChevronDown, ChevronUp, Loader2,
  Sliders, Eye, EyeOff, AlertCircle, CheckCircle2
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { DashboardUser } from "@/types/dashboard-user"

interface ModelDocsPageProps { user: DashboardUser; modelSlug: string }

const MODEL_DB: Record<string, any> = {
  "gpt-4-turbo": {
    name: "GPT-4 Turbo", provider: "OpenAI", category: "conversational", color: "#6366f1",
    description: "Advanced conversational AI with deep context understanding, code generation, creative writing and vision capabilities. Best for complex multi-turn tasks that demand reasoning and creativity.",
    features: ["Context Memory", "Multi-turn Dialogue", "Code Generation", "Creative Writing", "Vision Input", "Function Calling"],
    steps: ["Generate your API key in the APIs section", "Include it as a Bearer token in the Authorization header", "POST to /v1/chat/completions with your messages array"],
    endpoint: { method: "POST", path: "/v1/chat/completions", status: "Stable" },
    params: [
      { name: "model",       type: "string",  req: true,  default: "—",      desc: "Model identifier to use for this request" },
      { name: "messages",    type: "array",   req: true,  default: "—",      desc: "Array of message objects forming the conversation" },
      { name: "max_tokens",  type: "integer", req: false, default: "4096",   desc: "Maximum number of tokens to generate in the response" },
      { name: "temperature", type: "float",   req: false, default: "1.0",    desc: "Sampling temperature between 0.0 and 2.0 — lower = deterministic" },
      { name: "top_p",       type: "float",   req: false, default: "1.0",    desc: "Nucleus sampling probability mass" },
      { name: "stream",      type: "boolean", req: false, default: "false",  desc: "Stream partial responses via SSE" },
      { name: "n",           type: "integer", req: false, default: "1",      desc: "Number of completions to generate" },
    ],
    response: `{\n  "id": "chatcmpl-abc123",\n  "object": "chat.completion",\n  "created": 1714000000,\n  "model": "gpt-4-turbo",\n  "choices": [\n    {\n      "index": 0,\n      "message": {\n        "role": "assistant",\n        "content": "Hello! How can I help you today?"\n      },\n      "finish_reason": "stop"\n    }\n  ],\n  "usage": {\n    "prompt_tokens": 12,\n    "completion_tokens": 9,\n    "total_tokens": 21\n  }\n}`,
    examples: {
      Python: `import requests\n\nurl = "https://api.Modelsnest.com/v1/chat/completions"\nheaders = {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "Content-Type": "application/json"\n}\n\ndata = {\n    "model": "gpt-4-turbo",\n    "messages": [\n        {"role": "system", "content": "You are a helpful assistant."},\n        {"role": "user",   "content": "Explain quantum computing simply."}\n    ],\n    "max_tokens": 500,\n    "temperature": 0.7\n}\n\nres = requests.post(url, headers=headers, json=data)\nprint(res.json()["choices"][0]["message"]["content"])`,
      JavaScript: `const res = await fetch(\n  "https://api.Modelsnest.com/v1/chat/completions",\n  {\n    method: "POST",\n    headers: {\n      "Authorization": "Bearer YOUR_API_KEY",\n      "Content-Type": "application/json",\n    },\n    body: JSON.stringify({\n      model: "gpt-4-turbo",\n      messages: [\n        { role: "system", content: "You are a helpful assistant." },\n        { role: "user",   content: "Explain quantum computing simply." },\n      ],\n      max_tokens: 500,\n      temperature: 0.7,\n    }),\n  }\n)\nconst data = await res.json()\nconsole.log(data.choices[0].message.content)`,
      cURL: `curl https://api.Modelsnest.com/v1/chat/completions \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "model": "gpt-4-turbo",\n    "messages": [\n      {"role":"system","content":"You are a helpful assistant."},\n      {"role":"user","content":"Explain quantum computing simply."}\n    ],\n    "max_tokens": 500,\n    "temperature": 0.7\n  }'`,
    },
    pricing: { input: "0.010", output: "0.030", unit: "1K tokens" },
  },
  "claude-3-opus": {
    name: "Claude 3 Opus", provider: "Anthropic", category: "conversational", color: "#8b5cf6",
    description: "Anthropic's most capable model featuring exceptional reasoning, document analysis and nuanced instruction following. Ideal for research, legal analysis and complex writing tasks.",
    features: ["Logical Reasoning", "Document Analysis", "Creative Tasks", "Problem Solving", "Safe Output", "Long Context"],
    steps: ["Generate your API key in the APIs section", "Include it as a Bearer token in the Authorization header", "Send a messages array with role and content fields"],
    endpoint: { method: "POST", path: "/v1/chat/completions", status: "Stable" },
    params: [
      { name: "model",       type: "string",  req: true,  default: "—",    desc: "Model identifier — use claude-3-opus" },
      { name: "messages",    type: "array",   req: true,  default: "—",    desc: "Conversation history array with role and content" },
      { name: "max_tokens",  type: "integer", req: false, default: "2048", desc: "Maximum tokens to generate" },
      { name: "temperature", type: "float",   req: false, default: "1.0",  desc: "Sampling temperature 0.0–1.0" },
      { name: "system",      type: "string",  req: false, default: "—",    desc: "System prompt to set assistant behavior" },
      { name: "stream",      type: "boolean", req: false, default: "false", desc: "Enable streaming responses" },
    ],
    response: `{\n  "id": "claude-abc123",\n  "object": "chat.completion",\n  "created": 1714000000,\n  "model": "claude-3-opus",\n  "choices": [\n    {\n      "index": 0,\n      "message": {\n        "role": "assistant",\n        "content": "Here is my analysis of your document..."\n      },\n      "finish_reason": "stop"\n    }\n  ],\n  "usage": {\n    "prompt_tokens": 20,\n    "completion_tokens": 40,\n    "total_tokens": 60\n  }\n}`,
    examples: {
      Python: `import requests\n\nurl = "https://api.Modelsnest.com/v1/chat/completions"\nheaders = {\n    "Authorization": "Bearer YOUR_API_KEY",\n    "Content-Type": "application/json"\n}\n\ndata = {\n    "model": "claude-3-opus",\n    "system": "You are an expert business analyst.",\n    "messages": [\n        {"role": "user", "content": "Analyze this business strategy and identify risks..."}\n    ],\n    "max_tokens": 800,\n    "temperature": 0.5\n}\n\nres = requests.post(url, headers=headers, json=data)\nprint(res.json()["choices"][0]["message"]["content"])`,
      JavaScript: `const res = await fetch(\n  "https://api.Modelsnest.com/v1/chat/completions",\n  {\n    method: "POST",\n    headers: {\n      "Authorization": "Bearer YOUR_API_KEY",\n      "Content-Type": "application/json",\n    },\n    body: JSON.stringify({\n      model: "claude-3-opus",\n      system: "You are an expert business analyst.",\n      messages: [\n        { role: "user", content: "Analyze this business strategy and identify risks..." }\n      ],\n      max_tokens: 800,\n    }),\n  }\n)\nconst data = await res.json()\nconsole.log(data.choices[0].message.content)`,
      cURL: `curl https://api.Modelsnest.com/v1/chat/completions \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "model": "claude-3-opus",\n    "system": "You are an expert business analyst.",\n    "messages": [\n      {"role":"user","content":"Analyze this business strategy..."}\n    ],\n    "max_tokens": 800\n  }'`,
    },
    pricing: { input: "0.015", output: "0.075", unit: "1K tokens" },
  },
}

const buildFallback = (slug: string) => ({
  name: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
  provider: "Modelsnest", category: "llm", color: "#6366f1",
  description: "Full documentation for this model is coming soon. It is available via the Modelsnest API and follows the standard completions interface.",
  features: ["Fast Inference", "Reliable", "Scalable", "Standard API"],
  steps: ["Generate your API key in the APIs section", "Send requests to the endpoint with your prompt", "Parse the response"],
  endpoint: { method: "POST", path: "/v1/completions", status: "Stable" },
  params: [
    { name: "model",      type: "string",  req: true,  default: "—",   desc: "Model identifier" },
    { name: "prompt",     type: "string",  req: true,  default: "—",   desc: "Input prompt" },
    { name: "max_tokens", type: "integer", req: false, default: "256", desc: "Max tokens to generate" },
  ],
  response: `{\n  "choices": [{ "text": "..." }]\n}`,
  examples: {
    Python:     `import requests\nres = requests.post(\n  "https://api.Modelsnest.com/v1/completions",\n  headers={"Authorization": "Bearer YOUR_API_KEY"},\n  json={"model": "${slug}", "prompt": "Hello"}\n)\nprint(res.json()["choices"][0]["text"])`,
    JavaScript: `const res = await fetch("https://api.Modelsnest.com/v1/completions", {\n  method: "POST",\n  headers: { "Authorization": "Bearer YOUR_API_KEY", "Content-Type": "application/json" },\n  body: JSON.stringify({ model: "${slug}", prompt: "Hello" }),\n})\nconsole.log(await res.json())`,
    cURL:       `curl https://api.Modelsnest.com/v1/completions \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -d '{"model":"${slug}","prompt":"Hello"}'`,
  },
  pricing: { input: "0.001", output: "0.001", unit: "1K tokens" },
})

const LANGS = ["Python", "JavaScript", "cURL"]

/* ─── Playground mock responses by category ─────────────────────────────── */
const MOCK_RESPONSES: Record<string, (input: string, params: any) => any> = {
  "text-generation": (input, params) => ({
    id: `chatcmpl-${Math.random().toString(36).slice(2, 10)}`,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: params.model,
    choices: [{
      index: 0,
      message: {
        role: "assistant",
        content: `This is a simulated response to: "${input.slice(0, 60)}${input.length > 60 ? '...' : ''}"\n\nIn a real call, the model would process your text prompt and return a contextual answer. Output behavior depends on temperature (${params.temperature ?? 1.0}) and max_tokens (${params.max_tokens ?? 1024}).`,
      },
      finish_reason: "stop",
    }],
    usage: {
      prompt_tokens: Math.floor(input.split(" ").length * 1.3),
      completion_tokens: Math.floor(Math.random() * 80) + 40,
      total_tokens: Math.floor(input.split(" ").length * 1.3) + Math.floor(Math.random() * 80) + 40,
    },
  }),
  "image-generation": (input, params) => ({
    id: `img_${Math.random().toString(36).slice(2, 10)}`,
    object: "image.generation",
    created: Math.floor(Date.now() / 1000),
    model: params.model,
    prompt: input,
    image_url: `https://images.modelsnest.dev/generated/${Math.random().toString(36).slice(2, 10)}.png`,
    size: params.image_size || "1024x1024",
    quality: "standard",
  }),
  "video-generation": (input, params) => ({
    id: `gen_${Math.random().toString(36).slice(2, 10)}`,
    status: "processing",
    created_at: Math.floor(Date.now() / 1000),
    estimated_seconds: Math.floor(Math.random() * 30) + 20,
    prompt: input,
    resolution: "1080p",
    duration: params.duration_seconds || 8,
    _note: "Poll the returned id to check completion status. Video URL appears when status = 'completed'.",
  }),
  "voice-synthesis": (input, params) => ({
    id: `tts_${Math.random().toString(36).slice(2, 10)}`,
    status: "completed",
    model: params.model,
    voice: params.voice || "alloy",
    characters: input.length,
    audio_url: `https://audio.modelsnest.dev/generated/${Math.random().toString(36).slice(2, 10)}.mp3`,
  }),
  transcription: (input, params) => ({
    id: `tr_${Math.random().toString(36).slice(2, 10)}`,
    status: "completed",
    model: params.model,
    source_audio: input,
    text: `Simulated transcript for audio source: ${input.slice(0, 60)}${input.length > 60 ? "..." : ""}`,
    language: "en",
    duration: Number(params.duration_seconds || 30),
  }),
  conversational: (input, params) => MOCK_RESPONSES["text-generation"](input, params),
  llm: (input, params) => MOCK_RESPONSES["text-generation"](input, params),
  voice: (input, params) => MOCK_RESPONSES.transcription(input, params),
  video: (input, params) => MOCK_RESPONSES["video-generation"](input, params),
}

/* ─── Code block ─────────────────────────────────────────────────────────── */
function CodeBlock({ code, lang, isDark, border }: { code?: string; lang: string; isDark: boolean; border: string }) {
  const [copied, setCopied] = useState(false)
  const safeCode = typeof code === "string" ? code : ""
  const copy = () => { navigator.clipboard.writeText(safeCode); setCopied(true); setTimeout(() => setCopied(false), 1600) }
  const lines  = safeCode.split("\n")
  const codeBg = isDark ? "#080809" : "#fafaf9"
  const gutterC= isDark ? "#333340" : "#d6d3d1"
  const lineC  = isDark ? "#c9c9d4" : "#1c1917"
  const cmtC   = isDark ? "#444455" : "#a8a29e"
  const tabBg  = isDark ? "#0d0d10" : "#f0f0ee"

  return (
    <div style={{ border: `1px solid ${border}`, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: tabBg, borderBottom: `1px solid ${border}`, height: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", height: "100%", borderTop: "2px solid var(--color-primary)", borderRight: `1px solid ${border}` }}>
          <FileText size={11} style={{ color: "var(--color-primary)" }} />
          <span style={{ fontSize: 11, fontFamily: "monospace", color: isDark ? "#d4d4d8" : "#3f3f46" }}>{lang.toLowerCase()}.example</span>
        </div>
        <button onClick={copy} style={{ display: "flex", alignItems: "center", gap: 5, padding: "0 14px", height: "100%", background: "transparent", border: "none", cursor: "pointer", fontSize: 11, fontFamily: "monospace", color: copied ? "#10b981" : gutterC, transition: "color 0.15s" }}>
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div style={{ display: "flex", background: codeBg, overflowX: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", padding: "14px 10px", borderRight: `1px solid ${isDark ? "#18181c" : "#e7e5e4"}`, userSelect: "none", flexShrink: 0 }}>
          {lines.map((_, i) => (
            <span key={i} style={{ fontSize: 11, fontFamily: "monospace", lineHeight: "22px", color: gutterC, textAlign: "right", minWidth: 24 }}>{i + 1}</span>
          ))}
        </div>
        <pre style={{ margin: 0, padding: "14px 16px", fontSize: 12, fontFamily: "monospace", lineHeight: "22px", flex: 1, overflowX: "visible" }}>
          {lines.map((line, i) => {
            const isComment = line.trim().startsWith("#") || line.trim().startsWith("//") || line.trim().startsWith("/*")
            return (
              <div key={i} style={{ color: isComment ? cmtC : lineC }}>{line || "\u00A0"}</div>
            )
          })}
        </pre>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 14px", background: tabBg, borderTop: `1px solid ${border}` }}>
        <span style={{ fontSize: 10, fontFamily: "monospace", color: gutterC }}>UTF-8  ·  {lines.length} lines</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: 10, fontFamily: "monospace", color: gutterC }}>Ready</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Playground Tab ─────────────────────────────────────────────────────── */
function PlaygroundTab({ model, isDark, border, surface, text, muted, subtext, accent }: {
  model: any; isDark: boolean; border: string; surface: string;
  text: string; muted: string; subtext: string; accent: string;
}) {
  const rawCategory = String(model.category || "").toLowerCase()
  const normalizedCategory = rawCategory === "conversational" || rawCategory === "llm"
    ? "text-generation"
    : rawCategory

  const isTextGeneration = normalizedCategory === "text-generation"
  const isImageGeneration = normalizedCategory === "image-generation"
  const isVideoGeneration = normalizedCategory === "video-generation"
  const isVoiceSynthesis = normalizedCategory === "voice-synthesis"
  const isTranscription = normalizedCategory === "transcription"

  // Request state
  const [textInput, setTextInput]     = useState("")
  const [imagePrompt, setImagePrompt] = useState("")
  const [imageUrl, setImageUrl]       = useState("")
  const [audioUrl, setAudioUrl]       = useState("")
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful assistant.")
  const [durationSeconds, setDurationSeconds] = useState(8)
  const [voiceName, setVoiceName]     = useState("alloy")
  const [imageSize, setImageSize]     = useState("1024x1024")
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens]     = useState(512)
  const [showParams, setShowParams]   = useState(true)
  const [showSystem, setShowSystem]   = useState(false)

  // Response state
  const [response, setResponse]       = useState<any>(null)
  const [isLoading, setIsLoading]     = useState(false)
  const [latency, setLatency]         = useState<number | null>(null)
  const [hasRun, setHasRun]           = useState(false)
  const [responseTab, setResponseTab] = useState<"pretty" | "raw">("pretty")
  const [copiedResp, setCopiedResp]   = useState(false)

  const codeBg  = isDark ? "#080809" : "#fafaf9"
  const gutterC = isDark ? "#333340" : "#d6d3d1"
  const inputBg = isDark ? "#0a0a0d" : "#fafaf9"
  const inputBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"
  const tabBg   = isDark ? "#0d0d10" : "#f0f0ee"

  const canSend = isTextGeneration
    ? Boolean(textInput.trim())
    : isImageGeneration
      ? Boolean(imagePrompt.trim() || imageUrl.trim())
      : isVideoGeneration
        ? Boolean(textInput.trim())
        : isVoiceSynthesis
          ? Boolean(textInput.trim())
          : isTranscription
            ? Boolean(audioUrl.trim())
            : Boolean(textInput.trim())

  const handleRun = async () => {
    if (!canSend) return
    setIsLoading(true)
    setHasRun(true)
    const t0 = performance.now()
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800))
    const t1 = performance.now()
    const params = {
      model: model.name,
      temperature,
      max_tokens: maxTokens,
      duration_seconds: durationSeconds,
      image_size: imageSize,
      voice: voiceName,
      system: systemPrompt,
    }
    const requestInput = isImageGeneration
      ? (imagePrompt || imageUrl)
      : isTranscription
        ? audioUrl
        : textInput

    const fn = MOCK_RESPONSES[normalizedCategory] ?? MOCK_RESPONSES["text-generation"]
    setResponse(fn(requestInput, params))
    setLatency(Math.round(t1 - t0))
    setIsLoading(false)
    setResponseTab("pretty")
  }

  const handleReset = () => {
    setTextInput("")
    setImagePrompt("")
    setImageUrl("")
    setAudioUrl("")
    setResponse(null)
    setHasRun(false)
    setLatency(null)
  }

  const copyResp = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2))
    setCopiedResp(true); setTimeout(() => setCopiedResp(false), 1600)
  }

  const prettyLines = response ? JSON.stringify(response, null, 2).split("\n") : []
  const lineC  = isDark ? "#c9c9d4" : "#1c1917"
  const cmtC   = isDark ? "#444455" : "#a8a29e"

  const inputStyle: React.CSSProperties = {
    width: "100%", background: inputBg, border: `1px solid ${inputBorder}`,
    color: text, fontSize: 13, fontFamily: "inherit", outline: "none",
    padding: "10px 12px", boxSizing: "border-box", resize: "none",
    transition: "border-color 0.15s",
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: text, letterSpacing: "-0.03em", margin: 0 }}>Playground</h2>
          <p style={{ fontSize: 13, color: subtext, marginTop: 4 }}>
            Construct and fire test requests against <strong style={{ color: text }}>{model.name}</strong>. Responses are simulated — connect your API key for live calls.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: `${accent}12`, border: `1px solid ${accent}25`, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>Simulated Mode</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: border, minHeight: 540 }}>

        {/* ── LEFT: Request builder ── */}
        <div style={{ background: surface, display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Panel header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Terminal size={13} style={{ color: accent }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: text, textTransform: "uppercase", letterSpacing: "0.08em" }}>Request</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 8px", border: `1px solid ${border}` }}>
              <span style={{ padding: "2px 6px", background: `${accent}20`, color: accent, fontFamily: "monospace", fontSize: 10, fontWeight: 700 }}>{model.endpoint.method}</span>
              <span style={{ fontSize: 10, fontFamily: "monospace", color: muted }}>{model.endpoint.path}</span>
            </div>
          </div>

          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
            {/* System prompt (text generation) */}
            {isTextGeneration && (
              <div>
                <button onClick={() => setShowSystem(s => !s)}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: "pointer", color: muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: 0, marginBottom: showSystem ? 8 : 0 }}>
                  {showSystem ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                  System Prompt
                </button>
                {showSystem && (
                  <textarea rows={2} value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)}
                    placeholder="Set the assistant's behavior..."
                    style={{ ...inputStyle }}
                    onFocus={e => e.currentTarget.style.borderColor = accent}
                    onBlur={e => e.currentTarget.style.borderColor = inputBorder}
                  />
                )}
              </div>
            )}

            {/* Main input */}
            <div style={{ flex: 1 }}>
              {(isTextGeneration || isVideoGeneration || isVoiceSynthesis) && (
                <>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                    {isVideoGeneration ? "Video Prompt" : isVoiceSynthesis ? "Text to Synthesize" : "Text Prompt"}
                  </label>
                  <textarea
                    rows={isVideoGeneration ? 5 : 7}
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                    placeholder={
                      isVideoGeneration
                        ? "e.g. Cinematic drone shot of golden-hour waves crashing on black sand beach..."
                        : isVoiceSynthesis
                          ? "e.g. Welcome to Modelsnest, your AI infrastructure platform."
                          : "e.g. Explain the concept of neural networks in simple terms..."
                    }
                    style={{ ...inputStyle }}
                    onFocus={e => e.currentTarget.style.borderColor = accent}
                    onBlur={e => e.currentTarget.style.borderColor = inputBorder}
                    onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleRun() }}
                  />
                </>
              )}

              {isImageGeneration && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                      Image Prompt
                    </label>
                    <textarea
                      rows={5}
                      value={imagePrompt}
                      onChange={e => setImagePrompt(e.target.value)}
                      placeholder="e.g. A cinematic sunset over futuristic mountains"
                      style={{ ...inputStyle }}
                      onFocus={e => e.currentTarget.style.borderColor = accent}
                      onBlur={e => e.currentTarget.style.borderColor = inputBorder}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                      Reference Image URL (optional)
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://example.com/reference-image.png"
                      style={{ ...inputStyle }}
                      onFocus={e => e.currentTarget.style.borderColor = accent}
                      onBlur={e => e.currentTarget.style.borderColor = inputBorder}
                    />
                  </div>
                </div>
              )}

              {isTranscription && (
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                    Audio URL
                  </label>
                  <input
                    type="text"
                    value={audioUrl}
                    onChange={e => setAudioUrl(e.target.value)}
                    placeholder="https://example.com/audio-file.mp3"
                    style={{ ...inputStyle }}
                    onFocus={e => e.currentTarget.style.borderColor = accent}
                    onBlur={e => e.currentTarget.style.borderColor = inputBorder}
                  />
                </div>
              )}

              <div style={{ fontSize: 10, color: muted, marginTop: 4, textAlign: "right" }}>⌘↵ to send</div>
            </div>

            {/* Category-specific params */}
            {(isTextGeneration || isImageGeneration || isVideoGeneration || isVoiceSynthesis || isTranscription) && (
              <div>
                <button onClick={() => setShowParams(s => !s)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${border}`, cursor: "pointer", padding: "9px 12px", color: text }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <Sliders size={12} style={{ color: accent }} />
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Parameters</span>
                  </div>
                  {showParams ? <ChevronUp size={12} style={{ color: muted }} /> : <ChevronDown size={12} style={{ color: muted }} />}
                </button>
                {showParams && (
                  <div style={{ border: `1px solid ${border}`, borderTop: "none", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 14 }}>

                    {/* Temperature slider */}
                    {isTextGeneration && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Temperature</label>
                        <span style={{ fontSize: 12, fontFamily: "monospace", color: accent, fontWeight: 700 }}>{temperature.toFixed(2)}</span>
                      </div>
                      <input type="range" min={0} max={2} step={0.01} value={temperature}
                        onChange={e => setTemperature(parseFloat(e.target.value))}
                        style={{ width: "100%", accentColor: accent, cursor: "pointer" }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                        <span style={{ fontSize: 10, color: muted }}>Deterministic</span>
                        <span style={{ fontSize: 10, color: muted }}>Creative</span>
                      </div>
                    </div>
                    )}

                    {/* Max tokens */}
                    {isTextGeneration && (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <label style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Max Tokens</label>
                          <span style={{ fontSize: 12, fontFamily: "monospace", color: accent, fontWeight: 700 }}>{maxTokens}</span>
                        </div>
                        <input type="range" min={64} max={4096} step={64} value={maxTokens}
                          onChange={e => setMaxTokens(parseInt(e.target.value))}
                          style={{ width: "100%", accentColor: accent, cursor: "pointer" }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                          <span style={{ fontSize: 10, color: muted }}>64</span>
                          <span style={{ fontSize: 10, color: muted }}>4096</span>
                        </div>
                      </div>
                    )}

                    {(isVideoGeneration || isTranscription) && (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <label style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                            Duration (seconds)
                          </label>
                          <span style={{ fontSize: 12, fontFamily: "monospace", color: accent, fontWeight: 700 }}>{durationSeconds}</span>
                        </div>
                        <input type="range" min={1} max={120} step={1} value={durationSeconds}
                          onChange={e => setDurationSeconds(parseInt(e.target.value))}
                          style={{ width: "100%", accentColor: accent, cursor: "pointer" }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                          <span style={{ fontSize: 10, color: muted }}>1s</span>
                          <span style={{ fontSize: 10, color: muted }}>120s</span>
                        </div>
                      </div>
                    )}

                    {isVoiceSynthesis && (
                      <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                          Voice
                        </label>
                        <input type="text" value={voiceName} onChange={e => setVoiceName(e.target.value)}
                          style={{ ...inputStyle }}
                          onFocus={e => e.currentTarget.style.borderColor = accent}
                          onBlur={e => e.currentTarget.style.borderColor = inputBorder}
                        />
                      </div>
                    )}

                    {isImageGeneration && (
                      <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                          Image Size
                        </label>
                        <input type="text" value={imageSize} onChange={e => setImageSize(e.target.value)}
                          placeholder="1024x1024"
                          style={{ ...inputStyle }}
                          onFocus={e => e.currentTarget.style.borderColor = accent}
                          onBlur={e => e.currentTarget.style.borderColor = inputBorder}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleRun} disabled={isLoading || !canSend}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "11px", background: !canSend ? (isDark ? "#1a1a20" : "#e4e4e0") : accent,
                  border: "none", color: !canSend ? muted : "#fff",
                  fontSize: 13, fontWeight: 700, cursor: !canSend ? "not-allowed" : "pointer",
                  transition: "all 0.15s", opacity: isLoading ? 0.7 : 1,
                }}>
                {isLoading ? <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} /> : <Send size={14} />}
                {isLoading ? "Sending..." : "Send Request"}
              </button>
              {hasRun && (
                <button onClick={handleReset}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 14px", background: "transparent", border: `1px solid ${border}`, color: muted, fontSize: 13, cursor: "pointer" }}>
                  <RotateCcw size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Response viewer ── */}
        <div style={{ background: surface, display: "flex", flexDirection: "column" }}>
          {/* Panel header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Eye size={13} style={{ color: response ? "#10b981" : muted }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: text, textTransform: "uppercase", letterSpacing: "0.08em" }}>Response</span>
              {latency && (
                <span style={{ fontSize: 10, padding: "2px 7px", background: "#10b98118", border: "1px solid #10b98130", color: "#10b981", fontFamily: "monospace" }}>
                  {latency}ms
                </span>
              )}
            </div>
            {response && (
              <div style={{ display: "flex", gap: 1, background: border }}>
                {(["pretty", "raw"] as const).map(t => (
                  <button key={t} onClick={() => setResponseTab(t)}
                    style={{ padding: "4px 10px", background: responseTab === t ? isDark ? "#18181c" : "#fff" : "transparent", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, color: responseTab === t ? text : muted, textTransform: "capitalize" }}>
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Response body */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {!hasRun && !isLoading && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 32 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", border: `1px dashed ${border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Send size={18} style={{ color: muted }} />
                </div>
                <p style={{ fontSize: 13, color: muted, textAlign: "center", maxWidth: 200, lineHeight: 1.6 }}>
                  Fill in the request and hit <strong style={{ color: text }}>Send</strong> to see the response here.
                </p>
              </div>
            )}

            {isLoading && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
                <div style={{ position: "relative", width: 40, height: 40 }}>
                  <div style={{ position: "absolute", inset: 0, border: `2px solid ${border}`, borderTop: `2px solid ${accent}`, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                </div>
                <p style={{ fontSize: 13, color: muted }}>Awaiting response…</p>
              </div>
            )}

            {response && !isLoading && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                {/* Status bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "#10b98110", borderBottom: `1px solid #10b98120` }}>
                  <CheckCircle2 size={13} style={{ color: "#10b981" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>200 OK</span>
                  <span style={{ fontSize: 11, color: muted, marginLeft: "auto" }}>application/json</span>
                </div>

                {responseTab === "pretty" && (
                  <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                    {/* Content block */}
                    {(response.choices || response.candidates) && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Content</div>
                        <div style={{ padding: "14px 16px", background: isDark ? "#0d0d12" : "#f5f5f2", border: `1px solid ${border}`, fontSize: 13, color: text, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                          {response.choices?.[0]?.message?.content || response.choices?.[0]?.text || response.candidates?.[0]?.content?.parts?.[0]?.text || ""}
                        </div>
                      </div>
                    )}

                    {response.text && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Transcript</div>
                        <div style={{ padding: "14px 16px", background: isDark ? "#0d0d12" : "#f5f5f2", border: `1px solid ${border}`, fontSize: 13, color: text, lineHeight: 1.75 }}>
                          {response.text}
                        </div>
                      </div>
                    )}

                    {/* Usage / meta grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: border }}>
                      {response.usage && Object.entries(response.usage).map(([k, v]) => (
                        <div key={k} style={{ padding: "10px 14px", background: surface }}>
                          <div style={{ fontSize: 10, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{k.replace(/_/g, " ")}</div>
                          <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: text }}>{String(v)}</div>
                        </div>
                      ))}
                      {response.analytics && Object.entries(response.analytics).map(([k, v]) => (
                        <div key={k} style={{ padding: "10px 14px", background: surface }}>
                          <div style={{ fontSize: 10, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{k.replace(/_/g, " ")}</div>
                          <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: text }}>{String(v)}</div>
                        </div>
                      ))}
                      {response.duration !== undefined && (
                        <div style={{ padding: "10px 14px", background: surface }}>
                          <div style={{ fontSize: 10, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Duration</div>
                          <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: text }}>{response.duration}s</div>
                        </div>
                      )}
                      {response.language && (
                        <div style={{ padding: "10px 14px", background: surface }}>
                          <div style={{ fontSize: 10, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Language</div>
                          <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: text }}>{response.language}</div>
                        </div>
                      )}
                      {response.estimated_seconds !== undefined && (
                        <div style={{ padding: "10px 14px", background: surface }}>
                          <div style={{ fontSize: 10, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>ETA</div>
                          <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: text }}>{response.estimated_seconds}s</div>
                        </div>
                      )}
                      <div style={{ padding: "10px 14px", background: surface }}>
                        <div style={{ fontSize: 10, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Latency</div>
                        <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "monospace", color: "#10b981" }}>{latency}ms</div>
                      </div>
                    </div>
                  </div>
                )}

                {responseTab === "raw" && (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", background: codeBg }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "6px 14px", borderBottom: `1px solid ${isDark ? "#18181c" : "#e7e5e4"}` }}>
                      <button onClick={copyResp}
                        style={{ display: "flex", alignItems: "center", gap: 5, background: "transparent", border: "none", cursor: "pointer", fontSize: 11, fontFamily: "monospace", color: copiedResp ? "#10b981" : gutterC }}>
                        {copiedResp ? <Check size={11} /> : <Copy size={11} />}
                        {copiedResp ? "Copied!" : "Copy JSON"}
                      </button>
                    </div>
                    <div style={{ display: "flex", flex: 1, overflowY: "auto" }}>
                      <div style={{ display: "flex", flexDirection: "column", padding: "14px 10px", borderRight: `1px solid ${isDark ? "#18181c" : "#e7e5e4"}`, userSelect: "none", flexShrink: 0 }}>
                        {prettyLines.map((_, i) => (
                          <span key={i} style={{ fontSize: 11, fontFamily: "monospace", lineHeight: "20px", color: gutterC, textAlign: "right", minWidth: 24 }}>{i + 1}</span>
                        ))}
                      </div>
                      <pre style={{ margin: 0, padding: "14px 16px", fontSize: 12, fontFamily: "monospace", lineHeight: "20px", flex: 1, overflowX: "auto" }}>
                        {prettyLines.map((line, i) => (
                          <div key={i} style={{ color: line.includes('"') ? lineC : cmtC }}>{line || "\u00A0"}</div>
                        ))}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer notice */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: isDark ? "#0d0d10" : "#f5f5f2", border: `1px solid ${border}`, borderTop: "none" }}>
        <AlertCircle size={12} style={{ color: muted, flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: muted, lineHeight: 1.5 }}>
          Responses are <strong style={{ color: subtext }}>simulated</strong> for demonstration. To make live API calls, <Link href="/dashboard/apis" style={{ color: accent, textDecoration: "none", fontWeight: 700 }}>generate an API key</Link> and connect your application.
        </span>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

/* ─── Main component ──────────────────────────────────────────────────────── */
export function ModelDocsPage({ user, modelSlug }: ModelDocsPageProps) {
  const { isDark } = useTheme()
  const { sidebarWidth } = useSidebar()
  const [activeLang, setActiveLang] = useState("Python")
  const [activeSection, setActiveSection] = useState("overview")
  const [model, setModel] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const loadModel = async () => {
      setIsLoading(true)
      try {
        const supabase = createClient()
        const { data: modelRow, error: modelError } = await supabase
          .from("ai_models")
          .select("id, slug, name, provider, category_slug, display_color, card_description")
          .eq("slug", modelSlug)
          .single()
        if (modelError || !modelRow) throw new Error("Model not found")

        const { data: docRow, error: docError } = await supabase
          .from("ai_model_docs").select("*").eq("model_id", modelRow.id).single()
        if (docError && docError.code !== "PGRST116") throw docError

        const { data: featureRows, error: featureError } = await supabase
          .from("ai_model_features")
          .select("feature_text")
          .eq("model_id", modelRow.id)
          .eq("source", "docs_page")
          .order("sort_order", { ascending: true })
        if (featureError) throw featureError

        const { data: stepsRows, error: stepsError } = await supabase
          .from("ai_model_doc_steps").select("*").eq("model_id", modelRow.id).order("step_order", { ascending: true })
        if (stepsError) throw stepsError

        const { data: paramRows, error: paramError } = await supabase
          .from("ai_model_doc_parameters").select("*").eq("model_id", modelRow.id).order("sort_order", { ascending: true })
        if (paramError) throw paramError

        const { data: exampleRows, error: exampleError } = await supabase
          .from("ai_model_doc_examples").select("*").eq("model_id", modelRow.id).order("sort_order", { ascending: true })
        if (exampleError) throw exampleError

        const { data: pricingRow, error: pricingError } = await supabase
          .from("ai_model_pricing").select("*").eq("model_id", modelRow.id).single()
        if (pricingError && pricingError.code !== "PGRST116") throw pricingError

        let features: string[] = (featureRows ?? []).map((row) => row.feature_text).filter(Boolean)
        try {
          if (!features.length && docRow?.docs_page_payload?.features) {
            features = docRow.docs_page_payload.features
          }
        } catch (e) { features = [] }

        const examplesMap: Record<string, string> = {}
        for (const ex of exampleRows ?? []) {
          const language = String(ex.language || "").trim()
          if (!language) continue
          const normalized = language.toLowerCase()
          if (normalized === "python") examplesMap.Python = ex.code_example
          else if (normalized === "javascript" || normalized === "js" || normalized === "node") examplesMap.JavaScript = ex.code_example
          else if (normalized === "curl" || normalized === "curl") examplesMap.cURL = ex.code_example
          else examplesMap[language] = ex.code_example
        }

        try {
          if (docRow?.docs_page_payload?.examples && typeof docRow.docs_page_payload.examples === "object") {
            for (const [language, code] of Object.entries(docRow.docs_page_payload.examples)) {
              if (typeof code === "string" && !examplesMap[language]) {
                examplesMap[language] = code
              }
            }
          }
        } catch {}

        const paramsArray = (paramRows ?? []).map(p => ({
          name: p.param_name, type: p.param_type, req: p.is_required,
          default: p.default_value ?? "—", desc: p.description,
        }))
        const stepsArray = (stepsRows ?? []).map(s => s.step_text)

        const modelData = {
          name: modelRow.name, provider: modelRow.provider, category: modelRow.category_slug,
          color: modelRow.display_color || "#6366f1",
          description: docRow?.docs_description || modelRow.card_description || "",
          features, steps: stepsArray,
          endpoint: {
            method: docRow?.endpoint_method || "POST",
            path: docRow?.endpoint_path || "/api/v1/chat/completions",
            status: docRow?.endpoint_status || "Stable",
          },
          params: paramsArray,
          response: docRow?.response_example || "{}",
          examples: examplesMap,
          pricing: pricingRow
            ? { input: String(pricingRow.input_price), output: String(pricingRow.output_price), unit: pricingRow.price_unit || "1K tokens" }
            : { input: "0", output: "0", unit: "1K tokens" },
        }
        if (isMounted) setModel(modelData)
      } catch (err) {
        console.error("Failed to load model", err)
        if (isMounted) setModel(buildFallback(modelSlug))
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadModel()
    return () => { isMounted = false }
  }, [modelSlug])

  const bg      = isDark ? "#0d0d10" : "#f8f8f6"
  const surface = isDark ? "#111114" : "#ffffff"
  const border  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const text     = isDark ? "#f4f4f5" : "#09090b"
  const muted    = isDark ? "#52525b" : "#a1a1aa"
  const subtext  = isDark ? "#71717a" : "#71717a"
  const accent   = model?.color || "#6366f1"
  const quickstartExample =
    model?.examples?.Python ||
    model?.examples?.python ||
    model?.examples?.JavaScript ||
    model?.examples?.cURL ||
    Object.values(model?.examples ?? {}).find((value) => typeof value === "string") ||
    ""

  // Playground inserted as second tab (index 1)
  const SECTIONS = [
    { id: "overview",    label: "Overview"    },
    { id: "playground",  label: "Playground"  },
    { id: "quickstart",  label: "Quickstart"  },
    { id: "reference",   label: "API Ref"     },
    { id: "examples",    label: "Examples"    },
    { id: "pricing",     label: "Pricing"     },
  ]

  const CategoryIcon = model?.category === "voice" ? Mic
    : model?.category === "video"         ? Video
    : model?.category === "llm"           ? Brain
    : model?.category === "livestreaming" ? Radio
    : Bot

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ width: 40, height: 40, border: `2px solid ${border}`, borderTop: "2px solid var(--color-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 16 }} />
        <p style={{ fontSize: 16, fontWeight: 700, color: "var(--color-primary)" }}>Loading documentation...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!model) {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: text }}>Model not found</p>
        <Link href="/dashboard/models/docs" style={{ textDecoration: "none" }}>
          <button style={{ marginTop: 16, padding: "8px 16px", borderRadius: 8, background: "var(--color-primary)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}>
            Back to Docs
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column" }}>

      {/* ── PAGE HEADER ── */}
      <div style={{
        padding: "36px 48px 32px", borderBottom: `1px solid ${border}`,
        background: isDark ? "linear-gradient(160deg,#0d0d10,#111118)" : surface,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle,${isDark?"rgba(99,102,241,0.05)":"rgba(99,102,241,0.02)"} 1px,transparent 1px)`,
          backgroundSize: "28px 28px" }} />
        <div style={{ position: "absolute", top: -80, left: "30%", width: 500, height: 300, borderRadius: "50%",
          background: isDark ? `radial-gradient(ellipse,${accent}14 0%,transparent 70%)` : "transparent", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Link href="/dashboard/models/docs" style={{ textDecoration: "none" }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", marginBottom: 16, background: "transparent", border: `1px solid ${border}`, color: muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.color = text; e.currentTarget.style.borderColor = accent }}
              onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.borderColor = border }}>
              <ArrowLeft size={13} /> Back to Docs
            </button>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
            <Link href="/dashboard/models" style={{ textDecoration: "none" }}>
              <span style={{ fontSize: 12, color: muted, cursor: "pointer", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = accent}
                onMouseLeave={e => e.currentTarget.style.color = muted}>Models</span>
            </Link>
            <ChevronRight size={12} style={{ color: muted }} />
            <Link href="/dashboard/models/docs" style={{ textDecoration: "none" }}>
              <span style={{ fontSize: 12, color: muted, cursor: "pointer", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = accent}
                onMouseLeave={e => e.currentTarget.style.color = muted}>Docs</span>
            </Link>
            <ChevronRight size={12} style={{ color: muted }} />
            <span style={{ fontSize: 12, color: accent, fontWeight: 600 }}>{model.name}</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: accent, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 6px 24px ${accent}55` }}>
                  <CategoryIcon size={24} style={{ color: "#fff" }} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.04em", color: text, margin: 0 }}>{model.name}</h1>
                    <span style={{ fontSize: 10, padding: "3px 8px", background: `${accent}18`, color: accent, border: `1px solid ${accent}30`, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {model.endpoint.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>by {model.provider} · Modelsnest API</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: subtext, lineHeight: 1.75, maxWidth: 560, margin: 0 }}>{model.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
                {model.features.map((f: string) => (
                  <span key={f} style={{ fontSize: 11, padding: "3px 9px", border: `1px solid ${border}`, color: muted }}>{f}</span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 1, background: border, flexShrink: 0 }}>
              <div style={{ padding: "16px 22px", background: surface }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: muted, marginBottom: 6 }}>Input</div>
                <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "monospace", color: text, letterSpacing: "-0.04em" }}>${model.pricing.input}</div>
                <div style={{ fontSize: 11, color: muted }}>per {model.pricing.unit}</div>
              </div>
              {model.pricing.output !== "0.000" && (
                <div style={{ padding: "16px 22px", background: surface }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: muted, marginBottom: 6 }}>Output</div>
                  <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "monospace", color: text, letterSpacing: "-0.04em" }}>${model.pricing.output}</div>
                  <div style={{ fontSize: 11, color: muted }}>per {model.pricing.unit}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── NAV TABS ── */}
      <div style={{ display: "flex", borderBottom: `1px solid ${border}`, background: surface, overflowX: "auto" }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            style={{
              padding: "0 22px", height: 46, border: "none", cursor: "pointer", flexShrink: 0,
              background: "transparent", fontSize: 13, fontWeight: 600,
              color: activeSection === s.id ? text : muted,
              borderBottom: `2px solid ${activeSection === s.id ? accent : "transparent"}`,
              transition: "all 0.15s",
              // Playground tab gets a subtle highlight
              ...(s.id === "playground" && activeSection !== "playground" ? {
                background: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.015)",
              } : {}),
            }}
            onMouseEnter={e => { if (activeSection !== s.id) e.currentTarget.style.color = text }}
            onMouseLeave={e => { if (activeSection !== s.id) e.currentTarget.style.color = muted }}
          >
            {s.id === "playground" ? (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Play size={11} style={{ color: activeSection === "playground" ? accent : muted }} />
                {s.label}
              </span>
            ) : s.label}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, padding: activeSection === "playground" ? "32px 48px" : "40px 48px", overflowY: "auto" }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeSection}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ maxWidth: activeSection === "playground" ? 1100 : 860 }}>

            {/* ─── OVERVIEW ─── */}
            {activeSection === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: text, letterSpacing: "-0.03em", marginBottom: 10 }}>About {model.name}</h2>
                  <p style={{ fontSize: 14, color: subtext, lineHeight: 1.8 }}>{model.description}</p>
                </div>
                <div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Capabilities</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 1, background: border }}>
                    {model.features.map((f: string, i: number) => (
                      <motion.div key={f} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                        style={{ padding: "16px 18px", background: surface, display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: text, fontWeight: 500 }}>{f}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Primary Endpoint</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: surface, border: `1px solid ${border}` }}>
                    <span style={{ padding: "4px 10px", background: `${accent}20`, color: accent, fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>{model.endpoint.method}</span>
                    <code style={{ fontFamily: "monospace", fontSize: 14, color: text }}>{model.endpoint.path}</code>
                    <span style={{ marginLeft: "auto", fontSize: 11, padding: "2px 8px", border: `1px solid ${border}`, color: muted }}>{model.endpoint.status}</span>
                  </div>
                </div>
                {/* CTA to playground */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 22px", background: `${accent}08`, border: `1px solid ${accent}20` }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Play size={15} style={{ color: accent }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 2 }}>Try it in the Playground</div>
                    <div style={{ fontSize: 12, color: subtext }}>Build and fire test requests without writing any code.</div>
                  </div>
                  <button onClick={() => setActiveSection("playground")}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: accent, border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
                    Open Playground <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* ─── PLAYGROUND ─── */}
            {activeSection === "playground" && (
              <PlaygroundTab
                model={model} isDark={isDark} border={border}
                surface={surface} text={text} muted={muted} subtext={subtext} accent={accent}
              />
            )}

            {/* ─── QUICKSTART ─── */}
            {activeSection === "quickstart" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: text, letterSpacing: "-0.03em", marginBottom: 6 }}>Get started in minutes</h2>
                  <p style={{ fontSize: 14, color: subtext }}>Three steps to your first successful API call.</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 1, background: border }}>
                  {model.steps.map((step: string, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", background: surface }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                        background: `${accent}18`, border: `1px solid ${accent}30`,
                        display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 900, color: accent }}>{i + 1}</span>
                      </div>
                      <span style={{ fontSize: 14, color: text }}>{step}</span>
                    </motion.div>
                  ))}
                </div>
                <div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Your first request</h3>
                  <CodeBlock code={quickstartExample as string} lang="Python" isDark={isDark} border={border} />
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link href="/dashboard/apis" style={{ textDecoration: "none" }}>
                    <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", background: accent, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      <Terminal size={14} /> Get API Key
                    </button>
                  </Link>
                  <button onClick={() => setActiveSection("examples")}
                    style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "transparent", border: `1px solid ${border}`, color: text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    View All Examples
                  </button>
                </div>
              </div>
            )}

            {/* ─── API REFERENCE ─── */}
            {activeSection === "reference" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: text, letterSpacing: "-0.03em", marginBottom: 6 }}>API Reference</h2>
                  <p style={{ fontSize: 14, color: subtext }}>Complete endpoint documentation, request parameters and response schema.</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: surface, border: `1px solid ${border}` }}>
                  <span style={{ padding: "4px 10px", background: `${accent}20`, color: accent, fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>{model.endpoint.method}</span>
                  <code style={{ fontFamily: "monospace", fontSize: 14, color: text, flex: 1 }}>{model.endpoint.path}</code>
                  <span style={{ fontSize: 11, padding: "2px 8px", border: `1px solid ${border}`, color: muted }}>{model.endpoint.status}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Request Parameters</h3>
                  <div style={{ border: `1px solid ${border}`, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 0.6fr 0.8fr 2fr", padding: "10px 16px",
                      background: isDark ? "rgba(255,255,255,0.03)" : "#f5f5f4", borderBottom: `1px solid ${border}` }}>
                      {["Name","Type","Required","Default","Description"].map(h => (
                        <span key={h} style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted }}>{h}</span>
                      ))}
                    </div>
                    {model.params.map((p: any, i: number) => (
                      <div key={p.name} style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 0.6fr 0.8fr 2fr",
                        padding: "12px 16px", borderBottom: i < model.params.length - 1 ? `1px solid ${border}` : "none", alignItems: "flex-start" }}>
                        <code style={{ fontFamily: "monospace", fontSize: 12, color: accent, fontWeight: 600 }}>{p.name}</code>
                        <span style={{ fontSize: 12, color: muted, fontFamily: "monospace" }}>{p.type}</span>
                        <span style={{ fontSize: 12, color: p.req ? "#ef4444" : subtext, fontWeight: p.req ? 700 : 400 }}>{p.req ? "yes" : "no"}</span>
                        <span style={{ fontSize: 12, color: muted, fontFamily: "monospace" }}>{p.default}</span>
                        <span style={{ fontSize: 12, color: subtext, lineHeight: 1.6 }}>{p.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>200 Response</h3>
                  <CodeBlock code={model.response} lang="JSON" isDark={isDark} border={border} />
                </div>
              </div>
            )}

            {/* ─── EXAMPLES ─── */}
            {activeSection === "examples" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: text, letterSpacing: "-0.03em", marginBottom: 6 }}>Code Examples</h2>
                  <p style={{ fontSize: 14, color: subtext }}>Drop-in snippets in Python, JavaScript and cURL — copy and run.</p>
                </div>
                <div style={{ display: "flex", gap: 1, background: border }}>
                  {LANGS.filter(l => model.examples[l]).map(l => (
                    <button key={l} onClick={() => setActiveLang(l)}
                      style={{
                        padding: "0 22px", height: 38, border: "none", cursor: "pointer",
                        background: activeLang === l ? surface : isDark ? "#0d0d10" : "#f0f0ee",
                        color: activeLang === l ? text : muted,
                        fontSize: 12, fontWeight: 600,
                        borderBottom: `2px solid ${activeLang === l ? accent : "transparent"}`,
                        transition: "all 0.15s",
                      }}
                    >{l}</button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={activeLang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>
                    <CodeBlock code={model.examples[activeLang] ?? ""} lang={activeLang} isDark={isDark} border={border} />
                  </motion.div>
                </AnimatePresence>
                <div style={{ padding: "22px 24px", background: surface, border: `1px solid ${border}` }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 6 }}>Try it live</h3>
                  <p style={{ fontSize: 13, color: subtext, marginBottom: 16 }}>Run requests against {model.name} directly from your browser.</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button onClick={() => setActiveSection("playground")}
                      style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", background: accent, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      <Play size={14} /> Open Playground
                    </button>
                    <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "transparent", border: `1px solid ${border}`, color: text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      <Download size={14} /> Download SDK
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── PRICING ─── */}
            {activeSection === "pricing" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: text, letterSpacing: "-0.03em", marginBottom: 6 }}>Pricing</h2>
                  <p style={{ fontSize: 14, color: subtext }}>Pay only for what you use. No monthly minimums, no setup fees.</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 1, background: border }}>
                  {[
                    { label: "Input",  price: model.pricing.input,  color: "#10b981" },
                    ...(model.pricing.output !== "0.000" ? [{ label: "Output", price: model.pricing.output, color: accent }] : []),
                  ].map(item => (
                    <div key={item.label} style={{ padding: "28px", background: surface }}>
                      <DollarSign size={20} style={{ color: item.color, marginBottom: 12 }} />
                      <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: muted, marginBottom: 8 }}>{item.label}</div>
                      <div style={{ fontSize: 34, fontWeight: 900, fontFamily: "monospace", color: text, letterSpacing: "-0.04em" }}>${item.price}</div>
                      <div style={{ fontSize: 13, color: muted, marginTop: 6 }}>per {model.pricing.unit}</div>
                    </div>
                  ))}
                  <div style={{ padding: "28px", background: surface }}>
                    <Zap size={20} style={{ color: "#f59e0b", marginBottom: 12 }} />
                    <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: muted, marginBottom: 8 }}>Billing</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: text, marginBottom: 6 }}>Pay-as-you-go</div>
                    <div style={{ fontSize: 13, color: muted }}>No minimums or commitments</div>
                  </div>
                </div>
                <Link href="/dashboard/billing" style={{ textDecoration: "none", display: "inline-block" }}>
                  <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 20px", background: accent, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    <DollarSign size={14} /> View Billing Dashboard
                  </button>
                </Link>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}