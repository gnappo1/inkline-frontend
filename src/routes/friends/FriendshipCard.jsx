import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { CheckIcon, UserMinusIcon, BanIcon, UndoIcon, TrashIcon } from "../icons/Icons";
import { useToast } from "../../notifications/ToastProvider";

function formatWhen(s) { try { return new Date(s).toLocaleString(); } catch { return s; } }

export default function FriendshipCard({ friendship, id, meId }) {
    const qc = useQueryClient();
    const { push } = useToast() || { push: () => { } };

    const { status, sender_id, receiver_id, effective_timestamp, other_user_name, other_user_id } = friendship;
    const incoming = status === "pending" && Number(receiver_id) === meId;
    const sent = status === "pending" && Number(sender_id) === meId;

    const invalidateFriendships = () => qc.invalidateQueries({ queryKey: ["friendships"] });
    const invalidateSearches = () =>
        qc.invalidateQueries({
            predicate: ({ queryKey }) => Array.isArray(queryKey) && queryKey[0] === "user-search",
        });

    const onSuccessRefresh = (msg) => {
        invalidateFriendships();
        invalidateSearches();
        push(msg, { variant: "success" });
    };

    const mAct = useMutation({
        mutationFn: ({ op }) => api.actFriendship(id, op),
        onSuccess: () => onSuccessRefresh("Updated friendship"),
        onError: (e) => push(String(e?.details?.error || e?.message || "Action failed"), { variant: "error" }),
    });

    const mDel = useMutation({
        mutationFn: () => api.deleteFriendship(id),
        onSuccess: () => onSuccessRefresh("Friendship removed"),
        onError: (e) => push(String(e?.details?.error || e?.message || "Delete failed"), { variant: "error" }),
    });

    const name = other_user_name?.split(" - ")[1] ?? "Unknown user";

    return (
        <motion.article
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.995 }}
            className="relative overflow-hidden rounded-2xl p-4 bg-card border border-black/10 dark:border-white/10 shadow-sm group"
        >
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[hsl(var(--brand))]/20 to-[hsl(var(--accent))]/20 blur-2xl" />
            </div>

            <header className="relative flex items-start gap-3">
                <div className="flex-1">
                    <h2 className="text-lg font-semibold tracking-tight">
                        {status === "accepted" ? <a href={`/users/${other_user_id}`} className="hover:underline">{name}</a> : name}
                    </h2>
                    <div className="text-xs text-mute mt-1">{formatWhen(effective_timestamp)}</div>
                    <div className="text-xs mt-1 opacity-70">Status: {status}</div>
                </div>

                {status === "accepted" && (
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full text-amber-500 hover:bg-black/5 dark:hover:bg-white/10"
                            onClick={() => mDel.mutate()}
                            title="Unfriend"
                            aria-label="Unfriend"
                        >
                            <UserMinusIcon />
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full text-red-500 hover:bg-black/5 dark:hover:bg-white/10"
                            onClick={() => mAct.mutate({ op: "block" })}
                            title="Block"
                            aria-label="Block"
                        >
                            <BanIcon />
                        </button>
                    </div>
                )}

                {status === "blocked" && Number(sender_id) === meId && (
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full text-[hsl(var(--brand))] hover:bg-black/5 dark:hover:bg-white/10"
                            onClick={() => mAct.mutate({ op: "unblock" })}
                            title="Unblock"
                            aria-label="Unblock"
                        >
                            <UndoIcon />
                        </button>
                    </div>
                )}

                {incoming && (
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full text-green-500 hover:bg-black/5 dark:hover:bg-white/10"
                            onClick={() => mAct.mutate({ op: "accept" })}
                            title="Accept"
                            aria-label="Accept"
                        >
                            <CheckIcon />
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full text-red-500 hover:bg-black/5 dark:hover:bg-white/10"
                            onClick={() => mAct.mutate({ op: "reject" })}
                            title="Reject"
                            aria-label="Reject"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                )}

                {sent && (
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full text-red-500 hover:bg-black/5 dark:hover:bg-white/10"
                            onClick={() => mDel.mutate()}
                            title="Cancel request"
                            aria-label="Cancel request"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                )}
            </header>
        </motion.article>
    );
}
