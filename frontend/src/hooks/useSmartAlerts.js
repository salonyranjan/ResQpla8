import { useState, useMemo } from "react";
import { getAlerts } from "../services/dataService";

/**
 * Hook to provide alerts data and filtering logic for SmartAlerts component.
 * @returns {object} alerts, filteredAlerts, filter, setFilter, typeCounts
 */
export const useSmartAlerts = () => {
  const alerts = useMemo(() => getAlerts(), []);

  const [filter, setFilter] = useState("all");

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
