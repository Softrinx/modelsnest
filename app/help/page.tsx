import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, MessageCircle, Video, FileText, HelpCircle, Code, Shield, Gauge, AlertTriangle, Webhook, CreditCard } from "lucide-react"

// Force dynamic rendering to prevent prerendering issues with Client Components
export const dynamic = 'force-dynamic'

export default function HelpCenterPage() {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      faqs: [
        {
          question: "How do I create my first API key?",
          answer: "Navigate to your dashboard, click on 'API Keys' in the sidebar, and then click 'Create New Key'. Give it a descriptive name and copy the generated key immediately as it won't be shown again."
        },
        {
          question: "What are the rate limits for the APIs?",
          answer: "Rate limits vary by plan. Free tier includes 1,000 requests/month, Pro includes 100,000 requests/month, and Enterprise has custom limits. Check your plan details in the dashboard."
        },
        {
          question: "How do I upgrade my plan?",
          answer: "Go to your dashboard billing section, select the plan you want, and click 'Upgrade'. You can change plans at any time and will be charged prorated amounts."
        }
      ]
    },
    {
      title: "API Integration",
      icon: Code,
      faqs: [
        {
          question: "How do I authenticate my API requests?",
          answer: "Include your API key in the Authorization header: 'Authorization: Bearer YOUR_API_KEY'. Make sure to keep your API key secure and never expose it in client-side code."
        },
        {
          question: "What programming languages do you support?",
          answer: "We provide official SDKs for Python, JavaScript/Node.js, Java, C#, Go, and PHP. We also have community-contributed SDKs for other languages."
        },
        {
          question: "How do I handle API errors?",
          answer: "Our APIs return standard HTTP status codes and detailed error messages in JSON format. Always check the response status and handle errors gracefully in your application."
        }
      ]
    },
    {
      title: "Billing & Support",
      icon: CreditCard,
      faqs: [
        {
          question: "How is billing calculated?",
          answer: "Billing is based on the number of API calls you make. We count successful requests and bill monthly. Unused requests don't roll over to the next month."
        },
        {
          question: "How do I get technical support?",
          answer: "For technical issues, email us at modelsnest3@gmail.com or use the chat widget in your dashboard. Enterprise customers get priority support with dedicated channels."
        },
        {
          question: "Can I get a refund?",
          answer: "We offer a 30-day money-back guarantee for new customers. If you're not satisfied, contact our support team within 30 days of your first payment."
        }
      ]
    }
  ]

  const popularTopics = [
    { title: "API Authentication", description: "Learn how to securely authenticate your API requests", icon: Shield, href: "/docs/authentication" },
    { title: "Rate Limiting", description: "Understand how rate limits work and how to handle them", icon: Gauge, href: "/docs/rate-limits" },
    { title: "Error Handling", description: "Best practices for handling API errors in your applications", icon: AlertTriangle, href: "/docs/errors" },
    { title: "Webhooks", description: "Set up webhooks to receive real-time updates", icon: Webhook, href: "/docs/webhooks" }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Help Center</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Find answers to common questions, learn best practices, and get the support you need to build amazing applications with our APIs.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Popular Topics */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Popular Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTopics.map((topic) => (
            <Card key={topic.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <topic.icon className="w-8 h-8 text-green-500 mb-2" />
                <CardTitle className="text-lg">{topic.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{topic.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-foreground mb-8">Frequently Asked Questions</h2>
        <div className="space-y-8">
          {faqCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <category.icon className="w-6 h-6 text-green-500" />
                  <CardTitle>{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-border/20 pb-4 last:border-b-0">
                      <h4 className="font-medium text-foreground mb-2">{faq.question}</h4>
                      <p className="text-muted-foreground text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-muted/30 border-t border-border/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Still need help?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-green-500 hover:bg-green-600">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline">
                <Video className="w-4 h-4 mr-2" />
                Schedule a Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
