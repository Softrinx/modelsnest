import "dotenv/config";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";
const API_TOKEN = process.env.TEST_API_KEY || "ptr_YOUR_API_TOKEN_HERE";
const ONLY_ENDPOINT = process.env.ONLY_ENDPOINT || "";
const TIMEOUT_MS = Number.parseInt(process.env.TEST_TIMEOUT_MS || "25000", 10);

const authHeaders = {
  Authorization: `Bearer ${API_TOKEN}`,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function printDivider() {
  console.log("-".repeat(88));
}

function truncate(value, length = 280) {
  if (typeof value !== "string") return value;
  return value.length > length ? `${value.slice(0, length)}...` : value;
}

function pickSummaryPayload(payload) {
  if (!payload || typeof payload !== "object") return payload;
  const base = {
    success: payload.success,
    message: payload.message,
    error: payload.error,
    code: payload.code,
    billing: payload.billing,
  };

  if (Array.isArray(payload.choices) && payload.choices.length > 0) {
    const firstChoice = payload.choices[0];
    base.choice_preview = truncate(
      firstChoice?.message?.content || firstChoice?.text || "",
      160,
    );
    base.model = payload.model;
    base.usage = payload.usage;
  }

  return base;
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

const testCases = [
  {
    id: "chat-deepseek",
    endpoint: "chat",
    description: "Chat completion · DeepSeek",
    request: {
      method: "POST",
      path: "/v1/chat/completions",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: {
        model: "deepseek",
        messages: [{ role: "user", content: "Explain quantum computing simply in 3 bullets." }],
        max_tokens: 250,
        temperature: 0.4,
      },
    },
  },
  {
    id: "chat-gpt4",
    endpoint: "chat",
    description: "Chat completion · GPT-4",
    request: {
      method: "POST",
      path: "/v1/chat/completions",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: {
        model: "gpt-4",
        messages: [{ role: "user", content: "Give a short explanation of eventual consistency." }],
        max_tokens: 220,
        temperature: 0.3,
      },
    },
  },
  {
    id: "chat-qwen",
    endpoint: "chat",
    description: "Chat completion · Qwen-7B",
    request: {
      method: "POST",
      path: "/v1/chat/completions",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: {
        model: "qwen-7b",
        messages: [{ role: "user", content: "Translate 'good morning' to French and Hindi." }],
        max_tokens: 160,
        temperature: 0.2,
      },
    },
  },
  {
    id: "chat-gemini",
    endpoint: "chat",
    description: "Chat completion · Gemini Pro",
    request: {
      method: "POST",
      path: "/v1/chat/completions",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: {
        model: "gemini-pro",
        messages: [{ role: "user", content: "Write a 2-line summary of transformers in ML." }],
        max_tokens: 180,
        temperature: 0.3,
      },
    },
  },
  {
    id: "stt-whisper",
    endpoint: "audio",
    description: "Audio transcription billing · Whisper",
    request: {
      method: "POST",
      path: "/v1/audio/transcriptions",
      formData: {
        model: "whisper-1",
        duration_seconds: "75",
      },
      headers: authHeaders,
    },
  },
  {
    id: "stt-deepgram",
    endpoint: "audio",
    description: "Audio transcription billing · Deepgram Nova-3",
    request: {
      method: "POST",
      path: "/v1/audio/transcriptions",
      formData: {
        model: "deepgram-nova3",
        duration_seconds: "40",
      },
      headers: authHeaders,
    },
  },
  {
    id: "stt-assemblyai",
    endpoint: "audio",
    description: "Audio transcription billing · AssemblyAI Universal-1",
    request: {
      method: "POST",
      path: "/v1/audio/transcriptions",
      formData: {
        model: "assemblyai-universal1",
        duration_seconds: "50",
      },
      headers: authHeaders,
    },
  },
  {
    id: "tts-elevenlabs",
    endpoint: "tts",
    description: "Text-to-speech billing · ElevenLabs v3",
    request: {
      method: "POST",
      path: "/v1/text-to-speech",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: {
        model: "elevenlabs-v3",
        text: "Welcome to Modelsnest test suite.",
      },
    },
  },
  {
    id: "tts-playht",
    endpoint: "tts",
    description: "Text-to-speech billing · PlayHT Ultra",
    request: {
      method: "POST",
      path: "/v1/text-to-speech",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: {
        model: "playht-ultra",
        text: "This is a quick synthetic voice billing test.",
      },
    },
  },
  {
    id: "tts-coqui",
    endpoint: "tts",
    description: "Text-to-speech billing · Coqui TTS",
    request: {
      method: "POST",
      path: "/v1/text-to-speech",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: {
        model: "coqui-tts",
        text: "Coqui test synthesis line.",
      },
    },
  },
  {
    id: "image-midjourney",
    endpoint: "image",
    description: "Image generation billing · Midjourney v5",
    request: {
      method: "POST",
      path: "/v1/images/generate",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: {
        model: "midjourney-v5",
        prompt: "Sunset over mountains in cinematic style",
        num_images: 1,
      },
    },
  },
  {
    id: "image-stable-diffusion",
    endpoint: "image",
    description: "Image generation billing · Stable Diffusion v2",
    request: {
      method: "POST",
      path: "/v1/images/generate",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: {
        model: "stable-diffusion-v2",
        prompt: "A futuristic city skyline at night",
        num_images: 2,
      },
    },
  },
  {
    id: "video-runway",
    endpoint: "video",
    description: "Video generation billing · Runway Gen-3",
    request: {
      method: "POST",
      path: "/v1/video/generations",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: {
        model: "runway-gen-3",
        duration_seconds: 8,
      },
    },
  },
];

function buildRequestOptions(testCase) {
  const { request } = testCase;
  const options = {
    method: request.method,
    headers: request.headers,
  };

  if (request.formData) {
    const form = new FormData();
    for (const [key, value] of Object.entries(request.formData)) {
      form.append(key, value);
    }
    options.body = form;
    options.headers = { ...authHeaders };
    return options;
  }

  if (request.body !== undefined) {
    options.body = JSON.stringify(request.body);
  }

  return options;
}

async function runCase(testCase) {
  const url = `${API_BASE_URL}${testCase.request.path}`;
  const options = buildRequestOptions(testCase);
  const startedAt = Date.now();

  try {
    const res = await fetchWithTimeout(url, options, TIMEOUT_MS);
    const elapsedMs = Date.now() - startedAt;
    const contentType = res.headers.get("content-type") || "";

    let payload;
    if (contentType.includes("application/json")) {
      payload = await res.json().catch(() => null);
    } else {
      payload = await res.text().catch(() => null);
    }

    const passed = res.ok;

    return {
      id: testCase.id,
      endpoint: testCase.endpoint,
      description: testCase.description,
      method: testCase.request.method,
      path: testCase.request.path,
      status: res.status,
      statusText: res.statusText,
      elapsedMs,
      passed,
      payload,
    };
  } catch (error) {
    const elapsedMs = Date.now() - startedAt;
    return {
      id: testCase.id,
      endpoint: testCase.endpoint,
      description: testCase.description,
      method: testCase.request.method,
      path: testCase.request.path,
      status: 0,
      statusText: "REQUEST_FAILED",
      elapsedMs,
      passed: false,
      payload: {
        error: String(error?.message || error),
      },
    };
  }
}

async function main() {
  if (!API_TOKEN || !API_TOKEN.startsWith("ptr_")) {
    console.error("Set TEST_API_KEY in .env (ptr_...) before running this script.");
    process.exit(1);
  }

  const filteredCases = ONLY_ENDPOINT
    ? testCases.filter((testCase) => testCase.endpoint === ONLY_ENDPOINT)
    : testCases;

  if (filteredCases.length === 0) {
    console.error(
      `No test cases matched ONLY_ENDPOINT='${ONLY_ENDPOINT}'. Valid values: chat, audio, tts, image, video`,
    );
    process.exit(1);
  }

  console.log("API test runner");
  console.log("Base URL:", API_BASE_URL);
  console.log("Cases:", filteredCases.length, ONLY_ENDPOINT ? `(filtered by ${ONLY_ENDPOINT})` : "");
  printDivider();

  const results = [];

  for (const testCase of filteredCases) {
    console.log(`→ ${testCase.description}`);
    const result = await runCase(testCase);
    results.push(result);

    const mark = result.passed ? "✅" : "❌";
    console.log(
      `${mark} ${result.method} ${result.path} → ${result.status} ${result.statusText} (${result.elapsedMs}ms)`,
    );

    const summaryPayload = pickSummaryPayload(result.payload);
    console.dir(summaryPayload, { depth: null });
    printDivider();

    await sleep(250);
  }

  const passed = results.filter((result) => result.passed).length;
  const failed = results.length - passed;

  console.log("Summary");
  console.log(`Passed: ${passed}/${results.length}`);
  console.log(`Failed: ${failed}/${results.length}`);

  if (failed > 0) {
    console.log("Failed cases:");
    for (const failure of results.filter((result) => !result.passed)) {
      console.log(`- ${failure.id} (${failure.status} ${failure.statusText})`);
    }
    process.exitCode = 1;
  }
}

main();
