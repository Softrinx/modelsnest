"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/themeContext"
import { useSidebar } from "@/components/dashboard-layout-controller"
import Link from "next/link"
import {
  ArrowLeft, Copy, Check, Code2, Zap, FileText,
  Play, Download, ChevronRight, Terminal, BookOpen,
  Bot, Mic, Video, Brain, Radio, DollarSign, Settings
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { DashboardUser } from "@/types/dashboard-user"

interface ModelDocsPageProps { user: DashboardUser; modelSlug: string }

const MODEL_DB: Record<string, any> = {

  /* ─────────────────────────────── GPT-4 TURBO ─────────────────────────── */
  "gpt-4-turbo": {
    name: "GPT-4 Turbo", provider: "OpenAI", category: "conversational", color: "#6366f1",
    description: "Advanced conversational AI with deep context understanding, code generation, creative writing and vision capabilities. Best for complex multi-turn tasks that demand reasoning and creativity.",
    features: ["Context Memory", "Multi-turn Dialogue", "Code Generation", "Creative Writing", "Vision Input", "Function Calling"],
    steps: ["Generate your API key in the APIs section", "Include it as a Bearer token in the Authorization header", "POST to /v1/chat/completions with your messages array"],
    endpoint: { method: "POST", path: "/v1/chat/completions", status: "Stable" },
    params: [
      { name: "model",       type: "string",  req: true,  default: "—",      desc: "Model identifier to use for this request" },
      { name: "messages",    type: "array",   req: true,  default: "—",      desc: "Array of message objects forming the conversation" },
      { name: "max_tokens",  type: "integer", req: false, default: "4096",   desc: "Maximum number of tokens to generate in the response" },
      { name: "temperature", type: "float",   req: false, default: "1.0",    desc: "Sampling temperature between 0.0 and 2.0 — lower = deterministic" },
      { name: "top_p",       type: "float",   req: false, default: "1.0",    desc: "Nucleus sampling probability mass" },
      { name: "stream",      type: "boolean", req: false, default: "false",  desc: "Stream partial responses via SSE" },
      { name: "n",           type: "integer", req: false, default: "1",      desc: "Number of completions to generate" },
    ],
    response: `{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1714000000,
  "model": "gpt-4-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 9,
    "total_tokens": 21
  }
}`,
    examples: {
      Python: `import requests

url = "https://api.Modelsnest.com/v1/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "model": "gpt-4-turbo",
    "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user",   "content": "Explain quantum computing simply."}
    ],
    "max_tokens": 500,
    "temperature": 0.7
}

res = requests.post(url, headers=headers, json=data)
print(res.json()["choices"][0]["message"]["content"])`,

      JavaScript: `const res = await fetch(
  "https://api.Modelsnest.com/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user",   content: "Explain quantum computing simply." },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  }
)
const data = await res.json()
console.log(data.choices[0].message.content)`,

      cURL: `curl https://api.Modelsnest.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4-turbo",
    "messages": [
      {"role":"system","content":"You are a helpful assistant."},
      {"role":"user","content":"Explain quantum computing simply."}
    ],
    "max_tokens": 500,
    "temperature": 0.7
  }'`,
    },
    pricing: { input: "0.010", output: "0.030", unit: "1K tokens" },
  },

  /* ─────────────────────────────── CLAUDE 3 OPUS ───────────────────────── */
  "claude-3-opus": {
    name: "Claude 3 Opus", provider: "Anthropic", category: "conversational", color: "#8b5cf6",
    description: "Anthropic's most capable model featuring exceptional reasoning, document analysis and nuanced instruction following. Ideal for research, legal analysis and complex writing tasks.",
    features: ["Logical Reasoning", "Document Analysis", "Creative Tasks", "Problem Solving", "Safe Output", "Long Context"],
    steps: ["Generate your API key in the APIs section", "Include it as a Bearer token in the Authorization header", "Send a messages array with role and content fields"],
    endpoint: { method: "POST", path: "/v1/chat/completions", status: "Stable" },
    params: [
      { name: "model",       type: "string",  req: true,  default: "—",    desc: "Model identifier — use claude-3-opus" },
      { name: "messages",    type: "array",   req: true,  default: "—",    desc: "Conversation history array with role and content" },
      { name: "max_tokens",  type: "integer", req: false, default: "2048", desc: "Maximum tokens to generate" },
      { name: "temperature", type: "float",   req: false, default: "1.0",  desc: "Sampling temperature 0.0–1.0" },
      { name: "system",      type: "string",  req: false, default: "—",    desc: "System prompt to set assistant behavior" },
      { name: "stream",      type: "boolean", req: false, default: "false", desc: "Enable streaming responses" },
    ],
    response: `{
  "id": "claude-abc123",
  "object": "chat.completion",
  "created": 1714000000,
  "model": "claude-3-opus",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Here is my analysis of your document..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 40,
    "total_tokens": 60
  }
}`,
    examples: {
      Python: `import requests

url = "https://api.Modelsnest.com/v1/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "model": "claude-3-opus",
    "system": "You are an expert business analyst.",
    "messages": [
        {"role": "user", "content": "Analyze this business strategy and identify risks..."}
    ],
    "max_tokens": 800,
    "temperature": 0.5
}

res = requests.post(url, headers=headers, json=data)
print(res.json()["choices"][0]["message"]["content"])`,

      JavaScript: `const res = await fetch(
  "https://api.Modelsnest.com/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-opus",
      system: "You are an expert business analyst.",
      messages: [
        { role: "user", content: "Analyze this business strategy and identify risks..." }
      ],
      max_tokens: 800,
    }),
  }
)
const data = await res.json()
console.log(data.choices[0].message.content)`,

      cURL: `curl https://api.Modelsnest.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-3-opus",
    "system": "You are an expert business analyst.",
    "messages": [
      {"role":"user","content":"Analyze this business strategy..."}
    ],
    "max_tokens": 800
  }'`,
    },
    pricing: { input: "0.015", output: "0.075", unit: "1K tokens" },
  },

  /* ─────────────────────────────── GEMINI PRO ──────────────────────────── */
  "gemini-pro": {
    name: "Gemini Pro", provider: "Google", category: "conversational", color: "#06b6d4",
    description: "Google's multimodal conversational AI with real-time knowledge integration, strong cross-task performance, and built-in safety filters. Excels at image + text inputs.",
    features: ["Multimodal Input", "Real-time Responses", "Knowledge Integration", "Safe AI", "Code Generation", "Multilingual"],
    steps: ["Generate your API key in the APIs section", "Include it as a Bearer token in the Authorization header", "Send contents array with parts — supports text and image"],
    endpoint: { method: "POST", path: "/v1/chat/completions", status: "Stable" },
    params: [
      { name: "model",    type: "string", req: true,  default: "—",   desc: "Model identifier — use gemini-pro" },
      { name: "contents", type: "array",  req: true,  default: "—",   desc: "Array of content objects with parts" },
      { name: "generationConfig", type: "object", req: false, default: "—", desc: "maxOutputTokens, temperature, topP, topK" },
      { name: "safetySettings",   type: "array",  req: false, default: "—", desc: "Per-category harm blocking thresholds" },
    ],
    response: `{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Hello! I'm Gemini Pro. How can I help you today?"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 5,
    "candidatesTokenCount": 14,
    "totalTokenCount": 19
  }
}`,
    examples: {
      Python: `import requests

url = "https://api.Modelsnest.com/v1/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

# Text + image multimodal example
data = {
    "model": "gemini-pro",
    "contents": [
        {
            "parts": [
                {"text": "What's in this image? Describe in detail."},
                {
                    "inline_data": {
                        "mime_type": "image/jpeg",
                        "data": "BASE64_ENCODED_IMAGE_DATA"
                    }
                }
            ]
        }
    ],
    "generationConfig": {
        "maxOutputTokens": 500,
        "temperature": 0.4
    }
}

res = requests.post(url, headers=headers, json=data)
print(res.json()["candidates"][0]["content"]["parts"][0]["text"])`,

      JavaScript: `const res = await fetch(
  "https://api.Modelsnest.com/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gemini-pro",
      contents: [
        {
          parts: [
            { text: "What's in this image? Describe in detail." },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: "BASE64_ENCODED_IMAGE_DATA",
              },
            },
          ],
        },
      ],
      generationConfig: { maxOutputTokens: 500, temperature: 0.4 },
    }),
  }
)
const data = await res.json()
console.log(data.candidates[0].content.parts[0].text)`,

      cURL: `curl https://api.Modelsnest.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-pro",
    "contents": [
      {"parts": [{"text": "Explain the water cycle."}]}
    ],
    "generationConfig": {"maxOutputTokens": 300}
  }'`,
    },
    pricing: { input: "0.0025", output: "0.010", unit: "1K tokens" },
  },

  /* ─────────────────────────────── WHISPER V3 ──────────────────────────── */
  "whisper-v3": {
    name: "Whisper V3", provider: "OpenAI", category: "voice", color: "#10b981",
    description: "State-of-the-art automatic speech recognition supporting 99 languages with noise reduction, speaker diarization and word-level timestamps. Ideal for transcription pipelines and voice interfaces.",
    features: ["99 Languages", "Noise Reduction", "Timestamps", "Real-time", "Word-level Alignment", "Diarization"],
    steps: ["Generate your API key in the APIs section", "Send your audio file as multipart/form-data", "Receive a full transcript with optional timestamps and language detection"],
    endpoint: { method: "POST", path: "/v1/audio/transcriptions", status: "Stable" },
    params: [
      { name: "file",     type: "file",   req: true,  default: "—",    desc: "Audio file — mp3, mp4, mpeg, mpga, m4a, wav, webm" },
      { name: "model",    type: "string", req: true,  default: "—",    desc: "Model identifier — use whisper-v3" },
      { name: "language", type: "string", req: false, default: "auto", desc: "ISO-639-1 language code for the input audio" },
      { name: "prompt",   type: "string", req: false, default: "—",    desc: "Optional text to guide the model's style or vocabulary" },
      { name: "response_format", type: "string", req: false, default: "json", desc: "json, text, srt, verbose_json, or vtt" },
      { name: "timestamp_granularities", type: "array", req: false, default: "[]", desc: "word or segment — granularity of returned timestamps" },
    ],
    response: `{
  "text": "Hello, welcome to Modelsnest. Let's explore the possibilities.",
  "language": "en",
  "duration": 4.8,
  "segments": [
    {
      "id": 0,
      "start": 0.0,
      "end": 4.8,
      "text": "Hello, welcome to Modelsnest.",
      "words": [
        { "word": "Hello,", "start": 0.0, "end": 0.4 },
        { "word": "welcome", "start": 0.5, "end": 0.9 }
      ]
    }
  ]
}`,
    examples: {
      Python: `import requests

url = "https://api.Modelsnest.com/v1/audio/transcriptions"
headers = { "Authorization": "Bearer YOUR_API_KEY" }

with open("interview.mp3", "rb") as f:
    files = { "file": ("interview.mp3", f, "audio/mpeg") }
    data  = {
        "model": "whisper-v3",
        "language": "en",
        "response_format": "verbose_json",
        "timestamp_granularities": ["word"]
    }
    res = requests.post(url, headers=headers, files=files, data=data)

result = res.json()
print("Transcript:", result["text"])
print("Duration:", result["duration"], "seconds")
for word in result["segments"][0]["words"]:
    print(f"  {word['word']} ({word['start']:.2f}s)")`,

      JavaScript: `const formData = new FormData()
formData.append("file", audioBlob, "interview.mp3")
formData.append("model", "whisper-v3")
formData.append("language", "en")
formData.append("response_format", "verbose_json")

const res = await fetch("https://api.Modelsnest.com/v1/audio/transcriptions", {
  method: "POST",
  headers: { "Authorization": "Bearer YOUR_API_KEY" },
  body: formData,
})

const data = await res.json()
console.log("Transcript:", data.text)
console.log("Duration:", data.duration, "seconds")
data.segments.forEach(seg => console.log(seg.text, seg.start))`,

      cURL: `curl https://api.Modelsnest.com/v1/audio/transcriptions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@interview.mp3" \\
  -F "model=whisper-v3" \\
  -F "language=en" \\
  -F "response_format=verbose_json"`,
    },
    pricing: { input: "0.006", output: "0.000", unit: "minute" },
  },

  /* ────────────────────────────── ELEVENLABS PRO ───────────────────────── */
  "elevenlabs-pro": {
    name: "ElevenLabs Pro", provider: "ElevenLabs", category: "voice", color: "#10b981",
    description: "Hyper-realistic text-to-speech with voice cloning, emotion synthesis, and support for 29 languages. Perfect for audiobooks, virtual assistants and content creation at scale.",
    features: ["Voice Cloning", "Emotion Control", "29 Languages", "Custom Voices", "High Quality", "SSML Support"],
    steps: ["Generate your API key in the APIs section", "Pick or create a voice_id from the Voices library", "POST text to /v1/text-to-speech and save the returned binary audio"],
    endpoint: { method: "POST", path: "/v1/text-to-speech", status: "Stable" },
    params: [
      { name: "text",     type: "string", req: true,  default: "—",                     desc: "Text to synthesize — supports SSML tags" },
      { name: "voice_id", type: "string", req: true,  default: "—",                     desc: "Voice identifier from your voice library" },
      { name: "model_id", type: "string", req: false, default: "eleven_multilingual_v2", desc: "TTS model — eleven_monolingual_v1 or eleven_multilingual_v2" },
      { name: "voice_settings", type: "object", req: false, default: "—",              desc: "stability (0–1) and similarity_boost (0–1)" },
      { name: "output_format",  type: "string", req: false, default: "mp3_44100_128",  desc: "Audio format: mp3_44100_128, pcm_16000, ulaw_8000, etc." },
    ],
    response: `HTTP 200 OK
Content-Type: audio/mpeg

<binary MP3 audio data>

# On error:
{
  "detail": {
    "status": "voice_not_found",
    "message": "Voice ID not found in your library."
  }
}`,
    examples: {
      Python: `import requests

url = "https://api.Modelsnest.com/v1/text-to-speech"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "text": "Welcome to Modelsnest. Your AI infrastructure, supercharged.",
    "voice_id": "YOUR_VOICE_ID",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
        "stability": 0.5,
        "similarity_boost": 0.8
    },
    "output_format": "mp3_44100_128"
}

res = requests.post(url, headers=headers, json=data)

if res.status_code == 200:
    with open("output.mp3", "wb") as f:
        f.write(res.content)
    print("Audio saved to output.mp3")
else:
    print("Error:", res.json())`,

      JavaScript: `const res = await fetch(
  "https://api.Modelsnest.com/v1/text-to-speech",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: "Welcome to Modelsnest. Your AI infrastructure, supercharged.",
      voice_id: "YOUR_VOICE_ID",
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.8 },
    }),
  }
)

if (res.ok) {
  const arrayBuffer = await res.arrayBuffer()
  const blob = new Blob([arrayBuffer], { type: "audio/mpeg" })
  const url = URL.createObjectURL(blob)
  const audio = new Audio(url)
  audio.play()
}`,

      cURL: `curl https://api.Modelsnest.com/v1/text-to-speech \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Welcome to Modelsnest.",
    "voice_id": "YOUR_VOICE_ID",
    "model_id": "eleven_multilingual_v2"
  }' \\
  --output output.mp3`,
    },
    pricing: { input: "0.0005", output: "0.000", unit: "character" },
  },

  /* ────────────────────────────── RUNWAY GEN-3 ─────────────────────────── */
  "runway-gen-3": {
    name: "Runway Gen-3", provider: "Runway", category: "video", color: "#f59e0b",
    description: "Professional video generation from text or image prompts with granular motion control, cinematic output up to 4K, and advanced style transfer. Built for studios and content pipelines.",
    features: ["Text-to-Video", "Image-to-Video", "Motion Control", "4K Output", "Style Transfer", "Inpainting"],
    steps: ["Generate your API key in the APIs section", "POST a generation request — returns a task ID", "Poll /v1/video/generations/{id} until status is completed"],
    endpoint: { method: "POST", path: "/v1/video/generations", status: "Stable" },
    params: [
      { name: "prompt",       type: "string",  req: true,  default: "—",   desc: "Text description of the video to generate" },
      { name: "model",        type: "string",  req: true,  default: "—",   desc: "Model identifier — use runway-gen-3" },
      { name: "duration",     type: "integer", req: false, default: "10",  desc: "Duration in seconds — 4 to 16" },
      { name: "resolution",   type: "string",  req: false, default: "720p", desc: "Output resolution: 480p, 720p, 1080p, 4k" },
      { name: "image_url",    type: "string",  req: false, default: "—",   desc: "Optional reference image URL for image-to-video" },
      { name: "motion_amount",type: "integer", req: false, default: "5",   desc: "Amount of motion 1–10 — higher = more movement" },
    ],
    response: `{
  "id": "gen_abc123",
  "status": "processing",
  "created_at": 1714000000,
  "estimated_seconds": 45,
  "model": "runway-gen-3",
  "prompt": "A cinematic sunset over ocean waves",
  "resolution": "1080p",
  "duration": 10
}

// After polling until complete:
{
  "id": "gen_abc123",
  "status": "completed",
  "video_url": "https://cdn.Modelsnest.com/videos/gen_abc123.mp4",
  "duration": 10,
  "resolution": "1080p"
}`,
    examples: {
      Python: `import requests, time

url = "https://api.Modelsnest.com/v1/video/generations"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

# Step 1 — Create generation task
data = {
    "model": "runway-gen-3",
    "prompt": "Cinematic drone shot of golden-hour waves crashing on black sand beach",
    "duration": 10,
    "resolution": "1080p",
    "motion_amount": 6
}

res = requests.post(url, headers=headers, json=data)
task_id = res.json()["id"]
print(f"Task created: {task_id}")

# Step 2 — Poll until complete
while True:
    poll = requests.get(f"{url}/{task_id}", headers=headers)
    status = poll.json()["status"]
    print(f"Status: {status}")
    if status == "completed":
        print("Video URL:", poll.json()["video_url"])
        break
    elif status == "failed":
        print("Generation failed:", poll.json())
        break
    time.sleep(5)`,

      JavaScript: `// Step 1 — Create generation task
const createRes = await fetch(
  "https://api.Modelsnest.com/v1/video/generations",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "runway-gen-3",
      prompt: "Cinematic drone shot of golden-hour waves crashing on black sand beach",
      duration: 10,
      resolution: "1080p",
      motion_amount: 6,
    }),
  }
)
const { id } = await createRes.json()

// Step 2 — Poll until complete
const poll = async () => {
  const res = await fetch(
    \`https://api.Modelsnest.com/v1/video/generations/\${id}\`,
    { headers: { "Authorization": "Bearer YOUR_API_KEY" } }
  )
  const data = await res.json()
  if (data.status === "completed") return console.log("Video:", data.video_url)
  if (data.status === "failed")    return console.error("Failed:", data)
  setTimeout(poll, 5000)
}
poll()`,

      cURL: `# Step 1 — Create task
curl https://api.Modelsnest.com/v1/video/generations \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "runway-gen-3",
    "prompt": "Cinematic golden-hour ocean waves",
    "duration": 10,
    "resolution": "1080p"
  }'

# Step 2 — Poll with the returned id
curl https://api.Modelsnest.com/v1/video/generations/TASK_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    },
    pricing: { input: "0.050", output: "0.000", unit: "second" },
  },

  /* ─────────────────────────────── PIKA LABS ───────────────────────────── */
  "pika-labs": {
    name: "Pika Labs", provider: "Pika", category: "video", color: "#f59e0b",
    description: "Creative video generation with strong artistic style control, smooth animation and scene generation. Ideal for creative agencies, social content and music videos.",
    features: ["Artistic Styles", "Animation", "Scene Generation", "Prompt Control", "Style Transfer", "Frame Interpolation"],
    steps: ["Generate your API key in the APIs section", "POST a generation request with prompt and optional style", "Poll the returned task ID for the video URL"],
    endpoint: { method: "POST", path: "/v1/video/creative", status: "Stable" },
    params: [
      { name: "prompt",    type: "string",  req: true,  default: "—",         desc: "Creative description of the video scene" },
      { name: "style",     type: "string",  req: false, default: "cinematic", desc: "Artistic style: cinematic, anime, watercolor, impressionist, 3d, sketch" },
      { name: "duration",  type: "integer", req: false, default: "4",         desc: "Duration in seconds — 1 to 10" },
      { name: "aspect",    type: "string",  req: false, default: "16:9",      desc: "Aspect ratio: 16:9, 9:16, 1:1, 4:3" },
      { name: "fps",       type: "integer", req: false, default: "24",        desc: "Frames per second — 12, 24, or 30" },
      { name: "seed",      type: "integer", req: false, default: "—",         desc: "Seed for reproducible generation" },
    ],
    response: `{
  "id": "pika_abc123",
  "status": "processing",
  "created_at": 1714000000,
  "style": "watercolor",
  "prompt": "A magical forest with glowing fireflies"
}

// When complete:
{
  "id": "pika_abc123",
  "status": "completed",
  "video_url": "https://cdn.Modelsnest.com/videos/pika_abc123.mp4",
  "style": "watercolor",
  "duration": 4,
  "fps": 24
}`,
    examples: {
      Python: `import requests, time

url = "https://api.Modelsnest.com/v1/video/creative"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "prompt": "A magical forest with glowing fireflies drifting through ancient trees",
    "style": "watercolor",
    "duration": 6,
    "aspect": "16:9",
    "fps": 24
}

res = requests.post(url, headers=headers, json=data)
task = res.json()
print(f"Task: {task['id']}, Status: {task['status']}")

# Poll for result
while True:
    poll = requests.get(f"{url}/{task['id']}", headers=headers)
    data  = poll.json()
    if data["status"] == "completed":
        print("Video URL:", data["video_url"])
        break
    elif data["status"] == "failed":
        print("Failed")
        break
    time.sleep(5)`,

      JavaScript: `const res = await fetch(
  "https://api.Modelsnest.com/v1/video/creative",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: "A magical forest with glowing fireflies",
      style: "watercolor",
      duration: 6,
      aspect: "16:9",
    }),
  }
)
const { id } = await res.json()
console.log("Task ID:", id)

// Poll
const check = async () => {
  const r = await fetch(
    \`https://api.Modelsnest.com/v1/video/creative/\${id}\`,
    { headers: { "Authorization": "Bearer YOUR_API_KEY" } }
  )
  const d = await r.json()
  if (d.status === "completed") return console.log("Video:", d.video_url)
  setTimeout(check, 5000)
}
check()`,

      cURL: `curl https://api.Modelsnest.com/v1/video/creative \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "A magical forest with glowing fireflies",
    "style": "watercolor",
    "duration": 6
  }'`,
    },
    pricing: { input: "0.080", output: "0.000", unit: "second" },
  },

  /* ────────────────────────────── LLAMA 3 70B ──────────────────────────── */
  "llama-3-70b": {
    name: "Llama 3 70B", provider: "Meta", category: "llm", color: "#06b6d4",
    description: "Meta's open-source flagship large language model with strong reasoning, coding, instruction following and tool use. Ideal for custom deployments and fine-tuning pipelines.",
    features: ["Open Source", "Custom Training", "Efficient Inference", "Community Support", "High Performance", "Tool Use"],
    steps: ["Generate your API key in the APIs section", "Include it as a Bearer token in the Authorization header", "POST to /v1/completions with your prompt"],
    endpoint: { method: "POST", path: "/v1/completions", status: "Stable" },
    params: [
      { name: "model",       type: "string",  req: true,  default: "—",     desc: "Model identifier — use llama-3-70b" },
      { name: "prompt",      type: "string",  req: true,  default: "—",     desc: "Input text prompt to complete" },
      { name: "max_tokens",  type: "integer", req: false, default: "256",   desc: "Maximum tokens to generate" },
      { name: "temperature", type: "float",   req: false, default: "0.8",   desc: "Sampling temperature 0.0–2.0" },
      { name: "top_p",       type: "float",   req: false, default: "0.95",  desc: "Nucleus sampling probability mass" },
      { name: "stop",        type: "array",   req: false, default: "[]",    desc: "List of stop sequences to end generation" },
      { name: "stream",      type: "boolean", req: false, default: "false", desc: "Stream tokens as they are generated" },
    ],
    response: `{
  "id": "llama_abc123",
  "object": "text_completion",
  "created": 1714000000,
  "model": "llama-3-70b",
  "choices": [
    {
      "text": "Once upon a time in a digital kingdom, a robot named Aria...",
      "index": 0,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 8,
    "completion_tokens": 20,
    "total_tokens": 28
  }
}`,
    examples: {
      Python: `import requests

url = "https://api.Modelsnest.com/v1/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "model": "llama-3-70b",
    "prompt": "Write a Python function that implements binary search:\n\ndef binary_search(arr, target):",
    "max_tokens": 300,
    "temperature": 0.2,
    "stop": ["\\n\\n", "# End"]
}

res = requests.post(url, headers=headers, json=data)
print(res.json()["choices"][0]["text"])`,

      JavaScript: `const res = await fetch(
  "https://api.Modelsnest.com/v1/completions",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3-70b",
      prompt: "Write a short story about a robot discovering music:",
      max_tokens: 300,
      temperature: 0.8,
    }),
  }
)
const data = await res.json()
console.log(data.choices[0].text)`,

      cURL: `curl https://api.Modelsnest.com/v1/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama-3-70b",
    "prompt": "Write a short story about a robot discovering music:",
    "max_tokens": 300,
    "temperature": 0.8
  }'`,
    },
    pricing: { input: "0.0008", output: "0.0008", unit: "1K tokens" },
  },

  /* ────────────────────────────── MISTRAL LARGE ────────────────────────── */
  "mistral-large": {
    name: "Mistral Large", provider: "Mistral", category: "llm", color: "#06b6d4",
    description: "High-performance European LLM with exceptional multilingual capabilities, precise instruction following, strong code generation and efficient inference. Best for multilingual apps.",
    features: ["Multilingual", "Code Generation", "Reasoning", "Efficient", "High Quality", "Function Calling"],
    steps: ["Generate your API key in the APIs section", "Include it as a Bearer token in the Authorization header", "POST to /v1/chat/completions with messages array"],
    endpoint: { method: "POST", path: "/v1/chat/completions", status: "Stable" },
    params: [
      { name: "model",        type: "string",  req: true,  default: "—",     desc: "Model identifier — use mistral-large" },
      { name: "messages",     type: "array",   req: true,  default: "—",     desc: "Conversation history with role and content" },
      { name: "max_tokens",   type: "integer", req: false, default: "1024",  desc: "Maximum tokens to generate" },
      { name: "temperature",  type: "float",   req: false, default: "0.7",   desc: "Sampling temperature 0.0–1.0" },
      { name: "top_p",        type: "float",   req: false, default: "1.0",   desc: "Nucleus sampling probability" },
      { name: "stream",       type: "boolean", req: false, default: "false", desc: "Enable streaming responses" },
      { name: "safe_prompt",  type: "boolean", req: false, default: "false", desc: "Prepend safety system prompt" },
    ],
    response: `{
  "id": "mistral_abc123",
  "object": "chat.completion",
  "created": 1714000000,
  "model": "mistral-large-latest",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Bonjour! Je suis Mistral Large. Comment puis-je vous aider?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 18,
    "total_tokens": 28
  }
}`,
    examples: {
      Python: `import requests

url = "https://api.Modelsnest.com/v1/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

# Multilingual example
data = {
    "model": "mistral-large",
    "messages": [
        {"role": "system",  "content": "You are a multilingual assistant."},
        {"role": "user",    "content": "Explique-moi la relativité restreinte en termes simples."}
    ],
    "max_tokens": 500,
    "temperature": 0.6
}

res = requests.post(url, headers=headers, json=data)
print(res.json()["choices"][0]["message"]["content"])`,

      JavaScript: `const res = await fetch(
  "https://api.Modelsnest.com/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral-large",
      messages: [
        { role: "system", content: "You are a multilingual assistant." },
        { role: "user",   content: "Erkläre mir die Relativitätstheorie einfach." },
      ],
      max_tokens: 500,
      temperature: 0.6,
    }),
  }
)
const data = await res.json()
console.log(data.choices[0].message.content)`,

      cURL: `curl https://api.Modelsnest.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "mistral-large",
    "messages": [
      {"role":"user","content":"Bonjour! Comment allez-vous?"}
    ],
    "max_tokens": 300
  }'`,
    },
    pricing: { input: "0.0012", output: "0.0036", unit: "1K tokens" },
  },

  /* ────────────────────────────── STREAMAI PRO ─────────────────────────── */
  "streamai-pro": {
    name: "StreamAI Pro", provider: "Modelsnest", category: "livestreaming", color: "#ec4899",
    description: "Real-time AI processing purpose-built for live streaming — content moderation, audience engagement analytics, live caption generation and automated highlight detection.",
    features: ["Real-time Processing", "Content Moderation", "Audience Analytics", "Live Captions", "Highlight Detection", "Chat AI"],
    steps: ["Generate your API key in the APIs section", "Attach your stream_id to the processing request", "Receive real-time moderation scores and engagement metrics via webhooks"],
    endpoint: { method: "POST", path: "/v1/stream/process", status: "Stable" },
    params: [
      { name: "stream_id",    type: "string", req: true,  default: "—",       desc: "Live stream session identifier" },
      { name: "content_type", type: "string", req: true,  default: "—",       desc: "Type of content: video, audio, chat" },
      { name: "features",     type: "array",  req: false, default: "all",     desc: "Features to enable: moderation, captions, highlights, analytics" },
      { name: "webhook_url",  type: "string", req: false, default: "—",       desc: "URL to receive real-time event callbacks" },
      { name: "language",     type: "string", req: false, default: "auto",    desc: "Stream language for captions — ISO-639-1 code" },
    ],
    response: `{
  "stream_id": "stream_abc123",
  "status": "processing",
  "session_id": "sess_xyz789",
  "features_active": ["moderation", "captions", "analytics"],
  "moderation": {
    "score": 0.04,
    "status": "safe",
    "flagged_categories": []
  },
  "captions": {
    "current_text": "Welcome to tonight's live stream!",
    "language": "en"
  },
  "analytics": {
    "viewers": 2847,
    "peak_viewers": 3100,
    "chat_rate_per_minute": 142,
    "engagement_score": 0.87
  }
}`,
    examples: {
      Python: `import requests

url = "https://api.Modelsnest.com/v1/stream/process"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "stream_id": "stream_abc123",
    "content_type": "video",
    "features": ["moderation", "captions", "analytics"],
    "webhook_url": "https://yourapp.com/webhook/stream-events",
    "language": "en"
}

res = requests.post(url, headers=headers, json=data)
result = res.json()

print(f"Session: {result['session_id']}")
print(f"Viewers: {result['analytics']['viewers']}")
print(f"Moderation: {result['moderation']['status']}")
print(f"Current caption: {result['captions']['current_text']}")`,

      JavaScript: `const res = await fetch(
  "https://api.Modelsnest.com/v1/stream/process",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      stream_id: "stream_abc123",
      content_type: "video",
      features: ["moderation", "captions", "analytics"],
      webhook_url: "https://yourapp.com/webhook/stream-events",
      language: "en",
    }),
  }
)
const data = await res.json()
console.log("Session:", data.session_id)
console.log("Viewers:", data.analytics.viewers)
console.log("Moderation:", data.moderation.status)`,

      cURL: `curl https://api.Modelsnest.com/v1/stream/process \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "stream_id": "stream_abc123",
    "content_type": "video",
    "features": ["moderation","captions","analytics"],
    "language": "en"
  }'`,
    },
    pricing: { input: "0.020", output: "0.000", unit: "minute" },
  },

  /* ─────────────────────────────── LIVECHAT AI ─────────────────────────── */
  "livechat-ai": {
    name: "LiveChat AI", provider: "Modelsnest", category: "livestreaming", color: "#ec4899",
    description: "AI-powered live chat moderation with spam detection, toxicity scoring, sentiment analysis and smart auto-responses. Keeps your community safe at scale in real time.",
    features: ["Chat Moderation", "Spam Detection", "Toxicity Scoring", "Sentiment Analysis", "Auto-Responses", "Real-time"],
    steps: ["Generate your API key in the APIs section", "Send each chat message to /v1/chat/moderate", "Act on the returned is_approved flag and moderation_score"],
    endpoint: { method: "POST", path: "/v1/chat/moderate", status: "Stable" },
    params: [
      { name: "message",     type: "string",  req: true,  default: "—",    desc: "The chat message content to moderate" },
      { name: "user_id",     type: "string",  req: true,  default: "—",    desc: "Unique identifier of the message author" },
      { name: "stream_id",   type: "string",  req: false, default: "—",    desc: "Stream session context for user history tracking" },
      { name: "auto_reply",  type: "boolean", req: false, default: "false", desc: "Generate a smart auto-reply for approved messages" },
      { name: "thresholds",  type: "object",  req: false, default: "—",    desc: "Custom toxicity and spam thresholds (0.0–1.0)" },
    ],
    response: `{
  "message_id": "msg_abc123",
  "user_id": "user_xyz",
  "is_approved": true,
  "moderation_score": 0.03,
  "toxicity_score": 0.02,
  "spam_score": 0.01,
  "sentiment": "positive",
  "action": "allow",
  "categories": [],
  "auto_reply": null,
  "processing_ms": 18
}

// When message is flagged:
{
  "message_id": "msg_def456",
  "is_approved": false,
  "moderation_score": 0.91,
  "action": "remove",
  "categories": ["toxicity", "harassment"],
  "auto_reply": null
}`,
    examples: {
      Python: `import requests

url = "https://api.Modelsnest.com/v1/chat/moderate"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

def moderate_message(message: str, user_id: str, stream_id: str):
    data = {
        "message": message,
        "user_id": user_id,
        "stream_id": stream_id,
        "auto_reply": True,
        "thresholds": {
            "toxicity": 0.7,
            "spam": 0.8
        }
    }
    res = requests.post(url, headers=headers, json=data)
    result = res.json()

    if result["is_approved"]:
        print(f"✓ Approved — sentiment: {result['sentiment']}")
        if result.get("auto_reply"):
            print(f"  Auto-reply: {result['auto_reply']}")
    else:
        print(f"✗ Removed — categories: {result['categories']}")
    return result

moderate_message("Hello everyone! Great stream today!", "user_123", "stream_abc")`,

      JavaScript: `async function moderateMessage(message, userId, streamId) {
  const res = await fetch(
    "https://api.Modelsnest.com/v1/chat/moderate",
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        user_id: userId,
        stream_id: streamId,
        auto_reply: true,
        thresholds: { toxicity: 0.7, spam: 0.8 },
      }),
    }
  )
  const data = await res.json()

  if (data.is_approved) {
    console.log("✓ Approved — sentiment:", data.sentiment)
    if (data.auto_reply) console.log("Auto-reply:", data.auto_reply)
  } else {
    console.log("✗ Removed — categories:", data.categories)
  }
  return data
}

moderateMessage("Hello everyone! Great stream!", "user_123", "stream_abc")`,

      cURL: `curl https://api.Modelsnest.com/v1/chat/moderate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Hello everyone! Great stream today!",
    "user_id": "user_123",
    "stream_id": "stream_abc",
    "auto_reply": true
  }'`,
    },
    pricing: { input: "0.001", output: "0.000", unit: "message" },
  },
}

/* ─── fallback for unknown slugs ──────────────────────────────────────────── */
const buildFallback = (slug: string) => ({
  name: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
  provider: "Modelsnest", category: "llm", color: "#6366f1",
  description: "Full documentation for this model is coming soon. It is available via the Modelsnest API and follows the standard completions interface.",
  features: ["Fast Inference", "Reliable", "Scalable", "Standard API"],
  steps: ["Generate your API key in the APIs section", "Send requests to the endpoint with your prompt", "Parse the response"],
  endpoint: { method: "POST", path: "/v1/completions", status: "Stable" },
  params: [
    { name: "model",      type: "string",  req: true,  default: "—",   desc: "Model identifier" },
    { name: "prompt",     type: "string",  req: true,  default: "—",   desc: "Input prompt" },
    { name: "max_tokens", type: "integer", req: false, default: "256", desc: "Max tokens to generate" },
  ],
  response: `{\n  "choices": [{ "text": "..." }]\n}`,
  examples: {
    Python:     `import requests\nres = requests.post(\n  "https://api.Modelsnest.com/v1/completions",\n  headers={"Authorization": "Bearer YOUR_API_KEY"},\n  json={"model": "${slug}", "prompt": "Hello"}\n)\nprint(res.json()["choices"][0]["text"])`,
    JavaScript: `const res = await fetch("https://api.Modelsnest.com/v1/completions", {\n  method: "POST",\n  headers: { "Authorization": "Bearer YOUR_API_KEY", "Content-Type": "application/json" },\n  body: JSON.stringify({ model: "${slug}", prompt: "Hello" }),\n})\nconsole.log(await res.json())`,
    cURL:       `curl https://api.Modelsnest.com/v1/completions \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -d '{"model":"${slug}","prompt":"Hello"}'`,
  },
  pricing: { input: "0.001", output: "0.001", unit: "1K tokens" },
})

const LANGS = ["Python", "JavaScript", "cURL"]

/* ─── Code block component ────────────────────────────────────────────────── */
function CodeBlock({ code, lang, isDark, border }: { code: string; lang: string; isDark: boolean; border: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1600) }
  const lines  = code.split("\n")
  const codeBg = isDark ? "#080809" : "#fafaf9"
  const gutterC= isDark ? "#333340" : "#d6d3d1"
  const lineC  = isDark ? "#c9c9d4" : "#1c1917"
  const cmtC   = isDark ? "#444455" : "#a8a29e"
  const tabBg  = isDark ? "#0d0d10" : "#f0f0ee"

  return (
    <div style={{ border: `1px solid ${border}`, overflow: "hidden" }}>
      {/* Tab bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: tabBg, borderBottom: `1px solid ${border}`, height: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", height: "100%", borderTop: "2px solid var(--color-primary)", borderRight: `1px solid ${border}` }}>
          <FileText size={11} style={{ color: "var(--color-primary)" }} />
          <span style={{ fontSize: 11, fontFamily: "monospace", color: isDark ? "#d4d4d8" : "#3f3f46" }}>{lang.toLowerCase()}.example</span>
        </div>
        <button onClick={copy} style={{ display: "flex", alignItems: "center", gap: 5, padding: "0 14px", height: "100%", background: "transparent", border: "none", cursor: "pointer", fontSize: 11, fontFamily: "monospace", color: copied ? "#10b981" : gutterC, transition: "color 0.15s" }}>
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {/* Code */}
      <div style={{ display: "flex", background: codeBg, overflowX: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", padding: "14px 10px", borderRight: `1px solid ${isDark ? "#18181c" : "#e7e5e4"}`, userSelect: "none", flexShrink: 0 }}>
          {lines.map((_, i) => (
            <span key={i} style={{ fontSize: 11, fontFamily: "monospace", lineHeight: "22px", color: gutterC, textAlign: "right", minWidth: 24 }}>{i + 1}</span>
          ))}
        </div>
        <pre style={{ margin: 0, padding: "14px 16px", fontSize: 12, fontFamily: "monospace", lineHeight: "22px", flex: 1, overflowX: "visible" }}>
          {lines.map((line, i) => {
            const isComment = line.trim().startsWith("#") || line.trim().startsWith("//") || line.trim().startsWith("/*")
            return (
              <div key={i} style={{ color: isComment ? cmtC : lineC }}>{line || "\u00A0"}</div>
            )
          })}
        </pre>
      </div>
      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 14px", background: tabBg, borderTop: `1px solid ${border}` }}>
        <span style={{ fontSize: 10, fontFamily: "monospace", color: gutterC }}>UTF-8  ·  {lines.length} lines</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: 10, fontFamily: "monospace", color: gutterC }}>Ready</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Main component ──────────────────────────────────────────────────────── */
export function ModelDocsPage({ user, modelSlug }: ModelDocsPageProps) {
  const { isDark } = useTheme()
  const { sidebarWidth } = useSidebar()
  const [activeLang, setActiveLang] = useState("Python")
  const [activeSection, setActiveSection] = useState("overview")
  const [model, setModel] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadModel = async () => {
      setIsLoading(true)
      try {
        const supabase = createClient()
        
        // Fetch model main info
        const { data: modelRow, error: modelError } = await supabase
          .from("ai_models")
          .select("id, slug, name, provider, category_slug, docs_page_color, docs_page_description")
          .eq("slug", modelSlug)
          .single()

        if (modelError || !modelRow) {
          throw new Error("Model not found")
        }

        // Fetch doc details
        const { data: docRow, error: docError } = await supabase
          .from("ai_model_docs")
          .select("*")
          .eq("model_id", modelRow.id)
          .single()

        if (docError) {
          throw docError
        }

        // Fetch steps
        const { data: stepsRows, error: stepsError } = await supabase
          .from("ai_model_doc_steps")
          .select("*")
          .eq("model_id", modelRow.id)
          .order("step_order", { ascending: true })

        if (stepsError) {
          throw stepsError
        }

        // Fetch parameters
        const { data: paramRows, error: paramError } = await supabase
          .from("ai_model_doc_parameters")
          .select("*")
          .eq("model_id", modelRow.id)
          .order("sort_order", { ascending: true })

        if (paramError) {
          throw paramError
        }

        // Fetch examples
        const { data: exampleRows, error: exampleError } = await supabase
          .from("ai_model_doc_examples")
          .select("*")
          .eq("model_id", modelRow.id)
          .order("language", { ascending: true })

        if (exampleError) {
          throw exampleError
        }

        // Fetch pricing
        const { data: pricingRow, error: pricingError } = await supabase
          .from("ai_model_pricing")
          .select("*")
          .eq("model_id", modelRow.id)
          .single()

        if (pricingError && pricingError.code !== "PGRST116") {
          throw pricingError
        }

        // Build features array from docs_page_payload if available
        let features: string[] = []
        try {
          if (docRow.docs_page_payload && docRow.docs_page_payload.features) {
            features = docRow.docs_page_payload.features
          }
        } catch (e) {
          // If docs_page_payload is not available, fallback to empty
          features = []
        }

        // Build examples map
        const examplesMap: Record<string, string> = {}
        for (const ex of exampleRows ?? []) {
          examplesMap[ex.language] = ex.code_example
        }

        // Build params array
        const paramsArray = (paramRows ?? []).map(p => ({
          name: p.param_name,
          type: p.param_type,
          req: p.is_required,
          default: p.default_value ?? "—",
          desc: p.description,
        }))

        // Build steps array
        const stepsArray = (stepsRows ?? []).map(s => s.step_text)

        const modelData = {
          name: modelRow.name,
          provider: modelRow.provider,
          category: modelRow.category_slug,
          color: modelRow.docs_page_color || "#6366f1",
          description: modelRow.docs_page_description || "",
          features: features,
          steps: stepsArray,
          endpoint: docRow.endpoint_info ? JSON.parse(typeof docRow.endpoint_info === 'string' ? docRow.endpoint_info : JSON.stringify(docRow.endpoint_info)) : { method: "POST", path: "/api/endpoint", status: "Stable" },
          params: paramsArray,
          response: docRow.response_schema || "{}",
          examples: examplesMap,
          pricing: pricingRow ? {
            input: String(pricingRow.input_price),
            output: String(pricingRow.output_price),
            unit: pricingRow.price_unit || "1K tokens",
          } : { input: "0", output: "0", unit: "1K tokens" },
        }

        if (isMounted) {
          setModel(modelData)
        }
      } catch (err) {
        console.error("Failed to load model", err)
        if (isMounted) {
          // Set fallback model
          setModel(buildFallback(modelSlug))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadModel()
    return () => {
      isMounted = false
    }
  }, [modelSlug])

  const bg      = isDark ? "#0d0d10" : "#f8f8f6"
  const surface = isDark ? "#111114" : "#ffffff"
  const border  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"
  const text     = isDark ? "#f4f4f5" : "#09090b"
  const muted    = isDark ? "#52525b" : "#a1a1aa"
  const subtext  = isDark ? "#71717a" : "#71717a"
  const accent   = model?.color || "#6366f1"

  const SECTIONS = [
    { id: "overview",   label: "Overview"   },
    { id: "quickstart", label: "Quickstart" },
    { id: "reference",  label: "API Ref"    },
    { id: "examples",   label: "Examples"   },
    { id: "pricing",    label: "Pricing"    },
  ]

  const CategoryIcon = model?.category === "voice" ? Mic
    : model?.category === "video"         ? Video
    : model?.category === "llm"           ? Brain
    : model?.category === "livestreaming" ? Radio
    : Bot

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{
          width: 40, height: 40,
          border: `2px solid ${border}`, borderTop: "2px solid var(--color-primary)",
          borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 16,
        }} />
        <p style={{ fontSize: 16, fontWeight: 700, color: "var(--color-primary)" }}>Loading documentation...</p>
      </div>
    )
  }

  if (!model) {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: text }}>Model not found</p>
        <Link href="/dashboard/models/docs" style={{ textDecoration: "none" }}>
          <button style={{
            marginTop: 16,
            padding: "8px 16px", borderRadius: 8,
            background: "var(--color-primary)", color: "#fff",
            border: "none", cursor: "pointer", fontWeight: 600,
          }}>
            Back to Docs
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", flexDirection: "column" }}>

      {/* ── PAGE HEADER ── */}
      <div style={{
        padding: "36px 48px 32px",
        borderBottom: `1px solid ${border}`,
        background: isDark ? "linear-gradient(160deg,#0d0d10,#111118)" : surface,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle,${isDark?"rgba(99,102,241,0.05)":"rgba(99,102,241,0.02)"} 1px,transparent 1px)`,
          backgroundSize: "28px 28px" }} />
        <div style={{ position: "absolute", top: -80, left: "30%", width: 500, height: 300, borderRadius: "50%",
          background: isDark ? `radial-gradient(ellipse,${accent}14 0%,transparent 70%)` : "transparent", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
        <Link href="/dashboard/models/docs" style={{ textDecoration: "none" }}>
  <button
    style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "6px 12px", marginBottom: 16,
      background: "transparent",
      border: `1px solid ${border}`,
      color: muted, fontSize: 12, fontWeight: 600, cursor: "pointer",
    }}
    onMouseEnter={e => { e.currentTarget.style.color = text; e.currentTarget.style.borderColor = accent }}
    onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.borderColor = border }}
  >
    <ArrowLeft size={13} /> Back to Docs
  </button>
</Link>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
            <Link href="/dashboard/models" style={{ textDecoration: "none" }}>
              <span style={{ fontSize: 12, color: muted, cursor: "pointer", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = accent}
                onMouseLeave={e => e.currentTarget.style.color = muted}>Models</span>
            </Link>
            <ChevronRight size={12} style={{ color: muted }} />
            <Link href="/dashboard/models/docs" style={{ textDecoration: "none" }}>
              <span style={{ fontSize: 12, color: muted, cursor: "pointer", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = accent}
                onMouseLeave={e => e.currentTarget.style.color = muted}>Docs</span>
            </Link>
            <ChevronRight size={12} style={{ color: muted }} />
            <span style={{ fontSize: 12, color: accent, fontWeight: 600 }}>{model.name}</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: accent, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 6px 24px ${accent}55` }}>
                  <CategoryIcon size={24} style={{ color: "#fff" }} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.04em", color: text, margin: 0 }}>{model.name}</h1>
                    <span style={{ fontSize: 10, padding: "3px 8px", background: `${accent}18`, color: accent, border: `1px solid ${accent}30`, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {model.endpoint.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>by {model.provider} · Modelsnest API</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: subtext, lineHeight: 1.75, maxWidth: 560, margin: 0 }}>{model.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
                {model.features.map((f: string) => (
                  <span key={f} style={{ fontSize: 11, padding: "3px 9px", border: `1px solid ${border}`, color: muted }}>{f}</span>
                ))}
              </div>
            </div>

            {/* Pricing strip */}
            <div style={{ display: "flex", gap: 1, background: border, flexShrink: 0 }}>
              <div style={{ padding: "16px 22px", background: surface }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: muted, marginBottom: 6 }}>Input</div>
                <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "monospace", color: text, letterSpacing: "-0.04em" }}>${model.pricing.input}</div>
                <div style={{ fontSize: 11, color: muted }}>per {model.pricing.unit}</div>
              </div>
              {model.pricing.output !== "0.000" && (
                <div style={{ padding: "16px 22px", background: surface }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: muted, marginBottom: 6 }}>Output</div>
                  <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "monospace", color: text, letterSpacing: "-0.04em" }}>${model.pricing.output}</div>
                  <div style={{ fontSize: 11, color: muted }}>per {model.pricing.unit}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── NAV TABS ── */}
      <div style={{ display: "flex", borderBottom: `1px solid ${border}`, background: surface, overflowX: "auto" }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            style={{
              padding: "0 22px", height: 46, border: "none", cursor: "pointer", flexShrink: 0,
              background: "transparent", fontSize: 13, fontWeight: 600,
              color: activeSection === s.id ? text : muted,
              borderBottom: `2px solid ${activeSection === s.id ? accent : "transparent"}`,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (activeSection !== s.id) e.currentTarget.style.color = text }}
            onMouseLeave={e => { if (activeSection !== s.id) e.currentTarget.style.color = muted }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, padding: "40px 48px", overflowY: "auto" }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeSection}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ maxWidth: 860 }}>

            {/* ─── OVERVIEW ─── */}
            {activeSection === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: text, letterSpacing: "-0.03em", marginBottom: 10 }}>About {model.name}</h2>
                  <p style={{ fontSize: 14, color: subtext, lineHeight: 1.8 }}>{model.description}</p>
                </div>

                <div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Capabilities</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 1, background: border }}>
                    {model.features.map((f: string, i: number) => (
                      <motion.div key={f} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                        style={{ padding: "16px 18px", background: surface, display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: text, fontWeight: 500 }}>{f}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Primary Endpoint</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: surface, border: `1px solid ${border}` }}>
                    <span style={{ padding: "4px 10px", background: `${accent}20`, color: accent, fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>{model.endpoint.method}</span>
                    <code style={{ fontFamily: "monospace", fontSize: 14, color: text }}>{model.endpoint.path}</code>
                    <span style={{ marginLeft: "auto", fontSize: 11, padding: "2px 8px", border: `1px solid ${border}`, color: muted }}>{model.endpoint.status}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ─── QUICKSTART ─── */}
            {activeSection === "quickstart" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: text, letterSpacing: "-0.03em", marginBottom: 6 }}>Get started in minutes</h2>
                  <p style={{ fontSize: 14, color: subtext }}>Three steps to your first successful API call.</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 1, background: border }}>
                  {model.steps.map((step: string, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", background: surface }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                        background: `${accent}18`, border: `1px solid ${accent}30`,
                        display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 900, color: accent }}>{i + 1}</span>
                      </div>
                      <span style={{ fontSize: 14, color: text }}>{step}</span>
                    </motion.div>
                  ))}
                </div>

                <div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Your first request</h3>
                  <CodeBlock code={model.examples["Python"]} lang="Python" isDark={isDark} border={border} />
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link href="/dashboard/apis" style={{ textDecoration: "none" }}>
                    <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", background: accent, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      <Terminal size={14} /> Get API Key
                    </button>
                  </Link>
                  <button onClick={() => setActiveSection("examples")}
                    style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "transparent", border: `1px solid ${border}`, color: text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    View All Examples
                  </button>
                </div>
              </div>
            )}

            {/* ─── API REFERENCE ─── */}
            {activeSection === "reference" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: text, letterSpacing: "-0.03em", marginBottom: 6 }}>API Reference</h2>
                  <p style={{ fontSize: 14, color: subtext }}>Complete endpoint documentation, request parameters and response schema.</p>
                </div>

                {/* Endpoint pill */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: surface, border: `1px solid ${border}` }}>
                  <span style={{ padding: "4px 10px", background: `${accent}20`, color: accent, fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>{model.endpoint.method}</span>
                  <code style={{ fontFamily: "monospace", fontSize: 14, color: text, flex: 1 }}>{model.endpoint.path}</code>
                  <span style={{ fontSize: 11, padding: "2px 8px", border: `1px solid ${border}`, color: muted }}>{model.endpoint.status}</span>
                </div>

                {/* Parameters table */}
                <div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Request Parameters</h3>
                  <div style={{ border: `1px solid ${border}`, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 0.6fr 0.8fr 2fr", padding: "10px 16px",
                      background: isDark ? "rgba(255,255,255,0.03)" : "#f5f5f4", borderBottom: `1px solid ${border}` }}>
                      {["Name","Type","Required","Default","Description"].map(h => (
                        <span key={h} style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted }}>{h}</span>
                      ))}
                    </div>
                    {model.params.map((p: any, i: number) => (
                      <div key={p.name} style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 0.6fr 0.8fr 2fr",
                        padding: "12px 16px", borderBottom: i < model.params.length - 1 ? `1px solid ${border}` : "none", alignItems: "flex-start" }}>
                        <code style={{ fontFamily: "monospace", fontSize: 12, color: accent, fontWeight: 600 }}>{p.name}</code>
                        <span style={{ fontSize: 12, color: muted, fontFamily: "monospace" }}>{p.type}</span>
                        <span style={{ fontSize: 12, color: p.req ? "#ef4444" : subtext, fontWeight: p.req ? 700 : 400 }}>{p.req ? "yes" : "no"}</span>
                        <span style={{ fontSize: 12, color: muted, fontFamily: "monospace" }}>{p.default}</span>
                        <span style={{ fontSize: 12, color: subtext, lineHeight: 1.6 }}>{p.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Response */}
                <div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>200 Response</h3>
                  <CodeBlock code={model.response} lang="JSON" isDark={isDark} border={border} />
                </div>
              </div>
            )}

            {/* ─── EXAMPLES ─── */}
            {activeSection === "examples" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: text, letterSpacing: "-0.03em", marginBottom: 6 }}>Code Examples</h2>
                  <p style={{ fontSize: 14, color: subtext }}>Drop-in snippets in Python, JavaScript and cURL — copy and run.</p>
                </div>

                {/* Language tabs */}
                <div style={{ display: "flex", gap: 1, background: border }}>
                  {LANGS.filter(l => model.examples[l]).map(l => (
                    <button key={l} onClick={() => setActiveLang(l)}
                      style={{
                        padding: "0 22px", height: 38, border: "none", cursor: "pointer",
                        background: activeLang === l ? surface : isDark ? "#0d0d10" : "#f0f0ee",
                        color: activeLang === l ? text : muted,
                        fontSize: 12, fontWeight: 600,
                        borderBottom: `2px solid ${activeLang === l ? accent : "transparent"}`,
                        transition: "all 0.15s",
                      }}
                    >{l}</button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={activeLang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>
                    <CodeBlock code={model.examples[activeLang] ?? ""} lang={activeLang} isDark={isDark} border={border} />
                  </motion.div>
                </AnimatePresence>

                {/* Playground */}
                <div style={{ padding: "22px 24px", background: surface, border: `1px solid ${border}` }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 6 }}>Try it live</h3>
                  <p style={{ fontSize: 13, color: subtext, marginBottom: 16 }}>Run requests against {model.name} directly from your browser.</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", background: accent, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      <Play size={14} /> Open Playground
                    </button>
                    <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "transparent", border: `1px solid ${border}`, color: text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      <Download size={14} /> Download SDK
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── PRICING ─── */}
            {activeSection === "pricing" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: text, letterSpacing: "-0.03em", marginBottom: 6 }}>Pricing</h2>
                  <p style={{ fontSize: 14, color: subtext }}>Pay only for what you use. No monthly minimums, no setup fees.</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 1, background: border }}>
                  {[
                    { label: "Input",  price: model.pricing.input,  color: "#10b981" },
                    ...(model.pricing.output !== "0.000" ? [{ label: "Output", price: model.pricing.output, color: accent }] : []),
                  ].map(item => (
                    <div key={item.label} style={{ padding: "28px", background: surface }}>
                      <DollarSign size={20} style={{ color: item.color, marginBottom: 12 }} />
                      <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: muted, marginBottom: 8 }}>{item.label}</div>
                      <div style={{ fontSize: 34, fontWeight: 900, fontFamily: "monospace", color: text, letterSpacing: "-0.04em" }}>${item.price}</div>
                      <div style={{ fontSize: 13, color: muted, marginTop: 6 }}>per {model.pricing.unit}</div>
                    </div>
                  ))}
                  <div style={{ padding: "28px", background: surface }}>
                    <Zap size={20} style={{ color: "#f59e0b", marginBottom: 12 }} />
                    <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: muted, marginBottom: 8 }}>Billing</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: text, marginBottom: 6 }}>Pay-as-you-go</div>
                    <div style={{ fontSize: 13, color: muted }}>No minimums or commitments</div>
                  </div>
                </div>

                <Link href="/dashboard/billing" style={{ textDecoration: "none", display: "inline-block" }}>
                  <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 20px", background: accent, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    <DollarSign size={14} /> View Billing Dashboard
                  </button>
                </Link>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}