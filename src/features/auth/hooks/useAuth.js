import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/lib/api";

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
            return user;
        },

        async signup(userPayload) {
            const user = await api.signup(userPayload);
            qc.setQueryData(["me"], user);
            return user;
        },

        async logout() {
            try {
                await api.logout();
            } finally {
                qc.setQueryData(["me"], null);
            }
        },

        async updateProfile(payload) {
            const user = await api.profile(payload);
            await qc.invalidateQueries({ queryKey: ["me"] });
            return user;
        },
    };
}
