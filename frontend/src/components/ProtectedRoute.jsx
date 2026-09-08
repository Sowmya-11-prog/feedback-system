import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// requiredRole: "admin" | "student" | undefined (any logged-in user)
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Send the user to the page that matches their actual role
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/feedback"} replace />;
  }

  return children;
};

export default ProtectedRoute;
