export const USER_ROLES = Object.freeze(["donor", "receiver", "volunteer"]);

export const ROLE_DETAILS = Object.freeze({
  donor: { label: "Donor", action: "Donate food", home: "/dashboard/donate" },
  receiver: { label: "Receiver", action: "Find food", home: "/dashboard/search" },
  volunteer: { label: "Volunteer", action: "View pickups", home: "/dashboard/volunteer" },
});

export function normalizeRole(role) {
  return USER_ROLES.includes(role) ? role : null;
}

export function getUserRole(user) {
  return normalizeRole(user?.prefs?.role);
}

export function getRoleHome(role) {
  return ROLE_DETAILS[normalizeRole(role)]?.home || "/dashboard/settings?setup=role";
}

export function canAccessRole(allowedRoles, role) {
  return !allowedRoles?.length || allowedRoles.includes(normalizeRole(role));
}

export function getSafeDestination(requestedPath, role) {
  const normalizedRole = normalizeRole(role);
  if (!normalizedRole) return "/dashboard/settings?setup=role";
  if (!requestedPath || typeof requestedPath !== "string" || !requestedPath.startsWith("/")) return getRoleHome(normalizedRole);
  const restricted = [
    [/^\/dashboard\/donate(?:\/|$)/, ["donor"]],
    [/^\/dashboard\/(?:search|ai-matching)(?:\/|$)/, ["receiver"]],
    [/^\/(?:cart|checkout)(?:\/|$)/, ["receiver"]],
    [/^\/dashboard\/volunteer(?:\/|$)/, ["volunteer"]],
    [/^\/dashboard\/analytics(?:\/|$)/, ["donor"]],
  ];
  const rule = restricted.find(([pattern]) => pattern.test(requestedPath));
  return rule && !rule[1].includes(normalizedRole) ? getRoleHome(normalizedRole) : requestedPath;
}
