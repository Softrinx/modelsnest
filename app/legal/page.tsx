import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Shield, CheckCircle, Lock, Scale } from 'lucide-react'

// Force dynamic rendering to prevent prerendering issues with Client Components
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Legal',
  description: 'Access all legal documents, policies, and compliance information for Modelsnest.',
}

export default function LegalHub() {
  const legalDocuments = [
    {
      title: "Privacy Policy",
      description: "Learn how we collect, use, and protect your personal information",
      href: "/privacy",
      icon: Shield,
      category: "Data Protection"
    },
    {
      title: "Terms of Service",
      description: "Read the terms and conditions for using our AI API services",
      href: "/terms",
      icon: FileText,
      category: "Legal Terms"
    },
    {
      title: "Security",
      description: "Understand our comprehensive security measures and practices",
      href: "/security",
      icon: Lock,
      category: "Security"
    },
    {
      title: "Compliance",
      description: "View our compliance with industry standards and regulations",
      href: "/compliance",
      icon: CheckCircle,
      category: "Compliance"
    },
    {
      title: "Data Processing Agreement",
      description: "Read our DPA for data processing activities",
      href: "/dpa",
      icon: Scale,
      category: "Data Processing"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0F] via-[#121214] to-[#1A1B1F] text-white">
      {/* Navigation Header */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <a href="/" className="text-green-500 hover:text-green-400 transition-colors">
            ← Back to Modelsnest
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Legal & Compliance</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Access all legal documents, policies, and compliance information. We're committed to transparency and protecting your rights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {legalDocuments.map((doc) => {
            const IconComponent = doc.icon
            return (
              <Link 
                key={doc.title} 
                href={doc.href}
                className="group block"
              >
                <div className="bg-muted p-6 rounded-lg border border-border hover:border-green-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/30 transition-colors">
                      <IconComponent className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg group-hover:text-green-400 transition-colors">
                          {doc.title}
                        </h3>
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                          {doc.category}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {doc.description}
                      </p>
                      <div className="mt-3 text-green-500 text-sm font-medium group-hover:text-green-400 transition-colors">
                        Read more →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="bg-muted p-8 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-4">Need Legal Support?</h2>
          <p className="text-muted-foreground mb-6">
            Our legal and compliance teams are here to help with any questions about our policies, terms, or compliance requirements.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Document Requests</h3>
              <p className="text-sm text-muted-foreground">
                Need signed copies or specific documentation?
              </p>
              <a href="mailto:modelsnest3@gmail.com" className="text-blue-500 hover:text-blue-400 text-sm font-medium">
                modelsnest3@gmail.com
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">Compliance Questions</h3>
              <p className="text-sm text-muted-foreground">
                Questions about our compliance status?
              </p>
              <a href="mailto:modelsnest3@gmail.com" className="text-green-500 hover:text-green-400 text-sm font-medium">
                modelsnest3@gmail.com
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2">Security Concerns</h3>
              <p className="text-sm text-muted-foreground">
                Report security issues or vulnerabilities?
              </p>
              <a href="mailto:modelsnest3@gmail.com" className="text-purple-500 hover:text-purple-400 text-sm font-medium">
                modelsnest3@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-green-400">Transparency Commitment</h3>
            <p className="text-muted-foreground">
              We believe in transparency and are committed to keeping our legal documents clear, accessible, and up-to-date. 
              All documents are reviewed regularly and updated as needed to reflect current practices and legal requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
