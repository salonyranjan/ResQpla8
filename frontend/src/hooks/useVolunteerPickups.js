import { useCallback, useEffect, useMemo, useState } from "react";
import { Query } from "appwrite";
import { useAuth } from "../context/AuthContext";
import { databases } from "../services/appwrite";
import { getPickup } from "../services/foodService";
import { completeVolunteerDelivery, discoverVolunteerAssignments, respondToVolunteerAssignment } from "../services/volunteerRouting";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const NOTIFICATIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID;
const progressByStatus = { pending: 15, accepted: 55, delivered: 100, declined: 100, expired: 100 };
const colorByStatus = { pending: "#2563EB", accepted: "#F59E0B", delivered: "#10B981", declined: "#EF4444", expired: "#64748B" };

export const useVolunteerPickups = (enabled = true) => {
  const { user } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const fetchPickups = useCallback(async () => {
    if (!enabled || !user?.$id || !DATABASE_ID || !NOTIFICATIONS_COLLECTION_ID) {
      setPickups([]); setLoading(false); return;
    }
    try {
      await discoverVolunteerAssignments();
      const response = await databases.listDocuments(DATABASE_ID, NOTIFICATIONS_COLLECTION_ID, [Query.orderDesc("$createdAt"), Query.limit(100)]);
      const notifications = response.documents.filter((item) => item.volunteerId === user.$id);
      const results = await Promise.allSettled(notifications.map(async (notification) => {
        const donation = await getPickup(notification.donationId);
        const status = donation.status === "completed" && notification.status === "accepted" ? "delivered" : notification.status;
        return {
          id: donation.$id, notificationId: notification.$id, status,
          matchScore: Math.round(Number(notification.score || 0) * 100),
          foodItem: donation.name, description: donation.description, donor: donation.restaurant,
          pickupLocation: donation.pickupLocation,
          deliveryLocation: donation.dropOffLocation || "Waiting for a receiver to claim",
          hasReceiver: Boolean(donation.dropOffLocation), meals: donation.mealsCount || donation.meals || 0,
          expiresAt: donation.scheduledTime, distanceKm: Number(notification.distanceKm || 0),
          progress: progressByStatus[status] ?? 0, color: colorByStatus[status] || "#64748B",
        };
      }));
      setPickups(results.filter((result) => result.status === "fulfilled").map((result) => result.value));
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Volunteer assignments could not be loaded."); setPickups([]);
    } finally { setLoading(false); }
  }, [enabled, user?.$id]);

  useEffect(() => {
    fetchPickups();
    const interval = window.setInterval(fetchPickups, 30000);
    return () => window.clearInterval(interval);
  }, [fetchPickups]);

  const respond = useCallback(async (pickup, status) => {
    setBusyId(pickup.id); setError("");
    try { await respondToVolunteerAssignment(pickup.notificationId, status); await fetchPickups(); return true; }
    catch (actionError) { setError(actionError.message || "The assignment could not be updated."); return false; }
    finally { setBusyId(""); }
  }, [fetchPickups]);

  const complete = useCallback(async (pickup) => {
    setBusyId(pickup.id); setError("");
    try { await completeVolunteerDelivery(pickup.id); await fetchPickups(); return true; }
    catch (actionError) { setError(actionError.message || "Delivery could not be completed."); return false; }
    finally { setBusyId(""); }
  }, [fetchPickups]);

  return useMemo(() => ({ pickups, loading, error, busyId, refresh: fetchPickups, accept: (pickup) => respond(pickup, "accepted"), decline: (pickup) => respond(pickup, "declined"), complete }), [pickups, loading, error, busyId, fetchPickups, respond, complete]);
};
