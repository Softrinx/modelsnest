import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Users, Calendar, TrendingUp, Youtube, Instagram, MessageCircle, Mail } from "lucide-react"

// Force dynamic rendering to prevent prerendering issues with Client Components
export const dynamic = 'force-dynamic'

export default function CommunityPage() {
  const communityStats = [
    { label: "Active Members", value: "2,847", icon: Users },
    { label: "Discussions", value: "15,392", icon: MessageSquare },
    { label: "Solutions", value: "8,945", icon: TrendingUp },
    { label: "Events", value: "24", icon: Calendar }
  ]

  const recentDiscussions = [
    {
      title: "Best practices for handling rate limits in production",
      author: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      replies: 12,
      views: 234,
      category: "API Integration",
      time: "2 hours ago"
    },
    {
      title: "How to implement webhook retry logic?",
      author: "Mike Rodriguez",
      avatar: "/avatars/mike.jpg",
      replies: 8,
      views: 156,
      category: "Webhooks",
      time: "5 hours ago"
    },
    {
      title: "SDK performance comparison: Python vs Node.js",
      author: "Alex Thompson",
      avatar: "/avatars/alex.jpg",
      replies: 15,
      views: 421,
      category: "SDKs",
      time: "1 day ago"
    },
    {
      title: "Authentication best practices for mobile apps",
      author: "Emma Wilson",
      avatar: "/avatars/emma.jpg",
      replies: 6,
      views: 189,
      category: "Security",
      time: "2 days ago"
    }
  ]

  const communityCategories = [
    {
      name: "Getting Started",
      description: "New to Modelsnest? Start here",
      memberCount: 1234,
      discussionCount: 567,
      color: "bg-blue-500"
    },
    {
      name: "API Integration",
      description: "Share integration tips and tricks",
      memberCount: 2156,
      discussionCount: 1234,
      color: "bg-green-500"
    },
    {
      name: "SDKs & Libraries",
      description: "Discuss SDK usage and development",
      memberCount: 987,
      discussionCount: 456,
      color: "bg-purple-500"
    },
    {
      name: "Troubleshooting",
      description: "Get help with common issues",
      memberCount: 1567,
      discussionCount: 789,
      color: "bg-orange-500"
    },
    {
      name: "Showcase",
      description: "Share your projects and implementations",
      memberCount: 654,
      discussionCount: 234,
      color: "bg-pink-500"
    },
    {
      name: "Feature Requests",
      description: "Suggest new features and improvements",
      memberCount: 432,
      discussionCount: 123,
      color: "bg-indigo-500"
    }
  ]

  const upcomingEvents = [
    {
      title: "API Best Practices Workshop",
      date: "March 15, 2024",
      time: "2:00 PM EST",
      attendees: 127,
      type: "Virtual Workshop"
    },
    {
      title: "Community Q&A Session",
      date: "March 22, 2024",
      time: "1:00 PM EST",
      attendees: 89,
      type: "Live Q&A"
    },
    {
      title: "SDK Deep Dive: Python",
      date: "March 29, 2024",
      time: "3:00 PM EST",
      attendees: 156,
      type: "Technical Session"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Community</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with fellow developers, share knowledge, and get help from the Modelsnest community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-green-500 hover:bg-green-600">
                <MessageSquare className="w-4 h-4 mr-2" />
                Join Discussion
              </Button>
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                View Members
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {communityStats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Categories */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Community Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityCategories.map((category) => (
            <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{category.memberCount.toLocaleString()} members</span>
                  <span>{category.discussionCount.toLocaleString()} discussions</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Discussions */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Recent Discussions</h2>
          <Button variant="outline">View All</Button>
        </div>
        <div className="space-y-4">
          {recentDiscussions.map((discussion) => (
            <Card key={discussion.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={discussion.avatar} />
                    <AvatarFallback>{discussion.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-foreground">{discussion.title}</h3>
                      <Badge variant="secondary">{discussion.category}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>by {discussion.author}</span>
                      <span>{discussion.time}</span>
                      <span>{discussion.replies} replies</span>
                      <span>{discussion.views} views</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <Card key={event.title}>
              <CardHeader>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <CardDescription>{event.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{event.attendees} attending</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Register
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-muted/30 border-t border-border/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Connect With Us</h2>
            <p className="text-muted-foreground mb-6">
              Follow us on social media and join the conversation
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <a href="mailto:modelsnest3@gmail.com" aria-label="Email">
                  <Mail className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="https://www.youtube.com/channel/UCMR4IQM1ZQ-tbGUdElOgK9g" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <Youtube className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="https://www.instagram.com/modelsnest.ai/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="https://discord.gg/sEuW4V8K" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                  <MessageCircle className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
