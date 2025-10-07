import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem("auth_token"));
  const currentUser = (() => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!isLoggedIn) {
      // Use a deterministic toast id to avoid duplicates across renders/navigation
      toast.dismiss("auth-required");
      toast("Create an account or log in to continue.", {
        id: "auth-required",
      });
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname || "/" }}
      />
    );
  }

  if (allowedRoles && currentUser?.role) {
    const userRole = currentUser.role;
    const isAllowed = allowedRoles.includes(userRole);
    if (!isAllowed) {
      const wantsBuyer = allowedRoles.includes("buyer");
      const wantsSeller = allowedRoles.includes("seller");
      let message = "You do not have access to this page.";
      if (userRole === "seller" && wantsBuyer)
        message = "Sellers cannot access buyer pages.";
      else if (userRole === "buyer" && wantsSeller)
        message = "Buyers cannot access seller pages.";
      else if (userRole === "superadmin")
        message = "Super admin does not have access to this page.";
      toast.dismiss("role-denied");
      toast.error(message, { id: "role-denied" });
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
