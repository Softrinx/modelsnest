// test-api.js
import "dotenv/config";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";
const API_TOKEN = process.env.TEST_API_KEY || "ptr_YOUR_API_TOKEN_HERE";

async function main() {
  if (!API_TOKEN || !API_TOKEN.startsWith("ptr_")) {
    console.error("Set TEST_API_KEY in .env (ptr_...) before running this script.");
    process.exit(1);
  }

  console.log("Sending request to", `${API_BASE_URL}/v1/chat/completions`);

  try {
    const res = await fetch(`${API_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-v3-0324",
        messages: [
          { role: "user", content: "Explain quantum computing simply." },
        ],
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    console.log("Status:", res.status, res.statusText);
    const json = await res.json().catch(() => null);

    console.log("Response JSON:");
    console.dir(json, { depth: null });
  } catch (err) {
    console.error("Request failed:", err);
  }
}

main();
