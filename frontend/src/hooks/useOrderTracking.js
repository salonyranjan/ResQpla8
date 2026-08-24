import { useEffect, useState } from "react";
import { getPickup } from "../services/foodService";

export const STATUS_STEPS = [
  { id: "pending", label: "Donation posted", sub: "The food was listed for rescue", icon: null },
  { id: "completed", label: "Rescue completed", sub: "The food was successfully claimed", icon: null },
];

const STATUS_INDEX = { pending: 0, completed: 1 };

/**
 * Hook for order tracking logic.
 * @param {string} orderId - The order ID to track.
 * @returns {object} order, currentStep, eta, progressPct
 */
export const useOrderTracking = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!orderId) return undefined;
    let cancelled = false;
    getPickup(orderId)
      .then((pickup) => {
        if (!cancelled) {
          setOrder({ ...pickup, deliveryAddress: pickup.dropOffLocation || "Not assigned yet", items: [{ name: pickup.name, quantity: pickup.quantity, image: pickup.image }] });
          setError("");
        }
      })
      .catch((err) => !cancelled && setError(err.message || "This rescue could not be loaded."))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [orderId]);

  useEffect(() => {
    if (!order?.scheduledTime) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, [order?.scheduledTime]);

  const currentStep = order?.status === "cancelled" ? 0 : (STATUS_INDEX[order?.status] ?? 0);
  const eta = order?.scheduledTime ? Math.max(0, Math.ceil((new Date(order.scheduledTime).getTime() - now) / 60000)) : null;
  const progressPct = (currentStep / (STATUS_STEPS.length - 1)) * 100;

  return { order, currentStep, eta, progressPct, STATUS_STEPS, loading, error };
};
