-- Generated model catalog seed data
BEGIN;
CREATE TEMP TABLE IF NOT EXISTS seed_model_ids (slug TEXT PRIMARY KEY, id UUID);
TRUNCATE ai_model_doc_examples, ai_model_doc_parameters, ai_model_doc_steps, ai_model_docs, ai_model_features, ai_model_pricing, ai_models, ai_model_categories RESTART IDENTITY CASCADE;
INSERT INTO ai_model_categories (slug, name, short_name, display_order, color, icon_name) VALUES ('conversational', 'Conversational', 'Conversational', 1, '#6366f1', 'Bot') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, short_name = EXCLUDED.short_name, display_order = EXCLUDED.display_order, color = EXCLUDED.color, icon_name = EXCLUDED.icon_name, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_categories (slug, name, short_name, display_order, color, icon_name) VALUES ('voice', 'Voice', 'Voice', 2, '#10b981', 'Mic') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, short_name = EXCLUDED.short_name, display_order = EXCLUDED.display_order, color = EXCLUDED.color, icon_name = EXCLUDED.icon_name, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_categories (slug, name, short_name, display_order, color, icon_name) VALUES ('video', 'Video', 'Video', 3, '#f59e0b', 'Video') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, short_name = EXCLUDED.short_name, display_order = EXCLUDED.display_order, color = EXCLUDED.color, icon_name = EXCLUDED.icon_name, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_categories (slug, name, short_name, display_order, color, icon_name) VALUES ('llm', 'LLMs', 'LLM', 4, '#06b6d4', 'Brain') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, short_name = EXCLUDED.short_name, display_order = EXCLUDED.display_order, color = EXCLUDED.color, icon_name = EXCLUDED.icon_name, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_categories (slug, name, short_name, display_order, color, icon_name) VALUES ('livestreaming', 'Live Streaming', 'Live', 5, '#ec4899', 'Radio') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, short_name = EXCLUDED.short_name, display_order = EXCLUDED.display_order, color = EXCLUDED.color, icon_name = EXCLUDED.icon_name, updated_at = CURRENT_TIMESTAMP;
-- Model: gpt-4-turbo
WITH upsert_model AS (
  INSERT INTO ai_models (
    slug, name, provider, category_slug, status, performance, last_used_label, is_favorite_default, has_documentation,
    badge, display_color, card_description, docs_index_description, models_page_payload, docs_index_payload, sort_order
  )
  VALUES ('gpt-4-turbo', 'GPT-4 Turbo', 'OpenAI', 'conversational', 'active', 98, '2 min ago', TRUE, TRUE,
    'Popular', '#6366f1', 'Advanced conversational AI with context understanding, code generation and vision.', 'Advanced conversational AI with deep context understanding, code generation and creative writing.', $q${"id":"1","name":"GPT-4 Turbo","provider":"OpenAI","category":"conversational","status":"active","performance":98,"lastUsed":"2 min ago","slug":"gpt-4-turbo","hasDocumentation":true,"isFavorite":true,"description":"Advanced conversational AI with context understanding, code generation and vision.","features":["Context Memory","Multi-turn","Code Gen","Vision"]}$q$::jsonb, $q${"slug":"gpt-4-turbo","name":"GPT-4 Turbo","provider":"OpenAI","category":"conversational","badge":"Popular","description":"Advanced conversational AI with deep context understanding, code generation and creative writing.","features":["Context Memory","Multi-turn","Code Gen","Vision"],"pricing":{"input":"0.010","output":"0.030","unit":"1K tokens"}}$q$::jsonb, 0
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    provider = EXCLUDED.provider,
    category_slug = EXCLUDED.category_slug,
    status = EXCLUDED.status,
    performance = EXCLUDED.performance,
    last_used_label = EXCLUDED.last_used_label,
    is_favorite_default = EXCLUDED.is_favorite_default,
    has_documentation = EXCLUDED.has_documentation,
    badge = EXCLUDED.badge,
    display_color = EXCLUDED.display_color,
    card_description = EXCLUDED.card_description,
    docs_index_description = EXCLUDED.docs_index_description,
    models_page_payload = EXCLUDED.models_page_payload,
    docs_index_payload = EXCLUDED.docs_index_payload,
    sort_order = EXCLUDED.sort_order,
    updated_at = CURRENT_TIMESTAMP
  RETURNING id
)
INSERT INTO seed_model_ids (slug, id)
SELECT 'gpt-4-turbo', id FROM upsert_model
ON CONFLICT (slug) DO UPDATE SET id = EXCLUDED.id;
INSERT INTO ai_model_pricing (model_id, input_price, output_price, price_unit, currency) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 0.01, 0.03, '1K tokens', 'USD') ON CONFLICT (model_id) DO UPDATE SET input_price = EXCLUDED.input_price, output_price = EXCLUDED.output_price, price_unit = EXCLUDED.price_unit, currency = EXCLUDED.currency, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'models_page', 'Context Memory', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'models_page', 'Multi-turn', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'models_page', 'Code Gen', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'models_page', 'Vision', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'docs_index', 'Context Memory', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'docs_index', 'Multi-turn', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'docs_index', 'Code Gen', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'docs_index', 'Vision', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'docs_page', 'Context Memory', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'docs_page', 'Multi-turn Dialogue', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'docs_page', 'Code Generation', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'docs_page', 'Creative Writing', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'docs_page', 'Vision Input', 4) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'docs_page', 'Function Calling', 5) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_docs (model_id, docs_description, endpoint_method, endpoint_path, endpoint_status, response_example, docs_page_payload) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'Advanced conversational AI with deep context understanding, code generation, creative writing and vision capabilities. Best for complex multi-turn tasks that demand reasoning and creativity.', 'POST', '/v1/chat/completions', 'Stable', $q${
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
}$q$, $q${"name":"GPT-4 Turbo","provider":"OpenAI","category":"conversational","color":"#6366f1","description":"Advanced conversational AI with deep context understanding, code generation, creative writing and vision capabilities. Best for complex multi-turn tasks that demand reasoning and creativity.","features":["Context Memory","Multi-turn Dialogue","Code Generation","Creative Writing","Vision Input","Function Calling"],"steps":["Generate your API key in the APIs section","Include it as a Bearer token in the Authorization header","POST to /v1/chat/completions with your messages array"],"endpoint":{"method":"POST","path":"/v1/chat/completions","status":"Stable"},"params":[{"name":"model","type":"string","req":true,"default":"—","desc":"Model identifier to use for this request"},{"name":"messages","type":"array","req":true,"default":"—","desc":"Array of message objects forming the conversation"},{"name":"max_tokens","type":"integer","req":false,"default":"4096","desc":"Maximum number of tokens to generate in the response"},{"name":"temperature","type":"float","req":false,"default":"1.0","desc":"Sampling temperature between 0.0 and 2.0 — lower = deterministic"},{"name":"top_p","type":"float","req":false,"default":"1.0","desc":"Nucleus sampling probability mass"},{"name":"stream","type":"boolean","req":false,"default":"false","desc":"Stream partial responses via SSE"},{"name":"n","type":"integer","req":false,"default":"1","desc":"Number of completions to generate"}],"response":"{\n  \"id\": \"chatcmpl-abc123\",\n  \"object\": \"chat.completion\",\n  \"created\": 1714000000,\n  \"model\": \"gpt-4-turbo\",\n  \"choices\": [\n    {\n      \"index\": 0,\n      \"message\": {\n        \"role\": \"assistant\",\n        \"content\": \"Hello! How can I help you today?\"\n      },\n      \"finish_reason\": \"stop\"\n    }\n  ],\n  \"usage\": {\n    \"prompt_tokens\": 12,\n    \"completion_tokens\": 9,\n    \"total_tokens\": 21\n  }\n}","examples":{"Python":"import requests\n\nurl = \"https://api.Modelsnest.com/v1/chat/completions\"\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\ndata = {\n    \"model\": \"gpt-4-turbo\",\n    \"messages\": [\n        {\"role\": \"system\", \"content\": \"You are a helpful assistant.\"},\n        {\"role\": \"user\",   \"content\": \"Explain quantum computing simply.\"}\n    ],\n    \"max_tokens\": 500,\n    \"temperature\": 0.7\n}\n\nres = requests.post(url, headers=headers, json=data)\nprint(res.json()[\"choices\"][0][\"message\"][\"content\"])","JavaScript":"const res = await fetch(\n  \"https://api.Modelsnest.com/v1/chat/completions\",\n  {\n    method: \"POST\",\n    headers: {\n      \"Authorization\": \"Bearer YOUR_API_KEY\",\n      \"Content-Type\": \"application/json\",\n    },\n    body: JSON.stringify({\n      model: \"gpt-4-turbo\",\n      messages: [\n        { role: \"system\", content: \"You are a helpful assistant.\" },\n        { role: \"user\",   content: \"Explain quantum computing simply.\" },\n      ],\n      max_tokens: 500,\n      temperature: 0.7,\n    }),\n  }\n)\nconst data = await res.json()\nconsole.log(data.choices[0].message.content)","cURL":"curl https://api.Modelsnest.com/v1/chat/completions \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"model\": \"gpt-4-turbo\",\n    \"messages\": [\n      {\"role\":\"system\",\"content\":\"You are a helpful assistant.\"},\n      {\"role\":\"user\",\"content\":\"Explain quantum computing simply.\"}\n    ],\n    \"max_tokens\": 500,\n    \"temperature\": 0.7\n  }'"},"pricing":{"input":"0.010","output":"0.030","unit":"1K tokens"}}$q$::jsonb) ON CONFLICT (model_id) DO UPDATE SET docs_description = EXCLUDED.docs_description, endpoint_method = EXCLUDED.endpoint_method, endpoint_path = EXCLUDED.endpoint_path, endpoint_status = EXCLUDED.endpoint_status, response_example = EXCLUDED.response_example, docs_page_payload = EXCLUDED.docs_page_payload, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 0, 'Generate your API key in the APIs section') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 1, 'Include it as a Bearer token in the Authorization header') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 2, 'POST to /v1/chat/completions with your messages array') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'model', 'string', TRUE, '—', 'Model identifier to use for this request', 0) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'messages', 'array', TRUE, '—', 'Array of message objects forming the conversation', 1) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'max_tokens', 'integer', FALSE, '4096', 'Maximum number of tokens to generate in the response', 2) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'temperature', 'float', FALSE, '1.0', 'Sampling temperature between 0.0 and 2.0 — lower = deterministic', 3) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'top_p', 'float', FALSE, '1.0', 'Nucleus sampling probability mass', 4) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'stream', 'boolean', FALSE, 'false', 'Stream partial responses via SSE', 5) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'n', 'integer', FALSE, '1', 'Number of completions to generate', 6) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'Python', $code$import requests

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
print(res.json()["choices"][0]["message"]["content"])$code$, 0) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'JavaScript', $code$const res = await fetch(
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
console.log(data.choices[0].message.content)$code$, 1) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gpt-4-turbo'), 'cURL', $code$curl https://api.Modelsnest.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4-turbo",
    "messages": [
      {"role":"system","content":"You are a helpful assistant."},
      {"role":"user","content":"Explain quantum computing simply."}
    ],
    "max_tokens": 500,
    "temperature": 0.7
  }'$code$, 2) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
-- Model: claude-3-opus
WITH upsert_model AS (
  INSERT INTO ai_models (
    slug, name, provider, category_slug, status, performance, last_used_label, is_favorite_default, has_documentation,
    badge, display_color, card_description, docs_index_description, models_page_payload, docs_index_payload, sort_order
  )
  VALUES ('claude-3-opus', 'Claude 3 Opus', 'Anthropic', 'conversational', 'active', 96, '1 hr ago', FALSE, TRUE,
    NULL, '#8b5cf6', 'High-performance model with enhanced logical reasoning and document analysis.', 'High-performance model with enhanced logical reasoning, document analysis and problem solving.', $q${"id":"2","name":"Claude 3 Opus","provider":"Anthropic","category":"conversational","status":"active","performance":96,"lastUsed":"1 hr ago","slug":"claude-3-opus","hasDocumentation":true,"isFavorite":false,"description":"High-performance model with enhanced logical reasoning and document analysis.","features":["Reasoning","Doc Analysis","Creative","Safe"]}$q$::jsonb, $q${"slug":"claude-3-opus","name":"Claude 3 Opus","provider":"Anthropic","category":"conversational","description":"High-performance model with enhanced logical reasoning, document analysis and problem solving.","features":["Reasoning","Doc Analysis","Creative","Safe"],"pricing":{"input":"0.015","output":"0.075","unit":"1K tokens"}}$q$::jsonb, 1
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    provider = EXCLUDED.provider,
    category_slug = EXCLUDED.category_slug,
    status = EXCLUDED.status,
    performance = EXCLUDED.performance,
    last_used_label = EXCLUDED.last_used_label,
    is_favorite_default = EXCLUDED.is_favorite_default,
    has_documentation = EXCLUDED.has_documentation,
    badge = EXCLUDED.badge,
    display_color = EXCLUDED.display_color,
    card_description = EXCLUDED.card_description,
    docs_index_description = EXCLUDED.docs_index_description,
    models_page_payload = EXCLUDED.models_page_payload,
    docs_index_payload = EXCLUDED.docs_index_payload,
    sort_order = EXCLUDED.sort_order,
    updated_at = CURRENT_TIMESTAMP
  RETURNING id
)
INSERT INTO seed_model_ids (slug, id)
SELECT 'claude-3-opus', id FROM upsert_model
ON CONFLICT (slug) DO UPDATE SET id = EXCLUDED.id;
INSERT INTO ai_model_pricing (model_id, input_price, output_price, price_unit, currency) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 0.015, 0.075, '1K tokens', 'USD') ON CONFLICT (model_id) DO UPDATE SET input_price = EXCLUDED.input_price, output_price = EXCLUDED.output_price, price_unit = EXCLUDED.price_unit, currency = EXCLUDED.currency, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'models_page', 'Reasoning', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'models_page', 'Doc Analysis', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'models_page', 'Creative', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'models_page', 'Safe', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'docs_index', 'Reasoning', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'docs_index', 'Doc Analysis', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'docs_index', 'Creative', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'docs_index', 'Safe', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'docs_page', 'Logical Reasoning', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'docs_page', 'Document Analysis', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'docs_page', 'Creative Tasks', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'docs_page', 'Problem Solving', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'docs_page', 'Safe Output', 4) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'docs_page', 'Long Context', 5) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_docs (model_id, docs_description, endpoint_method, endpoint_path, endpoint_status, response_example, docs_page_payload) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'Anthropic''s most capable model featuring exceptional reasoning, document analysis and nuanced instruction following. Ideal for research, legal analysis and complex writing tasks.', 'POST', '/v1/chat/completions', 'Stable', $q${
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
}$q$, $q${"name":"Claude 3 Opus","provider":"Anthropic","category":"conversational","color":"#8b5cf6","description":"Anthropic's most capable model featuring exceptional reasoning, document analysis and nuanced instruction following. Ideal for research, legal analysis and complex writing tasks.","features":["Logical Reasoning","Document Analysis","Creative Tasks","Problem Solving","Safe Output","Long Context"],"steps":["Generate your API key in the APIs section","Include it as a Bearer token in the Authorization header","Send a messages array with role and content fields"],"endpoint":{"method":"POST","path":"/v1/chat/completions","status":"Stable"},"params":[{"name":"model","type":"string","req":true,"default":"—","desc":"Model identifier — use claude-3-opus"},{"name":"messages","type":"array","req":true,"default":"—","desc":"Conversation history array with role and content"},{"name":"max_tokens","type":"integer","req":false,"default":"2048","desc":"Maximum tokens to generate"},{"name":"temperature","type":"float","req":false,"default":"1.0","desc":"Sampling temperature 0.0–1.0"},{"name":"system","type":"string","req":false,"default":"—","desc":"System prompt to set assistant behavior"},{"name":"stream","type":"boolean","req":false,"default":"false","desc":"Enable streaming responses"}],"response":"{\n  \"id\": \"claude-abc123\",\n  \"object\": \"chat.completion\",\n  \"created\": 1714000000,\n  \"model\": \"claude-3-opus\",\n  \"choices\": [\n    {\n      \"index\": 0,\n      \"message\": {\n        \"role\": \"assistant\",\n        \"content\": \"Here is my analysis of your document...\"\n      },\n      \"finish_reason\": \"stop\"\n    }\n  ],\n  \"usage\": {\n    \"prompt_tokens\": 20,\n    \"completion_tokens\": 40,\n    \"total_tokens\": 60\n  }\n}","examples":{"Python":"import requests\n\nurl = \"https://api.Modelsnest.com/v1/chat/completions\"\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\ndata = {\n    \"model\": \"claude-3-opus\",\n    \"system\": \"You are an expert business analyst.\",\n    \"messages\": [\n        {\"role\": \"user\", \"content\": \"Analyze this business strategy and identify risks...\"}\n    ],\n    \"max_tokens\": 800,\n    \"temperature\": 0.5\n}\n\nres = requests.post(url, headers=headers, json=data)\nprint(res.json()[\"choices\"][0][\"message\"][\"content\"])","JavaScript":"const res = await fetch(\n  \"https://api.Modelsnest.com/v1/chat/completions\",\n  {\n    method: \"POST\",\n    headers: {\n      \"Authorization\": \"Bearer YOUR_API_KEY\",\n      \"Content-Type\": \"application/json\",\n    },\n    body: JSON.stringify({\n      model: \"claude-3-opus\",\n      system: \"You are an expert business analyst.\",\n      messages: [\n        { role: \"user\", content: \"Analyze this business strategy and identify risks...\" }\n      ],\n      max_tokens: 800,\n    }),\n  }\n)\nconst data = await res.json()\nconsole.log(data.choices[0].message.content)","cURL":"curl https://api.Modelsnest.com/v1/chat/completions \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"model\": \"claude-3-opus\",\n    \"system\": \"You are an expert business analyst.\",\n    \"messages\": [\n      {\"role\":\"user\",\"content\":\"Analyze this business strategy...\"}\n    ],\n    \"max_tokens\": 800\n  }'"},"pricing":{"input":"0.015","output":"0.075","unit":"1K tokens"}}$q$::jsonb) ON CONFLICT (model_id) DO UPDATE SET docs_description = EXCLUDED.docs_description, endpoint_method = EXCLUDED.endpoint_method, endpoint_path = EXCLUDED.endpoint_path, endpoint_status = EXCLUDED.endpoint_status, response_example = EXCLUDED.response_example, docs_page_payload = EXCLUDED.docs_page_payload, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 0, 'Generate your API key in the APIs section') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 1, 'Include it as a Bearer token in the Authorization header') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 2, 'Send a messages array with role and content fields') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'model', 'string', TRUE, '—', 'Model identifier — use claude-3-opus', 0) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'messages', 'array', TRUE, '—', 'Conversation history array with role and content', 1) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'max_tokens', 'integer', FALSE, '2048', 'Maximum tokens to generate', 2) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'temperature', 'float', FALSE, '1.0', 'Sampling temperature 0.0–1.0', 3) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'system', 'string', FALSE, '—', 'System prompt to set assistant behavior', 4) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'stream', 'boolean', FALSE, 'false', 'Enable streaming responses', 5) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'Python', $code$import requests

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
print(res.json()["choices"][0]["message"]["content"])$code$, 0) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'JavaScript', $code$const res = await fetch(
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
console.log(data.choices[0].message.content)$code$, 1) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'claude-3-opus'), 'cURL', $code$curl https://api.Modelsnest.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-opus",
    "system": "You are an expert business analyst.",
    "messages": [
      {"role":"user","content":"Analyze this business strategy..."}
    ],
    "max_tokens": 800
  }'$code$, 2) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
-- Model: gemini-pro
WITH upsert_model AS (
  INSERT INTO ai_models (
    slug, name, provider, category_slug, status, performance, last_used_label, is_favorite_default, has_documentation,
    badge, display_color, card_description, docs_index_description, models_page_payload, docs_index_payload, sort_order
  )
  VALUES ('gemini-pro', 'Gemini Pro', 'Google', 'conversational', 'active', 94, '30 min ago', FALSE, TRUE,
    'New', '#06b6d4', 'Google''s multimodal AI with real-time knowledge and strong cross-task performance.', 'Google''s multimodal AI with real-time knowledge integration and strong cross-task performance.', $q${"id":"3","name":"Gemini Pro","provider":"Google","category":"conversational","status":"active","performance":94,"lastUsed":"30 min ago","slug":"gemini-pro","hasDocumentation":true,"isFavorite":false,"description":"Google's multimodal AI with real-time knowledge and strong cross-task performance.","features":["Multimodal","Real-time","Multilingual","Safe"]}$q$::jsonb, $q${"slug":"gemini-pro","name":"Gemini Pro","provider":"Google","category":"conversational","badge":"New","description":"Google's multimodal AI with real-time knowledge integration and strong cross-task performance.","features":["Multimodal","Real-time","Multilingual","Safe"],"pricing":{"input":"0.0025","output":"0.010","unit":"1K tokens"}}$q$::jsonb, 2
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    provider = EXCLUDED.provider,
    category_slug = EXCLUDED.category_slug,
    status = EXCLUDED.status,
    performance = EXCLUDED.performance,
    last_used_label = EXCLUDED.last_used_label,
    is_favorite_default = EXCLUDED.is_favorite_default,
    has_documentation = EXCLUDED.has_documentation,
    badge = EXCLUDED.badge,
    display_color = EXCLUDED.display_color,
    card_description = EXCLUDED.card_description,
    docs_index_description = EXCLUDED.docs_index_description,
    models_page_payload = EXCLUDED.models_page_payload,
    docs_index_payload = EXCLUDED.docs_index_payload,
    sort_order = EXCLUDED.sort_order,
    updated_at = CURRENT_TIMESTAMP
  RETURNING id
)
INSERT INTO seed_model_ids (slug, id)
SELECT 'gemini-pro', id FROM upsert_model
ON CONFLICT (slug) DO UPDATE SET id = EXCLUDED.id;
INSERT INTO ai_model_pricing (model_id, input_price, output_price, price_unit, currency) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 0.0025, 0.01, '1K tokens', 'USD') ON CONFLICT (model_id) DO UPDATE SET input_price = EXCLUDED.input_price, output_price = EXCLUDED.output_price, price_unit = EXCLUDED.price_unit, currency = EXCLUDED.currency, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'models_page', 'Multimodal', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'models_page', 'Real-time', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'models_page', 'Multilingual', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'models_page', 'Safe', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'docs_index', 'Multimodal', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'docs_index', 'Real-time', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'docs_index', 'Multilingual', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'docs_index', 'Safe', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'docs_page', 'Multimodal Input', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'docs_page', 'Real-time Responses', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'docs_page', 'Knowledge Integration', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'docs_page', 'Safe AI', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'docs_page', 'Code Generation', 4) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'docs_page', 'Multilingual', 5) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_docs (model_id, docs_description, endpoint_method, endpoint_path, endpoint_status, response_example, docs_page_payload) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'Google''s multimodal conversational AI with real-time knowledge integration, strong cross-task performance, and built-in safety filters. Excels at image + text inputs.', 'POST', '/v1/chat/completions', 'Stable', $q${
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
}$q$, $q${"name":"Gemini Pro","provider":"Google","category":"conversational","color":"#06b6d4","description":"Google's multimodal conversational AI with real-time knowledge integration, strong cross-task performance, and built-in safety filters. Excels at image + text inputs.","features":["Multimodal Input","Real-time Responses","Knowledge Integration","Safe AI","Code Generation","Multilingual"],"steps":["Generate your API key in the APIs section","Include it as a Bearer token in the Authorization header","Send contents array with parts — supports text and image"],"endpoint":{"method":"POST","path":"/v1/chat/completions","status":"Stable"},"params":[{"name":"model","type":"string","req":true,"default":"—","desc":"Model identifier — use gemini-pro"},{"name":"contents","type":"array","req":true,"default":"—","desc":"Array of content objects with parts"},{"name":"generationConfig","type":"object","req":false,"default":"—","desc":"maxOutputTokens, temperature, topP, topK"},{"name":"safetySettings","type":"array","req":false,"default":"—","desc":"Per-category harm blocking thresholds"}],"response":"{\n  \"candidates\": [\n    {\n      \"content\": {\n        \"parts\": [\n          {\n            \"text\": \"Hello! I'm Gemini Pro. How can I help you today?\"\n          }\n        ],\n        \"role\": \"model\"\n      },\n      \"finishReason\": \"STOP\",\n      \"index\": 0\n    }\n  ],\n  \"usageMetadata\": {\n    \"promptTokenCount\": 5,\n    \"candidatesTokenCount\": 14,\n    \"totalTokenCount\": 19\n  }\n}","examples":{"Python":"import requests\n\nurl = \"https://api.Modelsnest.com/v1/chat/completions\"\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\n# Text + image multimodal example\ndata = {\n    \"model\": \"gemini-pro\",\n    \"contents\": [\n        {\n            \"parts\": [\n                {\"text\": \"What's in this image? Describe in detail.\"},\n                {\n                    \"inline_data\": {\n                        \"mime_type\": \"image/jpeg\",\n                        \"data\": \"BASE64_ENCODED_IMAGE_DATA\"\n                    }\n                }\n            ]\n        }\n    ],\n    \"generationConfig\": {\n        \"maxOutputTokens\": 500,\n        \"temperature\": 0.4\n    }\n}\n\nres = requests.post(url, headers=headers, json=data)\nprint(res.json()[\"candidates\"][0][\"content\"][\"parts\"][0][\"text\"])","JavaScript":"const res = await fetch(\n  \"https://api.Modelsnest.com/v1/chat/completions\",\n  {\n    method: \"POST\",\n    headers: {\n      \"Authorization\": \"Bearer YOUR_API_KEY\",\n      \"Content-Type\": \"application/json\",\n    },\n    body: JSON.stringify({\n      model: \"gemini-pro\",\n      contents: [\n        {\n          parts: [\n            { text: \"What's in this image? Describe in detail.\" },\n            {\n              inline_data: {\n                mime_type: \"image/jpeg\",\n                data: \"BASE64_ENCODED_IMAGE_DATA\",\n              },\n            },\n          ],\n        },\n      ],\n      generationConfig: { maxOutputTokens: 500, temperature: 0.4 },\n    }),\n  }\n)\nconst data = await res.json()\nconsole.log(data.candidates[0].content.parts[0].text)","cURL":"curl https://api.Modelsnest.com/v1/chat/completions \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"model\": \"gemini-pro\",\n    \"contents\": [\n      {\"parts\": [{\"text\": \"Explain the water cycle.\"}]}\n    ],\n    \"generationConfig\": {\"maxOutputTokens\": 300}\n  }'"},"pricing":{"input":"0.0025","output":"0.010","unit":"1K tokens"}}$q$::jsonb) ON CONFLICT (model_id) DO UPDATE SET docs_description = EXCLUDED.docs_description, endpoint_method = EXCLUDED.endpoint_method, endpoint_path = EXCLUDED.endpoint_path, endpoint_status = EXCLUDED.endpoint_status, response_example = EXCLUDED.response_example, docs_page_payload = EXCLUDED.docs_page_payload, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 0, 'Generate your API key in the APIs section') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 1, 'Include it as a Bearer token in the Authorization header') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 2, 'Send contents array with parts — supports text and image') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'model', 'string', TRUE, '—', 'Model identifier — use gemini-pro', 0) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'contents', 'array', TRUE, '—', 'Array of content objects with parts', 1) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'generationConfig', 'object', FALSE, '—', 'maxOutputTokens, temperature, topP, topK', 2) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'safetySettings', 'array', FALSE, '—', 'Per-category harm blocking thresholds', 3) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'Python', $code$import requests

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
print(res.json()["candidates"][0]["content"]["parts"][0]["text"])$code$, 0) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'JavaScript', $code$const res = await fetch(
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
console.log(data.candidates[0].content.parts[0].text)$code$, 1) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'gemini-pro'), 'cURL', $code$curl https://api.Modelsnest.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-pro",
    "contents": [
      {"parts": [{"text": "Explain the water cycle."}]}
    ],
    "generationConfig": {"maxOutputTokens": 300}
  }'$code$, 2) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
-- Model: whisper-v3
WITH upsert_model AS (
  INSERT INTO ai_models (
    slug, name, provider, category_slug, status, performance, last_used_label, is_favorite_default, has_documentation,
    badge, display_color, card_description, docs_index_description, models_page_payload, docs_index_payload, sort_order
  )
  VALUES ('whisper-v3', 'Whisper V3', 'OpenAI', 'voice', 'active', 97, '5 min ago', TRUE, TRUE,
    NULL, '#10b981', 'State-of-the-art speech recognition with noise reduction and 99 language support.', 'State-of-the-art speech recognition with noise reduction and 99 language support.', $q${"id":"4","name":"Whisper V3","provider":"OpenAI","category":"voice","status":"active","performance":97,"lastUsed":"5 min ago","slug":"whisper-v3","hasDocumentation":true,"isFavorite":true,"description":"State-of-the-art speech recognition with noise reduction and 99 language support.","features":["99 Languages","Noise Reduction","Timestamps","Real-time"]}$q$::jsonb, $q${"slug":"whisper-v3","name":"Whisper V3","provider":"OpenAI","category":"voice","description":"State-of-the-art speech recognition with noise reduction and 99 language support.","features":["99 Languages","Noise Reduction","Timestamps","Real-time"],"pricing":{"input":"0.006","output":"0.000","unit":"minute"}}$q$::jsonb, 3
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    provider = EXCLUDED.provider,
    category_slug = EXCLUDED.category_slug,
    status = EXCLUDED.status,
    performance = EXCLUDED.performance,
    last_used_label = EXCLUDED.last_used_label,
    is_favorite_default = EXCLUDED.is_favorite_default,
    has_documentation = EXCLUDED.has_documentation,
    badge = EXCLUDED.badge,
    display_color = EXCLUDED.display_color,
    card_description = EXCLUDED.card_description,
    docs_index_description = EXCLUDED.docs_index_description,
    models_page_payload = EXCLUDED.models_page_payload,
    docs_index_payload = EXCLUDED.docs_index_payload,
    sort_order = EXCLUDED.sort_order,
    updated_at = CURRENT_TIMESTAMP
  RETURNING id
)
INSERT INTO seed_model_ids (slug, id)
SELECT 'whisper-v3', id FROM upsert_model
ON CONFLICT (slug) DO UPDATE SET id = EXCLUDED.id;
INSERT INTO ai_model_pricing (model_id, input_price, output_price, price_unit, currency) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 0.006, 0, 'minute', 'USD') ON CONFLICT (model_id) DO UPDATE SET input_price = EXCLUDED.input_price, output_price = EXCLUDED.output_price, price_unit = EXCLUDED.price_unit, currency = EXCLUDED.currency, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'models_page', '99 Languages', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'models_page', 'Noise Reduction', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'models_page', 'Timestamps', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'models_page', 'Real-time', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'docs_index', '99 Languages', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'docs_index', 'Noise Reduction', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'docs_index', 'Timestamps', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'docs_index', 'Real-time', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'docs_page', '99 Languages', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'docs_page', 'Noise Reduction', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'docs_page', 'Timestamps', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'docs_page', 'Real-time', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'docs_page', 'Word-level Alignment', 4) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'docs_page', 'Diarization', 5) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_docs (model_id, docs_description, endpoint_method, endpoint_path, endpoint_status, response_example, docs_page_payload) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'State-of-the-art automatic speech recognition supporting 99 languages with noise reduction, speaker diarization and word-level timestamps. Ideal for transcription pipelines and voice interfaces.', 'POST', '/v1/audio/transcriptions', 'Stable', $q${
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
}$q$, $q${"name":"Whisper V3","provider":"OpenAI","category":"voice","color":"#10b981","description":"State-of-the-art automatic speech recognition supporting 99 languages with noise reduction, speaker diarization and word-level timestamps. Ideal for transcription pipelines and voice interfaces.","features":["99 Languages","Noise Reduction","Timestamps","Real-time","Word-level Alignment","Diarization"],"steps":["Generate your API key in the APIs section","Send your audio file as multipart/form-data","Receive a full transcript with optional timestamps and language detection"],"endpoint":{"method":"POST","path":"/v1/audio/transcriptions","status":"Stable"},"params":[{"name":"file","type":"file","req":true,"default":"—","desc":"Audio file — mp3, mp4, mpeg, mpga, m4a, wav, webm"},{"name":"model","type":"string","req":true,"default":"—","desc":"Model identifier — use whisper-v3"},{"name":"language","type":"string","req":false,"default":"auto","desc":"ISO-639-1 language code for the input audio"},{"name":"prompt","type":"string","req":false,"default":"—","desc":"Optional text to guide the model's style or vocabulary"},{"name":"response_format","type":"string","req":false,"default":"json","desc":"json, text, srt, verbose_json, or vtt"},{"name":"timestamp_granularities","type":"array","req":false,"default":"[]","desc":"word or segment — granularity of returned timestamps"}],"response":"{\n  \"text\": \"Hello, welcome to Modelsnest. Let's explore the possibilities.\",\n  \"language\": \"en\",\n  \"duration\": 4.8,\n  \"segments\": [\n    {\n      \"id\": 0,\n      \"start\": 0.0,\n      \"end\": 4.8,\n      \"text\": \"Hello, welcome to Modelsnest.\",\n      \"words\": [\n        { \"word\": \"Hello,\", \"start\": 0.0, \"end\": 0.4 },\n        { \"word\": \"welcome\", \"start\": 0.5, \"end\": 0.9 }\n      ]\n    }\n  ]\n}","examples":{"Python":"import requests\n\nurl = \"https://api.Modelsnest.com/v1/audio/transcriptions\"\nheaders = { \"Authorization\": \"Bearer YOUR_API_KEY\" }\n\nwith open(\"interview.mp3\", \"rb\") as f:\n    files = { \"file\": (\"interview.mp3\", f, \"audio/mpeg\") }\n    data  = {\n        \"model\": \"whisper-v3\",\n        \"language\": \"en\",\n        \"response_format\": \"verbose_json\",\n        \"timestamp_granularities\": [\"word\"]\n    }\n    res = requests.post(url, headers=headers, files=files, data=data)\n\nresult = res.json()\nprint(\"Transcript:\", result[\"text\"])\nprint(\"Duration:\", result[\"duration\"], \"seconds\")\nfor word in result[\"segments\"][0][\"words\"]:\n    print(f\"  {word['word']} ({word['start']:.2f}s)\")","JavaScript":"const formData = new FormData()\nformData.append(\"file\", audioBlob, \"interview.mp3\")\nformData.append(\"model\", \"whisper-v3\")\nformData.append(\"language\", \"en\")\nformData.append(\"response_format\", \"verbose_json\")\n\nconst res = await fetch(\"https://api.Modelsnest.com/v1/audio/transcriptions\", {\n  method: \"POST\",\n  headers: { \"Authorization\": \"Bearer YOUR_API_KEY\" },\n  body: formData,\n})\n\nconst data = await res.json()\nconsole.log(\"Transcript:\", data.text)\nconsole.log(\"Duration:\", data.duration, \"seconds\")\ndata.segments.forEach(seg => console.log(seg.text, seg.start))","cURL":"curl https://api.Modelsnest.com/v1/audio/transcriptions \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -F \"file=@interview.mp3\" \\\n  -F \"model=whisper-v3\" \\\n  -F \"language=en\" \\\n  -F \"response_format=verbose_json\""},"pricing":{"input":"0.006","output":"0.000","unit":"minute"}}$q$::jsonb) ON CONFLICT (model_id) DO UPDATE SET docs_description = EXCLUDED.docs_description, endpoint_method = EXCLUDED.endpoint_method, endpoint_path = EXCLUDED.endpoint_path, endpoint_status = EXCLUDED.endpoint_status, response_example = EXCLUDED.response_example, docs_page_payload = EXCLUDED.docs_page_payload, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 0, 'Generate your API key in the APIs section') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 1, 'Send your audio file as multipart/form-data') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 2, 'Receive a full transcript with optional timestamps and language detection') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'file', 'file', TRUE, '—', 'Audio file — mp3, mp4, mpeg, mpga, m4a, wav, webm', 0) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'model', 'string', TRUE, '—', 'Model identifier — use whisper-v3', 1) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'language', 'string', FALSE, 'auto', 'ISO-639-1 language code for the input audio', 2) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'prompt', 'string', FALSE, '—', 'Optional text to guide the model''s style or vocabulary', 3) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'response_format', 'string', FALSE, 'json', 'json, text, srt, verbose_json, or vtt', 4) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'timestamp_granularities', 'array', FALSE, '[]', 'word or segment — granularity of returned timestamps', 5) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'Python', $code$import requests

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
    print(f"  {word['word']} ({word['start']:.2f}s)")$code$, 0) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'JavaScript', $code$const formData = new FormData()
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
data.segments.forEach(seg => console.log(seg.text, seg.start))$code$, 1) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'whisper-v3'), 'cURL', $code$curl https://api.Modelsnest.com/v1/audio/transcriptions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@interview.mp3" \
  -F "model=whisper-v3" \
  -F "language=en" \
  -F "response_format=verbose_json"$code$, 2) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
-- Model: elevenlabs-pro
WITH upsert_model AS (
  INSERT INTO ai_models (
    slug, name, provider, category_slug, status, performance, last_used_label, is_favorite_default, has_documentation,
    badge, display_color, card_description, docs_index_description, models_page_payload, docs_index_payload, sort_order
  )
  VALUES ('elevenlabs-pro', 'ElevenLabs Pro', 'ElevenLabs', 'voice', 'active', 95, '2 hr ago', FALSE, TRUE,
    'Popular', '#10b981', 'Hyper-realistic text-to-speech with voice cloning and emotion synthesis.', 'Hyper-realistic text-to-speech with voice cloning and emotion synthesis.', $q${"id":"5","name":"ElevenLabs Pro","provider":"ElevenLabs","category":"voice","status":"active","performance":95,"lastUsed":"2 hr ago","slug":"elevenlabs-pro","hasDocumentation":true,"isFavorite":false,"description":"Hyper-realistic text-to-speech with voice cloning and emotion synthesis.","features":["Voice Cloning","Emotion","29 Languages","Custom"]}$q$::jsonb, $q${"slug":"elevenlabs-pro","name":"ElevenLabs Pro","provider":"ElevenLabs","category":"voice","badge":"Popular","description":"Hyper-realistic text-to-speech with voice cloning and emotion synthesis.","features":["Voice Cloning","Emotion","29 Languages","Custom"],"pricing":{"input":"0.0005","output":"0.000","unit":"character"}}$q$::jsonb, 4
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    provider = EXCLUDED.provider,
    category_slug = EXCLUDED.category_slug,
    status = EXCLUDED.status,
    performance = EXCLUDED.performance,
    last_used_label = EXCLUDED.last_used_label,
    is_favorite_default = EXCLUDED.is_favorite_default,
    has_documentation = EXCLUDED.has_documentation,
    badge = EXCLUDED.badge,
    display_color = EXCLUDED.display_color,
    card_description = EXCLUDED.card_description,
    docs_index_description = EXCLUDED.docs_index_description,
    models_page_payload = EXCLUDED.models_page_payload,
    docs_index_payload = EXCLUDED.docs_index_payload,
    sort_order = EXCLUDED.sort_order,
    updated_at = CURRENT_TIMESTAMP
  RETURNING id
)
INSERT INTO seed_model_ids (slug, id)
SELECT 'elevenlabs-pro', id FROM upsert_model
ON CONFLICT (slug) DO UPDATE SET id = EXCLUDED.id;
INSERT INTO ai_model_pricing (model_id, input_price, output_price, price_unit, currency) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 0.0005, 0, 'character', 'USD') ON CONFLICT (model_id) DO UPDATE SET input_price = EXCLUDED.input_price, output_price = EXCLUDED.output_price, price_unit = EXCLUDED.price_unit, currency = EXCLUDED.currency, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'models_page', 'Voice Cloning', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'models_page', 'Emotion', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'models_page', '29 Languages', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'models_page', 'Custom', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'docs_index', 'Voice Cloning', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'docs_index', 'Emotion', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'docs_index', '29 Languages', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'docs_index', 'Custom', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'docs_page', 'Voice Cloning', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'docs_page', 'Emotion Control', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'docs_page', '29 Languages', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'docs_page', 'Custom Voices', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'docs_page', 'High Quality', 4) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'docs_page', 'SSML Support', 5) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_docs (model_id, docs_description, endpoint_method, endpoint_path, endpoint_status, response_example, docs_page_payload) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'Hyper-realistic text-to-speech with voice cloning, emotion synthesis, and support for 29 languages. Perfect for audiobooks, virtual assistants and content creation at scale.', 'POST', '/v1/text-to-speech', 'Stable', $q$HTTP 200 OK
Content-Type: audio/mpeg

<binary MP3 audio data>

# On error:
{
  "detail": {
    "status": "voice_not_found",
    "message": "Voice ID not found in your library."
  }
}$q$, $q${"name":"ElevenLabs Pro","provider":"ElevenLabs","category":"voice","color":"#10b981","description":"Hyper-realistic text-to-speech with voice cloning, emotion synthesis, and support for 29 languages. Perfect for audiobooks, virtual assistants and content creation at scale.","features":["Voice Cloning","Emotion Control","29 Languages","Custom Voices","High Quality","SSML Support"],"steps":["Generate your API key in the APIs section","Pick or create a voice_id from the Voices library","POST text to /v1/text-to-speech and save the returned binary audio"],"endpoint":{"method":"POST","path":"/v1/text-to-speech","status":"Stable"},"params":[{"name":"text","type":"string","req":true,"default":"—","desc":"Text to synthesize — supports SSML tags"},{"name":"voice_id","type":"string","req":true,"default":"—","desc":"Voice identifier from your voice library"},{"name":"model_id","type":"string","req":false,"default":"eleven_multilingual_v2","desc":"TTS model — eleven_monolingual_v1 or eleven_multilingual_v2"},{"name":"voice_settings","type":"object","req":false,"default":"—","desc":"stability (0–1) and similarity_boost (0–1)"},{"name":"output_format","type":"string","req":false,"default":"mp3_44100_128","desc":"Audio format: mp3_44100_128, pcm_16000, ulaw_8000, etc."}],"response":"HTTP 200 OK\nContent-Type: audio/mpeg\n\n<binary MP3 audio data>\n\n# On error:\n{\n  \"detail\": {\n    \"status\": \"voice_not_found\",\n    \"message\": \"Voice ID not found in your library.\"\n  }\n}","examples":{"Python":"import requests\n\nurl = \"https://api.Modelsnest.com/v1/text-to-speech\"\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\ndata = {\n    \"text\": \"Welcome to Modelsnest. Your AI infrastructure, supercharged.\",\n    \"voice_id\": \"YOUR_VOICE_ID\",\n    \"model_id\": \"eleven_multilingual_v2\",\n    \"voice_settings\": {\n        \"stability\": 0.5,\n        \"similarity_boost\": 0.8\n    },\n    \"output_format\": \"mp3_44100_128\"\n}\n\nres = requests.post(url, headers=headers, json=data)\n\nif res.status_code == 200:\n    with open(\"output.mp3\", \"wb\") as f:\n        f.write(res.content)\n    print(\"Audio saved to output.mp3\")\nelse:\n    print(\"Error:\", res.json())","JavaScript":"const res = await fetch(\n  \"https://api.Modelsnest.com/v1/text-to-speech\",\n  {\n    method: \"POST\",\n    headers: {\n      \"Authorization\": \"Bearer YOUR_API_KEY\",\n      \"Content-Type\": \"application/json\",\n    },\n    body: JSON.stringify({\n      text: \"Welcome to Modelsnest. Your AI infrastructure, supercharged.\",\n      voice_id: \"YOUR_VOICE_ID\",\n      model_id: \"eleven_multilingual_v2\",\n      voice_settings: { stability: 0.5, similarity_boost: 0.8 },\n    }),\n  }\n)\n\nif (res.ok) {\n  const arrayBuffer = await res.arrayBuffer()\n  const blob = new Blob([arrayBuffer], { type: \"audio/mpeg\" })\n  const url = URL.createObjectURL(blob)\n  const audio = new Audio(url)\n  audio.play()\n}","cURL":"curl https://api.Modelsnest.com/v1/text-to-speech \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"text\": \"Welcome to Modelsnest.\",\n    \"voice_id\": \"YOUR_VOICE_ID\",\n    \"model_id\": \"eleven_multilingual_v2\"\n  }' \\\n  --output output.mp3"},"pricing":{"input":"0.0005","output":"0.000","unit":"character"}}$q$::jsonb) ON CONFLICT (model_id) DO UPDATE SET docs_description = EXCLUDED.docs_description, endpoint_method = EXCLUDED.endpoint_method, endpoint_path = EXCLUDED.endpoint_path, endpoint_status = EXCLUDED.endpoint_status, response_example = EXCLUDED.response_example, docs_page_payload = EXCLUDED.docs_page_payload, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 0, 'Generate your API key in the APIs section') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 1, 'Pick or create a voice_id from the Voices library') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 2, 'POST text to /v1/text-to-speech and save the returned binary audio') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'text', 'string', TRUE, '—', 'Text to synthesize — supports SSML tags', 0) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'voice_id', 'string', TRUE, '—', 'Voice identifier from your voice library', 1) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'model_id', 'string', FALSE, 'eleven_multilingual_v2', 'TTS model — eleven_monolingual_v1 or eleven_multilingual_v2', 2) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'voice_settings', 'object', FALSE, '—', 'stability (0–1) and similarity_boost (0–1)', 3) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'output_format', 'string', FALSE, 'mp3_44100_128', 'Audio format: mp3_44100_128, pcm_16000, ulaw_8000, etc.', 4) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'Python', $code$import requests

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
    print("Error:", res.json())$code$, 0) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'JavaScript', $code$const res = await fetch(
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
}$code$, 1) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'elevenlabs-pro'), 'cURL', $code$curl https://api.Modelsnest.com/v1/text-to-speech \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Welcome to Modelsnest.",
    "voice_id": "YOUR_VOICE_ID",
    "model_id": "eleven_multilingual_v2"
  }' \
  --output output.mp3$code$, 2) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
-- Model: runway-gen-3
WITH upsert_model AS (
  INSERT INTO ai_models (
    slug, name, provider, category_slug, status, performance, last_used_label, is_favorite_default, has_documentation,
    badge, display_color, card_description, docs_index_description, models_page_payload, docs_index_payload, sort_order
  )
  VALUES ('runway-gen-3', 'Runway Gen-3', 'Runway', 'video', 'active', 93, '1 day ago', FALSE, TRUE,
    NULL, '#f59e0b', 'Professional video generation with granular motion control and cinematic output.', 'Professional video generation with granular motion control and cinematic output.', $q${"id":"6","name":"Runway Gen-3","provider":"Runway","category":"video","status":"active","performance":93,"lastUsed":"1 day ago","slug":"runway-gen-3","hasDocumentation":true,"isFavorite":false,"description":"Professional video generation with granular motion control and cinematic output.","features":["Text-to-Video","Motion Control","4K","Style"]}$q$::jsonb, $q${"slug":"runway-gen-3","name":"Runway Gen-3","provider":"Runway","category":"video","description":"Professional video generation with granular motion control and cinematic output.","features":["Text-to-Video","Motion Control","4K","Style"],"pricing":{"input":"0.050","output":"0.000","unit":"second"}}$q$::jsonb, 5
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    provider = EXCLUDED.provider,
    category_slug = EXCLUDED.category_slug,
    status = EXCLUDED.status,
    performance = EXCLUDED.performance,
    last_used_label = EXCLUDED.last_used_label,
    is_favorite_default = EXCLUDED.is_favorite_default,
    has_documentation = EXCLUDED.has_documentation,
    badge = EXCLUDED.badge,
    display_color = EXCLUDED.display_color,
    card_description = EXCLUDED.card_description,
    docs_index_description = EXCLUDED.docs_index_description,
    models_page_payload = EXCLUDED.models_page_payload,
    docs_index_payload = EXCLUDED.docs_index_payload,
    sort_order = EXCLUDED.sort_order,
    updated_at = CURRENT_TIMESTAMP
  RETURNING id
)
INSERT INTO seed_model_ids (slug, id)
SELECT 'runway-gen-3', id FROM upsert_model
ON CONFLICT (slug) DO UPDATE SET id = EXCLUDED.id;
INSERT INTO ai_model_pricing (model_id, input_price, output_price, price_unit, currency) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 0.05, 0, 'second', 'USD') ON CONFLICT (model_id) DO UPDATE SET input_price = EXCLUDED.input_price, output_price = EXCLUDED.output_price, price_unit = EXCLUDED.price_unit, currency = EXCLUDED.currency, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'models_page', 'Text-to-Video', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'models_page', 'Motion Control', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'models_page', '4K', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'models_page', 'Style', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'docs_index', 'Text-to-Video', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'docs_index', 'Motion Control', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'docs_index', '4K', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'docs_index', 'Style', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'docs_page', 'Text-to-Video', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'docs_page', 'Image-to-Video', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'docs_page', 'Motion Control', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'docs_page', '4K Output', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'docs_page', 'Style Transfer', 4) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'docs_page', 'Inpainting', 5) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_docs (model_id, docs_description, endpoint_method, endpoint_path, endpoint_status, response_example, docs_page_payload) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'Professional video generation from text or image prompts with granular motion control, cinematic output up to 4K, and advanced style transfer. Built for studios and content pipelines.', 'POST', '/v1/video/generations', 'Stable', $q${
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
}$q$, $q${"name":"Runway Gen-3","provider":"Runway","category":"video","color":"#f59e0b","description":"Professional video generation from text or image prompts with granular motion control, cinematic output up to 4K, and advanced style transfer. Built for studios and content pipelines.","features":["Text-to-Video","Image-to-Video","Motion Control","4K Output","Style Transfer","Inpainting"],"steps":["Generate your API key in the APIs section","POST a generation request — returns a task ID","Poll /v1/video/generations/{id} until status is completed"],"endpoint":{"method":"POST","path":"/v1/video/generations","status":"Stable"},"params":[{"name":"prompt","type":"string","req":true,"default":"—","desc":"Text description of the video to generate"},{"name":"model","type":"string","req":true,"default":"—","desc":"Model identifier — use runway-gen-3"},{"name":"duration","type":"integer","req":false,"default":"10","desc":"Duration in seconds — 4 to 16"},{"name":"resolution","type":"string","req":false,"default":"720p","desc":"Output resolution: 480p, 720p, 1080p, 4k"},{"name":"image_url","type":"string","req":false,"default":"—","desc":"Optional reference image URL for image-to-video"},{"name":"motion_amount","type":"integer","req":false,"default":"5","desc":"Amount of motion 1–10 — higher = more movement"}],"response":"{\n  \"id\": \"gen_abc123\",\n  \"status\": \"processing\",\n  \"created_at\": 1714000000,\n  \"estimated_seconds\": 45,\n  \"model\": \"runway-gen-3\",\n  \"prompt\": \"A cinematic sunset over ocean waves\",\n  \"resolution\": \"1080p\",\n  \"duration\": 10\n}\n\n// After polling until complete:\n{\n  \"id\": \"gen_abc123\",\n  \"status\": \"completed\",\n  \"video_url\": \"https://cdn.Modelsnest.com/videos/gen_abc123.mp4\",\n  \"duration\": 10,\n  \"resolution\": \"1080p\"\n}","examples":{"Python":"import requests, time\n\nurl = \"https://api.Modelsnest.com/v1/video/generations\"\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\n# Step 1 — Create generation task\ndata = {\n    \"model\": \"runway-gen-3\",\n    \"prompt\": \"Cinematic drone shot of golden-hour waves crashing on black sand beach\",\n    \"duration\": 10,\n    \"resolution\": \"1080p\",\n    \"motion_amount\": 6\n}\n\nres = requests.post(url, headers=headers, json=data)\ntask_id = res.json()[\"id\"]\nprint(f\"Task created: {task_id}\")\n\n# Step 2 — Poll until complete\nwhile True:\n    poll = requests.get(f\"{url}/{task_id}\", headers=headers)\n    status = poll.json()[\"status\"]\n    print(f\"Status: {status}\")\n    if status == \"completed\":\n        print(\"Video URL:\", poll.json()[\"video_url\"])\n        break\n    elif status == \"failed\":\n        print(\"Generation failed:\", poll.json())\n        break\n    time.sleep(5)","JavaScript":"// Step 1 — Create generation task\nconst createRes = await fetch(\n  \"https://api.Modelsnest.com/v1/video/generations\",\n  {\n    method: \"POST\",\n    headers: {\n      \"Authorization\": \"Bearer YOUR_API_KEY\",\n      \"Content-Type\": \"application/json\",\n    },\n    body: JSON.stringify({\n      model: \"runway-gen-3\",\n      prompt: \"Cinematic drone shot of golden-hour waves crashing on black sand beach\",\n      duration: 10,\n      resolution: \"1080p\",\n      motion_amount: 6,\n    }),\n  }\n)\nconst { id } = await createRes.json()\n\n// Step 2 — Poll until complete\nconst poll = async () => {\n  const res = await fetch(\n    `https://api.Modelsnest.com/v1/video/generations/${id}`,\n    { headers: { \"Authorization\": \"Bearer YOUR_API_KEY\" } }\n  )\n  const data = await res.json()\n  if (data.status === \"completed\") return console.log(\"Video:\", data.video_url)\n  if (data.status === \"failed\")    return console.error(\"Failed:\", data)\n  setTimeout(poll, 5000)\n}\npoll()","cURL":"# Step 1 — Create task\ncurl https://api.Modelsnest.com/v1/video/generations \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"model\": \"runway-gen-3\",\n    \"prompt\": \"Cinematic golden-hour ocean waves\",\n    \"duration\": 10,\n    \"resolution\": \"1080p\"\n  }'\n\n# Step 2 — Poll with the returned id\ncurl https://api.Modelsnest.com/v1/video/generations/TASK_ID \\\n  -H \"Authorization: Bearer YOUR_API_KEY\""},"pricing":{"input":"0.050","output":"0.000","unit":"second"}}$q$::jsonb) ON CONFLICT (model_id) DO UPDATE SET docs_description = EXCLUDED.docs_description, endpoint_method = EXCLUDED.endpoint_method, endpoint_path = EXCLUDED.endpoint_path, endpoint_status = EXCLUDED.endpoint_status, response_example = EXCLUDED.response_example, docs_page_payload = EXCLUDED.docs_page_payload, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 0, 'Generate your API key in the APIs section') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 1, 'POST a generation request — returns a task ID') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 2, 'Poll /v1/video/generations/{id} until status is completed') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'prompt', 'string', TRUE, '—', 'Text description of the video to generate', 0) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'model', 'string', TRUE, '—', 'Model identifier — use runway-gen-3', 1) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'duration', 'integer', FALSE, '10', 'Duration in seconds — 4 to 16', 2) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'resolution', 'string', FALSE, '720p', 'Output resolution: 480p, 720p, 1080p, 4k', 3) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'image_url', 'string', FALSE, '—', 'Optional reference image URL for image-to-video', 4) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'motion_amount', 'integer', FALSE, '5', 'Amount of motion 1–10 — higher = more movement', 5) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'Python', $code$import requests, time

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
    time.sleep(5)$code$, 0) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'JavaScript', $code$// Step 1 — Create generation task
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
    `https://api.Modelsnest.com/v1/video/generations/${id}`,
    { headers: { "Authorization": "Bearer YOUR_API_KEY" } }
  )
  const data = await res.json()
  if (data.status === "completed") return console.log("Video:", data.video_url)
  if (data.status === "failed")    return console.error("Failed:", data)
  setTimeout(poll, 5000)
}
poll()$code$, 1) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'runway-gen-3'), 'cURL', $code$# Step 1 — Create task
curl https://api.Modelsnest.com/v1/video/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "runway-gen-3",
    "prompt": "Cinematic golden-hour ocean waves",
    "duration": 10,
    "resolution": "1080p"
  }'

# Step 2 — Poll with the returned id
curl https://api.Modelsnest.com/v1/video/generations/TASK_ID \
  -H "Authorization: Bearer YOUR_API_KEY"$code$, 2) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
-- Model: pika-labs
WITH upsert_model AS (
  INSERT INTO ai_models (
    slug, name, provider, category_slug, status, performance, last_used_label, is_favorite_default, has_documentation,
    badge, display_color, card_description, docs_index_description, models_page_payload, docs_index_payload, sort_order
  )
  VALUES ('pika-labs', 'Pika Labs', 'Pika', 'video', 'maintenance', 89, '3 days ago', TRUE, TRUE,
    'New', '#f59e0b', 'Creative video generation with artistic style control and seamless animation.', 'Creative video generation with artistic style control and seamless animation.', $q${"id":"7","name":"Pika Labs","provider":"Pika","category":"video","status":"maintenance","performance":89,"lastUsed":"3 days ago","slug":"pika-labs","hasDocumentation":true,"isFavorite":true,"description":"Creative video generation with artistic style control and seamless animation.","features":["Artistic","Animation","Scene Gen","Prompts"]}$q$::jsonb, $q${"slug":"pika-labs","name":"Pika Labs","provider":"Pika","category":"video","badge":"New","description":"Creative video generation with artistic style control and seamless animation.","features":["Artistic Styles","Animation","Scene Gen","Prompts"],"pricing":{"input":"0.080","output":"0.000","unit":"second"}}$q$::jsonb, 6
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    provider = EXCLUDED.provider,
    category_slug = EXCLUDED.category_slug,
    status = EXCLUDED.status,
    performance = EXCLUDED.performance,
    last_used_label = EXCLUDED.last_used_label,
    is_favorite_default = EXCLUDED.is_favorite_default,
    has_documentation = EXCLUDED.has_documentation,
    badge = EXCLUDED.badge,
    display_color = EXCLUDED.display_color,
    card_description = EXCLUDED.card_description,
    docs_index_description = EXCLUDED.docs_index_description,
    models_page_payload = EXCLUDED.models_page_payload,
    docs_index_payload = EXCLUDED.docs_index_payload,
    sort_order = EXCLUDED.sort_order,
    updated_at = CURRENT_TIMESTAMP
  RETURNING id
)
INSERT INTO seed_model_ids (slug, id)
SELECT 'pika-labs', id FROM upsert_model
ON CONFLICT (slug) DO UPDATE SET id = EXCLUDED.id;
INSERT INTO ai_model_pricing (model_id, input_price, output_price, price_unit, currency) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 0.08, 0, 'second', 'USD') ON CONFLICT (model_id) DO UPDATE SET input_price = EXCLUDED.input_price, output_price = EXCLUDED.output_price, price_unit = EXCLUDED.price_unit, currency = EXCLUDED.currency, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'models_page', 'Artistic', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'models_page', 'Animation', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'models_page', 'Scene Gen', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'models_page', 'Prompts', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'docs_index', 'Artistic Styles', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'docs_index', 'Animation', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'docs_index', 'Scene Gen', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'docs_index', 'Prompts', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'docs_page', 'Artistic Styles', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'docs_page', 'Animation', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'docs_page', 'Scene Generation', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'docs_page', 'Prompt Control', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'docs_page', 'Style Transfer', 4) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'docs_page', 'Frame Interpolation', 5) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_docs (model_id, docs_description, endpoint_method, endpoint_path, endpoint_status, response_example, docs_page_payload) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'Creative video generation with strong artistic style control, smooth animation and scene generation. Ideal for creative agencies, social content and music videos.', 'POST', '/v1/video/creative', 'Stable', $q${
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
}$q$, $q${"name":"Pika Labs","provider":"Pika","category":"video","color":"#f59e0b","description":"Creative video generation with strong artistic style control, smooth animation and scene generation. Ideal for creative agencies, social content and music videos.","features":["Artistic Styles","Animation","Scene Generation","Prompt Control","Style Transfer","Frame Interpolation"],"steps":["Generate your API key in the APIs section","POST a generation request with prompt and optional style","Poll the returned task ID for the video URL"],"endpoint":{"method":"POST","path":"/v1/video/creative","status":"Stable"},"params":[{"name":"prompt","type":"string","req":true,"default":"—","desc":"Creative description of the video scene"},{"name":"style","type":"string","req":false,"default":"cinematic","desc":"Artistic style: cinematic, anime, watercolor, impressionist, 3d, sketch"},{"name":"duration","type":"integer","req":false,"default":"4","desc":"Duration in seconds — 1 to 10"},{"name":"aspect","type":"string","req":false,"default":"16:9","desc":"Aspect ratio: 16:9, 9:16, 1:1, 4:3"},{"name":"fps","type":"integer","req":false,"default":"24","desc":"Frames per second — 12, 24, or 30"},{"name":"seed","type":"integer","req":false,"default":"—","desc":"Seed for reproducible generation"}],"response":"{\n  \"id\": \"pika_abc123\",\n  \"status\": \"processing\",\n  \"created_at\": 1714000000,\n  \"style\": \"watercolor\",\n  \"prompt\": \"A magical forest with glowing fireflies\"\n}\n\n// When complete:\n{\n  \"id\": \"pika_abc123\",\n  \"status\": \"completed\",\n  \"video_url\": \"https://cdn.Modelsnest.com/videos/pika_abc123.mp4\",\n  \"style\": \"watercolor\",\n  \"duration\": 4,\n  \"fps\": 24\n}","examples":{"Python":"import requests, time\n\nurl = \"https://api.Modelsnest.com/v1/video/creative\"\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\ndata = {\n    \"prompt\": \"A magical forest with glowing fireflies drifting through ancient trees\",\n    \"style\": \"watercolor\",\n    \"duration\": 6,\n    \"aspect\": \"16:9\",\n    \"fps\": 24\n}\n\nres = requests.post(url, headers=headers, json=data)\ntask = res.json()\nprint(f\"Task: {task['id']}, Status: {task['status']}\")\n\n# Poll for result\nwhile True:\n    poll = requests.get(f\"{url}/{task['id']}\", headers=headers)\n    data  = poll.json()\n    if data[\"status\"] == \"completed\":\n        print(\"Video URL:\", data[\"video_url\"])\n        break\n    elif data[\"status\"] == \"failed\":\n        print(\"Failed\")\n        break\n    time.sleep(5)","JavaScript":"const res = await fetch(\n  \"https://api.Modelsnest.com/v1/video/creative\",\n  {\n    method: \"POST\",\n    headers: {\n      \"Authorization\": \"Bearer YOUR_API_KEY\",\n      \"Content-Type\": \"application/json\",\n    },\n    body: JSON.stringify({\n      prompt: \"A magical forest with glowing fireflies\",\n      style: \"watercolor\",\n      duration: 6,\n      aspect: \"16:9\",\n    }),\n  }\n)\nconst { id } = await res.json()\nconsole.log(\"Task ID:\", id)\n\n// Poll\nconst check = async () => {\n  const r = await fetch(\n    `https://api.Modelsnest.com/v1/video/creative/${id}`,\n    { headers: { \"Authorization\": \"Bearer YOUR_API_KEY\" } }\n  )\n  const d = await r.json()\n  if (d.status === \"completed\") return console.log(\"Video:\", d.video_url)\n  setTimeout(check, 5000)\n}\ncheck()","cURL":"curl https://api.Modelsnest.com/v1/video/creative \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"prompt\": \"A magical forest with glowing fireflies\",\n    \"style\": \"watercolor\",\n    \"duration\": 6\n  }'"},"pricing":{"input":"0.080","output":"0.000","unit":"second"}}$q$::jsonb) ON CONFLICT (model_id) DO UPDATE SET docs_description = EXCLUDED.docs_description, endpoint_method = EXCLUDED.endpoint_method, endpoint_path = EXCLUDED.endpoint_path, endpoint_status = EXCLUDED.endpoint_status, response_example = EXCLUDED.response_example, docs_page_payload = EXCLUDED.docs_page_payload, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 0, 'Generate your API key in the APIs section') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 1, 'POST a generation request with prompt and optional style') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 2, 'Poll the returned task ID for the video URL') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'prompt', 'string', TRUE, '—', 'Creative description of the video scene', 0) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'style', 'string', FALSE, 'cinematic', 'Artistic style: cinematic, anime, watercolor, impressionist, 3d, sketch', 1) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'duration', 'integer', FALSE, '4', 'Duration in seconds — 1 to 10', 2) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'aspect', 'string', FALSE, '16:9', 'Aspect ratio: 16:9, 9:16, 1:1, 4:3', 3) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'fps', 'integer', FALSE, '24', 'Frames per second — 12, 24, or 30', 4) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'seed', 'integer', FALSE, '—', 'Seed for reproducible generation', 5) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'Python', $code$import requests, time

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
    time.sleep(5)$code$, 0) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'JavaScript', $code$const res = await fetch(
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
    `https://api.Modelsnest.com/v1/video/creative/${id}`,
    { headers: { "Authorization": "Bearer YOUR_API_KEY" } }
  )
  const d = await r.json()
  if (d.status === "completed") return console.log("Video:", d.video_url)
  setTimeout(check, 5000)
}
check()$code$, 1) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'pika-labs'), 'cURL', $code$curl https://api.Modelsnest.com/v1/video/creative \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A magical forest with glowing fireflies",
    "style": "watercolor",
    "duration": 6
  }'$code$, 2) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
-- Model: llama-3-70b
WITH upsert_model AS (
  INSERT INTO ai_models (
    slug, name, provider, category_slug, status, performance, last_used_label, is_favorite_default, has_documentation,
    badge, display_color, card_description, docs_index_description, models_page_payload, docs_index_payload, sort_order
  )
  VALUES ('llama-3-70b', 'Llama 3 70B', 'Meta', 'llm', 'active', 92, '4 hr ago', FALSE, TRUE,
    'Open Source', '#06b6d4', 'Meta''s open-source flagship with strong reasoning, coding and instruction following.', 'Meta''s open-source flagship with strong reasoning, coding and instruction following.', $q${"id":"8","name":"Llama 3 70B","provider":"Meta","category":"llm","status":"active","performance":92,"lastUsed":"4 hr ago","slug":"llama-3-70b","hasDocumentation":true,"isFavorite":false,"description":"Meta's open-source flagship with strong reasoning, coding and instruction following.","features":["Open Source","Custom Training","Efficient","Community"]}$q$::jsonb, $q${"slug":"llama-3-70b","name":"Llama 3 70B","provider":"Meta","category":"llm","badge":"Open Source","description":"Meta's open-source flagship with strong reasoning, coding and instruction following.","features":["Open Source","Custom Training","Efficient","Community"],"pricing":{"input":"0.0008","output":"0.0008","unit":"1K tokens"}}$q$::jsonb, 7
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    provider = EXCLUDED.provider,
    category_slug = EXCLUDED.category_slug,
    status = EXCLUDED.status,
    performance = EXCLUDED.performance,
    last_used_label = EXCLUDED.last_used_label,
    is_favorite_default = EXCLUDED.is_favorite_default,
    has_documentation = EXCLUDED.has_documentation,
    badge = EXCLUDED.badge,
    display_color = EXCLUDED.display_color,
    card_description = EXCLUDED.card_description,
    docs_index_description = EXCLUDED.docs_index_description,
    models_page_payload = EXCLUDED.models_page_payload,
    docs_index_payload = EXCLUDED.docs_index_payload,
    sort_order = EXCLUDED.sort_order,
    updated_at = CURRENT_TIMESTAMP
  RETURNING id
)
INSERT INTO seed_model_ids (slug, id)
SELECT 'llama-3-70b', id FROM upsert_model
ON CONFLICT (slug) DO UPDATE SET id = EXCLUDED.id;
INSERT INTO ai_model_pricing (model_id, input_price, output_price, price_unit, currency) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 0.0008, 0.0008, '1K tokens', 'USD') ON CONFLICT (model_id) DO UPDATE SET input_price = EXCLUDED.input_price, output_price = EXCLUDED.output_price, price_unit = EXCLUDED.price_unit, currency = EXCLUDED.currency, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'models_page', 'Open Source', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'models_page', 'Custom Training', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'models_page', 'Efficient', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'models_page', 'Community', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'docs_index', 'Open Source', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'docs_index', 'Custom Training', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'docs_index', 'Efficient', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'docs_index', 'Community', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'docs_page', 'Open Source', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'docs_page', 'Custom Training', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'docs_page', 'Efficient Inference', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'docs_page', 'Community Support', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'docs_page', 'High Performance', 4) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'docs_page', 'Tool Use', 5) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_docs (model_id, docs_description, endpoint_method, endpoint_path, endpoint_status, response_example, docs_page_payload) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'Meta''s open-source flagship large language model with strong reasoning, coding, instruction following and tool use. Ideal for custom deployments and fine-tuning pipelines.', 'POST', '/v1/completions', 'Stable', $q${
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
}$q$, $q${"name":"Llama 3 70B","provider":"Meta","category":"llm","color":"#06b6d4","description":"Meta's open-source flagship large language model with strong reasoning, coding, instruction following and tool use. Ideal for custom deployments and fine-tuning pipelines.","features":["Open Source","Custom Training","Efficient Inference","Community Support","High Performance","Tool Use"],"steps":["Generate your API key in the APIs section","Include it as a Bearer token in the Authorization header","POST to /v1/completions with your prompt"],"endpoint":{"method":"POST","path":"/v1/completions","status":"Stable"},"params":[{"name":"model","type":"string","req":true,"default":"—","desc":"Model identifier — use llama-3-70b"},{"name":"prompt","type":"string","req":true,"default":"—","desc":"Input text prompt to complete"},{"name":"max_tokens","type":"integer","req":false,"default":"256","desc":"Maximum tokens to generate"},{"name":"temperature","type":"float","req":false,"default":"0.8","desc":"Sampling temperature 0.0–2.0"},{"name":"top_p","type":"float","req":false,"default":"0.95","desc":"Nucleus sampling probability mass"},{"name":"stop","type":"array","req":false,"default":"[]","desc":"List of stop sequences to end generation"},{"name":"stream","type":"boolean","req":false,"default":"false","desc":"Stream tokens as they are generated"}],"response":"{\n  \"id\": \"llama_abc123\",\n  \"object\": \"text_completion\",\n  \"created\": 1714000000,\n  \"model\": \"llama-3-70b\",\n  \"choices\": [\n    {\n      \"text\": \"Once upon a time in a digital kingdom, a robot named Aria...\",\n      \"index\": 0,\n      \"finish_reason\": \"stop\"\n    }\n  ],\n  \"usage\": {\n    \"prompt_tokens\": 8,\n    \"completion_tokens\": 20,\n    \"total_tokens\": 28\n  }\n}","examples":{"Python":"import requests\n\nurl = \"https://api.Modelsnest.com/v1/completions\"\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\ndata = {\n    \"model\": \"llama-3-70b\",\n    \"prompt\": \"Write a Python function that implements binary search:\n\ndef binary_search(arr, target):\",\n    \"max_tokens\": 300,\n    \"temperature\": 0.2,\n    \"stop\": [\"\\n\\n\", \"# End\"]\n}\n\nres = requests.post(url, headers=headers, json=data)\nprint(res.json()[\"choices\"][0][\"text\"])","JavaScript":"const res = await fetch(\n  \"https://api.Modelsnest.com/v1/completions\",\n  {\n    method: \"POST\",\n    headers: {\n      \"Authorization\": \"Bearer YOUR_API_KEY\",\n      \"Content-Type\": \"application/json\",\n    },\n    body: JSON.stringify({\n      model: \"llama-3-70b\",\n      prompt: \"Write a short story about a robot discovering music:\",\n      max_tokens: 300,\n      temperature: 0.8,\n    }),\n  }\n)\nconst data = await res.json()\nconsole.log(data.choices[0].text)","cURL":"curl https://api.Modelsnest.com/v1/completions \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"model\": \"llama-3-70b\",\n    \"prompt\": \"Write a short story about a robot discovering music:\",\n    \"max_tokens\": 300,\n    \"temperature\": 0.8\n  }'"},"pricing":{"input":"0.0008","output":"0.0008","unit":"1K tokens"}}$q$::jsonb) ON CONFLICT (model_id) DO UPDATE SET docs_description = EXCLUDED.docs_description, endpoint_method = EXCLUDED.endpoint_method, endpoint_path = EXCLUDED.endpoint_path, endpoint_status = EXCLUDED.endpoint_status, response_example = EXCLUDED.response_example, docs_page_payload = EXCLUDED.docs_page_payload, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 0, 'Generate your API key in the APIs section') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 1, 'Include it as a Bearer token in the Authorization header') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 2, 'POST to /v1/completions with your prompt') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'model', 'string', TRUE, '—', 'Model identifier — use llama-3-70b', 0) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'prompt', 'string', TRUE, '—', 'Input text prompt to complete', 1) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'max_tokens', 'integer', FALSE, '256', 'Maximum tokens to generate', 2) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'temperature', 'float', FALSE, '0.8', 'Sampling temperature 0.0–2.0', 3) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'top_p', 'float', FALSE, '0.95', 'Nucleus sampling probability mass', 4) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'stop', 'array', FALSE, '[]', 'List of stop sequences to end generation', 5) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'stream', 'boolean', FALSE, 'false', 'Stream tokens as they are generated', 6) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'Python', $code$import requests

url = "https://api.Modelsnest.com/v1/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "model": "llama-3-70b",
    "prompt": "Write a Python function that implements binary search:

def binary_search(arr, target):",
    "max_tokens": 300,
    "temperature": 0.2,
    "stop": ["\n\n", "# End"]
}

res = requests.post(url, headers=headers, json=data)
print(res.json()["choices"][0]["text"])$code$, 0) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'JavaScript', $code$const res = await fetch(
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
console.log(data.choices[0].text)$code$, 1) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'llama-3-70b'), 'cURL', $code$curl https://api.Modelsnest.com/v1/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3-70b",
    "prompt": "Write a short story about a robot discovering music:",
    "max_tokens": 300,
    "temperature": 0.8
  }'$code$, 2) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
-- Model: mistral-large
WITH upsert_model AS (
  INSERT INTO ai_models (
    slug, name, provider, category_slug, status, performance, last_used_label, is_favorite_default, has_documentation,
    badge, display_color, card_description, docs_index_description, models_page_payload, docs_index_payload, sort_order
  )
  VALUES ('mistral-large', 'Mistral Large', 'Mistral', 'llm', 'active', 91, '6 hr ago', FALSE, TRUE,
    NULL, '#06b6d4', 'High-performance European LLM with exceptional multilingual and code capabilities.', 'High-performance European LLM with exceptional multilingual and code capabilities.', $q${"id":"9","name":"Mistral Large","provider":"Mistral","category":"llm","status":"active","performance":91,"lastUsed":"6 hr ago","slug":"mistral-large","hasDocumentation":true,"isFavorite":false,"description":"High-performance European LLM with exceptional multilingual and code capabilities.","features":["Multilingual","Code Gen","Reasoning","Efficient"]}$q$::jsonb, $q${"slug":"mistral-large","name":"Mistral Large","provider":"Mistral","category":"llm","description":"High-performance European LLM with exceptional multilingual and code capabilities.","features":["Multilingual","Code Gen","Reasoning","Efficient"],"pricing":{"input":"0.0012","output":"0.0036","unit":"1K tokens"}}$q$::jsonb, 8
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    provider = EXCLUDED.provider,
    category_slug = EXCLUDED.category_slug,
    status = EXCLUDED.status,
    performance = EXCLUDED.performance,
    last_used_label = EXCLUDED.last_used_label,
    is_favorite_default = EXCLUDED.is_favorite_default,
    has_documentation = EXCLUDED.has_documentation,
    badge = EXCLUDED.badge,
    display_color = EXCLUDED.display_color,
    card_description = EXCLUDED.card_description,
    docs_index_description = EXCLUDED.docs_index_description,
    models_page_payload = EXCLUDED.models_page_payload,
    docs_index_payload = EXCLUDED.docs_index_payload,
    sort_order = EXCLUDED.sort_order,
    updated_at = CURRENT_TIMESTAMP
  RETURNING id
)
INSERT INTO seed_model_ids (slug, id)
SELECT 'mistral-large', id FROM upsert_model
ON CONFLICT (slug) DO UPDATE SET id = EXCLUDED.id;
INSERT INTO ai_model_pricing (model_id, input_price, output_price, price_unit, currency) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 0.0012, 0.0036, '1K tokens', 'USD') ON CONFLICT (model_id) DO UPDATE SET input_price = EXCLUDED.input_price, output_price = EXCLUDED.output_price, price_unit = EXCLUDED.price_unit, currency = EXCLUDED.currency, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'models_page', 'Multilingual', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'models_page', 'Code Gen', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'models_page', 'Reasoning', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'models_page', 'Efficient', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'docs_index', 'Multilingual', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'docs_index', 'Code Gen', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'docs_index', 'Reasoning', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'docs_index', 'Efficient', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'docs_page', 'Multilingual', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'docs_page', 'Code Generation', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'docs_page', 'Reasoning', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'docs_page', 'Efficient', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'docs_page', 'High Quality', 4) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'docs_page', 'Function Calling', 5) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_docs (model_id, docs_description, endpoint_method, endpoint_path, endpoint_status, response_example, docs_page_payload) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'High-performance European LLM with exceptional multilingual capabilities, precise instruction following, strong code generation and efficient inference. Best for multilingual apps.', 'POST', '/v1/chat/completions', 'Stable', $q${
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
}$q$, $q${"name":"Mistral Large","provider":"Mistral","category":"llm","color":"#06b6d4","description":"High-performance European LLM with exceptional multilingual capabilities, precise instruction following, strong code generation and efficient inference. Best for multilingual apps.","features":["Multilingual","Code Generation","Reasoning","Efficient","High Quality","Function Calling"],"steps":["Generate your API key in the APIs section","Include it as a Bearer token in the Authorization header","POST to /v1/chat/completions with messages array"],"endpoint":{"method":"POST","path":"/v1/chat/completions","status":"Stable"},"params":[{"name":"model","type":"string","req":true,"default":"—","desc":"Model identifier — use mistral-large"},{"name":"messages","type":"array","req":true,"default":"—","desc":"Conversation history with role and content"},{"name":"max_tokens","type":"integer","req":false,"default":"1024","desc":"Maximum tokens to generate"},{"name":"temperature","type":"float","req":false,"default":"0.7","desc":"Sampling temperature 0.0–1.0"},{"name":"top_p","type":"float","req":false,"default":"1.0","desc":"Nucleus sampling probability"},{"name":"stream","type":"boolean","req":false,"default":"false","desc":"Enable streaming responses"},{"name":"safe_prompt","type":"boolean","req":false,"default":"false","desc":"Prepend safety system prompt"}],"response":"{\n  \"id\": \"mistral_abc123\",\n  \"object\": \"chat.completion\",\n  \"created\": 1714000000,\n  \"model\": \"mistral-large-latest\",\n  \"choices\": [\n    {\n      \"index\": 0,\n      \"message\": {\n        \"role\": \"assistant\",\n        \"content\": \"Bonjour! Je suis Mistral Large. Comment puis-je vous aider?\"\n      },\n      \"finish_reason\": \"stop\"\n    }\n  ],\n  \"usage\": {\n    \"prompt_tokens\": 10,\n    \"completion_tokens\": 18,\n    \"total_tokens\": 28\n  }\n}","examples":{"Python":"import requests\n\nurl = \"https://api.Modelsnest.com/v1/chat/completions\"\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\n# Multilingual example\ndata = {\n    \"model\": \"mistral-large\",\n    \"messages\": [\n        {\"role\": \"system\",  \"content\": \"You are a multilingual assistant.\"},\n        {\"role\": \"user\",    \"content\": \"Explique-moi la relativité restreinte en termes simples.\"}\n    ],\n    \"max_tokens\": 500,\n    \"temperature\": 0.6\n}\n\nres = requests.post(url, headers=headers, json=data)\nprint(res.json()[\"choices\"][0][\"message\"][\"content\"])","JavaScript":"const res = await fetch(\n  \"https://api.Modelsnest.com/v1/chat/completions\",\n  {\n    method: \"POST\",\n    headers: {\n      \"Authorization\": \"Bearer YOUR_API_KEY\",\n      \"Content-Type\": \"application/json\",\n    },\n    body: JSON.stringify({\n      model: \"mistral-large\",\n      messages: [\n        { role: \"system\", content: \"You are a multilingual assistant.\" },\n        { role: \"user\",   content: \"Erkläre mir die Relativitätstheorie einfach.\" },\n      ],\n      max_tokens: 500,\n      temperature: 0.6,\n    }),\n  }\n)\nconst data = await res.json()\nconsole.log(data.choices[0].message.content)","cURL":"curl https://api.Modelsnest.com/v1/chat/completions \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"model\": \"mistral-large\",\n    \"messages\": [\n      {\"role\":\"user\",\"content\":\"Bonjour! Comment allez-vous?\"}\n    ],\n    \"max_tokens\": 300\n  }'"},"pricing":{"input":"0.0012","output":"0.0036","unit":"1K tokens"}}$q$::jsonb) ON CONFLICT (model_id) DO UPDATE SET docs_description = EXCLUDED.docs_description, endpoint_method = EXCLUDED.endpoint_method, endpoint_path = EXCLUDED.endpoint_path, endpoint_status = EXCLUDED.endpoint_status, response_example = EXCLUDED.response_example, docs_page_payload = EXCLUDED.docs_page_payload, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 0, 'Generate your API key in the APIs section') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 1, 'Include it as a Bearer token in the Authorization header') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 2, 'POST to /v1/chat/completions with messages array') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'model', 'string', TRUE, '—', 'Model identifier — use mistral-large', 0) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'messages', 'array', TRUE, '—', 'Conversation history with role and content', 1) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'max_tokens', 'integer', FALSE, '1024', 'Maximum tokens to generate', 2) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'temperature', 'float', FALSE, '0.7', 'Sampling temperature 0.0–1.0', 3) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'top_p', 'float', FALSE, '1.0', 'Nucleus sampling probability', 4) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'stream', 'boolean', FALSE, 'false', 'Enable streaming responses', 5) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'safe_prompt', 'boolean', FALSE, 'false', 'Prepend safety system prompt', 6) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'Python', $code$import requests

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
print(res.json()["choices"][0]["message"]["content"])$code$, 0) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'JavaScript', $code$const res = await fetch(
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
console.log(data.choices[0].message.content)$code$, 1) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'mistral-large'), 'cURL', $code$curl https://api.Modelsnest.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistral-large",
    "messages": [
      {"role":"user","content":"Bonjour! Comment allez-vous?"}
    ],
    "max_tokens": 300
  }'$code$, 2) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
-- Model: streamai-pro
WITH upsert_model AS (
  INSERT INTO ai_models (
    slug, name, provider, category_slug, status, performance, last_used_label, is_favorite_default, has_documentation,
    badge, display_color, card_description, docs_index_description, models_page_payload, docs_index_payload, sort_order
  )
  VALUES ('streamai-pro', 'StreamAI Pro', 'Modelsnest', 'livestreaming', 'active', 96, '1 min ago', TRUE, TRUE,
    'Exclusive', '#ec4899', 'Real-time AI processing for live streaming — moderation, engagement and analytics.', 'Real-time AI processing built for live streaming — moderation, engagement and analytics.', $q${"id":"10","name":"StreamAI Pro","provider":"Modelsnest","category":"livestreaming","status":"active","performance":96,"lastUsed":"1 min ago","slug":"streamai-pro","hasDocumentation":true,"isFavorite":true,"description":"Real-time AI processing for live streaming — moderation, engagement and analytics.","features":["Real-time","Moderation","Analytics","Live Chat"]}$q$::jsonb, $q${"slug":"streamai-pro","name":"StreamAI Pro","provider":"Modelsnest","category":"livestreaming","badge":"Exclusive","description":"Real-time AI processing built for live streaming — moderation, engagement and analytics.","features":["Real-time","Moderation","Analytics","Live Chat"],"pricing":{"input":"0.020","output":"0.000","unit":"minute"}}$q$::jsonb, 9
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    provider = EXCLUDED.provider,
    category_slug = EXCLUDED.category_slug,
    status = EXCLUDED.status,
    performance = EXCLUDED.performance,
    last_used_label = EXCLUDED.last_used_label,
    is_favorite_default = EXCLUDED.is_favorite_default,
    has_documentation = EXCLUDED.has_documentation,
    badge = EXCLUDED.badge,
    display_color = EXCLUDED.display_color,
    card_description = EXCLUDED.card_description,
    docs_index_description = EXCLUDED.docs_index_description,
    models_page_payload = EXCLUDED.models_page_payload,
    docs_index_payload = EXCLUDED.docs_index_payload,
    sort_order = EXCLUDED.sort_order,
    updated_at = CURRENT_TIMESTAMP
  RETURNING id
)
INSERT INTO seed_model_ids (slug, id)
SELECT 'streamai-pro', id FROM upsert_model
ON CONFLICT (slug) DO UPDATE SET id = EXCLUDED.id;
INSERT INTO ai_model_pricing (model_id, input_price, output_price, price_unit, currency) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 0.02, 0, 'minute', 'USD') ON CONFLICT (model_id) DO UPDATE SET input_price = EXCLUDED.input_price, output_price = EXCLUDED.output_price, price_unit = EXCLUDED.price_unit, currency = EXCLUDED.currency, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'models_page', 'Real-time', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'models_page', 'Moderation', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'models_page', 'Analytics', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'models_page', 'Live Chat', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'docs_index', 'Real-time', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'docs_index', 'Moderation', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'docs_index', 'Analytics', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'docs_index', 'Live Chat', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'docs_page', 'Real-time Processing', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'docs_page', 'Content Moderation', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'docs_page', 'Audience Analytics', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'docs_page', 'Live Captions', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'docs_page', 'Highlight Detection', 4) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'docs_page', 'Chat AI', 5) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_docs (model_id, docs_description, endpoint_method, endpoint_path, endpoint_status, response_example, docs_page_payload) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'Real-time AI processing purpose-built for live streaming — content moderation, audience engagement analytics, live caption generation and automated highlight detection.', 'POST', '/v1/stream/process', 'Stable', $q${
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
}$q$, $q${"name":"StreamAI Pro","provider":"Modelsnest","category":"livestreaming","color":"#ec4899","description":"Real-time AI processing purpose-built for live streaming — content moderation, audience engagement analytics, live caption generation and automated highlight detection.","features":["Real-time Processing","Content Moderation","Audience Analytics","Live Captions","Highlight Detection","Chat AI"],"steps":["Generate your API key in the APIs section","Attach your stream_id to the processing request","Receive real-time moderation scores and engagement metrics via webhooks"],"endpoint":{"method":"POST","path":"/v1/stream/process","status":"Stable"},"params":[{"name":"stream_id","type":"string","req":true,"default":"—","desc":"Live stream session identifier"},{"name":"content_type","type":"string","req":true,"default":"—","desc":"Type of content: video, audio, chat"},{"name":"features","type":"array","req":false,"default":"all","desc":"Features to enable: moderation, captions, highlights, analytics"},{"name":"webhook_url","type":"string","req":false,"default":"—","desc":"URL to receive real-time event callbacks"},{"name":"language","type":"string","req":false,"default":"auto","desc":"Stream language for captions — ISO-639-1 code"}],"response":"{\n  \"stream_id\": \"stream_abc123\",\n  \"status\": \"processing\",\n  \"session_id\": \"sess_xyz789\",\n  \"features_active\": [\"moderation\", \"captions\", \"analytics\"],\n  \"moderation\": {\n    \"score\": 0.04,\n    \"status\": \"safe\",\n    \"flagged_categories\": []\n  },\n  \"captions\": {\n    \"current_text\": \"Welcome to tonight's live stream!\",\n    \"language\": \"en\"\n  },\n  \"analytics\": {\n    \"viewers\": 2847,\n    \"peak_viewers\": 3100,\n    \"chat_rate_per_minute\": 142,\n    \"engagement_score\": 0.87\n  }\n}","examples":{"Python":"import requests\n\nurl = \"https://api.Modelsnest.com/v1/stream/process\"\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\ndata = {\n    \"stream_id\": \"stream_abc123\",\n    \"content_type\": \"video\",\n    \"features\": [\"moderation\", \"captions\", \"analytics\"],\n    \"webhook_url\": \"https://yourapp.com/webhook/stream-events\",\n    \"language\": \"en\"\n}\n\nres = requests.post(url, headers=headers, json=data)\nresult = res.json()\n\nprint(f\"Session: {result['session_id']}\")\nprint(f\"Viewers: {result['analytics']['viewers']}\")\nprint(f\"Moderation: {result['moderation']['status']}\")\nprint(f\"Current caption: {result['captions']['current_text']}\")","JavaScript":"const res = await fetch(\n  \"https://api.Modelsnest.com/v1/stream/process\",\n  {\n    method: \"POST\",\n    headers: {\n      \"Authorization\": \"Bearer YOUR_API_KEY\",\n      \"Content-Type\": \"application/json\",\n    },\n    body: JSON.stringify({\n      stream_id: \"stream_abc123\",\n      content_type: \"video\",\n      features: [\"moderation\", \"captions\", \"analytics\"],\n      webhook_url: \"https://yourapp.com/webhook/stream-events\",\n      language: \"en\",\n    }),\n  }\n)\nconst data = await res.json()\nconsole.log(\"Session:\", data.session_id)\nconsole.log(\"Viewers:\", data.analytics.viewers)\nconsole.log(\"Moderation:\", data.moderation.status)","cURL":"curl https://api.Modelsnest.com/v1/stream/process \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"stream_id\": \"stream_abc123\",\n    \"content_type\": \"video\",\n    \"features\": [\"moderation\",\"captions\",\"analytics\"],\n    \"language\": \"en\"\n  }'"},"pricing":{"input":"0.020","output":"0.000","unit":"minute"}}$q$::jsonb) ON CONFLICT (model_id) DO UPDATE SET docs_description = EXCLUDED.docs_description, endpoint_method = EXCLUDED.endpoint_method, endpoint_path = EXCLUDED.endpoint_path, endpoint_status = EXCLUDED.endpoint_status, response_example = EXCLUDED.response_example, docs_page_payload = EXCLUDED.docs_page_payload, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 0, 'Generate your API key in the APIs section') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 1, 'Attach your stream_id to the processing request') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 2, 'Receive real-time moderation scores and engagement metrics via webhooks') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'stream_id', 'string', TRUE, '—', 'Live stream session identifier', 0) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'content_type', 'string', TRUE, '—', 'Type of content: video, audio, chat', 1) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'features', 'array', FALSE, 'all', 'Features to enable: moderation, captions, highlights, analytics', 2) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'webhook_url', 'string', FALSE, '—', 'URL to receive real-time event callbacks', 3) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'language', 'string', FALSE, 'auto', 'Stream language for captions — ISO-639-1 code', 4) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'Python', $code$import requests

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
print(f"Current caption: {result['captions']['current_text']}")$code$, 0) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'JavaScript', $code$const res = await fetch(
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
console.log("Moderation:", data.moderation.status)$code$, 1) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'streamai-pro'), 'cURL', $code$curl https://api.Modelsnest.com/v1/stream/process \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "stream_id": "stream_abc123",
    "content_type": "video",
    "features": ["moderation","captions","analytics"],
    "language": "en"
  }'$code$, 2) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
-- Model: livechat-ai
WITH upsert_model AS (
  INSERT INTO ai_models (
    slug, name, provider, category_slug, status, performance, last_used_label, is_favorite_default, has_documentation,
    badge, display_color, card_description, docs_index_description, models_page_payload, docs_index_payload, sort_order
  )
  VALUES ('livechat-ai', 'LiveChat AI', 'Modelsnest', 'livestreaming', 'inactive', 85, '1 week ago', FALSE, TRUE,
    NULL, '#ec4899', 'AI-powered live chat moderation with spam detection and sentiment analysis.', NULL, $q${"id":"11","name":"LiveChat AI","provider":"Modelsnest","category":"livestreaming","status":"inactive","performance":85,"lastUsed":"1 week ago","slug":"livechat-ai","hasDocumentation":true,"isFavorite":false,"description":"AI-powered live chat moderation with spam detection and sentiment analysis.","features":["Chat Mod","Spam Detection","Sentiment","Auto-Replies"]}$q$::jsonb, $q${}$q$::jsonb, 10
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    provider = EXCLUDED.provider,
    category_slug = EXCLUDED.category_slug,
    status = EXCLUDED.status,
    performance = EXCLUDED.performance,
    last_used_label = EXCLUDED.last_used_label,
    is_favorite_default = EXCLUDED.is_favorite_default,
    has_documentation = EXCLUDED.has_documentation,
    badge = EXCLUDED.badge,
    display_color = EXCLUDED.display_color,
    card_description = EXCLUDED.card_description,
    docs_index_description = EXCLUDED.docs_index_description,
    models_page_payload = EXCLUDED.models_page_payload,
    docs_index_payload = EXCLUDED.docs_index_payload,
    sort_order = EXCLUDED.sort_order,
    updated_at = CURRENT_TIMESTAMP
  RETURNING id
)
INSERT INTO seed_model_ids (slug, id)
SELECT 'livechat-ai', id FROM upsert_model
ON CONFLICT (slug) DO UPDATE SET id = EXCLUDED.id;
INSERT INTO ai_model_pricing (model_id, input_price, output_price, price_unit, currency) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 0.001, 0, 'message', 'USD') ON CONFLICT (model_id) DO UPDATE SET input_price = EXCLUDED.input_price, output_price = EXCLUDED.output_price, price_unit = EXCLUDED.price_unit, currency = EXCLUDED.currency, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'models_page', 'Chat Mod', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'models_page', 'Spam Detection', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'models_page', 'Sentiment', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'models_page', 'Auto-Replies', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'docs_page', 'Chat Moderation', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'docs_page', 'Spam Detection', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'docs_page', 'Toxicity Scoring', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'docs_page', 'Sentiment Analysis', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'docs_page', 'Auto-Responses', 4) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'docs_page', 'Real-time', 5) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_docs (model_id, docs_description, endpoint_method, endpoint_path, endpoint_status, response_example, docs_page_payload) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'AI-powered live chat moderation with spam detection, toxicity scoring, sentiment analysis and smart auto-responses. Keeps your community safe at scale in real time.', 'POST', '/v1/chat/moderate', 'Stable', $q${
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
}$q$, $q${"name":"LiveChat AI","provider":"Modelsnest","category":"livestreaming","color":"#ec4899","description":"AI-powered live chat moderation with spam detection, toxicity scoring, sentiment analysis and smart auto-responses. Keeps your community safe at scale in real time.","features":["Chat Moderation","Spam Detection","Toxicity Scoring","Sentiment Analysis","Auto-Responses","Real-time"],"steps":["Generate your API key in the APIs section","Send each chat message to /v1/chat/moderate","Act on the returned is_approved flag and moderation_score"],"endpoint":{"method":"POST","path":"/v1/chat/moderate","status":"Stable"},"params":[{"name":"message","type":"string","req":true,"default":"—","desc":"The chat message content to moderate"},{"name":"user_id","type":"string","req":true,"default":"—","desc":"Unique identifier of the message author"},{"name":"stream_id","type":"string","req":false,"default":"—","desc":"Stream session context for user history tracking"},{"name":"auto_reply","type":"boolean","req":false,"default":"false","desc":"Generate a smart auto-reply for approved messages"},{"name":"thresholds","type":"object","req":false,"default":"—","desc":"Custom toxicity and spam thresholds (0.0–1.0)"}],"response":"{\n  \"message_id\": \"msg_abc123\",\n  \"user_id\": \"user_xyz\",\n  \"is_approved\": true,\n  \"moderation_score\": 0.03,\n  \"toxicity_score\": 0.02,\n  \"spam_score\": 0.01,\n  \"sentiment\": \"positive\",\n  \"action\": \"allow\",\n  \"categories\": [],\n  \"auto_reply\": null,\n  \"processing_ms\": 18\n}\n\n// When message is flagged:\n{\n  \"message_id\": \"msg_def456\",\n  \"is_approved\": false,\n  \"moderation_score\": 0.91,\n  \"action\": \"remove\",\n  \"categories\": [\"toxicity\", \"harassment\"],\n  \"auto_reply\": null\n}","examples":{"Python":"import requests\n\nurl = \"https://api.Modelsnest.com/v1/chat/moderate\"\nheaders = {\n    \"Authorization\": \"Bearer YOUR_API_KEY\",\n    \"Content-Type\": \"application/json\"\n}\n\ndef moderate_message(message: str, user_id: str, stream_id: str):\n    data = {\n        \"message\": message,\n        \"user_id\": user_id,\n        \"stream_id\": stream_id,\n        \"auto_reply\": True,\n        \"thresholds\": {\n            \"toxicity\": 0.7,\n            \"spam\": 0.8\n        }\n    }\n    res = requests.post(url, headers=headers, json=data)\n    result = res.json()\n\n    if result[\"is_approved\"]:\n        print(f\"✓ Approved — sentiment: {result['sentiment']}\")\n        if result.get(\"auto_reply\"):\n            print(f\"  Auto-reply: {result['auto_reply']}\")\n    else:\n        print(f\"✗ Removed — categories: {result['categories']}\")\n    return result\n\nmoderate_message(\"Hello everyone! Great stream today!\", \"user_123\", \"stream_abc\")","JavaScript":"async function moderateMessage(message, userId, streamId) {\n  const res = await fetch(\n    \"https://api.Modelsnest.com/v1/chat/moderate\",\n    {\n      method: \"POST\",\n      headers: {\n        \"Authorization\": \"Bearer YOUR_API_KEY\",\n        \"Content-Type\": \"application/json\",\n      },\n      body: JSON.stringify({\n        message,\n        user_id: userId,\n        stream_id: streamId,\n        auto_reply: true,\n        thresholds: { toxicity: 0.7, spam: 0.8 },\n      }),\n    }\n  )\n  const data = await res.json()\n\n  if (data.is_approved) {\n    console.log(\"✓ Approved — sentiment:\", data.sentiment)\n    if (data.auto_reply) console.log(\"Auto-reply:\", data.auto_reply)\n  } else {\n    console.log(\"✗ Removed — categories:\", data.categories)\n  }\n  return data\n}\n\nmoderateMessage(\"Hello everyone! Great stream!\", \"user_123\", \"stream_abc\")","cURL":"curl https://api.Modelsnest.com/v1/chat/moderate \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\n    \"message\": \"Hello everyone! Great stream today!\",\n    \"user_id\": \"user_123\",\n    \"stream_id\": \"stream_abc\",\n    \"auto_reply\": true\n  }'"},"pricing":{"input":"0.001","output":"0.000","unit":"message"}}$q$::jsonb) ON CONFLICT (model_id) DO UPDATE SET docs_description = EXCLUDED.docs_description, endpoint_method = EXCLUDED.endpoint_method, endpoint_path = EXCLUDED.endpoint_path, endpoint_status = EXCLUDED.endpoint_status, response_example = EXCLUDED.response_example, docs_page_payload = EXCLUDED.docs_page_payload, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 0, 'Generate your API key in the APIs section') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 1, 'Send each chat message to /v1/chat/moderate') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_steps (model_id, step_order, step_text) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 2, 'Act on the returned is_approved flag and moderation_score') ON CONFLICT (model_id, step_order) DO UPDATE SET step_text = EXCLUDED.step_text;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'message', 'string', TRUE, '—', 'The chat message content to moderate', 0) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'user_id', 'string', TRUE, '—', 'Unique identifier of the message author', 1) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'stream_id', 'string', FALSE, '—', 'Stream session context for user history tracking', 2) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'auto_reply', 'boolean', FALSE, 'false', 'Generate a smart auto-reply for approved messages', 3) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_parameters (model_id, param_name, param_type, is_required, default_value, description, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'thresholds', 'object', FALSE, '—', 'Custom toxicity and spam thresholds (0.0–1.0)', 4) ON CONFLICT (model_id, param_name) DO UPDATE SET param_type = EXCLUDED.param_type, is_required = EXCLUDED.is_required, default_value = EXCLUDED.default_value, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'Python', $code$import requests

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

moderate_message("Hello everyone! Great stream today!", "user_123", "stream_abc")$code$, 0) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'JavaScript', $code$async function moderateMessage(message, userId, streamId) {
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

moderateMessage("Hello everyone! Great stream!", "user_123", "stream_abc")$code$, 1) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_doc_examples (model_id, language, code_example, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'livechat-ai'), 'cURL', $code$curl https://api.Modelsnest.com/v1/chat/moderate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello everyone! Great stream today!",
    "user_id": "user_123",
    "stream_id": "stream_abc",
    "auto_reply": true
  }'$code$, 2) ON CONFLICT (model_id, language) DO UPDATE SET code_example = EXCLUDED.code_example, sort_order = EXCLUDED.sort_order;
-- Model: neural-vision-pro
WITH upsert_model AS (
  INSERT INTO ai_models (
    slug, name, provider, category_slug, status, performance, last_used_label, is_favorite_default, has_documentation,
    badge, display_color, card_description, docs_index_description, models_page_payload, docs_index_payload, sort_order
  )
  VALUES ('neural-vision-pro', 'Neural Vision Pro', 'Modelsnest', 'video', 'inactive', 78, '2 weeks ago', FALSE, FALSE,
    NULL, '#f59e0b', 'Advanced computer vision for image recognition and scene understanding.', NULL, $q${"id":"12","name":"Neural Vision Pro","provider":"Modelsnest","category":"video","status":"inactive","performance":78,"lastUsed":"2 weeks ago","slug":"neural-vision-pro","hasDocumentation":false,"isFavorite":false,"description":"Advanced computer vision for image recognition and scene understanding.","features":["Object Detection","Classification","Facial Rec","Scene"]}$q$::jsonb, $q${}$q$::jsonb, 11
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    provider = EXCLUDED.provider,
    category_slug = EXCLUDED.category_slug,
    status = EXCLUDED.status,
    performance = EXCLUDED.performance,
    last_used_label = EXCLUDED.last_used_label,
    is_favorite_default = EXCLUDED.is_favorite_default,
    has_documentation = EXCLUDED.has_documentation,
    badge = EXCLUDED.badge,
    display_color = EXCLUDED.display_color,
    card_description = EXCLUDED.card_description,
    docs_index_description = EXCLUDED.docs_index_description,
    models_page_payload = EXCLUDED.models_page_payload,
    docs_index_payload = EXCLUDED.docs_index_payload,
    sort_order = EXCLUDED.sort_order,
    updated_at = CURRENT_TIMESTAMP
  RETURNING id
)
INSERT INTO seed_model_ids (slug, id)
SELECT 'neural-vision-pro', id FROM upsert_model
ON CONFLICT (slug) DO UPDATE SET id = EXCLUDED.id;
INSERT INTO ai_model_pricing (model_id, input_price, output_price, price_unit, currency) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'neural-vision-pro'), 0, 0, '1K tokens', 'USD') ON CONFLICT (model_id) DO UPDATE SET input_price = EXCLUDED.input_price, output_price = EXCLUDED.output_price, price_unit = EXCLUDED.price_unit, currency = EXCLUDED.currency, updated_at = CURRENT_TIMESTAMP;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'neural-vision-pro'), 'models_page', 'Object Detection', 0) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'neural-vision-pro'), 'models_page', 'Classification', 1) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'neural-vision-pro'), 'models_page', 'Facial Rec', 2) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
INSERT INTO ai_model_features (model_id, source, feature_text, sort_order) VALUES ((SELECT id FROM seed_model_ids WHERE slug = 'neural-vision-pro'), 'models_page', 'Scene', 3) ON CONFLICT (model_id, source, feature_text) DO UPDATE SET sort_order = EXCLUDED.sort_order;
COMMIT;