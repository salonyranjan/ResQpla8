import { useState, useEffect } from "react";
import { getMockOrder } from "../services/dataService";

export const STATUS_STEPS = [
  { id: "order_placed", label: "Order Placed", sub: "We received your request", icon: null },
  { id: "confirmed", label: "Confirmed", sub: "Restaurant is preparing your order", icon: null },
  { id: "preparing", label: "Preparing", sub: "Food being packed carefully", icon: null },
  { id: "out_for_delivery", label: "Out for Delivery", sub: "Volunteer is on the way", icon: null },
  { id: "delivered", label: "Delivered", sub: "Enjoy your meal! 🎉", icon: null },
];

/**
 * Hook for order tracking logic.
 * @param {string} orderId - The order ID to track.
 * @returns {object} order, currentStep, eta, progressPct
 */
export const useOrderTracking = (orderId) => {
  const [order, setOrder] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [eta, setEta] = useState(18);

  useEffect(() => {
    const found = getMockOrder(orderId);
    if (found) setOrder(found);
    else setOrder({ id: orderId, deliveryAddress: "Your location", items: [] });
  }, [orderId]);

  useEffect(() => {
    if (currentStep >= STATUS_STEPS.length - 1) return;
    const timer = setInterval(() => {
      setCurrentStep((p) => Math.min(p + 1, STATUS_STEPS.length - 1));
      setEta((p) => Math.max(p - 4, 0));
    }, 4000);
    return () => clearInterval(timer);
  }, [order, currentStep]);

  const progressPct = (currentStep / (STATUS_STEPS.length - 1)) * 100;

  return { order, currentStep, eta, progressPct, STATUS_STEPS };
};
