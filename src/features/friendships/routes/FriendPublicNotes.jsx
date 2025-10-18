import { useParams, useNavigate } from "react-router";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../shared/lib/api";
import NoteCard from "../../notes/components/NoteCard";
import { useAuth } from "../../auth/components/AuthProvider";

function FriendPublicNotes() {
    const { id } = useParams();
    const nav = useNavigate();
    const { data: me } = useAuth() || {};
    const meId = Number(me?.data?.id ?? me?.id);

    useEffect(() => {
        if (Number(id) === meId) nav("/notes", { replace: true });
    }, [id, meId, nav]);

    const userQ = useQuery({
        queryKey: ["user", id],
        queryFn: () => api.user(id),
        retry: false,
        enabled: Number(id) !== meId,
    });

    useEffect(() => {
        if (userQ.isError && userQ.error?.status === 403) {
            nav("/feed", { replace: true });
        }
    }, [userQ.isError, userQ.error, nav]);

    const [q, setQ] = useState("");
    const [qDebounced, setQDebounced] = useState("");
    useEffect(() => {
        const t = setTimeout(() => setQDebounced(q.trim()), 250);
        return () => clearTimeout(t);
    }, [q]);

    const notesQ = useInfiniteQuery({
        queryKey: ["friend-public-notes", id, qDebounced],
        queryFn: ({ pageParam }) =>
            api.feed(
                pageParam
                    ? { user_id: id, q: qDebounced, before: pageParam, limit: 20 }
                    : { user_id: id, q: qDebounced, limit: 20 }
            ),
        getNextPageParam: (last) => last?.next_cursor || undefined,
        enabled: userQ.isSuccess,
        initialPageParam: undefined,
    });

    const items = useMemo(
        () => (notesQ.data ? notesQ.data.pages.flatMap((p) => p.data) : []),
        [notesQ.data]
    );

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-2">
                {userQ.data?.data?.attributes?.first_name}{" "}
                {userQ.data?.data?.attributes?.last_name}
            </h1>

            <input
                className="input w-full mb-4"
                placeholder="Search their notes…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
            />

            <section className="space-y-4">
                {items.map((n) => (
                    <NoteCard
                        key={n.id}
                        note={n}
                        isOwner={false}
                        isFriend={() => true}
                    />
                ))}
            </section>

            {notesQ.hasNextPage && (
                <div className="mt-6">
                    <button
                        className="btn"
                        onClick={() => notesQ.fetchNextPage()}
                        disabled={notesQ.isFetchingNextPage}
                    >
                        {notesQ.isFetchingNextPage ? "Loading…" : "Load more"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default FriendPublicNotes;