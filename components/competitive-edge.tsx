"use client"

import { motion } from "framer-motion"
import { Check, X, Zap, Globe, Shield } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export function CompetitiveEdge() {
  const competitors = [
    {
      name: "Outsoor",
      logo: "🚀",
      isOurs: true,
      features: {
        latency: "< 200ms",
        uptime: "99.99%",
        pricing: "$0.001/1K tokens",
        models: "50+ models",
        support: "24/7 Enterprise",
        global: true,
        compliance: true,
      },
    },
    {
      name: "Novita.ai",
      logo: "🔷",
      isOurs: false,
      features: {
        latency: "~800ms",
        uptime: "99.5%",
        pricing: "$0.003/1K tokens",
        models: "20+ models",
        support: "Business hours",
        global: false,
        compliance: false,
      },
    },
    {
      name: "OpenAI",
      logo: "⚡",
      isOurs: false,
      features: {
        latency: "~500ms",
        uptime: "99.9%",
        pricing: "$0.002/1K tokens",
        models: "10+ models",
        support: "Email only",
        global: true,
        compliance: true,
      },
    },
  ]

  type FeatureKey = keyof (typeof competitors)[number]["features"]

  const comparisonRows: Array<{ label: string; key: FeatureKey; icon: LucideIcon }> = [
    { label: "Average Latency", key: "latency", icon: Zap },
    { label: "Uptime SLA", key: "uptime", icon: Shield },
    { label: "Starting Price", key: "pricing", icon: Globe },
    { label: "Available Models", key: "models", icon: Globe },
    { label: "Support Level", key: "support", icon: Shield },
    { label: "Global Infrastructure", key: "global", icon: Globe },
    { label: "Enterprise Compliance", key: "compliance", icon: Shield },
  ]

  return (
    <section className="py-24 px-6 relative bg-gradient-to-br from-[#0D0D0F] via-[#121214] to-[#1A1B1F]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold font-space mb-6 text-white">
            Why Developers Choose <span className="bg-gradient-to-r from-[#8C5CF7] via-[#C85CFA] to-[#5567F7] bg-clip-text text-transparent">Outsoor</span>
          </h2>
          <p className="text-xl text-[#A0A0A8] max-w-3xl mx-auto">
            See how we stack up against the competition. Better performance, better pricing, better developer
            experience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-[#1A1B1F] border border-[#2D2D32] rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 p-6 border-b border-[#2D2D32]">
            <div className="text-lg font-semibold text-[#A0A0A8]">Features</div>
            {competitors.map((competitor) => (
              <div key={competitor.name} className="text-center">
                <div className="text-2xl mb-2">{competitor.logo}</div>
                <div className={`font-bold ${competitor.isOurs ? "text-[#4ADE80]" : "text-[#A0A0A8]"}`}>
                  {competitor.name}
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Rows */}
          {comparisonRows.map((row, index) => (
            <div
              key={row.label}
              className={`grid grid-cols-4 gap-4 p-6 ${index < comparisonRows.length - 1 ? "border-b border-[#2D2D32]" : ""}`}
            >
              <div className="flex items-center gap-3">
                <row.icon className="w-5 h-5 text-[#4ADE80]" />
                <span className="font-medium text-white">{row.label}</span>
              </div>
              {competitors.map((competitor) => (
                <div key={competitor.name} className="text-center">
                  {typeof competitor.features[row.key] === "boolean" ? (
                    competitor.features[row.key] ? (
                      <Check className={`w-6 h-6 mx-auto text-[#4ADE80]`} />
                    ) : (
                      <X className="w-6 h-6 mx-auto text-[#EF4444]" />
                    )
                  ) : (
                    <span
                      className={`font-mono text-sm ${competitor.isOurs ? "text-[#4ADE80] font-bold" : "text-[#A0A0A8]"}`}
                    >
                      {competitor.features[row.key]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
