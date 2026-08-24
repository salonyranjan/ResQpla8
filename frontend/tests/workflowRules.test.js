import test from "node:test";
import assert from "node:assert/strict";
import { canCancelPickup, derivePickupWorkflowStatus, isPickupAvailable, isValidResQPlateDonation, isVerifiedRoutablePickup, PICKUP_WORKFLOW } from "../src/services/workflowRules.js";

test("available pickup must be pending, unclaimed, and unexpired", () => {
  const future = new Date(Date.now() + 60_000).toISOString();
  assert.equal(isPickupAvailable({ status: "pending", dropOffLocation: "", scheduledTime: future }), true);
  assert.equal(isPickupAvailable({ status: "pending", dropOffLocation: "Receiver address", scheduledTime: future }), false);
  assert.equal(isPickupAvailable({ status: "completed", dropOffLocation: "", scheduledTime: future }), false);
  assert.equal(isPickupAvailable({ status: "pending", dropOffLocation: "", scheduledTime: "invalid" }), false);
  assert.equal(isPickupAvailable({ status: "pending", dropOffLocation: "", scheduledTime: new Date(Date.now() - 1).toISOString() }), false);
});

test("workflow status is derived only from persisted pickup state", () => {
  assert.equal(derivePickupWorkflowStatus({ status: "pending", dropOffLocation: "" }), PICKUP_WORKFLOW.POSTED);
  assert.equal(derivePickupWorkflowStatus({ status: "pending", dropOffLocation: "Receiver" }), PICKUP_WORKFLOW.RESERVED);
  assert.equal(derivePickupWorkflowStatus({ status: "completed", dropOffLocation: "Receiver" }), PICKUP_WORKFLOW.COMPLETED);
  assert.equal(derivePickupWorkflowStatus({ status: "cancelled", dropOffLocation: "Receiver" }), PICKUP_WORKFLOW.CANCELLED);
});

test("only active pending pickups can be cancelled", () => {
  assert.equal(canCancelPickup({ status: "pending" }), true);
  assert.equal(canCancelPickup({ status: "completed" }), false);
  assert.equal(canCancelPickup({ status: "cancelled" }), false);
});

test("dashboard routes require real identities, addresses, and valid coordinates", () => {
  const valid = { donorId: "donor", pickupLocation: "Pickup", dropOffLocation: "Receiver", latitude: 28.6, longitude: 77.2 };
  assert.equal(isVerifiedRoutablePickup(valid), true);
  assert.equal(isVerifiedRoutablePickup({ ...valid, dropOffLocation: "" }), false);
  assert.equal(isVerifiedRoutablePickup({ ...valid, latitude: 120 }), false);
  assert.equal(isVerifiedRoutablePickup({ ...valid, longitude: Number.NaN }), false);
});

test("legacy or malformed database rows never enter application workflows", () => {
  const valid = { $id: "doc", donorId: "donor", pickupId: 123, pickupLocation: "Pickup", status: "pending", mealsCount: 4, scheduledTime: new Date(Date.now() + 60_000).toISOString(), location: "geo:28.600000,77.200000" };
  assert.equal(isValidResQPlateDonation(valid), true);
  assert.equal(isValidResQPlateDonation({ ...valid, donorId: "" }), false);
  assert.equal(isValidResQPlateDonation({ ...valid, mealsCount: 0 }), false);
  assert.equal(isValidResQPlateDonation({ ...valid, location: "Sample City" }), false);
  assert.equal(isValidResQPlateDonation({ ...valid, status: "unknown" }), false);
});
