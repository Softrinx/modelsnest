"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Code,
  Play,
  Copy,
  Check,
  BookOpen,
  Zap,
  Settings,
  TestTube,
  Download
} from "lucide-react"
import Link from "next/link"
import type { DashboardUser } from "@/types/dashboard-user"

interface ModelDocsPageProps {
  user: DashboardUser
  modelSlug: string
}

interface ModelDoc {
  slug: string
  name: string
  category: string
  description: string
  features: string[]
  endpoints: {
    name: string
    method: string
    path: string
    description: string
    parameters: {
      name: string
      type: string
      required: boolean
      description: string
      example: string
    }[]
    response: {
      type: string
      example: string
      description: string
    }
  }[]
  examples: {
    title: string
    description: string
    code: string
    language: string
  }[]
  pricing: {
    input: string
    output: string
    unit: string
  }
}

export function ModelDocsPage({ user, modelSlug }: ModelDocsPageProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Mock model documentation data
  const modelDocs: Record<string, ModelDoc> = {
    'gpt-4-turbo': {
      slug: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      category: 'Conversational AI',
      description: 'Advanced conversational AI with context understanding and natural language processing. Perfect for complex reasoning, creative writing, and code generation tasks.',
      features: ['Context Memory', 'Multi-turn Dialogue', 'Code Generation', 'Creative Writing', 'Reasoning', 'Multimodal Input'],
      endpoints: [
        {
          name: 'Chat Completion',
          method: 'POST',
          path: '/v1/chat/completions',
          description: 'Generate chat completions with GPT-4 Turbo',
          parameters: [
            {
              name: 'model',
              type: 'string',
              required: true,
              description: 'The model to use for completion',
              example: '"gpt-4-turbo"'
            },
            {
              name: 'messages',
              type: 'array',
              required: true,
              description: 'Array of message objects',
              example: '[{"role": "user", "content": "Hello!"}]'
            },
            {
              name: 'max_tokens',
              type: 'integer',
              required: false,
              description: 'Maximum number of tokens to generate',
              example: '1000'
            },
            {
              name: 'temperature',
              type: 'float',
              required: false,
              description: 'Controls randomness (0.0 to 2.0)',
              example: '0.7'
            }
          ],
          response: {
            type: 'object',
            description: 'Chat completion response with generated text',
            example: `{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Hello! How can I help you today?"
    }
  }]
}`
          }
        }
      ],
      examples: [
        {
          title: 'Basic Chat',
          description: 'Simple conversation with GPT-4 Turbo',
          language: 'javascript',
          code: `const response = await fetch('https://api.outsoor.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'user', content: 'Explain quantum computing in simple terms' }
    ],
    max_tokens: 500,
    temperature: 0.7
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);`
        },
        {
          title: 'Code Generation',
          description: 'Generate Python code for data analysis',
          language: 'python',
          code: `import requests

url = "https://api.outsoor.com/v1/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "model": "gpt-4-turbo",
    "messages": [
        {"role": "user", "content": "Write a Python function to calculate fibonacci numbers"}
    ],
    "max_tokens": 300,
    "temperature": 0.3
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['choices'][0]['message']['content'])`
        }
      ],
      pricing: {
        input: '0.01',
        output: '0.03',
        unit: 'per 1K tokens'
      }
    },
    'claude-3-opus': {
      slug: 'claude-3-opus',
      name: 'Claude 3 Opus',
      category: 'Conversational AI',
      description: 'High-performance conversational model with enhanced reasoning capabilities and document analysis.',
      features: ['Logical Reasoning', 'Document Analysis', 'Creative Tasks', 'Problem Solving', 'Context Understanding'],
      endpoints: [
        {
          name: 'Chat Completion',
          method: 'POST',
          path: '/v1/chat/completions',
          description: 'Generate chat completions with Claude 3 Opus',
          parameters: [
            {
              name: 'model',
              type: 'string',
              required: true,
              description: 'The model to use for completion',
              example: '"claude-3-opus"'
            },
            {
              name: 'messages',
              type: 'array',
              required: true,
              description: 'Array of message objects',
              example: '[{"role": "user", "content": "Hello!"}]'
            },
            {
              name: 'max_tokens',
              type: 'integer',
              required: false,
              description: 'Maximum number of tokens to generate',
              example: '1000'
            }
          ],
          response: {
            type: 'object',
            description: 'Chat completion response with generated text',
            example: `{
  "id": "claude-123",
  "object": "chat.completion",
  "created": 1677652288,
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Hello! I'm Claude 3 Opus. How can I assist you?"
    }
  }]
}`
          }
        }
      ],
      examples: [
        {
          title: 'Document Analysis',
          description: 'Analyze and summarize documents',
          language: 'javascript',
          code: `const response = await fetch('https://api.outsoor.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'claude-3-opus',
    messages: [
      { role: 'user', content: 'Please analyze this document and provide a summary' }
    ],
    max_tokens: 800
  })
});`
        }
      ],
      pricing: {
        input: '0.015',
        output: '0.075',
        unit: 'per 1K tokens'
      }
    },
    'gemini-pro': {
      slug: 'gemini-pro',
      name: 'Gemini Pro',
      category: 'Conversational AI',
      description: 'Google\'s multimodal conversational AI with strong performance across tasks and real-time responses.',
      features: ['Multimodal Input', 'Real-time Responses', 'Knowledge Integration', 'Safe AI', 'Code Generation'],
      endpoints: [
        {
          name: 'Chat Completion',
          method: 'POST',
          path: '/v1/chat/completions',
          description: 'Generate chat completions with Gemini Pro',
          parameters: [
            {
              name: 'model',
              type: 'string',
              required: true,
              description: 'Model to use for completion',
              example: '"gemini-pro"'
            },
            {
              name: 'contents',
              type: 'array',
              required: true,
              description: 'Array of content parts',
              example: '[{"parts": [{"text": "Hello!"}]}]'
            }
          ],
          response: {
            type: 'object',
            description: 'Chat completion response with generated text',
            example: `{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "Hello! I'm Gemini Pro. How can I help you today?"
      }]
    }
  }]
}`
          }
        }
      ],
      examples: [
        {
          title: 'Multimodal Chat',
          description: 'Chat with text and image input',
          language: 'python',
          code: `import requests

url = "https://api.outsoor.com/v1/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "model": "gemini-pro",
    "contents": [
        {
            "parts": [
                {"text": "What's in this image?"},
                {"image": {"data": "base64_encoded_image"}}
            ]
        }
    ]
}

response = requests.post(url, headers=headers, json=data)`
        }
      ],
      pricing: {
        input: '0.0025',
        output: '0.01',
        unit: 'per 1K tokens'
      }
    },
    'whisper-v3': {
      slug: 'whisper-v3',
      name: 'Whisper V3',
      category: 'Voice',
      description: 'Advanced speech recognition and transcription model with high accuracy and multi-language support.',
      features: ['Multi-language Support', 'Noise Reduction', 'Real-time Processing', 'High Accuracy', 'Timestamp Support'],
      endpoints: [
        {
          name: 'Audio Transcription',
          method: 'POST',
          path: '/v1/audio/transcriptions',
          description: 'Transcribe audio files to text',
          parameters: [
            {
              name: 'file',
              type: 'file',
              required: true,
              description: 'Audio file to transcribe',
              example: 'audio.mp3'
            },
            {
              name: 'model',
              type: 'string',
              required: true,
              description: 'The model to use',
              example: '"whisper-v3"'
            },
            {
              name: 'language',
              type: 'string',
              required: false,
              description: 'Language of the audio',
              example: '"en"'
            }
          ],
          response: {
            type: 'object',
            description: 'Transcription response with text and metadata',
            example: `{
  "text": "Hello, this is a transcription of the audio file.",
  "language": "en",
  "duration": 5.2
}`
          }
        }
      ],
      examples: [
        {
          title: 'Audio Transcription',
          description: 'Transcribe an audio file to text',
          language: 'javascript',
          code: `const formData = new FormData();
formData.append('file', audioFile);
formData.append('model', 'whisper-v3');
formData.append('language', 'en');

const response = await fetch('https://api.outsoor.com/v1/audio/transcriptions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: formData
});

const data = await response.json();
console.log('Transcription:', data.text);`
        }
      ],
      pricing: {
        input: '0.006',
        output: '0.000',
        unit: 'per minute'
      }
    },
    'elevenlabs-pro': {
      slug: 'elevenlabs-pro',
      name: 'ElevenLabs Pro',
      category: 'Voice',
      description: 'High-quality text-to-speech with natural voice synthesis and emotion control.',
      features: ['Voice Cloning', 'Emotion Control', 'Multiple Languages', 'Custom Voices', 'High Quality'],
      endpoints: [
        {
          name: 'Text to Speech',
          method: 'POST',
          path: '/v1/text-to-speech',
          description: 'Convert text to natural-sounding speech',
          parameters: [
            {
              name: 'text',
              type: 'string',
              required: true,
              description: 'Text to convert to speech',
              example: '"Hello, world!"'
            },
            {
              name: 'voice_id',
              type: 'string',
              required: true,
              description: 'Voice ID to use',
              example: '"voice_id_123"'
            },
            {
              name: 'model_id',
              type: 'string',
              required: false,
              description: 'Model to use for generation',
              example: '"eleven_multilingual_v2"'
            }
          ],
          response: {
            type: 'audio',
            description: 'Audio file in the requested format',
            example: 'Binary audio data (MP3, WAV, etc.)'
          }
        }
      ],
      examples: [
        {
          title: 'Text to Speech',
          description: 'Convert text to speech with custom voice',
          language: 'python',
          code: `import requests

url = "https://api.outsoor.com/v1/text-to-speech"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "text": "Hello, this is a test of text to speech conversion.",
    "voice_id": "voice_id_123",
    "model_id": "eleven_multilingual_v2"
}

response = requests.post(url, headers=headers, json=data)

# Save the audio file
with open("output.mp3", "wb") as f:
    f.write(response.content)`
        }
      ],
      pricing: {
        input: '0.0005',
        output: '0.000',
        unit: 'per character'
      }
    },
    'runway-gen-3': {
      slug: 'runway-gen-3',
      name: 'Runway Gen-3',
      category: 'Video',
      description: 'Advanced video generation and editing AI model with style transfer and motion control.',
      features: ['Video Generation', 'Style Transfer', 'Motion Control', 'High Resolution', 'Creative Control'],
      endpoints: [
        {
          name: 'Video Generation',
          method: 'POST',
          path: '/v1/video/generations',
          description: 'Generate videos from text prompts',
          parameters: [
            {
              name: 'prompt',
              type: 'string',
              required: true,
              description: 'Text description of the video',
              example: '"A cat walking in a garden"'
            },
            {
              name: 'model',
              type: 'string',
              required: true,
              description: 'Model to use for generation',
              example: '"runway-gen-3"'
            },
            {
              name: 'duration',
              type: 'integer',
              required: false,
              description: 'Duration in seconds',
              example: '10'
            }
          ],
          response: {
            type: 'object',
            description: 'Video generation response with video URL',
            example: `{
  "id": "video_123",
  "status": "completed",
  "video_url": "https://example.com/video.mp4",
  "duration": 10
}`
          }
        }
      ],
      examples: [
        {
          title: 'Video Generation',
          description: 'Generate a video from text prompt',
          language: 'javascript',
          code: `const response = await fetch('https://api.outsoor.com/v1/video/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'A beautiful sunset over the ocean',
    model: 'runway-gen-3',
    duration: 15
  })
});

const data = await response.json();
console.log('Video URL:', data.video_url);`
        }
      ],
      pricing: {
        input: '0.05',
        output: '0.000',
        unit: 'per second'
      }
    },
    'pika-labs': {
      slug: 'pika-labs',
      name: 'Pika Labs',
      category: 'Video',
      description: 'Creative video generation with artistic style control and animation capabilities.',
      features: ['Artistic Styles', 'Animation', 'Scene Generation', 'Custom Prompts', 'Style Transfer'],
      endpoints: [
        {
          name: 'Creative Video',
          method: 'POST',
          path: '/v1/video/creative',
          description: 'Generate creative videos with artistic styles',
          parameters: [
            {
              name: 'prompt',
              type: 'string',
              required: true,
              description: 'Creative description of the video',
              example: '"A magical forest with floating lights"'
            },
            {
              name: 'style',
              type: 'string',
              required: false,
              description: 'Artistic style to apply',
              example: '"watercolor"'
            }
          ],
          response: {
            type: 'object',
            description: 'Creative video response with video URL',
            example: `{
  "id": "creative_123",
  "video_url": "https://example.com/creative_video.mp4",
  "style": "watercolor"
}`
          }
        }
      ],
      examples: [
        {
          title: 'Creative Video',
          description: 'Generate artistic video with style',
          language: 'python',
          code: `import requests

url = "https://api.outsoor.com/v1/video/creative"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "prompt": "A dreamy landscape with floating clouds",
    "style": "impressionist"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print("Video URL:", result['video_url'])`
        }
      ],
      pricing: {
        input: '0.08',
        output: '0.000',
        unit: 'per second'
      }
    },
    'llama-3-70b': {
      slug: 'llama-3-70b',
      name: 'Llama 3 70B',
      category: 'LLMs',
      description: 'Open-source large language model with strong performance and custom training capabilities.',
      features: ['Open Source', 'Custom Training', 'Efficient Inference', 'Community Support', 'High Performance'],
      endpoints: [
        {
          name: 'Text Generation',
          method: 'POST',
          path: '/v1/completions',
          description: 'Generate text completions with Llama 3 70B',
          parameters: [
            {
              name: 'model',
              type: 'string',
              required: true,
              description: 'Model to use',
              example: '"llama-3-70b"'
            },
            {
              name: 'prompt',
              type: 'string',
              required: true,
              description: 'Text prompt to complete',
              example: '"Once upon a time"'
            },
            {
              name: 'max_tokens',
              type: 'integer',
              required: false,
              description: 'Maximum tokens to generate',
              example: '100'
            }
          ],
          response: {
            type: 'object',
            description: 'Text completion response',
            example: `{
  "id": "llama_123",
  "choices": [{
    "text": "Once upon a time, there was a magical kingdom..."
  }]
}`
          }
        }
      ],
      examples: [
        {
          title: 'Text Generation',
          description: 'Generate text with Llama 3 70B',
          language: 'javascript',
          code: `const response = await fetch('https://api.outsoor.com/v1/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'llama-3-70b',
    prompt: 'Write a short story about a robot',
    max_tokens: 200
  })
});

const data = await response.json();
console.log(data.choices[0].text);`
        }
      ],
      pricing: {
        input: '0.0008',
        output: '0.0008',
        unit: 'per 1K tokens'
      }
    },
    'mistral-large': {
      slug: 'mistral-large',
      name: 'Mistral Large',
      category: 'LLMs',
      description: 'High-performance language model with multilingual capabilities and efficient reasoning.',
      features: ['Multilingual', 'Code Generation', 'Reasoning', 'Efficient', 'High Quality'],
      endpoints: [
        {
          name: 'Chat Completion',
          method: 'POST',
          path: '/v1/chat/completions',
          description: 'Generate chat completions with Mistral Large',
          parameters: [
            {
              name: 'model',
              type: 'string',
              required: true,
              description: 'Model to use',
              example: '"mistral-large"'
            },
            {
              name: 'messages',
              type: 'array',
              required: true,
              description: 'Array of message objects',
              example: '[{"role": "user", "content": "Hello!"}]'
            }
          ],
          response: {
            type: 'object',
            description: 'Chat completion response',
            example: `{
  "id": "mistral_123",
  "choices": [{
    "message": {
      "content": "Hello! I'm Mistral Large. How can I help?"
    }
  }]
}`
          }
        }
      ],
      examples: [
        {
          title: 'Multilingual Chat',
          description: 'Chat in multiple languages',
          language: 'python',
          code: `import requests

url = "https://api.outsoor.com/v1/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "model": "mistral-large",
    "messages": [
        {"role": "user", "content": "Bonjour! Comment allez-vous?"}
    ]
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['choices'][0]['message']['content'])`
        }
      ],
      pricing: {
        input: '0.0012',
        output: '0.0036',
        unit: 'per 1K tokens'
      }
    },
    'streamai-pro': {
      slug: 'streamai-pro',
      name: 'StreamAI Pro',
      category: 'Livestreaming',
      description: 'Real-time AI processing for live streaming content with content moderation and analytics.',
      features: ['Real-time Processing', 'Content Moderation', 'Audience Engagement', 'Analytics', 'Live Chat'],
      endpoints: [
        {
          name: 'Live Stream Processing',
          method: 'POST',
          path: '/v1/stream/process',
          description: 'Process live stream content in real-time',
          parameters: [
            {
              name: 'stream_id',
              type: 'string',
              required: true,
              description: 'Live stream identifier',
              example: '"stream_123"'
            },
            {
              name: 'content_type',
              type: 'string',
              required: true,
              description: 'Type of content to process',
              example: '"video"'
            }
          ],
          response: {
            type: 'object',
            description: 'Stream processing response',
            example: `{
  "stream_id": "stream_123",
  "status": "processing",
  "moderation_score": 0.1,
  "engagement_metrics": {
    "viewers": 1500,
    "chat_messages": 45
  }
}`
          }
        }
      ],
      examples: [
        {
          title: 'Live Stream Processing',
          description: 'Process live stream content',
          language: 'javascript',
          code: `const response = await fetch('https://api.outsoor.com/v1/stream/process', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    stream_id: 'stream_123',
    content_type: 'video'
  })
});

const data = await response.json();
console.log('Moderation Score:', data.moderation_score);`
        }
      ],
      pricing: {
        input: '0.02',
        output: '0.000',
        unit: 'per minute'
      }
    },
    'livechat-ai': {
      slug: 'livechat-ai',
      name: 'LiveChat AI',
      category: 'Livestreaming',
      description: 'AI-powered live chat moderation and engagement with spam detection and sentiment analysis.',
      features: ['Chat Moderation', 'Spam Detection', 'Sentiment Analysis', 'Auto-Responses', 'Real-time'],
      endpoints: [
        {
          name: 'Chat Moderation',
          method: 'POST',
          path: '/v1/chat/moderate',
          description: 'Moderate live chat messages',
          parameters: [
            {
              name: 'message',
              type: 'string',
              required: true,
              description: 'Chat message to moderate',
              example: '"Hello everyone!"'
            },
            {
              name: 'user_id',
              type: 'string',
              required: true,
              description: 'User ID of message sender',
              example: '"user_123"'
            }
          ],
          response: {
            type: 'object',
            description: 'Moderation response',
            example: `{
  "message_id": "msg_123",
  "is_approved": true,
  "moderation_score": 0.05,
  "action": "allow"
}`
          }
        }
      ],
      examples: [
        {
          title: 'Chat Moderation',
          description: 'Moderate live chat messages',
          language: 'python',
          code: `import requests

url = "https://api.outsoor.com/v1/chat/moderate"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "message": "Hello everyone! Great stream!",
    "user_id": "user_123"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()

if result['is_approved']:
    print("Message approved")
else:
    print("Message flagged for moderation")`
        }
      ],
      pricing: {
        input: '0.001',
        output: '0.000',
        unit: 'per message'
      }
    }
  }

  const model = modelDocs[modelSlug]

  if (!model) {
    return (
      <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0D0D0F] via-[#121214] to-[#1A1B1F]">
        <div className="flex-1 p-6 flex items-center justify-center">
          <Card className="bg-[#1A1B1F] border-[#2D2D32] max-w-md">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold text-white mb-4">Model Not Found</h2>
              <p className="text-[#A0A0A8] mb-6">The requested model documentation could not be found.</p>
              <Link href="/dashboard/models">
                <Button className="bg-[#8C5CF7] hover:bg-[#7C4CF7] text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Models
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const copyToClipboard = async (code: string, exampleTitle: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(exampleTitle)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
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
            <Badge className="bg-[#8C5CF7] text-white">{model.category}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{model.name} API Documentation</h1>
          <p className="text-[#A0A0A8] text-lg max-w-3xl">
            {model.description}
          </p>
        </div>
      </header>

      {/* Documentation Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Quick Start */}
          <Card className="bg-[#1A1B1F] border-[#2D2D32]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Start
              </CardTitle>
              <CardDescription className="text-[#A0A0A8]">
                Get started with {model.name} in minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#2D2D32] rounded-lg">
                  <div className="text-[#8C5CF7] text-2xl font-bold mb-2">1</div>
                  <h4 className="text-white font-medium mb-2">Get API Key</h4>
                  <p className="text-[#A0A0A8] text-sm">Generate your API key from the dashboard</p>
                </div>
                <div className="p-4 bg-[#2D2D32] rounded-lg">
                  <div className="text-[#8C5CF7] text-2xl font-bold mb-2">2</div>
                  <h4 className="text-white font-medium mb-2">Make Request</h4>
                  <p className="text-[#A0A0A8] text-sm">Send requests to the API endpoints</p>
                </div>
                <div className="p-4 bg-[#2D2D32] rounded-lg">
                  <div className="text-[#8C5CF7] text-2xl font-bold mb-2">3</div>
                  <h4 className="text-white font-medium mb-2">Get Response</h4>
                  <p className="text-[#A0A0A8] text-sm">Receive AI-generated content</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Reference */}
          <Card className="bg-[#1A1B1F] border-[#2D2D32]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Code className="w-5 h-5" />
                API Reference
              </CardTitle>
              <CardDescription className="text-[#A0A0A8]">
                Complete API endpoints and parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {model.endpoints.map((endpoint, index) => (
                <div key={index} className="border border-[#2D2D32] rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className={`${
                      endpoint.method === 'GET' ? 'bg-[#4ADE80]' : 
                      endpoint.method === 'POST' ? 'bg-[#8C5CF7]' : 
                      endpoint.method === 'PUT' ? 'bg-[#FACC15]' : 'bg-[#EF4444]'
                    } text-white`}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-white font-mono bg-[#2D2D32] px-3 py-1 rounded">
                      {endpoint.path}
                    </code>
                  </div>
                  
                  <p className="text-[#A0A0A8] mb-4">{endpoint.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-3">Parameters</h4>
                      <div className="space-y-2">
                        {endpoint.parameters.map((param, paramIndex) => (
                          <div key={paramIndex} className="flex items-start gap-4 p-3 bg-[#2D2D32] rounded">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <code className="text-[#8C5CF7] font-mono">{param.name}</code>
                                <Badge variant="outline" className="text-xs border-[#3D3D42] text-[#A0A0A8]">
                                  {param.type}
                                </Badge>
                                {param.required && (
                                  <Badge className="bg-[#EF4444] text-white text-xs">Required</Badge>
                                )}
                              </div>
                              <p className="text-[#A0A0A8] text-sm mb-2">{param.description}</p>
                              <code className="text-[#4ADE80] font-mono text-xs bg-[#1A1B1F] px-2 py-1 rounded">
                                Example: {param.example}
                              </code>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium mb-3">Response</h4>
                      <div className="p-3 bg-[#2D2D32] rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs border-[#3D3D42] text-[#A0A0A8]">
                            {endpoint.response.type}
                          </Badge>
                        </div>
                        <p className="text-[#A0A0A8] text-sm mb-3">{endpoint.response.description}</p>
                        <pre className="text-[#4ADE80] text-xs bg-[#0D0D0F] p-3 rounded overflow-x-auto">
                          {endpoint.response.example}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Code Examples */}
          <Card className="bg-[#1A1B1F] border-[#2D2D32]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Code Examples
              </CardTitle>
              <CardDescription className="text-[#A0A0A8]">
                Ready-to-use code examples in multiple languages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {model.examples.map((example, index) => (
                <div key={index} className="border border-[#2D2D32] rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-white font-medium mb-1">{example.title}</h4>
                      <p className="text-[#A0A0A8] text-sm">{example.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-[#3D3D42] text-[#A0A0A8]">
                        {example.language}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(example.code, example.title)}
                        className="text-[#A0A0A8] hover:text-white hover:bg-[#2D2D32]"
                      >
                        {copiedCode === example.title ? (
                          <Check className="w-4 h-4 text-[#4ADE80]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <pre className="text-[#E0E0E0] text-sm bg-[#0D0D0F] p-4 rounded overflow-x-auto border border-[#2D2D32]">
                    {example.code}
                  </pre>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="bg-[#1A1B1F] border-[#2D2D32]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Pricing
              </CardTitle>
              <CardDescription className="text-[#A0A0A8]">
                Cost per request for {model.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-[#2D2D32] rounded-lg">
                  <h4 className="text-white font-medium mb-2">Input</h4>
                  <div className="text-2xl font-bold text-[#4ADE80]">
                    ${model.pricing.input}
                  </div>
                  <p className="text-[#A0A0A8] text-sm">per {model.pricing.unit}</p>
                </div>
                <div className="p-4 bg-[#2D2D32] rounded-lg">
                  <h4 className="text-white font-medium mb-2">Output</h4>
                  <div className="text-2xl font-bold text-[#8C5CF7]">
                    ${model.pricing.output}
                  </div>
                  <p className="text-[#A0A0A8] text-sm">per {model.pricing.unit}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Try It Out */}
          <Card className="bg-[#1A1B1F] border-[#2D2D32]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Try It Out
              </CardTitle>
              <CardDescription className="text-[#A0A0A8]">
                Test the API directly from your browser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-[#A0A0A8]">
                  Use our interactive API playground to test {model.name} endpoints with real data.
                </p>
                <div className="flex items-center gap-3">
                  <Button className="bg-[#8C5CF7] hover:bg-[#7C4CF7] text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Open API Playground
                  </Button>
                  <Button variant="outline" className="border-[#2D2D32] text-[#A0A0A8] hover:bg-[#2D2D32] hover:text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download SDK
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
