import { createContext, useContext } from "react";
import { useMe } from "../hooks/useAuth.js";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
    const me = useMe();
    return <AuthCtx.Provider value={me}>{children}</AuthCtx.Provider>;
}
