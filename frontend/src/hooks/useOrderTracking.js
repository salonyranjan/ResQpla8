import { useEffect, useState } from "react";
import { getPickup } from "../services/foodService";

export const STATUS_STEPS = [
  { id: "pending", label: "Donation posted", sub: "The food was listed for rescue", icon: null },
  { id: "confirmed", label: "Rescue confirmed", sub: "A receiver has claimed the food", icon: null },
  { id: "preparing", label: "Pickup preparation", sub: "The donor is preparing the handoff", icon: null },
  { id: "out_for_delivery", label: "In transit", sub: "The food is on its way", icon: null },
  { id: "completed", label: "Delivered", sub: "The rescue has been completed", icon: null },
];

const STATUS_INDEX = { pending: 0, confirmed: 1, preparing: 2, out_for_delivery: 3, completed: 4 };

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
