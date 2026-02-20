import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, BookOpen, Play, Code, Database, Zap, Shield, Globe, AlertTriangle, Gauge, Star } from "lucide-react"

// Force dynamic rendering to prevent prerendering issues with Client Components
export const dynamic = 'force-dynamic'

export default function TutorialsPage() {
  const tutorialCategories = [
    {
      name: "Getting Started",
      description: "Learn the basics of Outsoor APIs",
      icon: BookOpen,
      color: "bg-blue-500",
      tutorialCount: 8
    },
    {
      name: "API Integration",
      description: "Step-by-step integration guides",
      icon: Code,
      color: "bg-green-500",
      tutorialCount: 12
    },
    {
      name: "Authentication",
      description: "Security and authentication tutorials",
      icon: Shield,
      color: "bg-red-500",
      tutorialCount: 6
    },
    {
      name: "Webhooks",
      description: "Real-time data with webhooks",
      icon: Zap,
      color: "bg-yellow-500",
      tutorialCount: 4
    },
    {
      name: "SDKs",
      description: "Language-specific SDK tutorials",
      icon: Database,
      color: "bg-purple-500",
      tutorialCount: 10
    },
    {
      name: "Advanced Features",
      description: "Advanced API usage patterns",
      icon: Globe,
      color: "bg-indigo-500",
      tutorialCount: 7
    }
  ]

  const featuredTutorials = [
    {
      title: "Build Your First AI-Powered Chat Application",
      description: "Learn how to create a chat application using our AI APIs in just 30 minutes",
      duration: "30 min",
      difficulty: "Beginner",
      category: "Getting Started",
      progress: 0,
      thumbnail: "/tutorials/chat-app.jpg",
      author: "Outsoor Team",
      rating: 4.8,
      students: 1247
    },
    {
      title: "Implementing Secure API Authentication",
      description: "Master API key management and secure authentication patterns for production apps",
      duration: "45 min",
      difficulty: "Intermediate",
      category: "Authentication",
      progress: 0,
      thumbnail: "/tutorials/auth.jpg",
      author: "Security Team",
      rating: 4.9,
      students: 892
    },
    {
      title: "Real-time Data with Webhooks",
      description: "Set up webhooks to receive instant notifications when data changes",
      duration: "25 min",
      difficulty: "Intermediate",
      category: "Webhooks",
      progress: 0,
      thumbnail: "/tutorials/webhooks.jpg",
      author: "Engineering Team",
      rating: 4.7,
      students: 654
    },
    {
      title: "Python SDK Deep Dive",
      description: "Advanced Python SDK usage with best practices and performance optimization",
      duration: "60 min",
      difficulty: "Advanced",
      category: "SDKs",
      progress: 0,
      thumbnail: "/tutorials/python.jpg",
      author: "Python Team",
      rating: 4.6,
      students: 456
    }
  ]

  const quickStartGuides = [
    {
      title: "5-Minute Setup",
      description: "Get up and running with your first API call",
      icon: Play,
      time: "5 min",
      href: "/tutorials/quick-start"
    },
    {
      title: "API Key Management",
      description: "Create and manage your API keys securely",
      icon: Shield,
      time: "10 min",
      href: "/tutorials/api-keys"
    },
    {
      title: "Error Handling",
      description: "Learn how to handle API errors gracefully",
      icon: AlertTriangle,
      time: "15 min",
      href: "/tutorials/error-handling"
    },
    {
      title: "Rate Limiting",
      description: "Understand and work with API rate limits",
      icon: Gauge,
      time: "12 min",
      href: "/tutorials/rate-limits"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Tutorials</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Master Outsoor APIs with our comprehensive tutorials, from beginner basics to advanced implementation patterns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-green-500 hover:bg-green-600">
                <Play className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
              <Button variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                View All Tutorials
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Guides */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Start Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStartGuides.map((guide) => (
            <Card key={guide.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <guide.icon className="w-8 h-8 text-green-500 mb-2" />
                <CardTitle className="text-lg">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm mb-3">{guide.description}</CardDescription>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{guide.time}</Badge>
                  <Button variant="ghost" size="sm">Start</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Tutorials */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Featured Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredTutorials.map((tutorial) => (
            <Card key={tutorial.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="secondary">{tutorial.category}</Badge>
                  <Badge variant={tutorial.difficulty === 'Beginner' ? 'default' : tutorial.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                    {tutorial.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{tutorial.title}</CardTitle>
                <CardDescription className="text-base">{tutorial.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{tutorial.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{tutorial.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{tutorial.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">by {tutorial.author}</span>
                    <Button>Start Tutorial</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tutorial Categories */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorialCategories.map((category) => (
            <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <category.icon className="w-6 h-6 text-green-500" />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{category.tutorialCount} tutorials</span>
                  <Button variant="outline" size="sm">Explore</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Path */}
      <div className="bg-muted/30 border-t border-border/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Recommended Learning Path</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Follow our structured learning path to master Outsoor APIs step by step
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-green-500 hover:bg-green-600">
                <BookOpen className="w-4 h-4 mr-2" />
                View Learning Path
              </Button>
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Join Study Group
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
