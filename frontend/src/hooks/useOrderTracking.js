import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { cancelPickup, getPickup, listUserOrders, subscribeToPickupChanges } from "../services/foodService";
import { derivePickupWorkflowStatus } from "../services/workflowRules";

export const STATUS_STEPS = [
  { id: "posted", label: "Donation posted", sub: "Food was made available for rescue" },
  { id: "reserved", label: "Reserved", sub: "A receiver address has been confirmed" },
  { id: "completed", label: "Delivered", sub: "The rescue was completed successfully" },
];

const enhance = (pickup) => {
  const workflowStatus = derivePickupWorkflowStatus(pickup);
  const currentStep = workflowStatus === "completed" ? 2 : workflowStatus === "reserved" ? 1 : 0;
  return {
    ...pickup, workflowStatus, currentStep,
    deliveryAddress: pickup.dropOffLocation || "Waiting for a receiver",
    items: [{ name: pickup.name, quantity: pickup.quantity, image: pickup.image }],
    progressPct: workflowStatus === "cancelled" ? 0 : [20, 60, 100][currentStep],
  };
};

export const useOrderTracking = (orderId) => {
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(async () => {
    if (!user?.$id) return;
    try {
      if (orderId) setOrder(enhance(await getPickup(orderId)));
      else setOrders((await listUserOrders(user.$id)).map(enhance));
      setError("");
    } catch (requestError) { setError(requestError.message || "Rescue orders could not be loaded."); }
    finally { setLoading(false); }
  }, [orderId, user?.$id]);

  useEffect(() => {
    load();
    let unsubscribe;
    try { unsubscribe = subscribeToPickupChanges(load); } catch { unsubscribe = undefined; }
    const fallback = window.setInterval(load, 30000);
    return () => { unsubscribe?.(); window.clearInterval(fallback); };
  }, [load]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const cancel = useCallback(async () => {
    if (!order) return;
    setBusy(true); setError("");
    try { setOrder(enhance(await cancelPickup(order.$id))); }
    catch (actionError) { setError(actionError.message || "The rescue could not be cancelled."); }
    finally { setBusy(false); }
  }, [order]);

  const eta = order?.scheduledTime && order.workflowStatus !== "completed" ? Math.max(0, Math.ceil((new Date(order.scheduledTime).getTime() - now) / 60000)) : null;
  return useMemo(() => ({ order, orders, currentStep: order?.currentStep || 0, eta, progressPct: order?.progressPct || 0, STATUS_STEPS, loading, error, busy, cancel, refresh: load }), [order, orders, eta, loading, error, busy, cancel, load]);
};
