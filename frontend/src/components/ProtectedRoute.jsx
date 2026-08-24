import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion as Motion } from "framer-motion";
import { canAccessRole, getRoleHome, getUserRole } from "../services/roleAccess";

const LoadingSpinner = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
    <Motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      style={{
        width: 40,
        height: 40,
        border: "4px solid rgba(0,0,0,0.1)",
        borderTopColor: "#3498db",
        borderRadius: "50%",
      }}
    />
  </div>
);

/**
 * ProtectedRoute – guards routes behind authentication.
 *   • While auth state is loading → shows a spinner.
 *   • If no user → redirects to /login.
 *   • Otherwise renders children.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  const role = getUserRole(user);
  if (!role && location.pathname !== "/dashboard/settings") {
    return <Navigate to="/dashboard/settings?setup=role" replace />;
  }

  if (!canAccessRole(allowedRoles, role)) return <Navigate to={getRoleHome(role)} replace />;

  return <>{children}</>;
}
