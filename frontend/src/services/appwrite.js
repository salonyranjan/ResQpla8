import { Client, Account, Databases, Functions, Storage, ID } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT?.trim();
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID?.trim();

if (!endpoint || !projectId) {
  throw new Error("Appwrite is not configured. Add VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID.");
}

/**
 * Appwrite client configuration.
 * The endpoint and project ID are read from Vite environment variables:
 *   VITE_APPWRITE_ENDPOINT    – your Appwrite server URL (e.g. https://cloud.appwrite.io/v1)
 *   VITE_APPWRITE_PROJECT_ID – the Appwrite project identifier.
 *
 * Vite automatically exposes any variable prefixed with `VITE_` to the client bundle.
 * This keeps the configuration flexible without hard‑coding values.
 */
const client = new Client()
  .setEndpoint(endpoint.replace(/\/$/, ""))
  .setProject(projectId);

// Re‑usable service instances
export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const storage = new Storage(client);

// Export the client itself for any advanced use‑cases.
export default client;

function authError(error, fallback) {
  const messages = {
    user_invalid_credentials: "The email or password is incorrect.",
    user_email_already_exists: "An account with this email already exists. Try signing in.",
    user_session_already_exists: "You are already signed in.",
    general_rate_limit_exceeded: "Too many attempts. Please wait a moment and try again.",
    general_unknown_origin: "This website is not registered in Appwrite. Add its hostname under Project → Platforms.",
    project_unknown: "The Appwrite project ID is invalid or the project is unavailable.",
    project_paused: "The Appwrite project is paused. Resume it from the Appwrite Console, then try again.",
  };
  const friendly = new Error(messages[error?.type] || (error?.code >= 500
    ? "The account service is temporarily unavailable. Please try again shortly."
    : error?.message || fallback));
  friendly.code = error?.code;
  friendly.type = error?.type;
  friendly.cause = error;
  return friendly;
}

/**
 * Register a new user.
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @returns {Promise<object>}  The newly created user object.
 */
export async function register(email, password, name) {
  try {
    const user = await account.create(ID.unique(), email.trim().toLowerCase(), password, name.trim());
    return user;
  } catch (err) {
    console.error("Registration failed:", err.message);
    throw authError(err, "Account creation failed. Please try again.");
  }
}

/**
 * Log in an existing user with email + password.
 * Creates a session and persists it (cookie / localStorage, depending on platform).
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>}  The session object.
 */
export async function login(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email.trim().toLowerCase(), password);
    return session;
  } catch (err) {
    console.error("Login failed:", err.message);
    throw authError(err, "Sign in failed. Please try again.");
  }
}

/**
 * Retrieve the currently authenticated user.
 * @returns {Promise<object|null>}  User object or null if not signed in.
 */
export async function getCurrentUser() {
  try {
    const user = await account.get();
    return user;
  } catch (err) {
    // Only treat 401 (no session) as "not logged in".
    // For all other errors (network, 404, etc.), propagate the error
    // so the caller can decide how to handle it without clearing the session.
    if (err.code === 401) return null;
    console.error("Failed to fetch current user:", err.message);
    throw authError(err, "Unable to verify your session.");
  }
}

/**
 * Log the user out (deletes the current session).
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await account.deleteSession("current");
  } catch (err) {
    // Gracefully handle missing session (404 or user_session_not_found)
    if (err.code === 404 || err.type === "user_session_not_found") {
      // No active session – nothing to delete.
      return;
    }
    console.error("Logout failed:", err.message);
    throw err;
  }
}

export async function updateAccountName(name) {
  const value = name.trim();
  if (value.length < 2 || value.length > 128) throw new Error("Name must be between 2 and 128 characters.");
  try {
    return await account.updateName({ name: value });
  } catch (err) {
    throw authError(err, "Your name could not be updated.");
  }
}

export async function updateAccountEmail(email, password) {
  const value = email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(value)) throw new Error("Enter a valid email address.");
  if (!password) throw new Error("Enter your current password to change your email.");
  try {
    return await account.updateEmail({ email: value, password });
  } catch (err) {
    throw authError(err, "Your email address could not be updated.");
  }
}

export async function updateAccountPassword(password, oldPassword) {
  if (password.length < 8) throw new Error("The new password must contain at least 8 characters.");
  if (!oldPassword) throw new Error("Enter your current password to set a new password.");
  try {
    return await account.updatePassword({ password, oldPassword });
  } catch (err) {
    throw authError(err, "Your password could not be updated.");
  }
}

export async function updateAccountPreferences(changes) {
  try {
    const current = await account.getPrefs();
    return await account.updatePrefs({ prefs: { ...current, ...changes } });
  } catch (err) {
    throw authError(err, "Your preferences could not be saved.");
  }
}
