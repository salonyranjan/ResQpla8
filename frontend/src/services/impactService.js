// Impact service – fetches donor impact stats from Appwrite

import { databases } from "./appwrite";
import { Query } from "appwrite";

import { Groq } from "groq-sdk";

// Environment variables for Appwrite IDs
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PICKUPS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PICKUPS_COLLECTION_ID;

/**
 * Fetch all completed (delivered) pickups for a given donor/user.
 * @param {string} userId - The Appwrite user ID of the donor.
 * @returns {Promise<{totalWeight:number,totalMeals:number,estimatedCO2:number}>}
 */
export async function getMonthlyStats(userId) {
  // Compute start of current month for monthly stats.
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // Build query filters.
  const queries = [
    Query.equal("status", "delivered"),
    Query.greaterThanEqual("$createdAt", startOfMonth),
    Query.limit(5000),
  ];
  // If the donorId attribute exists, scope to the current user.
  if (userId) {
    queries.push(Query.equal("donorId", userId));
  }

  const response = await databases.listDocuments(
    DATABASE_ID,
    PICKUPS_COLLECTION_ID,
    queries
  );

  const pickups = response.documents || [];

  // Helper to extract a numeric meal count from the document.
  const meals = pickups.reduce((sum, doc) => {
    const raw = doc.qty?.match(/\d+/)?.[0] || doc.meals?.toString() || "0";
    const count = parseInt(raw, 10);
    return sum + (isNaN(count) ? 0 : count);
  }, 0);

  // Approximate weight: 0.3 kg per meal (standard average).
  const totalWeight = parseFloat((meals * 0.3).toFixed(2));
  // Approximate CO₂ saved: 0.5 kg per meal rescued.
  const estimatedCO2 = parseFloat((meals * 0.5).toFixed(2));

  return { totalWeight, totalMeals: meals, estimatedCO2 };
}

/**
 * Cache key generator for impact stories
 */
const getCacheKey = (stats) => {
  const keyString = JSON.stringify({
    totalWeight: stats.totalWeight,
    totalMeals: stats.totalMeals,
    estimatedCO2: stats.estimatedCO2,
    month: new Date().getFullYear() + "-" + (new Date().getMonth() + 1)
  });
  return `impactStory_${btoa(keyString)}`;
};

/**
 * Generate an AI-crafted impact story using Groq llama3-8b-8192.
 * @param {{totalWeight:number,totalMeals:number,estimatedCO2:number}} stats
 * @returns {Promise<string>} – poetic three-sentence story.
 */
export async function fetchDailyTip() {
  // Calls Groq model to generate a one-sentence surprising fact about food waste.
  try {
    const groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
    });

    const prompt = "Generate a one-sentence, surprising fact about food waste and environmental impact (water savings, $CO_2$, or energy). Keep it under 100 characters and use a professional botanical tone.";

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    const tip = response.choices[0].message.content.trim();
    return tip;
  } catch (error) {
    console.error("Groq tip generation failed:", error);
    // Fallback generic fact
    return "Every rescued meal saves roughly 0.3 kg of CO₂ and 0.5 L of water.";
  }
}

export async function generateImpactStory(stats) {
  // Check cache first
  const cacheKey = getCacheKey(stats);
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const cachedData = JSON.parse(cached);
    // Validate cache freshness (30 days max)
    const cacheTime = new Date(cachedData.timestamp || 0);
    if (Date.now() - cacheTime.getTime() < 30 * 24 * 60 * 60 * 1000) {
      return cachedData.story;
    }
  }

  try {
    // Initialize Groq client with environment variable
    const groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
    });

    const prompt = `You are the ResQPlate Botanical Historian. Write a poetic three-sentence impact story using growth metaphors (roots, leaves, photosynthesis, soil). Show how rescued food nourishes communities like a thriving ecosystem, ending with a unique "Eco-Rank" such as "Mycelium Guardian" or "Carbon Seedling". Keep tone warm and concise, using short paragraphs. Stats: ${JSON.stringify(stats)}`;

    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    });

    const story = response.choices[0].message.content.trim();

    // Cache successful response
    const cacheData = {
      story: story,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (storageError) {
      // Silently fail if quota exceeded or storage unavailable
    }

    return story;
  } catch (error) {
    console.error("Groq generation failed:", error);

    // Return professional botanical-themed fallback message
    const fallbackMessage =
      "Your commitment to a greener planet continues to grow. " +
      "Every rescued meal strengthens the roots of our community garden. " +
      "Keep nurturing the green growth and you'll bloom into a Carbon Seedling soon." ;

    // Attempt to cache the fallback for future use
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        story: fallbackMessage,
        timestamp: Date.now(),
      }));
    } catch {}

    return fallbackMessage;
  }
}
