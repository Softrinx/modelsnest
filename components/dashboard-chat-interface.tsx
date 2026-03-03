"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { MessageList } from "@/components/message-list"
import { ChatWelcome } from "@/components/chat-welcome"
import { sendChatMessage, getChatModels } from "@/app/actions/chat"
import { useChatStream } from "@/hooks/use-chat-stream"
import type { ChatMessage } from "@/lib/chat-api"
import { Plus, Settings, ArrowUp, Square, Paperclip, Globe } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/contexts/themeContext"
import { useSidebar } from "@/components/dashboard-layout-controller"
import type { DashboardUser } from "@/types/dashboard-user"

interface DashboardChatInterfaceProps {
  user: DashboardUser
  sidebarCollapsed?: boolean
}

interface UserCredits {
  balance: number
  total_spent: number
  total_topped_up: number
}

export function DashboardChatInterface({ user }: DashboardChatInterfaceProps) {
  const { isDark } = useTheme()
  const { sidebarWidth, isMobile } = useSidebar()

  const [credits, setCredits] = useState<UserCredits | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "system", content: "You are a helpful AI assistant. Be concise and helpful in your responses." },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel] = useState("deepseek/deepseek-v3-0324")
  const [models, setModels] = useState<Array<{ id: string; name: string }>>([])
  const [streamingEnabled] = useState(true)
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState("")
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { streamMessage, isStreaming } = useChatStream()

  // ── credits ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/user/credits")
      .then(r => r.ok ? r.json() : null)
      .then(d => d?.success && setCredits(d.credits))
      .catch(() => {})
  }, [])

  const refreshCredits = async () => {
    try {
      const r = await fetch("/api/user/credits")
      if (r.ok) { const d = await r.json(); if (d.success) setCredits(d.credits) }
    } catch {}
  }

  // ── models ────────────────────────────────────────────────────────────────
  useEffect(() => { getChatModels().then(setModels) }, [])

  // ── scroll ────────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, currentStreamingMessage])

  // ── auto-resize textarea ──────────────────────────────────────────────────
  const autoResize = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px"
  }, [])

  useEffect(() => { autoResize() }, [inputValue, autoResize])

  // ── send ──────────────────────────────────────────────────────────────────
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading || isStreaming) return
    setInputValue("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"

    const userMessage: ChatMessage = { role: "user", content }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setIsLoading(true)
    setCurrentStreamingMessage("")

    try {
      if (streamingEnabled) {
        await streamMessage(
          updatedMessages, selectedModel,
          (chunk: string) => setCurrentStreamingMessage(prev => prev + chunk),
          (fullMessage: string) => {
            setMessages([...updatedMessages, { role: "assistant", content: fullMessage }])
            setCurrentStreamingMessage("")
          },
          (error: string) => {
            setMessages([...updatedMessages, { role: "assistant", content: `Error: ${error}` }])
            setCurrentStreamingMessage("")
          },
        )
      } else {
        const response = await sendChatMessage(updatedMessages)
        setMessages([...updatedMessages, {
          role: "assistant",
          content: response.success ? (response.message ?? "No response generated") : `Error: ${response.error}`,
        }])
      }
    } catch {
      setMessages([...updatedMessages, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }])
      setCurrentStreamingMessage("")
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, isStreaming, streamingEnabled, selectedModel, streamMessage])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const handleStop = () => {
    // hook-level abort — expose if useChatStream supports it
  }

  // ── theme tokens ──────────────────────────────────────────────────────────
  const bg        = isDark ? "#0a0a0c"   : "#f5f5f3"
  const surface   = isDark ? "#111114"   : "#ffffff"
  const surfaceEl = isDark ? "#18181c"   : "#f0f0ee"
  const border    = isDark ? "#232329"   : "#e0e0de"
  const borderSub = isDark ? "#1c1c22"   : "#e8e8e6"
  const text      = isDark ? "#f0f0f2"   : "#111113"
  const textMuted = isDark ? "#6b6b78"   : "#888890"
  const textSub   = isDark ? "#3d3d48"   : "#c8c8c6"

  const visibleMessages = messages.filter(m => m.role !== "system")
  const hasMessages = visibleMessages.length > 0
  const busy = isLoading || isStreaming
  const canSend = inputValue.trim().length > 0 && !busy

  const headerLeft = isMobile ? 0 : sidebarWidth
  const inputLeft  = isMobile ? 0 : sidebarWidth

  // ── avatar initial ────────────────────────────────────────────────────────
  const initials = (user.name?.[0] || user.email?.[0] || "U").toUpperCase()

  return (
    <>
      <style>{`
        .chat-textarea {
          resize: none;
          outline: none;
          border: none;
          background: transparent;
          width: 100%;
          font-family: inherit;
          font-size: 15px;
          line-height: 1.6;
          color: ${text};
          min-height: 24px;
          max-height: 200px;
          overflow-y: auto;
          padding: 0;
          scrollbar-width: thin;
          scrollbar-color: ${border} transparent;
        }
        .chat-textarea::placeholder { color: ${textMuted}; }
        .chat-textarea::-webkit-scrollbar { width: 4px; }
        .chat-textarea::-webkit-scrollbar-thumb { background: ${border}; border-radius: 4px; }

        .send-btn {
          width: 34px; height: 34px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.15s, transform 0.1s;
          flex-shrink: 0;
        }
        .send-btn:active { transform: scale(0.93); }
        .send-btn:disabled { cursor: not-allowed; }

        .icon-btn {
          width: 30px; height: 30px;
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
          color: ${textMuted};
        }
        .icon-btn:hover { background: ${surfaceEl}; color: ${text}; }

        .credit-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-family: "SF Mono", "Fira Code", monospace;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
          border: 1px solid ${border};
          background: ${surfaceEl};
          color: ${text};
        }
        .credit-pill:hover { background: ${border}; }

        .add-credits-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid;
          cursor: pointer;
          transition: opacity 0.15s;
          border-color: color-mix(in srgb, var(--color-primary) 35%, transparent);
          background: color-mix(in srgb, var(--color-primary) 10%, transparent);
          color: var(--color-primary);
          text-decoration: none;
        }
        .add-credits-btn:hover { opacity: 0.8; }

        .input-box {
          border-radius: 16px;
          border: 1px solid ${border};
          background: ${surface};
          overflow: hidden;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-shadow: ${isDark
            ? "0 2px 16px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.03) inset"
            : "0 2px 16px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.8) inset"};
        }
        .input-box:focus-within {
          border-color: color-mix(in srgb, var(--color-primary) 50%, transparent);
          box-shadow: ${isDark
            ? "0 2px 20px rgba(0,0,0,0.5), 0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)"
            : "0 2px 20px rgba(0,0,0,0.08), 0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent)"};
        }

        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .typing-dot { animation: blink 1.2s ease-in-out infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, left: headerLeft, zIndex: 30,
          height: 52,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingLeft: isMobile ? 56 : 20, paddingRight: 16,
          borderBottom: `1px solid ${borderSub}`,
          background: surface,
          transition: "left 0.28s cubic-bezier(0.25,0.25,0,1)",
        }}
      >
        {/* Left: avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <Link href="/dashboard/settings" style={{ flexShrink: 0 }}>
            <div style={{
              width: 30, height: 30,
              borderRadius: 8,
              background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px color-mix(in srgb, var(--color-primary) 35%, transparent)",
              cursor: "pointer",
            }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>{initials}</span>
            </div>
          </Link>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: text, margin: 0, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.name || "User"}
            </p>
            <p style={{ fontSize: 11, color: textMuted, margin: 0, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.email}
            </p>
          </div>
        </div>

        {/* Right: credits + actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {credits && (
            <button className="credit-pill" onClick={refreshCredits} title="Click to refresh balance">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              ${credits.balance.toFixed(2)}
            </button>
          )}
          <Link href="/dashboard/billing" className="add-credits-btn">
            <Plus style={{ width: 12, height: 12 }} />
            <span>Add Credits</span>
          </Link>
          <Link href="/dashboard/settings">
            <button className="icon-btn">
              <Settings style={{ width: 15, height: 15 }} />
            </button>
          </Link>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────────────────── */}
      <div style={{
        paddingTop: 52,
        minHeight: "100svh",
        background: bg,
        display: "flex",
        flexDirection: "column",
      }}>
        {!hasMessages ? (
          <div style={{ flex: 1, background: bg }}>
            <ChatWelcome
              user={user}
              onSuggestion={handleSendMessage}
              onSendMessage={handleSendMessage}
              disabled={busy}
            />
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px 160px" }}>
              <div style={{ maxWidth: 720, margin: "0 auto" }}>
                <MessageList
                  messages={visibleMessages}
                  isLoading={isLoading || isStreaming}
                  streamingMessage={currentStreamingMessage}
                />
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── FLOATING INPUT ────────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed", bottom: 0, right: 0, left: inputLeft, zIndex: 50,
          padding: "12px 16px 20px",
          background: `linear-gradient(to top, ${bg} 65%, transparent)`,
          transition: "left 0.28s cubic-bezier(0.25,0.25,0,1)",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div className="input-box">

            {/* Textarea row */}
            <div style={{ padding: "14px 16px 0" }}>
              <textarea
                ref={textareaRef}
                className="chat-textarea"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={hasMessages ? "Message…" : "Ask anything…"}
                rows={1}
                disabled={busy}
              />
            </div>

            {/* Toolbar row */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 10px 10px",
            }}>
              {/* Left tools */}
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <button className="icon-btn" title="Attach file">
                  <Paperclip style={{ width: 15, height: 15 }} />
                </button>
                <button className="icon-btn" title="Web search">
                  <Globe style={{ width: 15, height: 15 }} />
                </button>
                {/* Model label */}
                <span style={{
                  marginLeft: 4,
                  fontSize: 11,
                  color: textMuted,
                  fontFamily: "monospace",
                  padding: "3px 7px",
                  borderRadius: 6,
                  background: surfaceEl,
                  border: `1px solid ${border}`,
                  lineHeight: 1,
                }}>
                  {selectedModel.split("/").pop()}
                </span>
              </div>

              {/* Right: send / stop */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {/* Char hint */}
                {inputValue.length > 200 && (
                  <span style={{ fontSize: 11, color: textMuted, fontVariantNumeric: "tabular-nums" }}>
                    {inputValue.length}
                  </span>
                )}

                {busy ? (
                  <button
                    className="send-btn"
                    onClick={handleStop}
                    style={{ background: isDark ? "#2a2a30" : "#e8e8e6" }}
                    title="Stop generating"
                  >
                    <Square style={{ width: 13, height: 13, fill: text, color: text }} />
                  </button>
                ) : (
                  <button
                    className="send-btn"
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!canSend}
                    title="Send (Enter)"
                    style={{
                      background: canSend
                        ? "var(--color-primary)"
                        : isDark ? "#1e1e24" : "#e4e4e2",
                      opacity: canSend ? 1 : 0.5,
                    }}
                  >
                    <ArrowUp
                      style={{
                        width: 16, height: 16,
                        color: canSend ? "#fff" : textSub,
                      }}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Hint */}
          <p style={{
            textAlign: "center", fontSize: 11, color: textMuted,
            margin: "8px 0 0", lineHeight: 1,
          }}>
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </>
  )
}