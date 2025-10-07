import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
    const me = useQuery({ queryKey: ["me"], queryFn: api.me, retry: false });
    return <AuthCtx.Provider value={me}>{children}</AuthCtx.Provider>;
}
