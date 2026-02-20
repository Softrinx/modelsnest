"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  Mic, 
  Video, 
  Brain, 
  Radio,
  Play,
  Pause,
  Settings,
  Zap,
  CheckCircle,
  Clock,
  Star,
  BookOpen
} from "lucide-react"
import Link from "next/link"
import type { DashboardUser } from "@/types/dashboard-user"

interface ModelsMainProps {
  user: DashboardUser
}

interface Model {
  id: string
  name: string
  category: string
  status: 'active' | 'inactive' | 'maintenance'
  performance: number
  lastUsed: string
  description: string
  features: string[]
  isFavorite: boolean
  hasDocumentation: boolean // Added for new logic
}

export function ModelsMain({ user }: ModelsMainProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [models] = useState<Model[]>([
    // Conversational AI Models
    {
      id: '1',
      name: 'GPT-4 Turbo',
      category: 'conversational',
      status: 'active',
      performance: 98,
      lastUsed: '2 minutes ago',
      description: 'Advanced conversational AI with context understanding and natural language processing',
      features: ['Context Memory', 'Multi-turn Dialogue', 'Code Generation', 'Creative Writing'],
      isFavorite: true,
      hasDocumentation: true // Added for new logic
    },
    {
      id: '2',
      name: 'Claude 3 Opus',
      category: 'conversational',
      status: 'active',
      performance: 96,
      lastUsed: '1 hour ago',
      description: 'High-performance conversational model with enhanced reasoning capabilities',
      features: ['Logical Reasoning', 'Document Analysis', 'Creative Tasks', 'Problem Solving'],
      isFavorite: false,
      hasDocumentation: true // Added for new logic
    },
    {
      id: '3',
      name: 'Gemini Pro',
      category: 'conversational',
      status: 'active',
      performance: 94,
      lastUsed: '30 minutes ago',
      description: 'Google\'s multimodal conversational AI with strong performance across tasks',
      features: ['Multimodal Input', 'Real-time Responses', 'Knowledge Integration', 'Safe AI'],
      isFavorite: false,
      hasDocumentation: true // Added for new logic
    },

    // Voice Models
    {
      id: '4',
      name: 'Whisper V3',
      category: 'voice',
      status: 'active',
      performance: 97,
      lastUsed: '5 minutes ago',
      description: 'Advanced speech recognition and transcription model',
      features: ['Multi-language Support', 'Noise Reduction', 'Real-time Processing', 'High Accuracy'],
      isFavorite: true,
      hasDocumentation: true // Added for new logic
    },
    {
      id: '5',
      name: 'ElevenLabs Pro',
      category: 'voice',
      status: 'active',
      performance: 95,
      lastUsed: '2 hours ago',
      description: 'High-quality text-to-speech with natural voice synthesis',
      features: ['Voice Cloning', 'Emotion Control', 'Multiple Languages', 'Custom Voices'],
      isFavorite: false,
      hasDocumentation: true // Added for new logic
    },

    // Video Models
    {
      id: '6',
      name: 'Runway Gen-3',
      category: 'video',
      status: 'active',
      performance: 93,
      lastUsed: '1 day ago',
      description: 'Advanced video generation and editing AI model',
      features: ['Video Generation', 'Style Transfer', 'Motion Control', 'High Resolution'],
      isFavorite: false,
      hasDocumentation: true // Added for new logic
    },
    {
      id: '7',
      name: 'Pika Labs',
      category: 'video',
      status: 'maintenance',
      performance: 89,
      lastUsed: '3 days ago',
      description: 'Creative video generation with artistic style control',
      features: ['Artistic Styles', 'Animation', 'Scene Generation', 'Custom Prompts'],
      isFavorite: true,
      hasDocumentation: true // Added for new logic
    },

    // LLM Models
    {
      id: '8',
      name: 'Llama 3 70B',
      category: 'llm',
      status: 'active',
      performance: 92,
      lastUsed: '4 hours ago',
      description: 'Open-source large language model with strong performance',
      features: ['Open Source', 'Custom Training', 'Efficient Inference', 'Community Support'],
      isFavorite: false,
      hasDocumentation: true // Added for new logic
    },
    {
      id: '9',
      name: 'Mistral Large',
      category: 'llm',
      status: 'active',
      performance: 91,
      lastUsed: '6 hours ago',
      description: 'High-performance language model with multilingual capabilities',
      features: ['Multilingual', 'Code Generation', 'Reasoning', 'Efficient'],
      isFavorite: false,
      hasDocumentation: true // Added for new logic
    },

    // Livestreaming Models
    {
      id: '10',
      name: 'StreamAI Pro',
      category: 'livestreaming',
      status: 'active',
      performance: 96,
      lastUsed: '1 minute ago',
      description: 'Real-time AI processing for live streaming content',
      features: ['Real-time Processing', 'Content Moderation', 'Audience Engagement', 'Analytics'],
      isFavorite: true,
      hasDocumentation: true // Added for new logic
    },
    {
      id: '11',
      name: 'LiveChat AI',
      category: 'livestreaming',
      status: 'inactive',
      performance: 85,
      lastUsed: '1 week ago',
      description: 'AI-powered live chat moderation and engagement',
      features: ['Chat Moderation', 'Spam Detection', 'Sentiment Analysis', 'Auto-Responses'],
      isFavorite: false,
      hasDocumentation: true // Added for new logic
    },
    {
      id: '12',
      name: 'Neural Vision Pro',
      category: 'video',
      status: 'inactive',
      performance: 78,
      lastUsed: '2 weeks ago',
      description: 'Advanced computer vision model for image recognition',
      features: ['Object Detection', 'Image Classification', 'Facial Recognition', 'Scene Understanding'],
      isFavorite: false,
      hasDocumentation: false
    }
  ])

  const categories = [
    { id: 'all', label: 'All Models', icon: Zap },
    { id: 'conversational', label: 'Conversational AI', icon: Bot },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'llm', label: 'LLMs', icon: Brain },
    { id: 'livestreaming', label: 'Livestreaming', icon: Radio }
  ]

  const filteredModels = selectedCategory === 'all' 
    ? models 
    : models.filter(model => model.category === selectedCategory)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#4ADE80] text-white'
      case 'inactive': return 'bg-[#6B7280] text-white'
      case 'maintenance': return 'bg-[#FACC15] text-black'
      default: return 'bg-[#6B7280] text-white'
    }
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 95) return 'text-[#4ADE80]'
    if (performance >= 90) return 'text-[#FACC15]'
    return 'text-[#EF4444]'
  }

  const toggleFavorite = (modelId: string) => {
    // Handle favorite toggle logic
    console.log('Toggle favorite:', modelId)
  }

  const openModelDocs = (model: Model) => {
    // Only allow navigation if documentation exists
    if (!model.hasDocumentation) {
      console.log('No documentation available for this model')
      return
    }
    
    // Navigate to internal model documentation page
    const modelSlug = model.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    window.location.href = `/dashboard/models/docs/${modelSlug}`
  }

  const openModelSettings = (model: Model) => {
    // Handle model settings
    console.log('Open settings for:', model.name)
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0D0D0F] via-[#121214] to-[#1A1B1F]">
             {/* Header */}
       <header className="p-6 border-b border-[#2D2D32] bg-[#1A1B1F]/80 backdrop-blur-sm">
         <div className="max-w-7xl">
           <div className="flex items-center justify-between mb-4">
             <h1 className="text-2xl font-bold text-white">AI Models</h1>
             <Link href="/dashboard/models/docs">
               <Button className="bg-[#8C5CF7] hover:bg-[#7C4CF7] text-white">
                 <BookOpen className="w-4 h-4 mr-2" />
                 View All Documentation
               </Button>
             </Link>
           </div>
           <p className="text-[#A0A0A8]">
             Manage and monitor your active AI models across different categories.
           </p>
         </div>
       </header>

      {/* Models Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Category Filter */}
          <div className="flex items-center justify-between">
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
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setViewMode('grid')}
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="sm"
                className={viewMode === 'grid' ? "bg-[#8C5CF7]" : "border-[#2D2D32] text-[#A0A0A8]"}
              >
                Grid
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                variant={viewMode === 'list' ? "default" : "outline"}
                size="sm"
                className={viewMode === 'list' ? "bg-[#8C5CF7]" : "border-[#2D2D32] text-[#A0A0A8]"}
              >
                List
              </Button>
            </div>
          </div>

          {/* Models Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model) => (
                <Card key={model.id} className="bg-[#1A1B1F] border-[#2D2D32] hover:border-[#3D3D42] transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                          {model.name}
                          {model.isFavorite && <Star className="w-4 h-4 text-[#FACC15] fill-current" />}
                        </CardTitle>
                        <CardDescription className="text-[#A0A0A8] mt-1">
                          {model.description}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(model.id)}
                        className="text-[#A0A0A8] hover:text-[#FACC15] hover:bg-[#2D2D32]"
                      >
                        <Star className={`w-4 h-4 ${model.isFavorite ? 'text-[#FACC15] fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Status and Performance */}
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(model.status)}>
                        {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getPerformanceColor(model.performance)}`}>
                          {model.performance}%
                        </span>
                        <span className="text-[#A0A0A8] text-xs">Performance</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <h4 className="text-white text-sm font-medium">Features</h4>
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

                    {/* Last Used */}
                    <div className="flex items-center justify-between text-xs text-[#A0A0A8]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last used: {model.lastUsed}
                      </div>
                    </div>

                                         {/* Actions */}
                     <div className="flex items-center gap-2 pt-2">
                       <Button 
                         size="sm" 
                         className="flex-1 bg-[#8C5CF7] hover:bg-[#7C4CF7] text-white disabled:bg-[#6B7280] disabled:text-[#A0A0A8] disabled:cursor-not-allowed"
                         onClick={() => openModelDocs(model)}
                         disabled={!model.hasDocumentation}
                       >
                         <Play className="w-3 h-3 mr-1" />
                         {model.hasDocumentation ? 'View API Docs' : 'No Docs Available'}
                       </Button>
                       <Button 
                         size="sm" 
                         variant="outline" 
                         className="border-[#2D2D32] text-[#A0A0A8] hover:bg-[#2D2D32] hover:text-white"
                         onClick={() => openModelSettings(model)}
                       >
                         <Settings className="w-3 h-3" />
                       </Button>
                     </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredModels.map((model) => (
                <Card key={model.id} className="bg-[#1A1B1F] border-[#2D2D32] hover:border-[#3D3D42] transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-white font-medium truncate">{model.name}</span>
                              {model.isFavorite && <Star className="w-4 h-4 text-[#FACC15] fill-current" />}
                            </div>
                            <Badge className={getStatusColor(model.status)}>
                              {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`font-medium ${getPerformanceColor(model.performance)}`}>
                            {model.performance}%
                          </span>
                          <span className="text-[#A0A0A8]">Performance</span>
                          <span className="text-[#A0A0A8]">Last used: {model.lastUsed}</span>
                        </div>
                      </div>
                                             <div className="flex items-center gap-2">
                         <Button 
                           size="sm" 
                           className="bg-[#8C5CF7] hover:bg-[#7C4CF7] text-white disabled:bg-[#6B7280] disabled:text-[#A0A0A8] disabled:cursor-not-allowed"
                           onClick={() => openModelDocs(model)}
                           disabled={!model.hasDocumentation}
                         >
                           <Play className="w-3 h-3 mr-1" />
                           {model.hasDocumentation ? 'View Docs' : 'No Docs'}
                         </Button>
                         <Button 
                           size="sm" 
                           variant="outline" 
                           className="border-[#2D2D32] text-[#A0A0A8] hover:bg-[#2D2D32] hover:text-white"
                           onClick={() => openModelSettings(model)}
                         >
                           <Settings className="w-3 h-3" />
                         </Button>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredModels.length === 0 && (
            <Card className="bg-[#1A1B1F] border-[#2D2D32]">
              <CardContent className="p-12 text-center">
                <Bot className="w-16 h-16 text-[#6B7280] mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">No models found</h3>
                <p className="text-[#A0A0A8]">Try adjusting your category filter or search criteria.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
