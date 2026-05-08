import { Groq } from "groq-sdk";

/**
 * Analyze a donation image using Groq vision model (llama-3.2-11b-vision-preview).
 * @param {string} base64Image - Image data as a base64 string (with or without data URI prefix).
 * @returns {Promise<{food:string, meals:number, type:"Veg"|"Non-Veg"|"Mixed"}>}
 */
export async function analyzeDonationImage(base64Image) {
  const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY });

  // Ensure the image has the proper data URI prefix for Groq vision
  const imageUrl = base64Image.startsWith("data:")
    ? base64Image
    : `data:image/jpeg;base64,${base64Image}`;

  const prompt = `You are an expert food analyst. Look at the provided image and identify:
- The type of food (Veg, Non-Veg, or Mixed). If uncertain, return "Mixed".
- The number of meals the dish could serve (estimated integer).
- A short name of the dish (e.g., "dal makhani").
Return ONLY a JSON object with keys "food", "meals", and "type". Do not include any extra text or markdown.`;

  const response = await groq.chat.completions.create({
    model: "llama-3.2-11b-vision-preview",
    messages: [{
      role: "user",
      content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: imageUrl } },
      ],
    }],
    temperature: 0.0,
    max_tokens: 200,
  });

  const raw = response.choices[0].message.content.trim();
  try {
    // Handle potential markdown code blocks
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleaned);
    return data;
  } catch (e) {
    console.error("Failed to parse Groq vision response", e, raw);
    throw new Error("Invalid JSON from Groq vision model");
  }
}

/**
 * Get a 7‑day waste forecast for a given region type.
 * @param {string} regionType - e.g. "city", "state", "national"
 * @returns {Promise<Array<{day:string,intensity:number,insight:string}>>}
 */
export async function getWasteForecast(regionType) {
  const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY });

  const prompt = `You are a food‑waste analyst. Provide a 7‑day forecast (next Monday to Sunday) for the given region type (${regionType}). For each day output a JSON object with:
- day: three‑letter abbreviation (Mon, Tue, ...)
- intensity: a number 0‑100 indicating predicted waste volume (higher = more waste)
- insight: a short explanation considering weekends, cultural events, seasonal trends.
Return ONLY a JSON array of the seven objects, no extra text or markdown.`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
    temperature: 0.2,
    max_tokens: 300,
  });

  const raw = response.choices[0].message.content.trim();
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleaned);
    return data;
  } catch (e) {
    console.error("Failed to parse waste forecast", e, raw);
    throw new Error("Invalid JSON from Groq forecast model");
  }
}
