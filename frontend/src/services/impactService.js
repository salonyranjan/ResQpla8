// Impact service – fetches donor impact stats from Appwrite

import { databases } from "./appwrite";
import { Query } from "appwrite";

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
 * Generate an AI‑crafted impact story using Gemini 1.5 Flash.
 * @param {{totalWeight:number,totalMeals:number,estimatedCO2:number}} stats
 * @returns {Promise<string>} – poetic three‑sentence story.
 */
export async function generateImpactStory(stats) {
  const key = import.meta.env.VITE_GEMINI_KEY;
  if (!key) {
    throw new Error("Gemini API key not configured (VITE_GEMINI_KEY)");
  }

  // Lazy‑load the SDK to keep bundle size small for callers that never use it.
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `You are the ResQPlate Botanical Historian. Write a poetic three‑sentence impact story using growth metaphors (roots, leaves, oxygen) and end with a prestigious Eco‑Rank like "Banyan Guardian" or "Golden Sprout".`,
  });

  const prompt = `Stats: ${JSON.stringify(stats)}. Write the story.`;
  const result = await model.generateContent(prompt);
  const text = await result.response?.text?.();
  return text?.trim() ?? "";
}
