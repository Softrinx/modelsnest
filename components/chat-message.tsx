"use client"

import { useState } from "react"
import { Copy, Check, User, Sparkles } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useTheme } from "@/contexts/themeContext"
import type { ChatMessage as ChatMessageType } from "@/lib/chat-api"

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const { isDark } = useTheme()
  const isUser = message.role === "user"

  const surface   = isDark ? "#111114" : "#ffffff"
  const border    = isDark ? "#232329" : "#e0e0de"
  const text      = isDark ? "#f0f0f2" : "#111113"
  const textMuted = isDark ? "#6b6b78" : "#888890"
  const surfaceEl = isDark ? "#18181c" : "#f0f0ee"
  const codeBg    = isDark ? "#13131a" : "#f4f4f2"
  const codeText  = isDark ? "#e879f9" : "#9333ea"
  const preBg     = isDark ? "#0d0d10" : "#f0f0ee"
  const blockquoteColor = isDark ? "#A0A0A8" : "#666670"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
      className="group"
    >
      {/* AI avatar */}
      {!isUser && (
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px color-mix(in srgb, var(--color-primary) 30%, transparent)",
        }}>
          <Sparkles style={{ width: 16, height: 16, color: "#fff" }} />
        </div>
      )}

      {/* Bubble */}
      <div style={{ maxWidth: "80%", order: isUser ? -1 : undefined }}>
        <div style={{
          padding: "10px 14px",
          borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
          background: isUser
            ? "linear-gradient(135deg, var(--color-primary), var(--color-accent))"
            : surface,
          border: isUser ? "none" : `1px solid ${border}`,
          boxShadow: isDark
            ? "0 1px 8px rgba(0,0,0,0.35)"
            : "0 1px 6px rgba(0,0,0,0.07)",
          position: "relative",
        }}>
          {/* Label */}
          <div style={{
            fontSize: 11, fontWeight: 600, marginBottom: 6,
            color: isUser ? "rgba(255,255,255,0.75)" : textMuted,
          }}>
            {isUser ? "You" : "AI Assistant"}
          </div>

          {/* Content */}
          {isUser ? (
            <div style={{
              color: "#fff",
              fontSize: 14,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}>
              {message.content}
            </div>
          ) : (
            <div style={{ color: text, fontSize: 14, lineHeight: 1.6 }}
              className="prose-container"
            >
              <style>{`
                .prose-container p { margin: 6px 0; line-height: 1.65; }
                .prose-container h1,.prose-container h2,.prose-container h3 {
                  color: ${text}; font-weight: 700; margin: 12px 0 6px;
                }
                .prose-container h1 { font-size: 15px; }
                .prose-container h2,.prose-container h3 { font-size: 14px; }
                .prose-container strong { color: ${text}; font-weight: 600; }
                .prose-container em { color: ${textMuted}; }
                .prose-container code {
                  color: ${codeText}; background: ${codeBg};
                  padding: 2px 6px; border-radius: 4px;
                  font-size: 12px; font-family: "SF Mono","Fira Code",monospace;
                }
                .prose-container pre {
                  background: ${preBg}; border: 1px solid ${border};
                  border-radius: 8px; padding: 12px; margin: 8px 0;
                  overflow-x: auto;
                }
                .prose-container pre code {
                  background: transparent; padding: 0; color: ${text};
                }
                .prose-container ul,.prose-container ol { padding-left: 18px; margin: 6px 0; }
                .prose-container li { margin: 3px 0; }
                .prose-container blockquote {
                  border-left: 2px solid var(--color-primary);
                  padding-left: 12px; color: ${blockquoteColor};
                  margin: 8px 0;
                }
                .prose-container hr { border-color: ${border}; margin: 12px 0; }
                .prose-container a { color: var(--color-primary); text-decoration: none; }
                .prose-container a:hover { text-decoration: underline; }
              `}</style>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}

          {/* Copy btn */}
          <button
            onClick={handleCopy}
            style={{
              position: "absolute", top: 8, right: 8,
              opacity: 0,
              background: isUser ? "rgba(255,255,255,0.15)" : surfaceEl,
              border: isUser ? "none" : `1px solid ${border}`,
              borderRadius: 6,
              padding: "3px 6px",
              cursor: "pointer",
              display: "flex", alignItems: "center",
              transition: "opacity 0.15s",
            }}
            className="copy-btn"
          >
            {copied
              ? <Check style={{ width: 12, height: 12, color: "var(--color-success)" }} />
              : <Copy style={{ width: 12, height: 12, color: isUser ? "rgba(255,255,255,0.8)" : textMuted }} />
            }
          </button>
          <style>{`
            .group:hover .copy-btn { opacity: 1 !important; }
          `}</style>
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg, var(--color-success), color-mix(in srgb, var(--color-success) 70%, var(--color-primary)))",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px color-mix(in srgb, var(--color-success) 30%, transparent)",
        }}>
          <User style={{ width: 16, height: 16, color: "#fff" }} />
        </div>
      )}
    </div>
  )
}