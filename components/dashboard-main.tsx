import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Star, Users, ExternalLink } from "lucide-react"
import type { DashboardUser } from "@/types/dashboard-user"

interface DashboardMainProps {
  user: DashboardUser
}

export function DashboardMain({ user }: DashboardMainProps) {
  const categories = [
    "Social media",
    "AI",
    "Agents",
    "Lead generation",
    "E-commerce",
    "SEO tools",
    "Jobs",
    "MCP servers",
    "News",
    "Real estate",
    "Developer tools",
    "Travel",
    "Videos",
    "Automation",
  ]

  const subCategories = ["Integrations", "Open source", "Other"]

  const apiServices = [
    {
      title: "Website Content Crawler",
      description:
        "Crawl websites and extract text content to feed AI models, LLM applications, vector databases, or RAG pipelines. The Actor supports rich formatting using...",
      provider: "Apify",
      icon: "🌐",
      users: "69K",
      rating: 4.4,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Apollo Scraper - Scrape upto 50K Leads",
      description: "Scrape up to 50,000 leads per search URL.",
      provider: "Code Pioneer",
      icon: "⚡",
      users: "58K",
      rating: 4.1,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "TikTok Scraper",
      description:
        "Extract data from TikTok videos, hashtags, and users. Use URLs or search terms to scrape TikTok profiles, hashtags, posts, URLs, shares, followers, hearts...",
      provider: "Clockworks",
      icon: "🎵",
      users: "60K",
      rating: 4.5,
      color: "from-pink-500 to-purple-500",
    },
    {
      title: "Google Maps Scraper",
      description:
        "Extract data from thousands of Google Maps locations and businesses, including reviews, reviewer details, images, contact info, opening hours, location, prices...",
      provider: "Compass",
      icon: "🗺️",
      users: "148K",
      rating: 4.1,
      color: "from-blue-500 to-green-500",
    },
    {
      title: "Instagram Scraper",
      description:
        "Scrape and download Instagram posts, profiles, places, hashtags, photos, and comments. Get data from Instagram using one or more Instagram URLs or...",
      provider: "Apify",
      icon: "📸",
      users: "123K",
      rating: 4.1,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Skip Trace",
      description:
        "Locate hard-to-find individuals with our powerful skip trace/tracking API. Truefinderpeoplesearch, Lead Finder, Truthfinder, Spokeo,...",
      provider: "ONE API",
      icon: "🔍",
      users: "712",
      rating: 2.0,
      color: "from-indigo-500 to-blue-500",
    },
  ]

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="p-6 border-b border-white/10">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-3xl font-bold text-white">API Store</h1>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search for APIs"
            className="pl-12 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 h-12"
          />
        </div>
      </header>

      {/* Categories */}
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          {subCategories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">All APIs</h2>
            <p className="text-gray-400">
              Explore 6,000+ pre-built APIs for your web scraping and automation projects.
            </p>
          </div>
          <Button variant="ghost" className="text-primary hover:text-primary/80">
            View all →
          </Button>
        </div>

        {/* API Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {apiServices.map((service, index) => (
            <Card
              key={service.title}
              className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center text-2xl`}
                  >
                    {service.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-white text-lg leading-tight mb-1">{service.title}</CardTitle>
                    <div className="text-sm text-gray-400">{service.provider}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {service.description}
                </CardDescription>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {service.users}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {service.rating}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-700">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Do you need custom web scrapers?</h3>
            <p className="text-gray-300 mb-6">
              Our expert consultants and developers guarantee data quality and availability. Leave the management of
              your web data pipeline to us, and focus on your company's business outcomes.
            </p>
            <div className="flex gap-4">
              <Button className="bg-primary hover:bg-primary/90">Learn more</Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white bg-transparent">
                Contact sales
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
