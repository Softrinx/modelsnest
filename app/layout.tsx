import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import { StructuredData, OrganizationStructuredData } from '@/components/structured-data'
import { ThemeProvider } from '@/contexts/themeContext'
import './globals.css'

export const dynamic = 'force-dynamic'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Modelsnest - Enterprise AI APIs Built for Scale',
    template: '%s | Modelsnest',
  },
  description:
    'Production ready AI infrastructure with <200ms latency, 99.99% uptime, and transparent pricing. Built by developers, for developers. Ship AI features in minutes, not months.',
  keywords: [
    'AI APIs',
    'Enterprise AI',
    'Machine Learning APIs',
    'AI Infrastructure',
    'Developer Tools',
    'API Platform',
    'AI Services',
    'Production AI',
    'Low Latency AI',
    'Scalable AI',
  ],
  authors: [{ name: 'Modelsnest Team' }],
  creator: 'Modelsnest',
  publisher: 'Modelsnest',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://Modelsnest.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://Modelsnest.com',
    siteName: 'Modelsnest',
    title: 'Modelsnest - Enterprise AI APIs Built for Scale',
    description:
      'Production-ready AI infrastructure with <200ms latency, 99.99% uptime, and transparent pricing. Built by developers, for developers.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Modelsnest - Enterprise AI APIs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modelsnest - Enterprise AI APIs Built for Scale',
    description:
      'Production-ready AI infrastructure with <200ms latency, 99.99% uptime, and transparent pricing.',
    images: ['/og-image.png'],
    creator: '@Modelsnest',
    site: '@Modelsnest',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
  classification: 'AI and Machine Learning APIs',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${dmSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#8C5CF7" />
        <meta name="msapplication-TileColor" content="#8C5CF7" />
        <StructuredData />
        <OrganizationStructuredData />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}