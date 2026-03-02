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
  (gen_random_uuid(), 'mythomax-13b', 'MythoMax 13B', 'MythoMax', 'text-generation', 'active', 75, 'recent', FALSE, TRUE, 'official', '#1abc9c',
   'MythoMax 13B: advanced open-source LLM for creative writing and code generation.',
   'Multi-purpose large language model for dialogues and programming.',
   '{"capabilities":["chat","code","creative-writing"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions with model=mythomax-13b"}'::jsonb, TRUE, 10, now(), now()),
  (gen_random_uuid(), 'gpt-4', 'GPT-4', 'OpenAI', 'text-generation', 'active', 94, 'high-usage', TRUE, TRUE, 'official', '#0A6EFF',
   'GPT-4: high-capability general purpose LLM for reasoning, coding, and dialogue.',
   'Multimodal; excels on reasoning and multi-turn chat.',
   '{"capabilities":["chat","code","reasoning"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 20, now(), now()),
  (gen_random_uuid(), 'claude-3-haiku', 'Claude 3 Haiku', 'Anthropic', 'text-generation', 'active', 85, 'recent', FALSE, TRUE, 'official', '#FF9800',
   'Claude 3 Haiku: lightweight Anthropic LLM with a focus on safe and helpful conversation.',
   'Lite model; optimized for fast, helpful dialogue.',
   '{"capabilities":["chat","safety"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 30, now(), now()),
  (gen_random_uuid(), 'mistral-large', 'Mistral Large', 'Mistral', 'text-generation', 'active', 88, 'recent', FALSE, TRUE, 'open-source', '#4CAF50',
   'Mistral Large: open-source LLM focusing on long-context reasoning and high throughput.',
   'Open-source model with strong multi-turn capabilities.',
   '{"capabilities":["chat","reasoning","long-context"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 40, now(), now()),
  (gen_random_uuid(), 'llamaguard-2-8b', 'LlamaGuard 2 8B', 'Meta', 'text-generation', 'active', 70, 'beta', FALSE, TRUE, 'beta', '#795548',
   'LlamaGuard 2 8B: security-focused version of Llama 2, designed for safe outputs and customization.',
   'Safety-first LLM with bias mitigation.',
   '{"capabilities":["chat","security","customization"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 50, now(), now()),
  (gen_random_uuid(), 'gpt-4o-extended', 'GPT-4o (Extended)', 'OpenAI', 'text-generation', 'active', 90, 'recent', FALSE, TRUE, 'official', '#3F51B5',
   'GPT-4o (Extended): GPT-4 variant with extended context window for specialized tasks.',
   'Extended GPT model with longer context support.',
   '{"capabilities":["chat","code","long-context"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 60, now(), now()),
  (gen_random_uuid(), 'wizardlm-2-8x22b', 'WizardLM-2 8x22B', 'WizardLM', 'text-generation', 'active', 80, 'community', FALSE, TRUE, 'open-source', '#673AB7',
   'WizardLM-2 8x22B: multi-agent model optimized for instruction-following and knowledge queries.',
   'Expert system LLM with knowledge integration.',
   '{"capabilities":["chat","knowledge","code"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 70, now(), now()),
  (gen_random_uuid(), 'mixtral-8x22b-instruct', 'Mixtral 8x22B (Instruct)', 'Mistral', 'text-generation', 'active', 83, 'recent', FALSE, TRUE, 'open-source', '#FF5722',
   'Mixtral 8x22B (Instruct): Mistral’s mixture-of-experts model fine-tuned for instructions and creative tasks.',
   'Mixture of experts model for structured tasks.',
   '{"capabilities":["chat","creative","structure"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 80, now(), now()),
  (gen_random_uuid(), 'weaver-alpha', 'Weaver (Alpha)', 'Mancer', 'text-generation', 'active', 65, 'beta', FALSE, TRUE, 'beta', '#9C27B0',
   'Weaver (Alpha): experimental LLM from Mancer with early access for feedback.',
   'Early access model for research.',
   '{"capabilities":["chat","experimental"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 90, now(), now()),
  (gen_random_uuid(), 'gpt-4-turbo-older-v1106', 'GPT-4 Turbo (V1106)', 'OpenAI', 'text-generation', 'active', 90, 'studio', FALSE, TRUE, 'legacy', '#2196F3',
   'GPT-4 Turbo (V1106): older GPT-4 variant optimized for speed; still supported but superseded.',
   'Legacy GPT-4 model with faster inference.',
   '{"capabilities":["chat","code"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 100, now(), now()),
  (gen_random_uuid(), 'gpt-3-5-turbo-older-v0613', 'GPT-3.5 Turbo (V0613)', 'OpenAI', 'text-generation', 'active', 75, 'community', FALSE, TRUE, 'legacy', '#1E88E5',
   'GPT-3.5 Turbo (V0613): older GPT-3.5 chat model; widely used for compatibility and lower cost.',
   'Classic GPT-3.5 chat assistant.',
   '{"capabilities":["chat"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 110, now(), now()),
  (gen_random_uuid(), 'gpt-4-turbo', 'GPT-4 Turbo', 'OpenAI', 'text-generation', 'active', 92, 'high-usage', FALSE, TRUE, 'official', '#4CAF50',
   'GPT-4 Turbo: faster and cheaper GPT-4 for general chat and coding tasks.',
   'High-efficiency GPT model for everyday use.',
   '{"capabilities":["chat","code","fast"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 120, now(), now()),
  (gen_random_uuid(), 'llama-3-1-40b', 'Llama 3.1 40B Instruct', 'Meta', 'text-generation', 'active', 80, 'recent', FALSE, TRUE, 'beta', '#795548',
   'Llama 3.1 40B Instruct: Meta’s bilingual LLM for research and applications.',
   'Large-scale multilingual model with instruction tuning.',
   '{"capabilities":["chat","multilingual","instruct"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 130, now(), now()),
  (gen_random_uuid(), 'llama-3-70b', 'Llama 3 70B Instruct', 'Meta', 'text-generation', 'active', 85, 'recent', FALSE, TRUE, 'official', '#9E9D24',
   'Llama 3 70B Instruct: Meta’s most capable LLM for demanding tasks.',
   'High-capacity model for general AI tasks.',
   '{"capabilities":["chat","powerful","multilingual"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 140, now(), now()),
  (gen_random_uuid(), 'hermes-2-pro', 'Hermes 2 Pro (Llama-3 8B)', 'NousResearch', 'text-generation', 'active', 78, 'community', FALSE, TRUE, 'official', '#f44336',
   'Hermes 2 Pro: NousResearch’s LLM fine-tuned from Llama 3 (8B) for code generation.',
   'Developer-focused model with code emphasis.',
   '{"capabilities":["chat","code","multilingual"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 150, now(), now()),
  (gen_random_uuid(), 'mistral-7b-instruct-v0-3', 'Mistral 7B Instruct V0.3', 'Mistral', 'text-generation', 'active', 60, 'beta', FALSE, TRUE, 'open-source', '#00bcd4',
   'Mistral 7B V0.3: lightweight open-source model for on-device inference and experimentation.',
   'Compact LLM suitable for edge devices.',
   '{"capabilities":["chat","instruct"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 160, now(), now()),
  (gen_random_uuid(), 'qwen-122b-a10b', 'Qwen3.5 122B A10B', 'Alibaba', 'text-generation', 'active', 88, 'recent', FALSE, TRUE, 'official', '#FF6F00',
   'Qwen 3.5 122B: Alibaba’s large bilingual model with strong code completion.',
   'Massively multilingual model focused on coding tasks.',
   '{"capabilities":["multilingual","code"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 170, now(), now()),
  (gen_random_uuid(), 'qwen-35b-a3b', 'Qwen3.5 35B A3B', 'Alibaba', 'text-generation', 'active', 80, 'recent', FALSE, TRUE, 'official', '#FF6F00',
   'Qwen 3.5 35B: bilingual (Chinese/English) LLM by Alibaba for versatile text tasks.',
   'General-purpose bilingual LLM from Alibaba Cloud.',
   '{"capabilities":["multilingual","chat"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 180, now(), now()),
  (gen_random_uuid(), 'nano-banana-2', 'Nano Banana 2', 'Google', 'text-generation', 'active', 77, 'recent', FALSE, TRUE, 'beta', '#0F9D58',
   'Nano Banana 2 (Gemini 3.1 Flash): Google’s vision-language preview model for quick image-based queries.',
   'Early Gemini preview with image understanding.',
   '{"capabilities":["vision","chat"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 190, now(), now()),
  (gen_random_uuid(), 'aion-2-0', 'Aion-2.0', 'AionLabs', 'text-generation', 'active', 65, 'recent', FALSE, TRUE, 'beta', '#009688',
   'Aion-2.0: domain-specific AI for financial data analysis and summarization.',
   'Business-focused model specialized in analytics.',
   '{"capabilities":["analytics","summarization"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 200, now(), now()),
  (gen_random_uuid(), 'qwen-397b-a17b', 'Qwen3.5 397B A17B', 'Alibaba', 'text-generation', 'active', 90, 'recent', FALSE, TRUE, 'official', '#FF6F00',
   'Qwen 3.5 397B: ultra-large variant of Alibaba’s Qwen series for maximum capability.',
   'Extremely large-scale transformer for maximum performance.',
   '{"capabilities":["multilingual","powerful"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 210, now(), now()),
  (gen_random_uuid(), 'seed-2-0-mini', 'Seed-2.0-Mini', 'ByteDance', 'text-generation', 'active', 50, 'beta', FALSE, TRUE, 'open-source', '#FF4081',
   'Seed-2.0-Mini: ByteDance’s small LLM for fast inference and on-device use.',
   'Compact model for lightweight applications.',
   '{"capabilities":["efficiency","compression"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 220, now(), now()),
  (gen_random_uuid(), 'gemini-3-1-pro-preview-customtools', 'Gemini 3.1 Pro (Preview)', 'Google', 'text-generation', 'active', 88, 'beta', FALSE, TRUE, 'beta', '#4285F4',
   'Gemini 3.1 Pro (Preview): Google’s advanced chat model with integrated tool usage.',
   'Preview of Gemini 3.1 with custom tools support.',
   '{"capabilities":["chat","tools","multimodal"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 230, now(), now()),
  (gen_random_uuid(), 'qwen-27b', 'Qwen3.5 27B', 'Alibaba', 'text-generation', 'active', 70, 'recent', FALSE, TRUE, 'open-source', '#FF6F00',
   'Qwen 3.5 27B: medium-scale model by Alibaba for balance of performance and efficiency.',
   'Efficient sized model for general tasks.',
   '{"capabilities":["multilingual","chat"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 240, now(), now()),
  (gen_random_uuid(), 'qwen-flash', 'Qwen3.5 Flash', 'Alibaba', 'text-generation', 'active', 85, 'recent', FALSE, TRUE, 'official', '#FF6F00',
   'Qwen 3.5 Flash: highly optimized version of Qwen for ultra-fast performance.',
   'Speed-optimized LLM for low-latency inference.',
   '{"capabilities":["fast-inference","chat"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 250, now(), now()),
  (gen_random_uuid(), 'llama-2-24b-a2b', 'Llama 2 24B A2B', 'LiquidAI', 'text-generation', 'active', 65, 'studio', FALSE, TRUE, 'beta', '#000000',
   'Llama 2 24B A2B: LiquidAI’s enterprise-oriented variant of Llama 2 with enhanced security.',
   'Enterprise-ready model with large context support.',
   '{"capabilities":["security","enterprise"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 260, now(), now()),
  (gen_random_uuid(), 'gpt-3-5-codex', 'GPT-3.5 Codex', 'OpenAI', 'text-generation', 'active', 75, 'community', FALSE, TRUE, 'official', '#ED8B00',
   'GPT-3.5 Codex: OpenAI’s model specialized for code generation from natural language.',
   'Code completion model derived from GPT-3.5.',
   '{"capabilities":["code","chat"]}'::jsonb, '{"quick_start":"POST /v1/chat/completions"}'::jsonb, TRUE, 270, now(), now());

-- === Features ===
INSERT INTO ai_model_features (id, model_id, source, feature_text, sort_order, created_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mythomax-13b'), 'models_page', 'Creative writing and code proficiency', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mythomax-13b'), 'models_page', 'Large context handling', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mythomax-13b'), 'models_page', 'Open-source and customizable', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4'), 'models_page', 'Advanced multi-turn dialogue', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4'), 'models_page', 'Strong reasoning and coding', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4'), 'models_page', 'Highly versatile across domains', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='claude-3-haiku'), 'models_page', 'Emphasis on safety and helpfulness', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='claude-3-haiku'), 'models_page', 'Fast response times', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='claude-3-haiku'), 'models_page', 'Lightweight architecture', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mistral-large'), 'models_page', 'Open-source community model', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mistral-large'), 'models_page', 'High throughput inference', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mistral-large'), 'models_page', 'Excellent multi-turn memory', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llamaguard-2-8b'), 'models_page', 'Enhanced safety filters', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llamaguard-2-8b'), 'models_page', 'Optimized for deployment', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llamaguard-2-8b'), 'models_page', 'Customizable Llama variant', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4o-extended'), 'models_page', 'Extended context window', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4o-extended'), 'models_page', 'Maintains GPT-4 accuracy', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4o-extended'), 'models_page', 'Multimodal capability', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='wizardlm-2-8x22b'), 'models_page', 'Multi-agent instruction tuning', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='wizardlm-2-8x22b'), 'models_page', 'Knowledge-grounded answers', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='wizardlm-2-8x22b'), 'models_page', 'Optimized for science tasks', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mixtral-8x22b-instruct'), 'models_page', 'Mixture of experts design', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mixtral-8x22b-instruct'), 'models_page', 'Balanced accuracy and speed', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mixtral-8x22b-instruct'), 'models_page', 'Instruction-following optimized', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='weaver-alpha'), 'models_page', 'Alpha research model', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='weaver-alpha'), 'models_page', 'Bleeding-edge improvements', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='weaver-alpha'), 'models_page', 'Focus on diverse dialogues', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4-turbo-older-v1106'), 'models_page', 'Legacy GPT-4 performance', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4-turbo-older-v1106'), 'models_page', 'Optimized for lower latency', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4-turbo-older-v1106'), 'models_page', 'Stable and reliable responses', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-3-5-turbo-older-v0613'), 'models_page', 'Classic GPT-3.5 chat engine', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-3-5-turbo-older-v0613'), 'models_page', 'Cost-effective solution', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-3-5-turbo-older-v0613'), 'models_page', 'Proven stability', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4-turbo'), 'models_page', 'Fast GPT-4 variant', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4-turbo'), 'models_page', 'Cost-efficient for bulk tasks', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4-turbo'), 'models_page', 'High throughput', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-3-1-40b'), 'models_page', 'Large multilingual support', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-3-1-40b'), 'models_page', 'Instruction-tuned knowledge', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-3-1-40b'), 'models_page', 'General-purpose LLM', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-3-70b'), 'models_page', 'State-of-the-art performance', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-3-70b'), 'models_page', 'Huge knowledge base', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-3-70b'), 'models_page', 'High-capacity LLM', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='hermes-2-pro'), 'models_page', 'Llama-3 backbone', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='hermes-2-pro'), 'models_page', 'Code-specialized training', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='hermes-2-pro'), 'models_page', 'Compact and efficient', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mistral-7b-instruct-v0-3'), 'models_page', 'Ultra-compact model', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mistral-7b-instruct-v0-3'), 'models_page', 'Low memory footprint', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mistral-7b-instruct-v0-3'), 'models_page', 'Good inference speed', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-122b-a10b'), 'models_page', 'Ultralarge multilingual LLM', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-122b-a10b'), 'models_page', 'Superior code generation', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-122b-a10b'), 'models_page', 'Bilingual (EN/CN) support', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-35b-a3b'), 'models_page', 'Balanced bilingual LLM', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-35b-a3b'), 'models_page', 'General knowledge tasks', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-35b-a3b'), 'models_page', 'Chinese/English support', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='nano-banana-2'), 'models_page', 'Vision-language preview', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='nano-banana-2'), 'models_page', 'Optimized for mobile devices', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='nano-banana-2'), 'models_page', 'Early Gemini model', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='aion-2-0'), 'models_page', 'Business domain expertise', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='aion-2-0'), 'models_page', 'Data analysis specialization', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='aion-2-0'), 'models_page', 'Financial data handling', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-397b-a17b'), 'models_page', 'Massive context capability', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-397b-a17b'), 'models_page', 'High-end performance', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-397b-a17b'), 'models_page', 'Cutting-edge research', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='seed-2-0-mini'), 'models_page', 'Tiny footprint model', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='seed-2-0-mini'), 'models_page', 'Fast on-device inference', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='seed-2-0-mini'), 'models_page', 'Open-source variant', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gemini-3-1-pro-preview-customtools'), 'models_page', 'Integrated tools support', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gemini-3-1-pro-preview-customtools'), 'models_page', 'Advanced multimodal AI', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gemini-3-1-pro-preview-customtools'), 'models_page', 'Preview release', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-27b'), 'models_page', 'Mid-sized Alibaba LLM', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-27b'), 'models_page', 'Efficient performance', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-27b'), 'models_page', 'Versatile chat model', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-flash'), 'models_page', 'Ultra-fast variant', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-flash'), 'models_page', 'Optimized architecture', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-flash'), 'models_page', 'Low-latency outputs', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-2-24b-a2b'), 'models_page', 'Enterprise security enhancements', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-2-24b-a2b'), 'models_page', 'Large context support', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-2-24b-a2b'), 'models_page', 'High reliability', 30, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-3-5-codex'), 'models_page', 'Focused on code generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-3-5-codex'), 'models_page', 'Understands natural language', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-3-5-codex'), 'models_page', 'Legacy code assistant', 30, now());

-- === Docs (one row per model) ===
INSERT INTO ai_model_docs
  (model_id, docs_description, endpoint_method, endpoint_path, endpoint_status, response_example, docs_page_payload, created_at, updated_at)
VALUES
  ((SELECT id FROM ai_models WHERE slug='mythomax-13b'),
   'MythoMax 13B chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with MythoMax 13B."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='gpt-4'),
   'GPT-4 chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with GPT-4."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='claude-3-haiku'),
   'Claude 3 Haiku chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Claude 3 Haiku."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='mistral-large'),
   'Mistral Large chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Mistral Large."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='llamaguard-2-8b'),
   'LlamaGuard 2 8B chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with LlamaGuard 2 8B."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='gpt-4o-extended'),
   'GPT-4o (Extended) chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with GPT-4o (Extended)."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='wizardlm-2-8x22b'),
   'WizardLM-2 8x22B chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with WizardLM-2 8x22B."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='mixtral-8x22b-instruct'),
   'Mixtral 8x22B (Instruct) chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Mixtral 8x22B (Instruct)."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='weaver-alpha'),
   'Weaver (Alpha) chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Weaver (Alpha)."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='gpt-4-turbo-older-v1106'),
   'GPT-4 Turbo (V1106) chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with GPT-4 Turbo (V1106)."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='gpt-3-5-turbo-older-v0613'),
   'GPT-3.5 Turbo (V0613) chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with GPT-3.5 Turbo (V0613)."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='gpt-4-turbo'),
   'GPT-4 Turbo chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with GPT-4 Turbo."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='llama-3-1-40b'),
   'Llama 3.1 40B Instruct chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Llama 3.1 40B Instruct."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='llama-3-70b'),
   'Llama 3 70B Instruct chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Llama 3 70B Instruct."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='hermes-2-pro'),
   'Hermes 2 Pro chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Hermes 2 Pro."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='mistral-7b-instruct-v0-3'),
   'Mistral 7B Instruct V0.3 chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Mistral 7B Instruct V0.3."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='qwen-122b-a10b'),
   'Qwen3.5 122B A10B chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Qwen3.5 122B A10B."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='qwen-35b-a3b'),
   'Qwen3.5 35B A3B chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Qwen3.5 35B A3B."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='nano-banana-2'),
   'Nano Banana 2 chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Nano Banana 2."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='aion-2-0'),
   'Aion-2.0 chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Aion-2.0."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='qwen-397b-a17b'),
   'Qwen3.5 397B A17B chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Qwen3.5 397B A17B."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='seed-2-0-mini'),
   'Seed-2.0-Mini chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Seed-2.0-Mini."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='gemini-3-1-pro-preview-customtools'),
   'Gemini 3.1 Pro (Preview) chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Gemini 3.1 Pro (Preview)."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='qwen-27b'),
   'Qwen3.5 27B chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Qwen3.5 27B."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='qwen-flash'),
   'Qwen3.5 Flash chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Qwen3.5 Flash."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='llama-2-24b-a2b'),
   'Llama 2 24B A2B chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with Llama 2 24B A2B."}'::jsonb, now(), now()),
  ((SELECT id FROM ai_models WHERE slug='gpt-3-5-codex'),
   'GPT-3.5 Codex chat completion endpoint.', 'POST', '/v1/chat/completions', 'stable',
   '{"id":"abc","choices":[{"message":{"role":"assistant","content":"Hello!"}}]}'::text,
   '{"summary":"Use this endpoint to generate responses with GPT-3.5 Codex."}'::jsonb, now(), now());

-- === Doc Steps (per-model examples) ===
INSERT INTO ai_model_doc_steps (id, model_id, step_order, step_text, created_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mythomax-13b'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mythomax-13b'), 2, 'POST JSON { "model":"mythomax-13b", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4'), 2, 'POST JSON { "model":"gpt-4", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='claude-3-haiku'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='claude-3-haiku'), 2, 'POST JSON { "model":"claude-3-haiku", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mistral-large'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mistral-large'), 2, 'POST JSON { "model":"mistral-large", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llamaguard-2-8b'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llamaguard-2-8b'), 2, 'POST JSON { "model":"llamaguard-2-8b", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4o-extended'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4o-extended'), 2, 'POST JSON { "model":"gpt-4o-extended", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='wizardlm-2-8x22b'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='wizardlm-2-8x22b'), 2, 'POST JSON { "model":"wizardlm-2-8x22b", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mixtral-8x22b-instruct'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mixtral-8x22b-instruct'), 2, 'POST JSON { "model":"mixtral-8x22b-instruct", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='weaver-alpha'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='weaver-alpha'), 2, 'POST JSON { "model":"weaver-alpha", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4-turbo-older-v1106'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4-turbo-older-v1106'), 2, 'POST JSON { "model":"gpt-4-turbo-older-v1106", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-3-5-turbo-older-v0613'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-3-5-turbo-older-v0613'), 2, 'POST JSON { "model":"gpt-3-5-turbo-older-v0613", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4-turbo'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4-turbo'), 2, 'POST JSON { "model":"gpt-4-turbo", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-3-1-40b'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-3-1-40b'), 2, 'POST JSON { "model":"llama-3-1-40b", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-3-70b'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-3-70b'), 2, 'POST JSON { "model":"llama-3-70b", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='hermes-2-pro'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='hermes-2-pro'), 2, 'POST JSON { "model":"hermes-2-pro", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mistral-7b-instruct-v0-3'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mistral-7b-instruct-v0-3'), 2, 'POST JSON { "model":"mistral-7b-instruct-v0-3", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-122b-a10b'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-122b-a10b'), 2, 'POST JSON { "model":"qwen-122b-a10b", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-35b-a3b'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-35b-a3b'), 2, 'POST JSON { "model":"qwen-35b-a3b", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='nano-banana-2'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='nano-banana-2'), 2, 'POST JSON { "model":"nano-banana-2", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='aion-2-0'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='aion-2-0'), 2, 'POST JSON { "model":"aion-2-0", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-397b-a17b'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-397b-a17b'), 2, 'POST JSON { "model":"qwen-397b-a17b", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='seed-2-0-mini'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='seed-2-0-mini'), 2, 'POST JSON { "model":"seed-2-0-mini", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gemini-3-1-pro-preview-customtools'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gemini-3-1-pro-preview-customtools'), 2, 'POST JSON { "model":"gemini-3-1-pro-preview-customtools", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-27b'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-27b'), 2, 'POST JSON { "model":"qwen-27b", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-flash'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-flash'), 2, 'POST JSON { "model":"qwen-flash", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-2-24b-a2b'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-2-24b-a2b'), 2, 'POST JSON { "model":"llama-2-24b-a2b", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-3-5-codex'), 1, 'Set Authorization header: Bearer YOUR_API_KEY', now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-3-5-codex'), 2, 'POST JSON { "model":"gpt-3-5-codex", "messages":[{"role":"user","content":"Hello"}] } to /v1/chat/completions', now());

-- === Doc Parameters (common examples) ===
INSERT INTO ai_model_doc_parameters (id, model_id, param_name, param_type, is_required, default_value, description, sort_order, created_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mythomax-13b'), 'model', 'string', TRUE, 'mythomax-13b', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mythomax-13b'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4'), 'model', 'string', TRUE, 'gpt-4', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='claude-3-haiku'), 'model', 'string', TRUE, 'claude-3-haiku', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='claude-3-haiku'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mistral-large'), 'model', 'string', TRUE, 'mistral-large', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mistral-large'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llamaguard-2-8b'), 'model', 'string', TRUE, 'llamaguard-2-8b', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llamaguard-2-8b'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4o-extended'), 'model', 'string', TRUE, 'gpt-4o-extended', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4o-extended'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='wizardlm-2-8x22b'), 'model', 'string', TRUE, 'wizardlm-2-8x22b', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='wizardlm-2-8x22b'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mixtral-8x22b-instruct'), 'model', 'string', TRUE, 'mixtral-8x22b-instruct', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mixtral-8x22b-instruct'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='weaver-alpha'), 'model', 'string', TRUE, 'weaver-alpha', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='weaver-alpha'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4-turbo-older-v1106'), 'model', 'string', TRUE, 'gpt-4-turbo-older-v1106', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4-turbo-older-v1106'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-3-5-turbo-older-v0613'), 'model', 'string', TRUE, 'gpt-3-5-turbo-older-v0613', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-3-5-turbo-older-v0613'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4-turbo'), 'model', 'string', TRUE, 'gpt-4-turbo', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4-turbo'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-3-1-40b'), 'model', 'string', TRUE, 'llama-3-1-40b', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-3-1-40b'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-3-70b'), 'model', 'string', TRUE, 'llama-3-70b', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-3-70b'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='hermes-2-pro'), 'model', 'string', TRUE, 'hermes-2-pro', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='hermes-2-pro'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mistral-7b-instruct-v0-3'), 'model', 'string', TRUE, 'mistral-7b-instruct-v0-3', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mistral-7b-instruct-v0-3'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-122b-a10b'), 'model', 'string', TRUE, 'qwen-122b-a10b', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-122b-a10b'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-35b-a3b'), 'model', 'string', TRUE, 'qwen-35b-a3b', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-35b-a3b'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='nano-banana-2'), 'model', 'string', TRUE, 'nano-banana-2', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='nano-banana-2'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='aion-2-0'), 'model', 'string', TRUE, 'aion-2-0', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='aion-2-0'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-397b-a17b'), 'model', 'string', TRUE, 'qwen-397b-a17b', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-397b-a17b'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='seed-2-0-mini'), 'model', 'string', TRUE, 'seed-2-0-mini', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='seed-2-0-mini'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gemini-3-1-pro-preview-customtools'), 'model', 'string', TRUE, 'gemini-3-1-pro-preview-customtools', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gemini-3-1-pro-preview-customtools'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-27b'), 'model', 'string', TRUE, 'qwen-27b', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-27b'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-flash'), 'model', 'string', TRUE, 'qwen-flash', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-flash'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-2-24b-a2b'), 'model', 'string', TRUE, 'llama-2-24b-a2b', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-2-24b-a2b'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-3-5-codex'), 'model', 'string', TRUE, 'gpt-3-5-codex', 'Model identifier to use for generation', 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-3-5-codex'), 'messages', 'json[]', TRUE, NULL, 'Array of message objects with roles and content', 20, now());

-- === Doc Examples (one per model) ===
INSERT INTO ai_model_doc_examples (id, model_id, language, code_example, sort_order, created_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mythomax-13b'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'mythomax-13b','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'gpt-4','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='claude-3-haiku'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'claude-3-haiku','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mistral-large'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'mistral-large','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llamaguard-2-8b'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'llamaguard-2-8b','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4o-extended'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'gpt-4o-extended','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='wizardlm-2-8x22b'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'wizardlm-2-8x22b','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mixtral-8x22b-instruct'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'mixtral-8x22b-instruct','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='weaver-alpha'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'weaver-alpha','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4-turbo-older-v1106'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'gpt-4-turbo-older-v1106','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-3-5-turbo-older-v0613'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'gpt-3-5-turbo-older-v0613','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-4-turbo'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'gpt-4-turbo','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-3-1-40b'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'llama-3-1-40b','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-3-70b'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'llama-3-70b','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='hermes-2-pro'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'hermes-2-pro','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='mistral-7b-instruct-v0-3'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'mistral-7b-instruct-v0-3','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-122b-a10b'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'qwen-122b-a10b','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-35b-a3b'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'qwen-35b-a3b','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='nano-banana-2'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'nano-banana-2','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='aion-2-0'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'aion-2-0','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-397b-a17b'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'qwen-397b-a17b','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='seed-2-0-mini'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'seed-2-0-mini','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gemini-3-1-pro-preview-customtools'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'gemini-3-1-pro-preview-customtools','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-27b'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'qwen-27b','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='qwen-flash'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'qwen-flash','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='llama-2-24b-a2b'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'llama-2-24b-a2b','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now()),
  (gen_random_uuid(), (SELECT id FROM ai_models WHERE slug='gpt-3-5-codex'), 'python', $$
import requests
headers = {'Authorization': 'Bearer YOUR_KEY'}
resp = requests.post('https://api.example.com/v1/chat/completions', json={'model':'gpt-3-5-codex','messages':[{'role':'user','content':'Hello'}]}, headers=headers)
print(resp.json())
$$, 10, now());

-- === Pricing (per model) ===
INSERT INTO ai_model_pricing (model_id, input_price, output_price, price_unit, currency, created_at, updated_at)
VALUES
  ((SELECT id FROM ai_models WHERE slug='mythomax-13b'), 0.020000, 0.040000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='gpt-4'), 0.030000, 0.060000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='claude-3-haiku'), 0.018000, 0.036000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='mistral-large'), 0.015000, 0.030000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='llamaguard-2-8b'), 0.010000, 0.020000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='gpt-4o-extended'), 0.030000, 0.060000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='wizardlm-2-8x22b'), 0.012000, 0.025000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='mixtral-8x22b-instruct'), 0.012000, 0.024000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='weaver-alpha'), 0.010000, 0.020000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='gpt-4-turbo-older-v1106'), 0.025000, 0.050000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='gpt-3-5-turbo-older-v0613'), 0.005000, 0.005000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='gpt-4-turbo'), 0.020000, 0.040000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='llama-3-1-40b'), 0.020000, 0.040000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='llama-3-70b'), 0.025000, 0.050000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='hermes-2-pro'), 0.015000, 0.030000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='mistral-7b-instruct-v0-3'), 0.005000, 0.010000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='qwen-122b-a10b'), 0.025000, 0.050000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='qwen-35b-a3b'), 0.020000, 0.040000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='nano-banana-2'), 0.025000, 0.050000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='aion-2-0'), 0.015000, 0.030000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='qwen-397b-a17b'), 0.035000, 0.070000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='seed-2-0-mini'), 0.005000, 0.010000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='gemini-3-1-pro-preview-customtools'), 0.025000, 0.050000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='qwen-27b'), 0.015000, 0.030000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='qwen-flash'), 0.015000, 0.030000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='llama-2-24b-a2b'), 0.020000, 0.040000, '1k tokens', 'USD', now(), now()),
  ((SELECT id FROM ai_models WHERE slug='gpt-3-5-codex'), 0.020000, 0.060000, '1k tokens', 'USD', now(), now());
