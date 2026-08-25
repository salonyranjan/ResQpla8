import { Client, Databases, ID, Permission, Query, Role } from "node-appwrite";

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing function variable: ${name}`);
  return value;
};

const coordinatesOf = (pickup) => {
  const match = String(pickup.location || "").match(/^geo:([-+]?\d+(?:\.\d+)?),([-+]?\d+(?:\.\d+)?)$/);
  return match ? [Number(match[1]), Number(match[2])] : null;
};

const distanceKm = ([lat1, lon1], [lat2, lon2]) => {
  const radians = (degrees) => degrees * Math.PI / 180;
  const dLat = radians(lat2 - lat1);
  const dLon = radians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const scoreVolunteer = (volunteer, pickup, pickupCoordinates) => {
  const volunteerCoordinates = [Number(volunteer.latitude), Number(volunteer.longitude)];
  if (!volunteer.available || !volunteerCoordinates.every(Number.isFinite)) return null;
  const distance = distanceKm(pickupCoordinates, volunteerCoordinates);
  const urgent = new Date(pickup.scheduledTime).getTime() - Date.now() <= 2 * 60 * 60 * 1000;
  if (distance > (urgent ? 15 : 5)) return null;
  const reliability = Math.min(1, Math.max(0, Number(volunteer.reliability ?? 1)));
  const capacity = Math.min(1, Number(volunteer.maxMeals || 0) / Math.max(1, Number(pickup.mealsCount || 1)));
  const score = (0.5 * Math.exp(-distance / (urgent ? 8 : 4)) + 0.25 * reliability + 0.15 + 0.1 * capacity)
    * (reliability < 0.5 ? 0.65 : 1);
  return { volunteer, distance, score };
};

const parseBody = (req) => {
  try {
    const json = req.bodyJson;
    if (json && typeof json === "object") return json;
  } catch {
    // Fall through to the raw body so malformed requests receive a normal 400.
  }
  try { return JSON.parse(req.bodyText || req.body || "{}"); } catch { return {}; }
};

const send = (res, status, body) => res.json(body, status);

export default async ({ req, res, log, error }) => {
  const userId = req.headers["x-appwrite-user-id"];
  if (!userId) return send(res, 401, { ok: false, message: "Sign in is required." });

  try {
    const endpoint = required("APPWRITE_FUNCTION_API_ENDPOINT");
    const projectId = required("APPWRITE_FUNCTION_PROJECT_ID");
    const apiKey = req.headers["x-appwrite-key"] || process.env.APPWRITE_FUNCTION_API_KEY;
    if (!apiKey) throw new Error("Appwrite did not provide the function API key.");
    const databaseId = required("RESQPLATE_DATABASE_ID");
    const pickupsId = required("RESQPLATE_PICKUPS_COLLECTION_ID");
    const volunteersId = required("RESQPLATE_VOLUNTEERS_COLLECTION_ID");
    const notificationsId = required("RESQPLATE_NOTIFICATIONS_COLLECTION_ID");
    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const databases = new Databases(client);
    const body = parseBody(req);

    const findNotifications = (queries) => databases.listDocuments(
      databaseId, notificationsId, [...queries, Query.limit(100)],
    );

    const createMatch = async (pickup, volunteer, distance, score) => {
      const existing = await findNotifications([
        Query.equal("donationId", pickup.$id), Query.equal("volunteerId", volunteer.userId),
      ]);
      if (existing.total) return false;
      await databases.createDocument(
        databaseId,
        notificationsId,
        ID.unique(),
        {
          volunteerId: volunteer.userId,
          donationId: pickup.$id,
          status: "pending",
          distanceKm: Number(distance.toFixed(2)),
          score: Number(score.toFixed(4)),
          message: `${pickup.foodType || "Food donation"} is available near ${pickup.pickupLocation}`.slice(0, 250),
        },
        [
          Permission.read(Role.user(volunteer.userId)),
          Permission.update(Role.user(volunteer.userId)),
        ],
      );
      return true;
    };

    if (body.action === "claim") {
      const donationIds = [...new Set(Array.isArray(body.donationIds) ? body.donationIds : [])];
      const deliveryAddress = String(body.deliveryAddress || "").trim();
      if (!donationIds.length || donationIds.length > 20) return send(res, 400, { ok: false, message: "Select between 1 and 20 donations." });
      if (!deliveryAddress || deliveryAddress.length > 255) return send(res, 400, { ok: false, message: "Enter a valid delivery address." });
      const pickups = await Promise.all(donationIds.map((id) => databases.getDocument(databaseId, pickupsId, id)));
      const now = Date.now();
      const unavailable = pickups.find((pickup) => pickup.status !== "pending"
        || pickup.dropOffLocation
        || (pickup.scheduledTime && new Date(pickup.scheduledTime).getTime() <= now));
      if (unavailable) return send(res, 409, { ok: false, message: "One or more donations are no longer available." });
      const updated = await Promise.all(pickups.map((pickup) => databases.updateDocument(
        databaseId, pickupsId, pickup.$id, { dropOffLocation: deliveryAddress, receiverId: userId },
      )));
      return send(res, 200, { ok: true, donations: updated });
    }

    if (body.action === "cancel") {
      const pickup = await databases.getDocument(databaseId, pickupsId, body.donationId);
      if (pickup.donorId !== userId) return send(res, 403, { ok: false, message: "Only the donor can cancel this rescue." });
      if (pickup.status !== "pending") return send(res, 409, { ok: false, message: "Only an active rescue can be cancelled." });
      const updated = await databases.updateDocument(databaseId, pickupsId, pickup.$id, { status: "cancelled" });
      return send(res, 200, { ok: true, donation: updated });
    }

    if (body.action === "match") {
      const pickup = await databases.getDocument(databaseId, pickupsId, body.donationId);
      if (pickup.donorId !== userId) return send(res, 403, { ok: false, message: "Only the donor can dispatch this rescue." });
      if (!pickup.dropOffLocation) return send(res, 200, { ok: true, notifiedCount: 0 });
      const origin = coordinatesOf(pickup);
      if (!origin) return send(res, 422, { ok: false, message: "The donor map location is missing." });
      const volunteers = await databases.listDocuments(databaseId, volunteersId, [Query.equal("available", true), Query.limit(500)]);
      const ranked = volunteers.documents.map((item) => scoreVolunteer(item, pickup, origin)).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 3);
      const created = await Promise.all(ranked.map(({ volunteer, distance, score }) => createMatch(pickup, volunteer, distance, score)));
      return send(res, 200, { ok: true, notifiedCount: created.filter(Boolean).length });
    }

    if (body.action === "discover") {
      const profiles = await databases.listDocuments(databaseId, volunteersId, [Query.equal("userId", userId), Query.limit(1)]);
      const volunteer = profiles.documents[0];
      if (!volunteer?.available) return send(res, 200, { ok: true, notifiedCount: 0 });
      const pickups = await databases.listDocuments(databaseId, pickupsId, [Query.equal("status", "pending"), Query.limit(500)]);
      const ranked = pickups.documents.flatMap((pickup) => {
        const origin = coordinatesOf(pickup);
        const match = origin && pickup.dropOffLocation ? scoreVolunteer(volunteer, pickup, origin) : null;
        return match ? [{ pickup, ...match }] : [];
      }).sort((a, b) => b.score - a.score).slice(0, 20);
      const created = await Promise.all(ranked.map(({ pickup, distance, score }) => createMatch(pickup, volunteer, distance, score)));
      return send(res, 200, { ok: true, notifiedCount: created.filter(Boolean).length });
    }

    if (body.action === "respond") {
      if (!["accepted", "declined"].includes(body.status)) return send(res, 400, { ok: false, message: "Invalid response." });
      const notification = await databases.getDocument(databaseId, notificationsId, body.notificationId);
      if (notification.volunteerId !== userId) return send(res, 403, { ok: false, message: "This assignment belongs to another volunteer." });
      if (notification.status !== "pending") return send(res, 409, { ok: false, message: "This request has already been answered." });
      if (body.status === "accepted") {
        const siblings = await findNotifications([Query.equal("donationId", notification.donationId)]);
        if (siblings.documents.some((item) => item.status === "accepted" && item.$id !== notification.$id)) {
          await databases.updateDocument(databaseId, notificationsId, notification.$id, { status: "expired" });
          return send(res, 409, { ok: false, message: "Another volunteer has already accepted this rescue." });
        }
        const updated = await databases.updateDocument(databaseId, notificationsId, notification.$id, { status: "accepted" });
        await Promise.all(siblings.documents.filter((item) => item.$id !== notification.$id && item.status === "pending").map((item) =>
          databases.updateDocument(databaseId, notificationsId, item.$id, { status: "expired" })
        ));
        return send(res, 200, { ok: true, notification: updated });
      }
      const updated = await databases.updateDocument(databaseId, notificationsId, notification.$id, { status: "declined" });
      return send(res, 200, { ok: true, notification: updated });
    }

    if (body.action === "complete") {
      const assignments = await findNotifications([
        Query.equal("donationId", body.donationId), Query.equal("volunteerId", userId), Query.equal("status", "accepted"),
      ]);
      if (!assignments.total) return send(res, 403, { ok: false, message: "Accept this rescue before completing it." });
      const pickup = await databases.getDocument(databaseId, pickupsId, body.donationId);
      if (!pickup.dropOffLocation) return send(res, 409, { ok: false, message: "A receiver has not claimed this food yet." });
      if (pickup.status !== "pending") return send(res, 409, { ok: false, message: "This rescue is already closed." });
      const updated = await databases.updateDocument(databaseId, pickupsId, pickup.$id, { status: "completed" });
      return send(res, 200, { ok: true, donation: updated });
    }

    return send(res, 400, { ok: false, message: "Unknown workflow action." });
  } catch (cause) {
    error(cause?.stack || cause?.message || String(cause));
    return send(res, Number(cause?.code) >= 400 && Number(cause?.code) < 600 ? Number(cause.code) : 500, {
      ok: false,
      message: cause?.code === 404 ? "A rescue record could not be found." : "Volunteer operations are temporarily unavailable.",
    });
  }
};
