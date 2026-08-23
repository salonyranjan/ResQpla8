import { ID, Query } from "appwrite";
import { databases, storage } from "./appwrite";
import client from "./appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PICKUPS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PICKUPS_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

function assertConfigured() {
  if (!DATABASE_ID || !PICKUPS_COLLECTION_ID) {
    throw new Error("Food data is not configured. Add the Appwrite database and pickups collection IDs.");
  }
}

function isAppDonation(document) {
  return Boolean(document?.$id && document.pickupId === document.$id && document.donorId);
}

export function normalizePickup(document) {
  const meals = Number(document.mealsCount || 0);
  const location = document.location || document.pickupLocation || "Location not provided";
  const storedType = document.foodType?.trim() || "Food donation";
  const [type, ...details] = storedType.split(":");
  const ownsImage = Boolean(BUCKET_ID && document.pickupId === document.$id);

  return {
    ...document,
    id: document.$id,
    name: type,
    foodItem: type,
    restaurant: "Verified ResQPlate donor",
    category: type,
    description: details.join(":").trim() || `${meals || "Available"} meal${meals === 1 ? "" : "s"} ready for pickup at ${location}.`,
    image: ownsImage ? storage.getFileView(BUCKET_ID, document.$id) : "",
    imageUrl: ownsImage ? storage.getFileView(BUCKET_ID, document.$id) : "",
    quantity: meals,
    meals,
    qty: `${meals} meals`,
    location,
    distance: location,
    expiresIn: document.scheduledTime
      ? new Date(document.scheduledTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
      : "Pickup time not set",
    rating: null,
  };
}

export async function listAvailableFood(limit = 100) {
  assertConfigured();
  const response = await databases.listDocuments(DATABASE_ID, PICKUPS_COLLECTION_ID, [
    Query.equal("status", "pending"),
    Query.orderDesc("$createdAt"),
    Query.limit(limit),
  ]);
  const now = Date.now();
  return response.documents
    .filter(isAppDonation)
    .filter((document) => !document.scheduledTime || new Date(document.scheduledTime).getTime() > now)
    .map(normalizePickup);
}

export async function listAllPickups(limit = 500) {
  assertConfigured();
  const response = await databases.listDocuments(DATABASE_ID, PICKUPS_COLLECTION_ID, [
    Query.orderDesc("$createdAt"),
    Query.limit(limit),
  ]);
  return response.documents.filter(isAppDonation).map(normalizePickup);
}

export function subscribeToPickupChanges(onChange) {
  assertConfigured();
  const channel = `databases.${DATABASE_ID}.collections.${PICKUPS_COLLECTION_ID}.documents`;
  return client.subscribe(channel, onChange);
}

export async function createFoodDonation({ userId, foodType, quantity, description, location, expiry, image }) {
  assertConfigured();
  if (!userId) throw new Error("You must be signed in to post food.");

  const mealsCount = Number.parseInt(quantity, 10);
  if (!Number.isInteger(mealsCount) || mealsCount < 1) throw new Error("Enter a valid meal quantity.");

  const documentId = ID.unique();
  let uploaded = false;

  try {
    if (image && BUCKET_ID) {
      await storage.createFile(BUCKET_ID, documentId, image);
      uploaded = true;
    }

    const expiryHours = Number.parseInt(expiry, 10) || 2;
    const scheduledTime = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();
    const document = await databases.createDocument(DATABASE_ID, PICKUPS_COLLECTION_ID, documentId, {
      pickupId: documentId,
      pickupLocation: location.trim(),
      dropOffLocation: "",
      scheduledTime,
      status: "pending",
      vehicleType: "Unassigned",
      donorId: userId,
      weight: Number((mealsCount * 0.3).toFixed(2)),
      mealsCount,
      foodType: `${foodType.trim()}: ${description.trim()}`.slice(0, 250),
      location: location.trim(),
    });
    return normalizePickup(document);
  } catch (error) {
    if (uploaded) await storage.deleteFile(BUCKET_ID, documentId).catch(() => {});
    throw error;
  }
}

export async function claimFood(items, deliveryAddress) {
  assertConfigured();
  if (!items.length) throw new Error("Your cart is empty.");

  const claimed = [];
  for (const item of items) {
    const latest = await databases.getDocument(DATABASE_ID, PICKUPS_COLLECTION_ID, item.id);
    if (latest.status !== "pending") throw new Error(`${item.name} is no longer available.`);
    const updated = await databases.updateDocument(DATABASE_ID, PICKUPS_COLLECTION_ID, item.id, {
      status: "confirmed",
      dropOffLocation: deliveryAddress,
    });
    claimed.push(normalizePickup(updated));
  }
  return claimed;
}

export async function getPickup(documentId) {
  assertConfigured();
  return normalizePickup(await databases.getDocument(DATABASE_ID, PICKUPS_COLLECTION_ID, documentId));
}
