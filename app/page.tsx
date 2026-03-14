import { HeroSection } from "@/components/hero-section"
import { VisionSection } from "@/components/vision-section"
import { ApiShowcase } from "@/components/api-showcase"
import { DeveloperExperience } from "@/components/developer-experience"
import { EnterpriseSolutions } from "@/components/enterprise-solutions"
import { GlobalClients } from "@/components/global-clients"
import { Testimonials } from "@/components/testimonials"
import { PricingSection } from "@/components/pricing-section"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import type { Metadata } from 'next'
import { TrustSignals } from "@/components/trust-signals"
import { BusinessLocation } from "@/components/business-location"

export const metadata: Metadata = {
  title: 'Enterprise AI APIs Built for Scale',
  description: 'Production-ready AI infrastructure with <200ms latency, 99.99% uptime, and transparent pricing. Built by developers, for developers. Ship AI features in minutes, not months.',
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
    'AI Development',
    'API Integration'
  ],
  openGraph: {
    title: 'Modelsnest - Enterprise AI APIs Built for Scale',
    description: 'Production-ready AI infrastructure with <200ms latency, 99.99% uptime, and transparent pricing. Built by developers, for developers.',
    url: 'https://Modelsnest.com',
    siteName: 'Modelsnest',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Modelsnest - Enterprise AI APIs',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modelsnest - Enterprise AI APIs Built for Scale',
    description: 'Production-ready AI infrastructure with <200ms latency, 99.99% uptime, and transparent pricing.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0F] via-[#121214] to-[#1A1B1F] relative overflow-hidden">
      <HeroSection />
      <VisionSection />
      <ApiShowcase />
      <DeveloperExperience />
      <EnterpriseSolutions />
      <GlobalClients />
      <Testimonials />
      <PricingSection />
      <FinalCTA />
      <TrustSignals />
<BusinessLocation />
      <Footer />
    </div>
  )
}
