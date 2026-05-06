import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

/**
 * Simple loading spinner using Framer Motion.
 */
const LoadingSpinner = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
    <motion.div
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
export default function ProtectedRoute({ children }) {
  const { loading, user } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
