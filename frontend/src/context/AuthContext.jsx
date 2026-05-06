import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCurrentUser, login, register, logout } from "../services/appwrite";

/**
 * @typedef {{ $id: string, name: string, email: string, [key: string]: any }} AppwriteUser
 * @typedef {{
 *   user: AppwriteUser | null,
 *   loading: boolean,
 *   isAuthenticated: boolean,
 *   login: (email: string, password: string) => Promise<any>,
 *   register: (email: string, password: string, name: string) => Promise<any>,
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
    const session = await login(email, password);
    await refetch();
    return session;
  }, [refetch]);

  const handleRegister = useCallback(async (email, password, name) => {
    const newUser = await register(email, password, name);
    // Auto-login after registration (comment out if you require email verification)
    await handleLogin(email, password);
    return newUser;
  }, [handleLogin]);

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

  const isAuthenticated = user !== null;

  const value = React.useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      refetch,
    }),
    [user, loading, isAuthenticated, handleLogin, handleRegister, handleLogout, refetch],
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
