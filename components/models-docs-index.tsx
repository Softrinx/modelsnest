"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft,
  Search,
  BookOpen,
  Bot, 
  Mic, 
  Video, 
  Brain, 
  Radio,
  Zap,
  ExternalLink,
  Code,
  Play
} from "lucide-react"
import Link from "next/link"
import type { DashboardUser } from "@/types/dashboard-user"

interface ModelsDocsIndexProps {
  user: DashboardUser
}

interface ModelDoc {
  slug: string
  name: string
  category: string
  description: string
  features: string[]
  pricing: {
    input: string
    output: string
    unit: string
  }
}

export function ModelsDocsIndex({ user }: ModelsDocsIndexProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // All available models documentation
  const allModels: ModelDoc[] = [
    {
      slug: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      category: 'conversational',
      description: 'Advanced conversational AI with context understanding and natural language processing.',
      features: ['Context Memory', 'Multi-turn Dialogue', 'Code Generation', 'Creative Writing'],
      pricing: { input: '0.01', output: '0.03', unit: 'per 1K tokens' }
    },
    {
      slug: 'claude-3-opus',
      name: 'Claude 3 Opus',
      category: 'conversational',
      description: 'High-performance conversational model with enhanced reasoning capabilities.',
      features: ['Logical Reasoning', 'Document Analysis', 'Creative Tasks', 'Problem Solving'],
      pricing: { input: '0.015', output: '0.075', unit: 'per 1K tokens' }
    },
    {
      slug: 'gemini-pro',
      name: 'Gemini Pro',
      category: 'conversational',
      description: 'Google\'s multimodal conversational AI with strong performance across tasks.',
      features: ['Multimodal Input', 'Real-time Responses', 'Knowledge Integration', 'Safe AI'],
      pricing: { input: '0.0025', output: '0.01', unit: 'per 1K tokens' }
    },
    {
      slug: 'whisper-v3',
      name: 'Whisper V3',
      category: 'voice',
      description: 'Advanced speech recognition and transcription model with high accuracy.',
      features: ['Multi-language Support', 'Noise Reduction', 'Real-time Processing', 'High Accuracy'],
      pricing: { input: '0.006', output: '0.000', unit: 'per minute' }
    },
    {
      slug: 'elevenlabs-pro',
      name: 'ElevenLabs Pro',
      category: 'voice',
      description: 'High-quality text-to-speech with natural voice synthesis.',
      features: ['Voice Cloning', 'Emotion Control', 'Multiple Languages', 'Custom Voices'],
      pricing: { input: '0.0005', output: '0.000', unit: 'per character' }
    },
    {
      slug: 'runway-gen-3',
      name: 'Runway Gen-3',
      category: 'video',
      description: 'Advanced video generation and editing AI model.',
      features: ['Video Generation', 'Style Transfer', 'Motion Control', 'High Resolution'],
      pricing: { input: '0.05', output: '0.000', unit: 'per second' }
    },
    {
      slug: 'pika-labs',
      name: 'Pika Labs',
      category: 'video',
      description: 'Creative video generation with artistic style control.',
      features: ['Artistic Styles', 'Animation', 'Scene Generation', 'Custom Prompts'],
      pricing: { input: '0.08', output: '0.000', unit: 'per second' }
    },
    {
      slug: 'llama-3-70b',
      name: 'Llama 3 70B',
      category: 'llm',
      description: 'Open-source large language model with strong performance.',
      features: ['Open Source', 'Custom Training', 'Efficient Inference', 'Community Support'],
      pricing: { input: '0.0008', output: '0.0008', unit: 'per 1K tokens' }
    },
    {
      slug: 'mistral-large',
      name: 'Mistral Large',
      category: 'llm',
      description: 'High-performance language model with multilingual capabilities.',
      features: ['Multilingual', 'Code Generation', 'Reasoning', 'Efficient'],
      pricing: { input: '0.0012', output: '0.0036', unit: 'per 1K tokens' }
    },
    {
      slug: 'streamai-pro',
      name: 'StreamAI Pro',
      category: 'livestreaming',
      description: 'Real-time AI processing for live streaming content.',
      features: ['Real-time Processing', 'Content Moderation', 'Audience Engagement', 'Analytics'],
      pricing: { input: '0.02', output: '0.000', unit: 'per minute' }
    }
  ]

  const categories = [
    { id: 'all', label: 'All Models', icon: Zap, count: allModels.length },
    { id: 'conversational', label: 'Conversational AI', icon: Bot, count: allModels.filter(m => m.category === 'conversational').length },
    { id: 'voice', label: 'Voice', icon: Mic, count: allModels.filter(m => m.category === 'voice').length },
    { id: 'video', label: 'Video', icon: Video, count: allModels.filter(m => m.category === 'video').length },
    { id: 'llm', label: 'LLMs', icon: Brain, count: allModels.filter(m => m.category === 'llm').length },
    { id: 'livestreaming', label: 'Livestreaming', icon: Radio, count: allModels.filter(m => m.category === 'livestreaming').length }
  ]

  const filteredModels = allModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'conversational': return Bot
      case 'voice': return Mic
      case 'video': return Video
      case 'llm': return Brain
      case 'livestreaming': return Radio
      default: return Zap
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'conversational': return 'bg-[#8C5CF7]'
      case 'voice': return 'bg-[#4ADE80]'
      case 'video': return 'bg-[#F59E0B]'
      case 'llm': return 'bg-[#06B6D4]'
      case 'livestreaming': return 'bg-[#EC4899]'
      default: return 'bg-[#6B7280]'
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0D0D0F] via-[#121214] to-[#1A1B1F]">
      {/* Header */}
      <header className="p-6 border-b border-[#2D2D32] bg-[#1A1B1F]/80 backdrop-blur-sm">
        <div className="max-w-7xl">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/models">
              <Button variant="ghost" size="sm" className="text-[#A0A0A8] hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Models
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">API Documentation</h1>
          <p className="text-[#A0A0A8] text-lg max-w-3xl">
            Comprehensive API documentation for all available AI models. Learn how to integrate and use each model effectively.
          </p>
        </div>
      </header>

      {/* Documentation Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A8] w-4 h-4" />
                <Input
                  placeholder="Search models by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#1A1B1F] border-[#2D2D32] text-white placeholder-[#A0A0A8] focus:border-[#8C5CF7] focus:ring-[#8C5CF7]/20"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center gap-2 ${
                    selectedCategory === category.id 
                      ? "bg-[#8C5CF7] text-white" 
                      : "border-[#2D2D32] text-[#A0A0A8] hover:bg-[#2D2D32] hover:text-white"
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                  <Badge variant="secondary" className="ml-1 bg-[#2D2D32] text-[#A0A0A8]">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => {
              const CategoryIcon = getCategoryIcon(model.category)
              return (
                <Card key={model.slug} className="bg-[#1A1B1F] border-[#2D2D32] hover:border-[#3D3D42] transition-all duration-200 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getCategoryColor(model.category)} text-white`}>
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {model.category.charAt(0).toUpperCase() + model.category.slice(1)}
                          </Badge>
                        </div>
                        <CardTitle className="text-white text-lg mb-2">{model.name}</CardTitle>
                        <CardDescription className="text-[#A0A0A8] text-sm">
                          {model.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Features */}
                    <div className="space-y-2">
                      <h4 className="text-white text-sm font-medium">Key Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {model.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-[#3D3D42] text-[#A0A0A8]">
                            {feature}
                          </Badge>
                        ))}
                        {model.features.length > 3 && (
                          <Badge variant="outline" className="text-xs border-[#3D3D42] text-[#A0A0A8]">
                            +{model.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <h4 className="text-white text-sm font-medium">Pricing</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#2D2D32] p-2 rounded">
                          <div className="text-[#4ADE80] font-medium">Input</div>
                          <div className="text-white">${model.pricing.input}</div>
                          <div className="text-[#A0A0A8]">{model.pricing.unit}</div>
                        </div>
                        <div className="bg-[#2D2D32] p-2 rounded">
                          <div className="text-[#8C5CF7] font-medium">Output</div>
                          <div className="text-white">${model.pricing.output}</div>
                          <div className="text-[#A0A0A8]">{model.pricing.unit}</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Link href={`/dashboard/models/docs/${model.slug}`} className="flex-1">
                        <Button 
                          size="sm" 
                          className="w-full bg-[#8C5CF7] hover:bg-[#7C4CF7] text-white"
                        >
                          <BookOpen className="w-3 h-3 mr-1" />
                          View Documentation
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-[#2D2D32] text-[#A0A0A8] hover:bg-[#2D2D32] hover:text-white"
                      >
                        <Code className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredModels.length === 0 && (
            <Card className="bg-[#1A1B1F] border-[#2D2D32]">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-[#6B7280] mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">No models found</h3>
                <p className="text-[#A0A0A8] mb-6">
                  Try adjusting your search query or category filter.
                </p>
                <Button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="bg-[#8C5CF7] hover:bg-[#7C4CF7] text-white"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          <Card className="bg-[#1A1B1F] border-[#2D2D32]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Links
              </CardTitle>
              <CardDescription className="text-[#A0A0A8]">
                Additional resources to help you get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/dashboard/apis">
                  <Card className="bg-[#2D2D32] border-[#3D3D42] hover:border-[#8C5CF7] transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#8C5CF7] rounded-lg flex items-center justify-center">
                          <Code className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">API Keys</h4>
                          <p className="text-[#A0A0A8] text-sm">Manage your API keys</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/api-docs">
                  <Card className="bg-[#2D2D32] border-[#3D3D42] hover:border-[#8C5CF7] transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4ADE80] rounded-lg flex items-center justify-center">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">General API Docs</h4>
                          <p className="text-[#A0A0A8] text-sm">Complete API reference</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/dashboard/billing">
                  <Card className="bg-[#2D2D32] border-[#3D3D42] hover:border-[#8C5CF7] transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F59E0B] rounded-lg flex items-center justify-center">
                          <Play className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">Usage & Billing</h4>
                          <p className="text-[#A0A0A8] text-sm">Monitor your usage</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
