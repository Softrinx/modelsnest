"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/themeContext"

interface OutsoorLogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "sidebar" | "header"
}

const sizeMap = {
  sm: { w: 80,  h: 26 },
  md: { w: 110, h: 36 },
  lg: { w: 155, h: 48 },
  xl: { w: 180, h: 56 },
}

export function OutsoorLogo({ className, size = "md" }: OutsoorLogoProps) {
  const { isDark } = useTheme()
  const s = sizeMap[size]

  return (
    <Image
      src={isDark ? "/logodark.png" : "/logolight.png"}
      alt="Outsoor"
      width={s.w}
      height={s.h}
      className={cn("object-contain", className)}
      priority
    />
  )
}

export function OutsoorLogoCompact({ className }: { className?: string }) {
  const { isDark } = useTheme()

  return (
    <Image
      src={isDark ? "/logodark.png" : "/logolight.png"}
      alt="Outsoor"
      width={38}
      height={38}
      className={cn("object-contain", className)}
      priority
    />
  )
}