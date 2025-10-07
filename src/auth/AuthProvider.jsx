import { createContext, useContext } from "react";
import { useMe } from "../hooks/useAuth.js";  // ⬅️ reuse the hook

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
    const me = useMe();               // ⬅️ this already handles 401 → null
    return <AuthCtx.Provider value={me}>{children}</AuthCtx.Provider>;
}
