import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { api } from "../lib/api";
import NoteCard from "./NoteCard.jsx";
import EditNoteModal from "./EditNoteModal.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import { useAuth } from "../auth/authProvider.jsx";
import AnimatedWaveText from "./AnimatedWaveText.jsx";

function Feed() {
    const qc = useQueryClient();
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const { data: currentUser } = useAuth() || {};
    const meId = Number(currentUser?.data?.id ?? currentUser?.id);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
    } = useInfiniteQuery({
        queryKey: ["feed"],
        queryFn: ({ pageParam }) =>
            api.feed(pageParam ? { before: pageParam, limit: 20 } : { limit: 20 }),
        getNextPageParam: (last) => last?.next_cursor || undefined,
        initialPageParam: undefined,
    });

    const friendshipsQuery = useQuery({
        queryKey: ["friendships"],
        queryFn: () => api.friendships(),
    });

    const friendIds = useMemo(() => {
        const rows = friendshipsQuery.data?.data ?? [];
        return new Set(
            rows
                .filter((r) => r.attributes.status === "accepted")
                .map((r) => {
                    const me = meId;
                    const a = r.attributes;
                    return Number(a.sender_id) === me ? Number(a.receiver_id) : Number(a.sender_id);
                })
        );
    }, [friendshipsQuery.data, meId]);

    const items = useMemo(
        () => (data ? data.pages.flatMap((p) => p.data) : []),
        [data]
    );

    if (status === "pending") {
        return <div className="container py-8">Loading feed…</div>;
    }
    if (status === "error") {
        return (
            <div className="container py-8 text-red-500">
                Failed to load: {String(error?.message || "error")}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4">

            <AnimatedWaveText text="Public Feed" className="text-4xl md:text-5xl font-semibold mb-2" />
            <p className="text-mute mt-2 mb-6 md:mb-8">Fresh public notes from the community.</p>

            <section className="space-y-4">
                {items.map((n) => (
                    <NoteCard
                        key={n.id}
                        note={n}
                        onEdit={() => setEditing(n)}
                        onDelete={() => setDeleting(n)}
                        isFriend={(id) => friendIds.has(Number(id))}
                        isOwner={String(currentUser?.id ?? currentUser?.data?.id) === String(n.author?.id)}
                    />
                ))}
            </section>

            <div className="mt-6">
                {hasNextPage && (
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="btn"
                    >
                        {isFetchingNextPage ? "Loading…" : "Load more"}
                    </button>
                )}
            </div>

            {editing && (
                <EditNoteModal
                    note={editing}
                    onClose={() => setEditing(null)}
                    onSaved={() => {
                        setEditing(null);
                        qc.invalidateQueries({ queryKey: ["feed"] });
                    }}
                />
            )}

            {deleting && (
                <ConfirmDialog
                    title="Delete note?"
                    message="This action cannot be undone."
                    confirmText="Delete"
                    variant="danger"
                    onCancel={() => setDeleting(null)}
                    onConfirm={async () => {
                        await api.deleteNote(deleting.id);
                        setDeleting(null);
                        qc.invalidateQueries({ queryKey: ["feed"] });
                    }}
                />
            )}
        </div>
    );
}

export default Feed;
