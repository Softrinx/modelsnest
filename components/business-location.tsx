"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { useTheme } from "@/contexts/themeContext"
import { MapPin, Mail, Hash } from "lucide-react"

export function BusinessLocation() {
  const { isDark } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })

  const card   = isDark ? "#18181c" : "#ffffff"
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)"
  const text   = isDark ? "#f4f4f5" : "#0a0a0b"
  const muted  = isDark ? "#71717a" : "#71717a"

  const details = [
    { label: "County",         value: "Laikipia" },
    { label: "District",       value: "Laikipia East District" },
    { label: "Locality",       value: "Nanyuki" },
    { label: "Street",         value: "Kimathi Rd" },
    { label: "Postal Address", value: "302" },
    { label: "Postal Code",    value: "10400 – Nanyuki" },
  ]

  return (
    <section
      ref={ref}
      className="relative py-20 overflow-hidden"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p
            className="text-xs font-mono tracking-widest uppercase mb-3"
            style={{ color: "var(--color-primary)" }}
          >
            Our Location
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: text,
            }}
          >
            Find us in{" "}
            <span
              style={{
                background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Nanyuki, Kenya
            </span>
          </h2>
        </motion.div>

        {/* Map + Address side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              border: `1px solid ${border}`,
              minHeight: "380px",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.4!2d37.0699!3d0.0167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKimathi+Rd%2C+Nanyuki%2C+Kenya!5e0!3m2!1sen!2ske!4v1"
              width="100%"
              height="100%"
              style={{
                border: 0,
                minHeight: "380px",
                filter: isDark ? "invert(90%) hue-rotate(180deg)" : "none",
                transition: "filter 0.3s",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Modelsnest Location"
            />
          </motion.div>

          {/* Address details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              background: card,
              border: `1px solid ${border}`,
              borderRadius: "12px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* Address icon + title */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "color-mix(in srgb, var(--color-primary) 14%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--color-primary) 28%, transparent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MapPin size={18} style={{ color: "var(--color-primary)" }} />
              </div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 800, color: text, letterSpacing: "-0.02em" }}>
                  Primary Address
                </div>
                <div style={{ fontSize: "12px", color: muted }}>Modelsnest HQ</div>
              </div>
            </div>

            {/* Address grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1px",
                background: border,
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {details.map((d) => (
                <div
                  key={d.label}
                  style={{
                    padding: "14px 16px",
                    background: card,
                  }}
                >
                  <div style={{ fontSize: "11px", color: muted, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: text }}>
                    {d.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Email */}
            <motion.div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                background: "color-mix(in srgb, var(--color-primary) 6%, transparent)",
                border: "1px solid color-mix(in srgb, var(--color-primary) 18%, transparent)",
                borderRadius: "8px",
              }}
            >
              <Mail size={14} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "11px", color: muted, marginBottom: "2px" }}>Company Email</div>
                <a
                  href="mailto:Modelsnest3@gmail.com"
                  style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-primary)", textDecoration: "none" }}
                >
                  Modelsnest3@gmail.com
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}