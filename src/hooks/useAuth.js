import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useMe() {
    return useQuery({ queryKey: ["me"], queryFn: api.me, retry: false });
}

export function useAuthActions() {
    const qc = useQueryClient();
    return {
        async login(email, password) { await api.login(email, password); await qc.invalidateQueries({ queryKey: ["me"] }); },
        async signup(user) { await api.signup(user); await qc.invalidateQueries({ queryKey: ["me"] }); },
        async logout() { await api.logout(); await qc.invalidateQueries({ queryKey: ["me"] }); }
    };
}
