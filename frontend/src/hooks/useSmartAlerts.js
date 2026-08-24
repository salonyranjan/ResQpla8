import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listAllPickups } from "../services/foodService";

const relativeTime = (date) => {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

const toAlert = (pickup) => {
  const status = pickup.status;
  const config = status === "completed"
    ? { type: "delivery", title: "Rescue completed", icon: "✓", action: "Completed", color: "#10b981", bg: "#10b98118" }
    : status === "cancelled"
      ? { type: "cancelled", title: "Donation cancelled", icon: "!", action: "Review", color: "#f59e0b", bg: "#f59e0b18" }
      : { type: "pending", title: "Donation posted", icon: "+", action: "View", color: "#2563eb", bg: "#2563eb18" };
  return {
    id: pickup.$id, ...config, border: `${config.color}35`,
    message: `${pickup.foodType || "Food donation"} · ${pickup.mealsCount || 0} meals · ${status}`,
    location: pickup.pickupLocation || "Location not provided",
    time: relativeTime(status === "pending" ? pickup.$createdAt : pickup.$updatedAt),
  };
};

export const useSmartAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let active = true;
    listAllPickups()
      .then((items) => active && setAlerts(
        items.filter((item) => item.donorId === user?.$id).slice(0, 30).map(toAlert),
      ))
      .catch(() => active && setAlerts([]));
    return () => { active = false; };
  }, [user?.$id]);

  const filteredAlerts = useMemo(() => {
    return filter === "all" ? alerts : alerts.filter(a => a.type === filter);
  }, [filter, alerts]);

  const typeCounts = useMemo(() => {
    const counts = { all: alerts.length };
    alerts.forEach(a => {
      counts[a.type] = (counts[a.type] || 0) + 1;
    });
    return counts;
  }, [alerts]);

  return { alerts, filteredAlerts, filter, setFilter, typeCounts };
};
