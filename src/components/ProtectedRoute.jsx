import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem("auth_token"));

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

  return children;
};

export default ProtectedRoute;
