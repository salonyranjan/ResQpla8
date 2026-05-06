import { useState, useEffect, useCallback } from "react";
import { databases } from "../services/appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PICKUPS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PICKUPS_COLLECTION_ID;

/**
 * Map an Appwrite document to the shape the UI expects.
 * Adjust the field mappings to match your actual Appwrite collection schema.
 */
const mapPickup = (doc) => {
  // Derive avatar initials from volunteer name
  const volunteerName = doc.volunteerName || doc.volunteer || "Unknown";
  const avatar = doc.avatar ||
    volunteerName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  // Determine color based on status
  const statusColorMap = {
    "on-the-way": "#10B981",
    "arrived": "#F59E0B",
    "picking-up": "#14B8A6",
    "delivered": "#2563EB",
  };

  return {
    id: doc.$id,
    status: doc.status || "on-the-way",
    volunteer: volunteerName,
    avatar,
    rating: doc.rating || doc.volunteerRating || 4.5,
    rescues: doc.rescues || doc.volunteerRescues || 0,
    foodItem: doc.foodItem || doc.food || "Unknown food",
    donor: doc.donor || doc.restaurant || "Unknown donor",
    ngo: doc.ngo || doc.ngoName || "Unknown NGO",
    pickupLocation: doc.pickupLocation || doc.pickupAddress || "Unknown",
    deliveryLocation: doc.deliveryLocation || doc.deliveryAddress || "Unknown",
    distance: doc.distance || "0 km",
    eta: doc.eta || "0 min",
    progress: doc.progress ?? 0,
    color: statusColorMap[doc.status] || "#10B981",
    // Reliable static map placeholder — no external API dependency
    mapImageUrl: `https://placehold.co/440x120/e2e8f0/475569?text=Map+${encodeURIComponent(doc.pickupLocation || doc.pickupAddress || "Pickup")}`,
  };
};

/**
 * Hook to fetch volunteer pickups from Appwrite.
 * Returns { pickups, loading, error }.
 * Polling is set up to refresh data every 30 seconds for near-real-time feel.
 */
export const useVolunteerPickups = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPickups = useCallback(async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PICKUPS_COLLECTION_ID
        // Add queries if needed, e.g., Query.equal('status', 'active')
      );
      const mapped = response.documents.map(mapPickup);
      setPickups(mapped);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch pickups:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPickups();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchPickups, 30000);
    return () => clearInterval(interval);
  }, [fetchPickups]);

  return { pickups, loading, error };
};
