import { THEME_DEFAULTS, CSS_VAR_MAP, COLORS } from '@/constants/theme.constants'

export type ColorMode = 'dark' | 'light' | 'system'

export interface ThemeOverrides {
  primaryColor?:   string
  secondaryColor?: string
  accentColor?:    string
  successColor?:   string
  dangerColor?:    string
}

export interface ThemeConfig extends Required<ThemeOverrides> {
  mode: ColorMode
}

const STORAGE_KEY = 'outsoor:theme'

export const ThemeService = {
  load(): ThemeConfig {
    if (typeof window === 'undefined') return ThemeService.defaults()

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return ThemeService.defaults()
      return { ...ThemeService.defaults(), ...JSON.parse(raw) }
    } catch {
      return ThemeService.defaults()
    }
  },

  save(overrides: Partial<ThemeConfig>): ThemeConfig {
    const next: ThemeConfig = { ...ThemeService.load(), ...overrides }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }
    ThemeService.applyToDom(next)
    return next
  },

  reset(): ThemeConfig {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    const defaults = ThemeService.defaults()
    ThemeService.applyToDom(defaults)
    return defaults
  },

  applyToDom(config: ThemeConfig): void {
    if (typeof window === 'undefined') return

    const root = document.documentElement

    ;(Object.keys(CSS_VAR_MAP) as Array<keyof typeof CSS_VAR_MAP>).forEach((key) => {
      const value = config[key as keyof ThemeOverrides]
      if (value) root.style.setProperty(CSS_VAR_MAP[key], value)
    })

    const isDark = ThemeService.resolveIsDark(config.mode)
    const palette = isDark ? COLORS.dark : COLORS.light

    root.style.setProperty('--color-bg',           palette.bg)
    root.style.setProperty('--color-surface-1',    palette.surface1)
    root.style.setProperty('--color-surface-2',    palette.surface2)
    root.style.setProperty('--color-surface-3',    palette.surface3)
    root.style.setProperty('--color-border',       palette.border)
    root.style.setProperty('--color-border-hover', palette.borderHover)
    root.style.setProperty('--color-text',         isDark ? COLORS.text.primary : COLORS.text.inverse)
    root.style.setProperty('--color-text-muted',   isDark ? COLORS.text.secondary : COLORS.text.muted)
    root.setAttribute('data-theme', isDark ? 'dark' : 'light')
  },

  resolveIsDark(mode: ColorMode): boolean {
    if (mode === 'dark') return true
    if (mode === 'light') return false
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return true
  },

  defaults(): ThemeConfig {
    return {
      primaryColor:   THEME_DEFAULTS.primaryColor,
      secondaryColor: THEME_DEFAULTS.secondaryColor,
      accentColor:    THEME_DEFAULTS.accentColor,
      successColor:   THEME_DEFAULTS.successColor,
      dangerColor:    THEME_DEFAULTS.dangerColor,
      mode:           THEME_DEFAULTS.defaultMode,
    }
  },

  isValidColor(value: string): boolean {
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)
  },
} as const