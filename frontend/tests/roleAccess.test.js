import test from "node:test";
import assert from "node:assert/strict";
import { canAccessRole, getRoleHome, getSafeDestination, getUserRole, normalizeRole } from "../src/services/roleAccess.js";

test("only supported account roles are accepted", () => {
  assert.equal(normalizeRole("donor"), "donor");
  assert.equal(normalizeRole("admin"), null);
  assert.equal(getUserRole({ prefs: { role: "volunteer" } }), "volunteer");
  assert.equal(getUserRole({ prefs: {} }), null);
});

test("each role opens its primary workspace after sign in", () => {
  assert.equal(getRoleHome("donor"), "/dashboard/donate");
  assert.equal(getRoleHome("receiver"), "/dashboard/search");
  assert.equal(getRoleHome("volunteer"), "/dashboard/volunteer");
  assert.equal(getSafeDestination("", "receiver"), "/dashboard/search");
});

test("restricted destinations cannot be opened by the wrong role", () => {
  assert.equal(getSafeDestination("/dashboard/donate", "receiver"), "/dashboard/search");
  assert.equal(getSafeDestination("/checkout", "donor"), "/dashboard/donate");
  assert.equal(getSafeDestination("/dashboard/volunteer", "donor"), "/dashboard/donate");
  assert.equal(getSafeDestination("/dashboard/orders", "volunteer"), "/dashboard/orders");
  assert.equal(canAccessRole(["donor"], "receiver"), false);
  assert.equal(canAccessRole(["donor"], "donor"), true);
});

test("legacy accounts without a role are sent to role setup", () => {
  assert.equal(getSafeDestination("/dashboard", null), "/dashboard/settings?setup=role");
});
