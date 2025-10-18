import React from "react";
import { Navigate, useLocation, Outlet } from "react-router";
import { useAuth } from "./AuthProvider.jsx";

function RequireAuth() {
  const { data: user, status } = useAuth() || {};
  const loc = useLocation();

  if (status === "pending")
    return <div className="container p-8">Loading…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;

  return <Outlet />;
}

export default RequireAuth;
