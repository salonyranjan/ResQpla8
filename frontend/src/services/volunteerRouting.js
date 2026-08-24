import { ID, Permission, Query, Role } from "appwrite";
import { databases, functions } from "./appwrite";
import { geocodeAddress } from "./geocoding";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const VOLUNTEERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_VOLUNTEERS_COLLECTION_ID;
const NOTIFICATIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID;
const WORKFLOW_FUNCTION_ID = import.meta.env.VITE_APPWRITE_VOLUNTEER_FUNCTION_ID;

function workflowError(error, fallback) {
  const friendly = new Error(error?.message || fallback);
  friendly.code = error?.code;
  friendly.type = error?.type;
  return friendly;
}

async function executeWorkflow(action, payload = {}) {
  if (!WORKFLOW_FUNCTION_ID) return null;
  const execution = await functions.createExecution({
    functionId: WORKFLOW_FUNCTION_ID,
    body: JSON.stringify({ action, ...payload }),
    async: false,
  });
  let response = {};
  try { response = JSON.parse(execution.responseBody || "{}"); } catch { response = {}; }
  if (execution.status === "failed" || Number(execution.responseStatusCode) >= 400 || response.ok === false) {
    throw workflowError(response, "The volunteer workflow could not complete this request.");
  }
  return response;
}

const toUnitScore = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(1, Math.max(0, numeric > 1 ? numeric / 100 : numeric));
};

const distanceKm = ([lat1, lon1], [lat2, lon2]) => {
  const radians = (degrees) => degrees * Math.PI / 180;
  const dLat = radians(lat2 - lat1);
  const dLon = radians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export function rankVolunteers(volunteers, donationCoordinates, meals, urgent = false) {
  const radiusKm = urgent ? 15 : 5;
  const distanceDecay = urgent ? 8 : 4;

  return volunteers.flatMap((volunteer) => {
    const coordinates = [Number(volunteer.latitude), Number(volunteer.longitude)];
    if (!volunteer.available || !coordinates.every(Number.isFinite) || !volunteer.userId) return [];
    const distance = distanceKm(donationCoordinates, coordinates);
    if (distance > radiusKm) return [];

    const reliability = toUnitScore(volunteer.reliability);
    const capacity = Number(volunteer.maxMeals || 0);
    const capacityScore = capacity > 0 ? Math.min(1, capacity / Math.max(1, meals)) : 0;
    const score = (
      0.50 * Math.exp(-distance / distanceDecay)
      + 0.25 * reliability
      + 0.15
      + 0.10 * capacityScore
    ) * (reliability < 0.5 ? 0.65 : 1);

    return [{ ...volunteer, distanceKm: distance, routingScore: score }];
  }).sort((a, b) => b.routingScore - a.routingScore);
}

export async function findVolunteerMatches({ address, quantity, expiry }) {
  if (!DATABASE_ID || !VOLUNTEERS_COLLECTION_ID) return [];
  const coordinates = await geocodeAddress(address);
  if (!coordinates) throw new Error("The pickup address could not be located.");
  const response = await databases.listDocuments(DATABASE_ID, VOLUNTEERS_COLLECTION_ID, [Query.limit(100)]);
  const urgent = (Number.parseInt(expiry, 10) || 2) <= 2;
  return rankVolunteers(response.documents, coordinates, Number(quantity || 0), urgent);
}

export async function getVolunteerProfile(userId) {
  if (!DATABASE_ID || !VOLUNTEERS_COLLECTION_ID || !userId) return null;
  const response = await databases.listDocuments(DATABASE_ID, VOLUNTEERS_COLLECTION_ID, [Query.equal("userId", userId), Query.limit(1)]);
  return response.documents[0] || null;
}

export async function saveVolunteerProfile({ userId, latitude, longitude, maxMeals, available }) {
  if (!DATABASE_ID || !VOLUNTEERS_COLLECTION_ID) throw new Error("Volunteer profiles are not configured.");
  const coordinates = [Number(latitude), Number(longitude)];
  if (!coordinates.every(Number.isFinite)) throw new Error("A valid location is required.");
  const capacity = Number.parseInt(maxMeals, 10);
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 500) throw new Error("Capacity must be between 1 and 500 meals.");
  const current = await getVolunteerProfile(userId);
  const data = { userId, latitude: coordinates[0], longitude: coordinates[1], maxMeals: capacity, available: Boolean(available), reliability: Number(current?.reliability ?? 1) };
  const saved = current
    ? await databases.updateDocument(DATABASE_ID, VOLUNTEERS_COLLECTION_ID, current.$id, data)
    : await databases.createDocument(DATABASE_ID, VOLUNTEERS_COLLECTION_ID, ID.unique(), data, [Permission.read(Role.user(userId)), Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))]);
  if (available && WORKFLOW_FUNCTION_ID) await executeWorkflow("discover");
  return saved;
}

export async function routeDonationToVolunteers({ donation, address, expiry }) {
  if (!DATABASE_ID || !VOLUNTEERS_COLLECTION_ID || !NOTIFICATIONS_COLLECTION_ID) {
    return { enabled: false, notifiedCount: 0 };
  }

  try {
    const serverResult = await executeWorkflow("match", { donationId: donation.$id });
    if (serverResult) return { enabled: true, notifiedCount: serverResult.notifiedCount || 0 };
    const coordinates = await geocodeAddress(address);
    if (!coordinates) return { enabled: true, notifiedCount: 0, reason: "location_unresolved" };

    const response = await databases.listDocuments(DATABASE_ID, VOLUNTEERS_COLLECTION_ID, [Query.limit(100)]);
    const urgent = (Number.parseInt(expiry, 10) || 2) <= 2;
    const candidates = rankVolunteers(response.documents, coordinates, Number(donation.mealsCount || 0), urgent).slice(0, 3);

    const results = await Promise.allSettled(candidates.map((volunteer) => databases.createDocument(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      ID.unique(),
      {
        volunteerId: volunteer.userId,
        donationId: donation.$id,
        status: "pending",
        distanceKm: Number(volunteer.distanceKm.toFixed(2)),
        score: Number(volunteer.routingScore.toFixed(4)),
        message: `${donation.name || "Food donation"} is available near ${address}`.slice(0, 250),
      },
      [Permission.read(Role.user(volunteer.userId)), Permission.update(Role.user(volunteer.userId))],
    )));

    return { enabled: true, notifiedCount: results.filter((result) => result.status === "fulfilled").length };
  } catch (error) {
    console.warn("Volunteer routing is temporarily unavailable:", error);
    return { enabled: true, notifiedCount: 0, reason: "routing_unavailable" };
  }
}

export async function respondToVolunteerAssignment(notificationId, status) {
  if (!DATABASE_ID || !NOTIFICATIONS_COLLECTION_ID) throw new Error("Volunteer assignments are not configured.");
  if (!["accepted", "declined"].includes(status)) throw new Error("Invalid assignment response.");
  const serverResult = await executeWorkflow("respond", { notificationId, status });
  if (serverResult) return serverResult.notification || serverResult;
  return databases.updateDocument(DATABASE_ID, NOTIFICATIONS_COLLECTION_ID, notificationId, { status });
}

export async function discoverVolunteerAssignments() {
  const result = await executeWorkflow("discover");
  return result || { ok: false, notifiedCount: 0 };
}

export async function completeVolunteerDelivery(donationId) {
  const collectionId = import.meta.env.VITE_APPWRITE_PICKUPS_COLLECTION_ID;
  if (!DATABASE_ID || !collectionId) throw new Error("Pickup data is not configured.");
  const serverResult = await executeWorkflow("complete", { donationId });
  if (serverResult) return serverResult.donation || serverResult;
  const donation = await databases.getDocument(DATABASE_ID, collectionId, donationId);
  if (donation.status !== "pending") throw new Error("This pickup is no longer active.");
  if (!donation.dropOffLocation) throw new Error("A receiver has not claimed this food yet.");
  return databases.updateDocument(DATABASE_ID, collectionId, donationId, { status: "completed" });
}

export function getVolunteerWorkflowStatus() {
  if (!DATABASE_ID || !VOLUNTEERS_COLLECTION_ID || !NOTIFICATIONS_COLLECTION_ID) {
    return { ready: false, message: "Volunteer collections are not configured." };
  }
  if (!WORKFLOW_FUNCTION_ID) {
    return { ready: false, message: "Secure volunteer matching is not configured. Add the Appwrite workflow function ID." };
  }
  return { ready: true, message: "Secure matching is active." };
}
