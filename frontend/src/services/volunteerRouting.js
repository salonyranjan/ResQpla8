import { ID, Permission, Query, Role } from "appwrite";
import { databases } from "./appwrite";
import { geocodeAddress } from "./geocoding";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const VOLUNTEERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_VOLUNTEERS_COLLECTION_ID;
const NOTIFICATIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID;

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

export async function routeDonationToVolunteers({ donation, address, expiry }) {
  if (!DATABASE_ID || !VOLUNTEERS_COLLECTION_ID || !NOTIFICATIONS_COLLECTION_ID) {
    return { enabled: false, notifiedCount: 0 };
  }

  try {
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
