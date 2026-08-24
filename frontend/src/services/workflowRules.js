export const PICKUP_WORKFLOW = Object.freeze({
  POSTED: "posted",
  RESERVED: "reserved",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

export function derivePickupWorkflowStatus(pickup) {
  if (pickup?.status === "cancelled") return PICKUP_WORKFLOW.CANCELLED;
  if (pickup?.status === "completed") return PICKUP_WORKFLOW.COMPLETED;
  if (pickup?.dropOffLocation?.trim()) return PICKUP_WORKFLOW.RESERVED;
  return PICKUP_WORKFLOW.POSTED;
}

export function isPickupAvailable(pickup, now = Date.now()) {
  if (!pickup || pickup.status !== "pending" || pickup.dropOffLocation?.trim()) return false;
  if (!pickup.scheduledTime) return true;
  const expiry = new Date(pickup.scheduledTime).getTime();
  return Number.isFinite(expiry) && expiry > now;
}

export function canCancelPickup(pickup) {
  return Boolean(pickup && pickup.status === "pending");
}

export function isVerifiedRoutablePickup(pickup) {
  const latitude = Number(pickup?.latitude);
  const longitude = Number(pickup?.longitude);
  return Boolean(
    pickup?.donorId
    && pickup?.pickupLocation?.trim()
    && pickup?.dropOffLocation?.trim()
    && Number.isFinite(latitude) && latitude >= -90 && latitude <= 90
    && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180
  );
}

export function isValidResQPlateDonation(pickup) {
  const pickupId = Number(pickup?.pickupId);
  const meals = Number(pickup?.mealsCount);
  const expiry = pickup?.scheduledTime ? new Date(pickup.scheduledTime).getTime() : Number.NaN;
  return Boolean(
    pickup?.$id
    && pickup?.donorId?.trim()
    && Number.isSafeInteger(pickupId)
    && pickup?.pickupLocation?.trim()
    && ["pending", "completed", "cancelled"].includes(pickup?.status)
    && Number.isInteger(meals) && meals > 0
    && Number.isFinite(expiry)
    && /^geo:([-+]?\d+(?:\.\d+)?),([-+]?\d+(?:\.\d+)?)$/.test(pickup?.location || "")
  );
}
