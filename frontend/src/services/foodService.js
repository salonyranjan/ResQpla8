import { ID, Permission, Query, Role } from "appwrite";
import { databases, functions, storage } from "./appwrite";
import client from "./appwrite";
import { isPickupAvailable, isValidResQPlateDonation } from "./workflowRules";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PICKUPS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PICKUPS_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;
const WORKFLOW_FUNCTION_ID = import.meta.env.VITE_APPWRITE_VOLUNTEER_FUNCTION_ID;
const GEO_LOCATION_PATTERN = /^geo:([-+]?\d+(?:\.\d+)?),([-+]?\d+(?:\.\d+)?)$/;

function assertConfigured() {
  if (!DATABASE_ID || !PICKUPS_COLLECTION_ID) {
    throw new Error("Food data is not configured. Add the Appwrite database and pickups collection IDs.");
  }
}

function isAppDonation(document) {
  return isValidResQPlateDonation(document);
}

async function executePickupWorkflow(action, payload = {}) {
  if (!WORKFLOW_FUNCTION_ID) {
    throw new Error("Secure rescue operations are not configured. Add the Appwrite workflow function ID.");
  }
  const execution = await functions.createExecution({
    functionId: WORKFLOW_FUNCTION_ID,
    body: JSON.stringify({ action, ...payload }),
    async: false,
  });
  let response = {};
  try { response = JSON.parse(execution.responseBody || "{}"); } catch { response = {}; }
  if (execution.status === "failed" || Number(execution.responseStatusCode) >= 400 || response.ok === false) {
    const error = new Error(response.message || "The secure rescue workflow could not complete this request.");
    error.code = Number(execution.responseStatusCode) || 500;
    throw error;
  }
  return response;
}

function donationImageError(error) {
  const messages = {
    storage_bucket_not_found: "The donation image bucket was not found. Check VITE_APPWRITE_BUCKET_ID.",
    storage_file_type_unsupported: "This image type is not allowed by the Appwrite bucket.",
    storage_invalid_file_size: "This image exceeds the Appwrite bucket file-size limit.",
  };
  const message = messages[error?.type]
    || (error?.code === 401 || error?.code === 403
      ? "Photo upload was denied. Grant authenticated users Create permission on the Appwrite storage bucket."
      : error?.message || "The food photo could not be uploaded.");
  const friendly = new Error(message);
  friendly.code = error?.code;
  friendly.type = error?.type;
  friendly.cause = error;
  return friendly;
}

export function normalizePickup(document) {
  const meals = Number(document.mealsCount || 0);
  const encodedCoordinates = document.location?.match(GEO_LOCATION_PATTERN);
  const latitude = encodedCoordinates ? Number(encodedCoordinates[1]) : Number(document.latitude ?? document.lat);
  const longitude = encodedCoordinates ? Number(encodedCoordinates[2]) : Number(document.longitude ?? document.lng);
  const location = encodedCoordinates
    ? document.pickupLocation || "Location not provided"
    : document.location || document.pickupLocation || "Location not provided";
  const storedType = document.foodType?.trim() || "Food donation";
  const [type, ...details] = storedType.split(":");
  const ownsImage = Boolean(BUCKET_ID && isAppDonation(document));
  const imageUrl = ownsImage ? storage.getFileView({ bucketId: BUCKET_ID, fileId: document.$id }) : "";

  return {
    ...document,
    id: document.$id,
    name: type,
    foodItem: type,
    restaurant: "Verified ResQPlate donor",
    category: type,
    description: details.join(":").trim() || `${meals || "Available"} meal${meals === 1 ? "" : "s"} ready for pickup at ${location}.`,
    image: imageUrl,
    imageUrl,
    quantity: meals,
    meals,
    qty: `${meals} meals`,
    location,
    distance: location,
    latitude: Number.isFinite(latitude) ? latitude : undefined,
    longitude: Number.isFinite(longitude) ? longitude : undefined,
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
    .filter((document) => isPickupAvailable(document, now))
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

export async function createFoodDonation({ userId, foodType, quantity, description, location, expiry, image, coordinates }) {
  assertConfigured();
  if (!userId) throw new Error("You must be signed in to post food.");
  if (!BUCKET_ID) throw new Error("Donation image storage is not configured.");
  if (!image) throw new Error("Select a food photo before posting the donation.");

  const mealsCount = Number.parseInt(quantity, 10);
  if (!Number.isInteger(mealsCount) || mealsCount < 1) throw new Error("Enter a valid meal quantity.");

  const documentId = ID.unique();
  // The Appwrite collection defines pickupId as a signed 64-bit integer.
  // Keep it distinct from the alphanumeric Appwrite document ID while staying
  // inside JavaScript's safe-integer range.
  const pickupId = (Date.now() * 1000) + Math.floor(Math.random() * 1000);
  const latitude = Number(coordinates?.[0]);
  const longitude = Number(coordinates?.[1]);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90
    || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("The pickup address could not be placed on the map. Enter a more specific address.");
  }
  let uploaded = false;

  try {
    if (image) {
      try {
        await storage.createFile({
          bucketId: BUCKET_ID,
          fileId: documentId,
          file: image,
          permissions: [
            Permission.read(Role.any()),
            Permission.update(Role.user(userId)),
            Permission.delete(Role.user(userId)),
          ],
        });
        uploaded = true;
        // Do not publish the database listing until Appwrite confirms that the
        // corresponding file exists and is readable by the current user.
        await storage.getFile({ bucketId: BUCKET_ID, fileId: documentId });
      } catch (error) {
        throw donationImageError(error);
      }
    }

    const expiryHours = Number.parseInt(expiry, 10) || 2;
    const scheduledTime = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();
    const document = await databases.createDocument(DATABASE_ID, PICKUPS_COLLECTION_ID, documentId, {
      pickupId,
      pickupLocation: location.trim(),
      dropOffLocation: "",
      scheduledTime,
      status: "pending",
      // Appwrite stores this field as an enum: sedan, suv, truck, or van.
      vehicleType: "van",
      donorId: userId,
      weight: Number((mealsCount * 0.3).toFixed(2)),
      mealsCount,
      // The deployed Appwrite column is 99 characters. Keep the payload
      // inside that contract so long descriptions cannot reject a rescue.
      foodType: `${foodType.trim()}: ${description.trim()}`.slice(0, 99),
      // Preserve the human-readable address in pickupLocation and use the
      // existing location string for coordinates, avoiding a schema migration.
      location: `geo:${latitude.toFixed(6)},${longitude.toFixed(6)}`,
    });
    return {
      ...normalizePickup(document),
      imageUploadFailed: false,
    };
  } catch (error) {
    if (uploaded) await storage.deleteFile(BUCKET_ID, documentId).catch(() => {});
    throw error;
  }
}

export async function claimFood(items, deliveryAddress) {
  assertConfigured();
  if (!items.length) throw new Error("Your cart is empty.");
  const address = deliveryAddress?.trim();
  if (!address || address.length > 255) throw new Error("Enter a valid delivery address.");
  const result = await executePickupWorkflow("claim", {
    donationIds: items.map((item) => item.id),
    deliveryAddress: address,
  });
  const updatedDocuments = result.donations || [];
  try {
    const existing = JSON.parse(localStorage.getItem("resqplate_claimed_pickups") || "[]");
    localStorage.setItem("resqplate_claimed_pickups", JSON.stringify([...new Set([...existing, ...updatedDocuments.map((item) => item.$id)])]));
  } catch {
    // Order tracking still works for donors if browser storage is unavailable.
  }
  return updatedDocuments.map(normalizePickup);
}

export async function listUserOrders(userId, limit = 500) {
  const pickups = await listAllPickups(limit);
  let claimedIds = [];
  try { claimedIds = JSON.parse(localStorage.getItem("resqplate_claimed_pickups") || "[]"); } catch { claimedIds = []; }
  const claimed = new Set(Array.isArray(claimedIds) ? claimedIds : []);
  return pickups.filter((pickup) => pickup.donorId === userId || pickup.receiverId === userId || claimed.has(pickup.$id));
}

export async function cancelPickup(documentId) {
  assertConfigured();
  const result = await executePickupWorkflow("cancel", { donationId: documentId });
  return normalizePickup(result.donation);
}

export async function getPickup(documentId) {
  assertConfigured();
  return normalizePickup(await databases.getDocument(DATABASE_ID, PICKUPS_COLLECTION_ID, documentId));
}
