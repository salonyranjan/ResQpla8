import { Client, Account, Databases } from "appwrite";

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
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // required, no trailing slash
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Re‑usable service instances
export const account = new Account(client);
export const databases = new Databases(client);

// Export the client itself for any advanced use‑cases.
export default client;

/* ────────────────────────────────────────────
   Authentication helpers
   ──────────────────────────────────────────── */

/**
 * Register a new user.
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @returns {Promise<object>}  The newly created user object.
 */
export async function register(email, password, name) {
  try {
    const user = await account.create("unique()", email, password, name);
    return user;
  } catch (err) {
    console.error("Registration failed:", err.message);
    throw err; // let the caller handle UI feedback
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
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (err) {
    console.error("Login failed:", err.message);
    throw err;
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
    // Not authenticated – not an error, just return null.
    if (err.code === 401) return null;
    console.error("Failed to fetch current user:", err.message);
    return null;
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
    console.error("Logout failed:", err.message);
    throw err;
  }
}
