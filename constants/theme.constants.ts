export const COLORS = {
    primary: {
      50:  '#F3EEFF',
      100: '#E9DDFF',
      200: '#D4BCFF',
      300: '#BC97FF',
      400: '#A673FF',
      500: '#8C5CF7',
      600: '#7C4CF7',
      700: '#6A3AE0',
      800: '#5529C4',
      900: '#3E1E99',
    },
  
    secondary: {
      50:  '#EEEEFF',
      100: '#DCDCFF',
      200: '#B8B9FF',
      300: '#9396FF',
      400: '#6E73FF',
      500: '#5567F7',
      600: '#4455E8',
      700: '#3343CC',
      800: '#2231AE',
      900: '#131F8A',
    },
  
    accent: {
      500: '#C85CFA',
      600: '#B44AE8',
    },
  
    success: {
      400: '#4ADE80',
      500: '#22C55E',
      muted: 'rgba(74, 222, 128, 0.10)',
    },
  
    danger: {
      400: '#EF4444',
      500: '#DC2626',
      muted: 'rgba(239, 68, 68, 0.10)',
    },
  
    warning: {
      400: '#FBBF24',
      500: '#F59E0B',
      muted: 'rgba(251, 191, 36, 0.10)',
    },
  
    dark: {
      bg:          '#0D0D0F',
      surface1:    '#121214',
      surface2:    '#1A1B1F',
      surface3:    '#22232A',
      border:      '#2D2D32',
      borderHover: '#3D3D42',
    },
  
    text: {
      primary:   '#FFFFFF',
      secondary: '#A0A0A8',
      muted:     '#6B6B75',
      inverse:   '#0D0D0F',
    },
  
    light: {
      bg:          '#FAFAFA',
      surface1:    '#FFFFFF',
      surface2:    '#F4F4F6',
      surface3:    '#EBEBEF',
      border:      '#E4E4E8',
      borderHover: '#C8C8D0',
    },
  } as const
  
  export const GRADIENTS = {
    brand:      'linear-gradient(90deg, #8C5CF7, #C85CFA, #5567F7)',
    heroBg:     'linear-gradient(135deg, #0D0D0F, #121214, #1A1B1F)',
    cardAccent: 'linear-gradient(135deg, #8C5CF7, #5567F7)',
    successBg:  'linear-gradient(135deg, rgba(74,222,128,0.05), rgba(74,222,128,0.02))',
  } as const
  
  export const TYPOGRAPHY = {
    fonts: {
      sans: 'var(--font-space-grotesk)',
      mono: 'var(--font-geist-mono)',
    },
    sizes: {
      display: 'clamp(3rem, 8vw, 7rem)',
      h1:      'clamp(2rem, 5vw, 3.75rem)',
      h2:      'clamp(1.5rem, 3vw, 2.25rem)',
      h3:      'clamp(1.25rem, 2vw, 1.5rem)',
      body:    '1rem',
      sm:      '0.875rem',
      xs:      '0.75rem',
    },
  } as const
  
  export const RADIUS = {
    sm:    '0.5rem',
    md:    '0.75rem',
    lg:    '1rem',
    xl:    '1.5rem',
    '2xl': '2rem',
    full:  '9999px',
  } as const
  
  export const ANIMATION = {
    duration: {
      fast:   '150ms',
      normal: '200ms',
      slow:   '350ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  } as const
  
  export const THEME_DEFAULTS = {
    primaryColor:   COLORS.primary[500],
    secondaryColor: COLORS.secondary[500],
    accentColor:    COLORS.accent[500],
    successColor:   COLORS.success[400],
    dangerColor:    COLORS.danger[400],
    defaultMode:    'dark' as 'dark' | 'light' | 'system',
  } as const
  
  export const CSS_VAR_MAP = {
    primaryColor:   '--color-primary',
    secondaryColor: '--color-secondary',
    accentColor:    '--color-accent',
    successColor:   '--color-success',
    dangerColor:    '--color-danger',
  } as const