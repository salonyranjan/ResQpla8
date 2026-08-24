import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCurrentUser, login, register, logout, updateAccountEmail, updateAccountName, updateAccountPassword, updateAccountPreferences } from "../services/appwrite";

/**
 * @typedef {{ $id: string, name: string, email: string, [key: string]: any }} AppwriteUser
 * @typedef {{
 *   user: AppwriteUser | null,
 *   loading: boolean,
 *   isAuthenticated: boolean,
 *   login: (email: string, password: string) => Promise<any>,
 *   register: (email: string, password: string, name: string, role: string) => Promise<any>,
 *   logout: () => Promise<void>,
 *   refetch: () => Promise<void>,
 * }} AuthContextValue
 */

const AuthContext = createContext(/** @type {AuthContextValue | null} */(null));
AuthContext.displayName = "AuthContext";

/** @param {{ children: React.ReactNode }} props */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch current user from Appwrite.
   * Handles 401 (no session) gracefully by setting user to null.
   * Called on mount and after auth actions (login/register/logout).
   */
  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser); // currentUser is null if not authenticated (401)
    } catch (err) {
      // Should rarely happen since getCurrentUser() catches its own errors,
      // but kept as safety net for network errors, etc.
      console.error("AuthContext: Failed to fetch user", err);
      // Only clear user on authentication errors (e.g., 401). For other errors, keep the existing user.
      if (err.code === 401) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleLogin = useCallback(async (email, password) => {
    await login(email, password);
    const authenticatedUser = await getCurrentUser();
    if (!authenticatedUser) throw new Error("The session was created but the user could not be loaded.");
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const handleRegister = useCallback(async (email, password, name, role) => {
    const newUser = await register(email, password, name);
    await login(email, password);
    await updateAccountPreferences({ role, onboardingComplete: true });
    const authenticatedUser = await getCurrentUser();
    if (!authenticatedUser) throw new Error("Your account was created but the profile could not be loaded.");
    setUser(authenticatedUser);
    return newUser;
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (err) {
      // Ignore 401 on logout (session might already be invalid)
      if (err.code !== 401) console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback(async ({ name, email, currentPassword, newPassword }) => {
    const current = await getCurrentUser();
    if (!current) throw new Error("Your session has expired. Sign in again.");
    if (name.trim() !== current.name) await updateAccountName(name);
    if (email.trim().toLowerCase() !== current.email.toLowerCase()) {
      await updateAccountEmail(email, currentPassword);
    }
    if (newPassword) await updateAccountPassword(newPassword, currentPassword);
    const updated = await getCurrentUser();
    setUser(updated);
    return updated;
  }, []);

  const updatePreferences = useCallback(async (changes) => {
    await updateAccountPreferences(changes);
    const updated = await getCurrentUser();
    setUser(updated);
    return updated?.prefs || {};
  }, []);

  const isAuthenticated = user !== null;

  const value = React.useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      updateProfile,
      updatePreferences,
      refetch,
    }),
    [user, loading, isAuthenticated, handleLogin, handleRegister, handleLogout, updateProfile, updatePreferences, refetch],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Primary hook — full auth state and actions.
 * Throws if used outside <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
