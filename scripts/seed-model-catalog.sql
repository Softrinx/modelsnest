-- === Categories ===
INSERT INTO ai_model_categories
  (slug, name, short_name, display_order, color, icon_name, created_at, updated_at)
VALUES
  ('text-generation', 'Text Generation', 'TextGen', 10, '#3f51b5', 'text_fields', now(), now()),
  ('image-generation', 'Image Generation', 'Images', 20, '#e65100', 'image', now(), now()),
  ('video-generation', 'Video Generation', 'Video', 30, '#6a1b9a', 'videocam', now(), now()),
  ('voice-synthesis', 'Voice Synthesis', 'TTS', 40, '#004d40', 'volume_up', now(), now()),
  ('transcription', 'Speech Transcription', 'STT', 50, '#880e4f', 'record_voice_over', now(), now());

-- === Models ===
INSERT INTO ai_models
  (id, slug, name, provider, category_slug, status, performance, last_used_label, is_favorite_default, has_documentation, badge, display_color, card_description, docs_index_description, models_page_payload, docs_index_payload, is_active, sort_order, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'deepseek', 'DeepSeek', 'DeepSeekAI', 'text-generation', 'active', 82, 'recent', FALSE, TRUE, 'official', '#2E7D32',
   'DeepSeek: multimodal LLM for chat, summarization and code generation.',
   'Multimodal LLM focused on conversational flows and retrieval-augmented generation.',
    '{"capabilities":["chat","summarization","code"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions with model=deepseek"}'::jsonb, TRUE, 10, now(), now()),

  (gen_random_uuid(), 'gpt-4', 'GPT-4', 'OpenAI', 'text-generation', 'active', 94, 'high-usage', TRUE, TRUE, 'official', '#0A6EFF',
   'GPT-4: high-capability general purpose LLM for reasoning, coding and dialogue.',
   'Multimodal; excels on reasoning and multi-turn chat.',
   '{"capabilities":["chat","code","reasoning"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 20, now(), now()),

  (gen_random_uuid(), 'qwen-7b', 'Qwen-7B', 'Alibaba', 'text-generation', 'active', 78, 'moderate', FALSE, TRUE, 'official', '#FF6F00',
   'Qwen-7B: bilingual LLM (Chinese/English) optimized for understanding and generation.',
   'Strong Chinese-language support; good for multi-lingual tasks.',
    '{"capabilities":["multilingual","chat"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions with model=qwen-7b"}'::jsonb, TRUE, 30, now(), now()),

  (gen_random_uuid(), 'gemini-pro', 'Gemini Pro', 'Google', 'text-generation', 'active', 92, 'high-usage', FALSE, TRUE, 'official', '#0F9D58',
   'Gemini Pro: Google DeepMind’s multimodal model for reasoning and coding.',
   'Advanced reasoning & multimodal capabilities.',
    '{"capabilities":["multimodal","reasoning","code"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions with model=gemini-pro"}'::jsonb, TRUE, 40, now(), now()),

  (gen_random_uuid(), 'midjourney-v5', 'Midjourney v5', 'Midjourney', 'image-generation', 'active', 88, 'user-favorite', FALSE, TRUE, 'popular', '#7B1FA2',
   'Midjourney v5: creative, high-quality image generation from text prompts.',
   'High quality artistic image generation.',
    '{"capabilities":["text-to-image"]}'::jsonb, '{"quick_start":"POST /v1/images/generate with model=midjourney-v5"}'::jsonb, TRUE, 50, now(), now()),

  (gen_random_uuid(), 'stable-diffusion-v2', 'Stable Diffusion v2', 'Stability AI', 'image-generation', 'active', 80, 'community', FALSE, TRUE, 'open-source', '#37474F',
   'Stable Diffusion v2: open-source latent diffusion model for image synthesis.',
   'Flexible and self-hostable image generation model.',
    '{"capabilities":["text-to-image","inpainting"]}'::jsonb, '{"quick_start":"POST /v1/images/generate with model=stable-diffusion-v2"}'::jsonb, TRUE, 60, now(), now()),

  (gen_random_uuid(), 'runway-gen-3', 'Runway Gen-3', 'Runway', 'video-generation', 'active', 86, 'beta', FALSE, TRUE, 'beta', '#880E4F',
   'Runway Gen-3: text-to-video for short, high-quality clips.',
   'Focused on short-clip text-to-video generation.',
    '{"capabilities":["text-to-video"]}'::jsonb, '{"quick_start":"POST /v1/video/generations with model=runway-gen-3"}'::jsonb, TRUE, 70, now(), now()),

  (gen_random_uuid(), 'elevenlabs-v3', 'ElevenLabs v3', 'ElevenLabs', 'voice-synthesis', 'active', 91, 'studio', FALSE, TRUE, 'official', '#1E88E5',
   'ElevenLabs v3: ultra-realistic TTS with expressive voices and multi-language support.',
   'High-quality neural TTS with expressive control.',
    '{"capabilities":["tts","voice-cloning"]}'::jsonb, '{"quick_start":"POST /v1/text-to-speech with model=elevenlabs-v3"}'::jsonb, TRUE, 80, now(), now()),

  (gen_random_uuid(), 'playht-ultra', 'PlayHT Ultra', 'PlayHT', 'voice-synthesis', 'active', 85, 'streaming', FALSE, TRUE, 'official', '#009688',
   'PlayHT Ultra: streaming TTS with many prebuilt voices.',
   'Real-time streaming TTS and many voice options.',
    '{"capabilities":["streaming-tts"]}'::jsonb, '{"quick_start":"POST /v1/text-to-speech with model=playht-ultra"}'::jsonb, TRUE, 90, now(), now()),

  (gen_random_uuid(), 'coqui-tts', 'Coqui TTS', 'Coqui', 'voice-synthesis', 'active', 76, 'community', FALSE, TRUE, 'open-source', '#6D4C41',
   'Coqui TTS: open-source TTS toolkit, good for custom voices and self-hosting.',
   'Community-driven TTS, supports many languages and custom models.',
    '{"capabilities":["tts","custom-voices"]}'::jsonb, '{"quick_start":"POST /v1/text-to-speech with model=coqui-tts"}'::jsonb, TRUE, 100, now(), now()),

  (gen_random_uuid(), 'whisper-1', 'Whisper', 'OpenAI', 'transcription', 'active', 90, 'robust', FALSE, TRUE, 'official', '#D32F2F',
   'Whisper: OpenAI ASR model with broad language support and robust transcription.',
   'Good general-purpose speech-to-text with multi-language support.',
   '{"capabilities":["transcription","language_detection"]}'::jsonb, '{"quick_start":"POST /v1/audio/transcriptions"}'::jsonb, TRUE, 110, now(), now()),

  (gen_random_uuid(), 'deepgram-nova3', 'Deepgram Nova-3', 'Deepgram', 'transcription', 'active', 88, 'low-latency', FALSE, TRUE, 'official', '#1976D2',
   'Deepgram Nova-3: fast, accurate speech-to-text optimized for real-time usage.',
   'Commercial ASR optimized for real-time and batch with low WER.',
    '{"capabilities":["transcription","real-time"]}'::jsonb, '{"quick_start":"POST /v1/audio/transcriptions with model=deepgram-nova3"}'::jsonb, TRUE, 120, now(), now()),

  (gen_random_uuid(), 'assemblyai-universal1', 'AssemblyAI Universal-1', 'AssemblyAI', 'transcription', 'active', 92, 'enterprise', FALSE, TRUE, 'official', '#283593',
   'AssemblyAI Universal-1: large-scale ASR trained on millions of hours for high accuracy.',
   'Feature-rich transcription with diarization and content detection.',
    '{"capabilities":["transcription","diarization","content_detection"]}'::jsonb, '{"quick_start":"POST /v1/audio/transcriptions with model=assemblyai-universal1"}'::jsonb, TRUE, 130, now(), now());

-- === Features (examples) ===
INSERT INTO ai_model_features (id, model_id, source, feature_text, sort_order, created_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='deepseek'), 'models_page', 'Multimodal chat + retrieval support', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4'), 'models_page', 'Advanced multi-turn dialogue and code generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-7b'), 'models_page', 'Bilingual (Chinese/English) support and long-context', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gemini-pro'), 'models_page', 'Multimodal reasoning and structured outputs', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='midjourney-v5'), 'models_page', 'Artistic, high-detail image creation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='stable-diffusion-v2'), 'models_page', 'Open-source image synthesis and inpainting', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='runway-gen-3'), 'models_page', 'Text-to-video short-clip generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='elevenlabs-v3'), 'models_page', 'Studio-grade neural TTS with expressive control', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='playht-ultra'), 'models_page', 'Streaming TTS and many preset voices', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='coqui-tts'), 'models_page', 'Self-hostable TTS with custom voice training', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='whisper-1'), 'models_page', 'Broad language transcription and noise robustness', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='deepgram-nova3'), 'models_page', 'Low-latency, high-accuracy ASR', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='assemblyai-universal1'), 'models_page', 'Diarization, content detection and high-accuracy ASR', 10, now());

-- === Docs (one row per model) ===
INSERT INTO ai_model_docs
  (model_id, docs_description, endpoint_method, endpoint_path, endpoint_status, response_example, docs_page_payload, created_at, updated_at)
VALUES
  ((SELECT id FROM ai_models WHERE slug='deepseek'),
   'DeepSeek completion endpoint for text generation.',
    'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc123","output":"This is a generated response."}'::text,
   '{"summary":"Use this endpoint to generate completions"}'::jsonb, now(), now()),

  ((SELECT id FROM ai_models WHERE slug='gpt-4'),
   'Chat completion endpoint for GPT-4.',
   'POST', '/v1/chat/completions', 'stable',
   '{"id":"chatcmpl-6","choices":[{"message":{"role":"assistant","content":"Hello"}}]}'::text,
   '{"summary":"Send messages array to /v1/chat/completions"}'::jsonb, now(), now()),

  ((SELECT id FROM ai_models WHERE slug='qwen-7b'),
   'Qwen text completion endpoint.',
    'POST', '/v1/chat/completions', 'stable',
   '{"id":"qwen1","outputs":[{"generated_text":"Answer"}]}'::text,
   '{"summary":"Use qwen completions endpoint"}'::jsonb, now(), now()),

  ((SELECT id FROM ai_models WHERE slug='gemini-pro'),
   'Gemini generate API (chat-style).',
    'POST', '/v1/chat/completions', 'stable',
   '{"id":"gemini1","result":"Response"}'::text,
   '{"summary":"Use /v1/chat/generate for text generation"}'::jsonb, now(), now()),

  ((SELECT id FROM ai_models WHERE slug='midjourney-v5'),
   'Generate images from text prompts with Midjourney v5.',
   'POST', '/v1/images/generate', 'stable',
   '{"images":["https://cdn.midjourney.com/img1.png"]}'::text,
   '{"summary":"Send prompt to images/generate"}'::jsonb, now(), now()),

  ((SELECT id FROM ai_models WHERE slug='stable-diffusion-v2'),
   'Stable Diffusion v2 image generation endpoint.',
    'POST', '/v1/images/generate', 'stable',
   '{"image_url":"https://sd.example.com/img.png"}'::text,
   '{"summary":"Text-to-image via stable-diffusion"}'::jsonb, now(), now()),

  ((SELECT id FROM ai_models WHERE slug='runway-gen-3'),
   'Text-to-video generation endpoint (short clips).',
    'POST', '/v1/video/generations', 'stable',
   '{"video_url":"https://runway.example.com/video.mp4"}'::text,
   '{"summary":"Generate short videos from prompts"}'::jsonb, now(), now()),

  ((SELECT id FROM ai_models WHERE slug='elevenlabs-v3'),
   'Text-to-Speech using ElevenLabs API.',
   'POST', '/v1/text-to-speech', 'stable',
   '{"audio_url":"https://elevenlabs.example.com/audio.mp3"}'::text,
   '{"summary":"Send text and voice parameters to synthesize audio"}'::jsonb, now(), now()),

  ((SELECT id FROM ai_models WHERE slug='playht-ultra'),
   'Streaming text-to-speech endpoint for PlayHT.',
    'POST', '/v1/text-to-speech', 'stable',
   '{"audio_stream_url":"wss://stream.play.ht/stream"}'::text,
   '{"summary":"Realtime TTS streaming"}'::jsonb, now(), now()),

  ((SELECT id FROM ai_models WHERE slug='coqui-tts'),
   'Coqui TTS endpoint for self-hosted or cloud TTS.',
    'POST', '/v1/text-to-speech', 'stable',
   '{"audio_url":"https://coqui.example.com/out.wav"}'::text,
   '{"summary":"Coqui text-to-speech API"}'::jsonb, now(), now()),

  ((SELECT id FROM ai_models WHERE slug='whisper-1'),
   'Whisper audio transcription endpoint.',
   'POST', '/v1/audio/transcriptions', 'stable',
   '{"id":"trans123","text":"Hello world","status":"completed"}'::text,
   '{"summary":"Upload audio URL or file to transcribe"}'::jsonb, now(), now()),

  ((SELECT id FROM ai_models WHERE slug='deepgram-nova3'),
   'Deepgram real-time or batch transcription endpoint.',
    'POST', '/v1/audio/transcriptions', 'stable',
   '{"results":{"channels":[{"alternatives":[{"transcript":"Hello world","confidence":0.98}]}]}}'::text,
   '{"summary":"Submit audio or stream for transcription"}'::jsonb, now(), now()),

  ((SELECT id FROM ai_models WHERE slug='assemblyai-universal1'),
   'AssemblyAI transcription and audio intelligence endpoint.',
    'POST', '/v1/audio/transcriptions', 'stable',
   '{"id":"task123","status":"queued"}'::text,
   '{"summary":"Submit audio URL and poll transcript status"}'::jsonb, now(), now());

-- === Doc Steps (per-model examples) ===
INSERT INTO ai_model_doc_steps (id, model_id, step_order, step_text, created_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='deepseek'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='deepseek'), 2, 'POST JSON { "model":"deepseek", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4'), 1, 'Set Authorization header with OpenAI API key', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4'), 2, 'POST messages array to /v1/chat/completions with model=gpt-4', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='midjourney-v5'), 1, 'POST JSON { "model":"midjourney-v5", "prompt":"...", "num_images":1 } to /v1/images/generate', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='stable-diffusion-v2'), 1, 'POST JSON { "model":"stable-diffusion-v2", "prompt":"...", "width":1024, "height":1024 } to /v1/images/generate', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='runway-gen-3'), 1, 'POST JSON { "model":"runway-gen-3", "duration_seconds": 8 } to /v1/video/generations', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='elevenlabs-v3'), 1, 'POST JSON { "model":"elevenlabs-v3", "text":"Hello" } to /v1/text-to-speech', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='whisper-1'), 1, 'POST form-data model=whisper-1 and duration_seconds to /v1/audio/transcriptions', now());

-- === Doc Parameters (common examples) ===
INSERT INTO ai_model_doc_parameters (id, model_id, param_name, param_type, is_required, default_value, description, sort_order, created_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4'), 'model', 'string', TRUE, 'gpt-4', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with role and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4'), 'temperature', 'float', FALSE, '0.0', 'Sampling temperature (0-2)', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='deepseek'), 'model', 'string', TRUE, 'deepseek', 'Catalog model slug to route and bill this request', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='deepseek'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with role and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='midjourney-v5'), 'model', 'string', TRUE, 'midjourney-v5', 'Catalog model slug for image generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='midjourney-v5'), 'prompt', 'text', TRUE, NULL, 'Text prompt describing desired image', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='midjourney-v5'), 'num_images', 'integer', FALSE, '1', 'Number of images to generate (1-10)', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='midjourney-v5'), 'width', 'integer', FALSE, '1024', 'Output image width in px', 40, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='runway-gen-3'), 'duration_seconds', 'number', TRUE, '8', 'Video duration in seconds', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='elevenlabs-v3'), 'text', 'text', FALSE, NULL, 'Text to synthesize (or provide characters)', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='elevenlabs-v3'), 'characters', 'number', FALSE, NULL, 'Character count fallback when text is omitted', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='whisper-1'), 'duration_seconds', 'number', TRUE, NULL, 'Audio duration in seconds for billing', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='assemblyai-universal1'), 'duration_seconds', 'number', TRUE, NULL, 'Audio duration in seconds for billing', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='deepgram-nova3'), 'duration_seconds', 'number', TRUE, NULL, 'Audio duration in seconds for billing', 10, now());

-- === Doc Examples (one language per model) ===
INSERT INTO ai_model_doc_examples (id, model_id, language, code_example, sort_order, created_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='deepseek'), 'python',
   $$import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'deepseek','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())$$, 10, now()),

  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4'), 'python',
    $$import requests
  headers = {'Authorization': 'Bearer YOUR_KEY'}
  resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'gpt-4','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
  print(resp.json())$$, 10, now()),

  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='midjourney-v5'), 'javascript',
   $$const axios = require('axios');
axios.post('https://api.example.com/v1/images/generate', {model:'midjourney-v5', prompt:'Sunset over mountains', num_images:1}, { headers: { Authorization: 'Bearer YOUR_KEY' }})
  .then(r => console.log(r.data));$$, 10, now()),

  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='elevenlabs-v3'), 'python',
   $$import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/text-to-speech', headers=headers, json={'model':'elevenlabs-v3','text':'Hello world'})
print(resp.json())$$, 10, now()),

  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='whisper-1'), 'javascript',
    $$const axios = require('axios');
  const FormData = require('form-data');
  const form = new FormData();
  form.append('model', 'whisper-1');
  form.append('duration_seconds', '45');
  axios.post('https://api.example.com/v1/audio/transcriptions', form, {headers:{...form.getHeaders(), Authorization:'Bearer YOUR_KEY'}})
    .then(res => console.log(res.data));$$, 10, now());

-- === Pricing (one row per model: input_price, output_price) ===
INSERT INTO ai_model_pricing (model_id, input_price, output_price, price_unit, currency, created_at, updated_at)
VALUES
  ((SELECT id FROM ai_models WHERE slug='deepseek'), 0.020000, 0.040000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='gpt-4'), 0.030000, 0.060000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='qwen-7b'), 0.020000, 0.050000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='gemini-pro'), 0.025000, 0.050000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='midjourney-v5'), 0.010000, 0.100000, 'image', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='stable-diffusion-v2'), 0.005000, 0.030000, 'image', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='runway-gen-3'), 0.010000, 0.020000, 'second', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='elevenlabs-v3'), 0.000120, 0.000005, 'character', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='playht-ultra'), 0.000100, 0.000002, 'character', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='coqui-tts'), 0.000010, 0.000002, 'character', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='whisper-1'), 0.006000, 0.000000, 'minute', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='deepgram-nova3'), 0.030000, 0.000000, 'minute', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='assemblyai-universal1'), 0.048000, 0.000000, 'minute', 'USD', now(), now());
