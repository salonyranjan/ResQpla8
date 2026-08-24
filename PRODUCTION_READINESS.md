# ResQPlate production-readiness plan

ResQPlate now supports a working pilot, but it must not be treated as a hardened public service until the P0 controls below are deployed. Food rescue involves real people, private addresses, health information, and time-sensitive handoffs; browser validation is not a security or safety boundary.

## Implemented

- Appwrite accounts, session restoration, protected routes, profiles, and account preferences.
- Role selection during onboarding, role-aware login destinations, navigation, and route guards for donor, receiver, and volunteer workspaces.
- Public live donation discovery; authentication is required only when claiming.
- Donation creation with photo validation, quantity, description, expiry, geocoding, and saved coordinates.
- Claiming reserves food and immediately removes it from public availability without falsely marking it delivered.
- Volunteer enrollment with consented location, capacity, availability, proximity matching, private assignments, acceptance/decline, route access, and delivery confirmation.
- A deployed Appwrite rescue-workflow Function performs private volunteer discovery, prevents duplicate acceptance, and authorizes delivery completion.
- Account order history, live tracking, cancellation, and verified donor-to-receiver road routes.
- Responsive public and dashboard UI with accessible controls and operational states.

## P0 — required before public launch

### Server-controlled, atomic workflow

Extend the deployed rescue-workflow Function so claim, cancel, pickup, and every remaining state transition are server-controlled. Volunteer accept/decline and delivery completion already run through the Function. The completed workflow must validate the caller ID/role, ownership, expiry, current status, and allowed next status. Use an Appwrite transaction when claiming and assigning.

**Reason:** client checks are bypassable and read-then-write claiming has race conditions. Two receivers must never reserve the same food.

### Production pickup schema

Add `receiverId`, `volunteerId`, `claimedAt`, `acceptedAt`, `pickedUpAt`, `deliveredAt`, `version`, `cancellationReason`, and `handoffCodeHash`. Replace the three-value status with `available`, `reserved`, `volunteer_assigned`, `picked_up`, `delivered`, `cancelled`, and `expired`.

**Reason:** the pilot enum cannot truthfully represent handoffs, and browser storage cannot provide receiver history across devices.

### Least-privilege permissions

Enable document security. Allow authenticated creation, but do not grant collection-wide update/delete. Give donors, assigned receivers, and assigned volunteers only the row access they need; perform state changes through the Function. Public listing responses must expose an approximate area, never the exact pickup or household address. Restrict image access after expiry/cancellation.

**Reason:** broad update permission allows account holders to alter other rescues. Exact addresses are sensitive personal data.

**Live audit finding:** the configured pickup collection currently allows unauthenticated reads of pending, completed, and cancelled documents. Correct this in Appwrite before using real household addresses. A frontend filter does not secure the direct Appwrite API.

### Structured food safety

Add preparation time, safe-until time, storage state, seal/packaging status, allergens, dietary tags, ingredients/unknown flag, donor attestation, and jurisdiction-specific prohibited categories.

**Reason:** free text is not safe enough for allergy, cold-chain, or liability decisions.

### Scheduled expiry and reliable notifications

Use scheduled Appwrite Functions to expire food, close stale assignments, remove public image access, and trigger notification jobs. Add email/SMS/push delivery for claims, acceptance, approaching expiry, pickup, delivery, cancellation, and no-shows.

**Reason:** browser tabs cannot enforce deadlines or deliver reliable background alerts.

### Verified handoffs and audit events

Use short-lived OTP or QR verification for donor pickup and receiver delivery. Store append-only events with actor ID, action, rescue ID, and timestamp; never store raw OTP values.

**Reason:** this prevents mistaken pickup, false completion, theft, and unverifiable impact claims.

### Moderation and incident response

Add organization/NGO verification, phone/email verification, reports, admin review, suspension, food recall, emergency guidance, and a documented incident process.

**Reason:** a real service needs a response path for unsafe food, fraud, harassment, and vulnerable-user protection.

## P1 — required for a dependable city pilot

- Volunteer shifts, vehicle/capacity limits, radius, accessibility needs, and checks where legally appropriate.
- Multi-stop routing, proof of pickup/delivery, no-show handling, and reassignment.
- Organization accounts with teams and staff roles.
- Receiver eligibility/privacy rules, fair allocation, recurring needs, and rate limits.
- PWA/offline retry, idempotency keys, network recovery, and low-bandwidth images.
- Multilingual UI, WCAG audit, local time zones, and non-map route alternatives.
- Monitoring for function errors, failed notifications, routing/geocoder health, claim conflicts, abuse, backups, and restore drills.
- Counsel-reviewed terms, privacy, consent, retention/deletion, food-safety, and donor-liability policies for the launch jurisdiction.

## Rollout recommendation

1. Deploy the P0 schema and workflow Function in a separate Appwrite staging project.
2. Test simultaneous claims, expired food, unauthorized transitions, reassignment, cancellation, and handoff verification.
3. Pilot with verified participants in one locality and staffed operating hours.
4. Measure failed pickups, response time, expiry rate, notification delivery, incidents, and complaints.
5. Expand only after operational targets and incident procedures are proven.
