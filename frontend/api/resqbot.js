/* global process */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2000;

const SYSTEM_MESSAGE = `You are ResQBot, the concise support assistant for ResQPlate, a surplus-food donation and rescue application.

Help users post donations, browse available food, upload images, use Map View, claim food, track rescues, understand volunteer matching, and follow safe food-handling practices. Only describe features that exist. Never claim an organization is verified, insured, government-backed, or partnered. Do not invent donation, volunteer, impact, or account data. For urgent medical or food-safety concerns, recommend a qualified local professional or authority. Stay focused on food rescue and answer in short paragraphs with no more than four bullets.`;

function sanitizeMessages(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((message) => message && ["user", "assistant"].includes(message.role))
    .slice(-MAX_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: String(message.content || "").trim().slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((message) => message.content);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return response.status(503).json({ error: "Assistant is not configured" });

  const messages = sanitizeMessages(request.body?.messages);
  if (!messages.length || messages.at(-1).role !== "user") {
    return response.status(400).json({ error: "A user message is required" });
  }

  try {
    const groqResponse = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: SYSTEM_MESSAGE }, ...messages],
        temperature: 0.35,
        max_completion_tokens: 350,
      }),
    });

    const payload = await groqResponse.json().catch(() => ({}));
    if (!groqResponse.ok) {
      console.error("Groq request failed", groqResponse.status, payload?.error?.code || "unknown");
      return response.status(502).json({ error: "Assistant provider request failed" });
    }

    const content = payload?.choices?.[0]?.message?.content?.trim();
    if (!content) return response.status(502).json({ error: "Assistant returned no content" });
    return response.status(200).json({ message: content });
  } catch (error) {
    console.error("ResQBot proxy failed", error instanceof Error ? error.message : "unknown error");
    return response.status(502).json({ error: "Assistant is temporarily unavailable" });
  }
}
