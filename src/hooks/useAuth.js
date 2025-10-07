import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useMe() {
    return useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            try {
                return await api.me();
            } catch (e) {
                if (e.status === 401) return null;
                throw e;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

export function useAuthActions() {
    const qc = useQueryClient();

    return {
        async login(email, password) {
            const user = await api.login(email, password);
            qc.setQueryData(["me"], user);
            // (optional) confirm with a background refetch
            // qc.invalidateQueries({ queryKey: ["me"] });
            return user;
        },

        async signup(userPayload) {
            const user = await api.signup(userPayload);
            qc.setQueryData(["me"], user);
            // (optional) confirm with a background refetch
            // qc.invalidateQueries({ queryKey: ["me"] });
            return user;
        },

        async logout() {
            try {
                await api.logout();
            } finally {
                qc.setQueryData(["me"], null);
                // (optional) ping the server; if cookie/session already gone, /me -> 401 -> null
                // qc.invalidateQueries({ queryKey: ["me"] });
            }
        },
    };
}
