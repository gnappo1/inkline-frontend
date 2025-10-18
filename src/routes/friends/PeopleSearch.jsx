import { useEffect, useMemo, useRef, useState } from "react";
import * as Yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useToast } from "../../notifications/ToastProvider";
import { PlusIcon, SpinnerIcon, CheckIcon, TrashIcon, BanIcon, UndoIcon, UserMinusIcon } from "../icons/Icons";

const schema = Yup.object({
    q: Yup.string().trim().min(2, "Type at least 2 characters"),
});

export default function PeopleSearch() {
    const qc = useQueryClient();
    const { push } = useToast() || { push: () => { } };

    const [input, setInput] = useState("");
    const [query, setQuery] = useState("");
    const tRef = useRef();

    useEffect(() => {
        clearTimeout(tRef.current);
        tRef.current = setTimeout(() => setQuery(input.trim()), 300);
        return () => clearTimeout(tRef.current);
    }, [input]);

    const onKeyDown = (e) => {
        if (e.key === "Escape") {
            setInput("");
            setQuery("");
        }
    };

    const valid = useMemo(() => {
        try { schema.validateSync({ q: input }); return true; } catch { return false; }
    }, [input]);

    const searchQ = useQuery({
        queryKey: ["user-search", query],
        queryFn: () => api.searchUsers(query),
        enabled: query.length >= 2,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });

    const rows = searchQ.data?.data ?? [];

    const invalidateFriendships = () => qc.invalidateQueries({ queryKey: ["friendships"] });
    const invalidateSearches = () =>
        qc.invalidateQueries({
            predicate: ({ queryKey }) => Array.isArray(queryKey) && queryKey[0] === "user-search",
        });

    const [busyKey, setBusyKey] = useState(null);

    const clearBusy = () => setBusyKey(null);

    const mAdd = useMutation({
        mutationFn: (id) => api.createFriendship(id),
        onMutate: (id) => setBusyKey(`add:${id}`),
        onSuccess: () => {
            push("Friend request sent", { variant: "success" });
            setInput("");
            setQuery("");
            invalidateFriendships();
            invalidateSearches();
        },
        onError: (e) =>
            push(String(e?.details?.error || e?.message || "Failed to send"), { variant: "error" }),
        onSettled: clearBusy,
    });

    const mAct = useMutation({
        mutationFn: ({ frId, op }) => api.actFriendship(frId, op),
        onMutate: ({ frId, op }) => setBusyKey(`${op}:${frId}`),
        onSuccess: () => {
            push("Updated friend request", { variant: "success" });
            invalidateFriendships();
            invalidateSearches();
        },
        onError: (e) =>
            push(String(e?.details?.error || e?.message || "Action failed"), { variant: "error" }),
        onSettled: clearBusy,
    });

    const mDel = useMutation({
        mutationFn: (frId) => api.deleteFriendship(frId),
        onMutate: (frId) => setBusyKey(`cancel:${frId}`),
        onSuccess: () => {
            push("Request removed", { variant: "success" });
            invalidateFriendships();
            invalidateSearches();
        },
        onError: (e) =>
            push(String(e?.details?.error || e?.message || "Delete failed"), { variant: "error" }),
        onSettled: clearBusy,
    });

    return (
        <div className="card p-4">
            <div className="flex gap-2 items-start">
                <div className="flex-1">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        className="input w-full"
                        placeholder="Search people by name…"
                    />
                    {!valid && input && (
                        <div className="text-xs text-red-500 mt-1">Type at least 2 characters</div>
                    )}
                </div>
            </div>

            {query && (
                <div className="mt-4 space-y-2">
                    {rows.length === 0 ? (
                        <div className="text-sm opacity-70">No users match “{query}”.</div>
                    ) : (
                        rows.map((u) => {
                            const rel = u.meta?.relationship || "none";
                            const frId = u.meta?.friendship_id || null;

                            const isBusy = (key) => busyKey === key;

                            return (
                                <div
                                    key={u.id}
                                    className="flex items-center justify-between rounded-lg border border-black/10 dark:border-white/10 p-3"
                                >
                                    <a className="font-medium hover:underline" href={`/users/${u.id}`}>
                                        {u.attributes.first_name} {u.attributes.last_name}
                                    </a>

                                    {rel === "none" && (
                                        <button
                                            className="inline-flex items-center justify-center h-8 w-8 rounded-full
                                 text-[hsl(var(--brand))] hover:bg-black/5 dark:hover:bg-white/10"
                                            title="Add"
                                            onClick={() => mAdd.mutate(u.id)}
                                            disabled={isBusy(`add:${u.id}`)}
                                            aria-busy={isBusy(`add:${u.id}`)}
                                        >
                                            {isBusy(`add:${u.id}`) ? <SpinnerIcon /> : <PlusIcon />}
                                        </button>
                                    )}

                                    {rel === "friend" && (
                                        <div className="inline-flex items-center justify-center h-8 w-8 rounded-full text-green-500 hover:bg-black/5 dark:hover:bg-white/10">
                                            <CheckIcon />
                                        </div>
                                    )}

                                    {rel === "pending_sent" && frId && (
                                        <button
                                            className="inline-flex items-center justify-center h-8 w-8 rounded-full
                                 text-red-500 hover:bg-black/5 dark:hover:bg-white/10"
                                            title="Cancel request"
                                            onClick={() => mDel.mutate(frId)}
                                            disabled={isBusy(`cancel:${frId}`)}
                                            aria-busy={isBusy(`cancel:${frId}`)}
                                        >
                                            {isBusy(`cancel:${frId}`) ? <SpinnerIcon /> : <TrashIcon />}
                                        </button>
                                    )}

                                    {rel === "pending_incoming" && frId && (
                                        <div className="flex gap-1.5">
                                            <button
                                                className="inline-flex items-center justify-center h-8 w-8 rounded-full
                                   text-green-500 hover:bg-black/5 dark:hover:bg-white/10"
                                                title="Accept"
                                                onClick={() => mAct.mutate({ frId, op: "accept" })}
                                                disabled={isBusy(`accept:${frId}`)}
                                                aria-busy={isBusy(`accept:${frId}`)}
                                            >
                                                {isBusy(`accept:${frId}`) ? <SpinnerIcon /> : <CheckIcon />}
                                            </button>
                                            <button
                                                className="inline-flex items-center justify-center h-8 w-8 rounded-full
                                   text-red-500 hover:bg-black/5 dark:hover:bg-white/10"
                                                title="Reject"
                                                onClick={() => mAct.mutate({ frId, op: "reject" })}
                                                disabled={isBusy(`reject:${frId}`)}
                                                aria-busy={isBusy(`reject:${frId}`)}
                                            >
                                                {isBusy(`reject:${frId}`) ? <SpinnerIcon /> : <TrashIcon />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
