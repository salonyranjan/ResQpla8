import { useCallback, useEffect, useMemo, useState } from "react";
import { Query } from "appwrite";
import { useAuth } from "../context/AuthContext";
import { databases } from "../services/appwrite";
import { getPickup } from "../services/foodService";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const NOTIFICATIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID;
const progressByStatus = { pending: 20, accepted: 65, declined: 100, expired: 100 };
const colorByStatus = { pending: "#2563EB", accepted: "#10B981", declined: "#EF4444", expired: "#64748B" };

export const useVolunteerPickups = () => {
  const { user } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPickups = useCallback(async () => {
    if (!user?.$id || !DATABASE_ID || !NOTIFICATIONS_COLLECTION_ID) {
      setPickups([]);
      setLoading(false);
      return;
    }
    try {
      const response = await databases.listDocuments(DATABASE_ID, NOTIFICATIONS_COLLECTION_ID, [
        Query.orderDesc("$createdAt"), Query.limit(100),
      ]);
      const notifications = response.documents.filter((item) => item.volunteerId === user.$id);
      const results = await Promise.allSettled(notifications.map(async (notification) => {
        const donation = await getPickup(notification.donationId);
        const volunteerName = user.name || user.email || "Volunteer";
        return {
          id: donation.$id,
          notificationId: notification.$id,
          status: notification.status,
          volunteer: volunteerName,
          avatar: volunteerName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
          matchScore: Math.round(Number(notification.score || 0) * 100),
          foodItem: donation.name,
          donor: donation.restaurant,
          pickupLocation: donation.pickupLocation,
          deliveryLocation: donation.dropOffLocation || "Not assigned",
          distance: `${Number(notification.distanceKm || 0).toFixed(1)} km`,
          eta: notification.status === "pending" ? "Awaiting response" : notification.status,
          progress: progressByStatus[notification.status] ?? 0,
          color: colorByStatus[notification.status] || "#64748B",
        };
      }));
      const mapped = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);
      setPickups(mapped);
      setError("");
    } catch (requestError) {
      console.error("Failed to fetch volunteer matches:", requestError);
      setError(requestError.message || "Volunteer matches could not be loaded.");
      setPickups([]);
    } finally {
      setLoading(false);
    }
  }, [user?.$id, user?.email, user?.name]);

  useEffect(() => {
    fetchPickups();
    const interval = window.setInterval(fetchPickups, 30000);
    return () => window.clearInterval(interval);
  }, [fetchPickups]);

  return useMemo(() => ({ pickups, loading, error }), [pickups, loading, error]);
};
