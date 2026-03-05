"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, Loader2, Paperclip, AtSign } from "lucide-react"
import { useTheme } from "@/contexts/themeContext"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  variant?: "default" | "welcome"
}

export function MessageInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type a message...",
  className = "",
  variant = "default",
}: MessageInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { isDark } = useTheme()

  const surface   = isDark ? "#111114" : "#ffffff"
  const border    = isDark ? "#232329" : "#e0e0de"
  const surfaceEl = isDark ? "#18181c" : "#f0f0ee"
  const text      = isDark ? "#f0f0f2" : "#111113"
  const textMuted = isDark ? "#6b6b78" : "#888890"

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const canSend = message.trim().length > 0 && !disabled

  // ── Welcome variant ────────────────────────────────────────────────────────
  if (variant === "welcome") {
    return (
      <form onSubmit={handleSubmit} className={className} style={{ width: "100%" }}>
        <div style={{
          display: "flex", alignItems: "flex-end", gap: 12,
          background: surface,
          border: `1px solid ${border}`,
          borderRadius: 16,
          padding: "12px 14px",
          boxShadow: isDark
            ? "0 2px 16px rgba(0,0,0,0.4)"
            : "0 2px 16px rgba(0,0,0,0.06)",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
          onFocus={() => {}}
          className="welcome-input-box"
        >
          <style>{`
            .welcome-input-box:focus-within {
              border-color: color-mix(in srgb, var(--color-primary) 50%, transparent) !important;
              box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent) !important;
            }
          `}</style>
          <div style={{ flex: 1 }}>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              style={{
                width: "100%", resize: "none", border: "none", outline: "none",
                background: "transparent", color: text,
                fontSize: 15, lineHeight: 1.6,
                minHeight: 24, maxHeight: 120, overflowY: "auto",
                fontFamily: "inherit",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!canSend}
            style={{
              height: 40, padding: "0 20px", borderRadius: 10, border: "none",
              background: canSend
                ? "linear-gradient(135deg, var(--color-primary), var(--color-accent))"
                : surfaceEl,
              color: canSend ? "#fff" : textMuted,
              cursor: canSend ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 14, fontWeight: 600,
              transition: "opacity 0.15s",
              opacity: canSend ? 1 : 0.5,
              flexShrink: 0,
            }}
          >
            {disabled
              ? <Loader2 style={{ width: 15, height: 15, animation: "spin 1s linear infinite" }} />
              : <>
                  <Sparkles style={{ width: 15, height: 15 }} />
                  Send
                </>
            }
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </form>
    )
  }

  // ── Default variant ────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className={className} style={{ width: "100%" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: isDark ? "#0D0D0F" : "#ffffff",
        border: `1px solid ${border}`,
        borderRadius: 30,
        padding: "8px 12px",
        margin: "0 16px 16px",
        boxShadow: isDark
          ? "0 2px 16px rgba(0,0,0,0.4)"
          : "0 2px 16px rgba(0,0,0,0.06)",
        minHeight: 52,
        maxHeight: 52,
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
        className="default-input-box"
      >
        <style>{`
          .default-input-box:focus-within {
            border-color: color-mix(in srgb, var(--color-primary) 50%, transparent) !important;
            box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent) !important;
          }
          .icon-action-btn {
            width: 30px; height: 30px; border-radius: 8px; border: none;
            background: transparent; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            color: ${textMuted}; transition: background 0.15s, color 0.15s;
            flex-shrink: 0;
          }
          .icon-action-btn:hover { background: ${surfaceEl}; color: ${text}; }
        `}</style>

        <button type="button" className="icon-action-btn" title="Attach file">
          <Paperclip style={{ width: 16, height: 16 }} />
        </button>
        <button type="button" className="icon-action-btn" title="Mention">
          <AtSign style={{ width: 16, height: 16 }} />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message here..."
            disabled={disabled}
            style={{
              width: "100%", border: "none", outline: "none",
              background: "transparent", color: text,
              fontSize: 14, fontFamily: "inherit",
              height: 28, lineHeight: "28px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!canSend}
          style={{
            width: 36, height: 36, borderRadius: "50%", border: "none",
            background: canSend ? "var(--color-success)" : surfaceEl,
            cursor: canSend ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            transition: "opacity 0.15s, background 0.15s",
            opacity: canSend ? 1 : 0.4,
          }}
        >
          {disabled
            ? <Loader2 style={{ width: 15, height: 15, color: textMuted, animation: "spin 1s linear infinite" }} />
            : <Send style={{ width: 16, height: 16, color: canSend ? "#fff" : textMuted }} />
          }
        </button>
      </div>
    </form>
  )
}