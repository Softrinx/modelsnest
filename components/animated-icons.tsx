"use client"

import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import type { CSSProperties } from "react"
import {
  MessageSquare,
  ImageIcon,
  Mic,
  Volume2,
  Brain,
  Layers,
  Zap,
  Clock,
  Activity,
  Terminal,
  Globe,
  Sparkles,
  Rocket,
  Code,
  ArrowRight,
  TrendingUp,
  Shield,
  Play,
  BarChart3,
  Key,
  Puzzle,
} from "lucide-react"

// Simple Static Icon Variants - No Wobbling
const iconVariants: Variants = {
  idle: {
    scale: 1,
    rotate: 0,
    opacity: 1,
  },
  hover: {
    scale: 1.05,
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
}

interface AnimatedIconProps {
  className?: string
  style?: CSSProperties
}

// Static Icon Components - No Animation
export const AnimatedMessageSquare = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <MessageSquare className="w-full h-full" />
  </motion.div>
)

export const AnimatedImageIcon = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <ImageIcon className="w-full h-full" />
  </motion.div>
)

export const AnimatedMic = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <Mic className="w-full h-full" />
  </motion.div>
)

export const AnimatedVolume2 = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <Volume2 className="w-full h-full" />
  </motion.div>
)

export const AnimatedBrain = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <Brain className="w-full h-full" />
  </motion.div>
)

export const AnimatedLayers = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <Layers className="w-full h-full" />
  </motion.div>
)

export const AnimatedZap = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <Zap className="w-full h-full" />
  </motion.div>
)

export const AnimatedActivity = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <Activity className="w-full h-full" />
  </motion.div>
)

export const AnimatedTerminal = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <Terminal className="w-full h-full" />
  </motion.div>
)

export const AnimatedGlobe = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <Globe className="w-full h-full" />
  </motion.div>
)

export const AnimatedSparkles = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <Sparkles className="w-full h-full" />
  </motion.div>
)

export const AnimatedRocket = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <Rocket className="w-full h-full" />
  </motion.div>
)

export const AnimatedCode = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <Code className="w-full h-full" />
  </motion.div>
)

export const AnimatedArrowRight = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <ArrowRight className="w-full h-full" />
  </motion.div>
)

export const AnimatedTrendingUp = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <TrendingUp className="w-full h-full" />
  </motion.div>
)

export const AnimatedShield = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <Shield className="w-full h-full" />
  </motion.div>
)

export const AnimatedClock = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <Clock className="w-full h-full" />
  </motion.div>
)

export const AnimatedPlay = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <Play className="w-full h-full" />
  </motion.div>
)

export const AnimatedBarChart3 = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <BarChart3 className="w-full h-full" />
  </motion.div>
)

export const AnimatedKey = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <Key className="w-full h-full" />
  </motion.div>
)

export const AnimatedPuzzle = ({ className = "", style }: AnimatedIconProps) => (
  <motion.div variants={iconVariants} initial="idle" whileHover="hover" whileTap="tap" className={className} style={style}>
    <Puzzle className="w-full h-full" />
  </motion.div>
)

// Simple Status Indicator - No Animation
export const AnimatedStatusIndicator = ({ className = "" }: { className?: string }) => (
  <motion.div
    className={`relative ${className}`}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "tween", duration: 0.3 }}
  >
    <div className="w-3 h-3 bg-green-500 rounded-full" />
    <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full opacity-75" />
  </motion.div>
)

// Simple Loading Spinner - Minimal Animation
export const AnimatedLoadingSpinner = ({ className = "" }: { className?: string }) => (
  <motion.div
    className={`w-6 h-6 border-2 border-green-500/30 border-t-green-500 rounded-full ${className}`}
    animate={{ rotate: 360 }}
    transition={{
      duration: 1,
      repeat: Number.POSITIVE_INFINITY,
      ease: "linear",
    }}
  />
)

// Static Icon Component - No Morphing
export const MorphingIcon = ({
  icons,
  className = "",
}: {
  icons: any[]
  className?: string
}) => {
  const CurrentIcon = icons[0] // Just show the first icon, no morphing

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "tween", duration: 0.3 }}
      className={className}
    >
      <CurrentIcon className="w-full h-full" />
    </motion.div>
  )
}
