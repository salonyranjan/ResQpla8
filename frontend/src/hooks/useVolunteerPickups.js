import { useState, useMemo, useEffect } from "react";
import { getActivePickups } from "../services/dataService";

/**
 * Hook providing pickup data and live progress simulation.
 * @param {object} theme - Theme object for colors.
 */
export const useVolunteerPickups = (theme) => {
  const [pickups, setPickups] = useState(() => getActivePickups().map(p => ({
    ...p,
    color: p.color || theme?.accent,
  })));

  // Simulate live progress updates similar to original component.
  useEffect(() => {
    const interval = setInterval(() => {
      setPickups(prev =>
        prev.map(p => {
          const newProgress = Math.min(100, p.progress + Math.random() * 2);
          const newEta = p.progress < 90 ? `${Math.max(0, parseInt(p.eta) - 1)} min` : "Arrived";
          return { ...p, progress: newProgress, eta: newEta };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [filter, setFilter] = useState("all");

  const filteredPickups = useMemo(() => {
    return filter === "all" ? pickups : pickups.filter(p => p.status === filter);
  }, [filter, pickups]);

  const statusCounts = useMemo(() => {
    const counts = { all: pickups.length };
    pickups.forEach(p => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return counts;
  }, [pickups]);

  return { filteredPickups, filter, setFilter, statusCounts };
};
