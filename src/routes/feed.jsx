import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export default function Feed() {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useInfiniteQuery({
            queryKey: ["feed"],
            queryFn: ({ pageParam }) =>
                api.feed(pageParam ? { before: pageParam, limit: 20 } : { limit: 20 }),
            getNextPageParam: (last) => last.next_cursor || undefined,
            initialPageParam: undefined,
        });

    if (status === "pending") return <p>Loading…</p>;
    if (status === "error") return <p>Failed to load</p>;

    const items = data.pages.flatMap((p) => p.data);

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
            {items.map((n) => (
                <article
                    key={n.id}
                    className="rounded-2xl p-4 bg-white/5 border border-white/10"
                >
                    <h2 className="text-lg font-semibold">{n.title}</h2>
                    <p className="text-sm opacity-80">
                        {new Date(n.created_at).toLocaleString()}
                    </p>
                    <p className="mt-2">{n.body}</p>
                </article>
            ))}
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
    );
}
