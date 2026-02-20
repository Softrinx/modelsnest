'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

import { ThemeService, type ThemeConfig, type ColorMode } from '@/services/themeService'

interface ThemeContextValue {
  config: ThemeConfig
  isDark: boolean
  setMode: (mode: ColorMode) => void
  setPrimaryColor: (color: string) => void
  setSecondaryColor: (color: string) => void
  setAccentColor: (color: string) => void
  setSuccessColor: (color: string) => void
  setDangerColor: (color: string) => void
  resetTheme: () => void
  updateTheme: (overrides: Partial<ThemeConfig>) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(() => ThemeService.defaults())

  useEffect(() => {
    const stored = ThemeService.load()
    setConfig(stored)
    ThemeService.applyToDom(stored)
  }, [])

  useEffect(() => {
    if (config.mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => ThemeService.applyToDom(config)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [config])

  const updateTheme = useCallback((overrides: Partial<ThemeConfig>) => {
    setConfig(ThemeService.save(overrides))
  }, [])

  const setMode = useCallback((mode: ColorMode) => updateTheme({ mode }), [updateTheme])

  const makeColorSetter = useCallback(
    (key: keyof Omit<ThemeConfig, 'mode'>) => (color: string) => {
      if (!ThemeService.isValidColor(color)) {
        console.warn(`[ThemeService] Invalid color: "${color}"`)
        return
      }
      updateTheme({ [key]: color })
    },
    [updateTheme]
  )

  const resetTheme = useCallback(() => setConfig(ThemeService.reset()), [])

  return (
    <ThemeContext.Provider
      value={{
        config,
        isDark: ThemeService.resolveIsDark(config.mode),
        setMode,
        setPrimaryColor:   makeColorSetter('primaryColor'),
        setSecondaryColor: makeColorSetter('secondaryColor'),
        setAccentColor:    makeColorSetter('accentColor'),
        setSuccessColor:   makeColorSetter('successColor'),
        setDangerColor:    makeColorSetter('dangerColor'),
        resetTheme,
        updateTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}