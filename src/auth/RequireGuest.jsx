import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./authProvider.jsx";

export default function RequireGuest() {
    const { data: me, status } = useAuth() || {};
    const loc = useLocation();

    if (status === "pending") return null;
    if (me) return <Navigate to={loc.state?.from ?? "/"} replace />;
    return <Outlet />;
}
