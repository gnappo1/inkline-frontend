import { useMemo, useState } from "react";
import { useAuth } from "../../auth/components/AuthProvider.jsx";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../shared/lib/api.js";
import FriendshipCard from "../components/FriendshipCard.jsx";
import AnimatedWaveText from "../../../shared/ui/AnimatedWaveText.jsx";
import PeopleSearch from "../components/PeopleSearch.jsx";

const FILTERS = ["friends", "incoming requests", "sent requests", "blocked users"];
const MODES = { search: "search", manage: "manage" };

export default function FriendsContainer() {
  const { data: currentUser } = useAuth() || {};
  const meId = Number(currentUser?.data?.id ?? currentUser?.id);
  const [filter, setFilter] = useState(FILTERS[0]);
  const [localFilter, setLocalFilter] = useState("");
  const [mode, setMode] = useState(MODES.manage);

  const { data, status, error } = useQuery({
    queryKey: ["friendships"],
    queryFn: () => api.friendships(),
  });

  const rows = data?.data ?? [];

  const filtered = useMemo(() => {
    const base = (() => {
      switch (filter) {
        case "friends":
          return rows.filter((f) => f.attributes.status === "accepted");
        case "incoming requests":
          return rows.filter((f) => f.attributes.status === "pending" && Number(f.attributes.receiver_id) === meId);
        case "sent requests":
          return rows.filter((f) => f.attributes.status === "pending" && Number(f.attributes.sender_id) === meId);
        case "blocked users":
          return rows.filter((f) => f.attributes.status === "blocked" && Number(f.attributes.sender_id) === meId);
        default:
          return rows;
      }
    })();

    if (!localFilter.trim()) return base;

    const q = localFilter.trim().toLowerCase();
    return base.filter((f) => {
      const name = f.attributes.other_user_name?.split(" - ")[1] || "";
      return name.toLowerCase().includes(q);
    });
  }, [rows, filter, meId, localFilter]);

  if (status === "pending") return <div className="container py-8">Loading your friendships…</div>;
  if (status === "error") {
    return <div className="container py-8 text-red-500">Failed to load: {String(error?.message || "unexpected error")}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <AnimatedWaveText text="My Friendships" className="text-4xl md:text-5xl font-semibold mb-2" />
      <p className="text-mute mt-2">All your friends and requests in one place.</p>
      <div className="inline-flex rounded-full border border-black/10 dark:border-white/10 overflow-hidden m-4">
        <button className={`px-3 py-1.5 text-sm ${mode === MODES.search ? "bg-[hsl(var(--brand)/.15)]" : ""}`} onClick={() => setMode(MODES.search)}>Search</button>
        <button className={`px-3 py-1.5 text-sm ${mode === MODES.manage ? "bg-[hsl(var(--brand)/.15)]" : ""}`} onClick={() => setMode(MODES.manage)}>Manage</button>
      </div>

      {mode === MODES.search ? (
        <div className="search-friends mb-5 mt-5">
          <PeopleSearch />
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            {FILTERS.map((k) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`px-3 py-1.5 rounded-full text-sm border transition
                  ${filter === k
                    ? "bg-[hsl(var(--brand)/.15)] border-[hsl(var(--brand)/.35)]"
                    : "bg-card border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"}`}
              >
                {k[0].toUpperCase() + k.slice(1)}
              </button>
            ))}

          </div>
          <div className="card font-semibold mb-4">
            <input
              className="input ml-auto w-full"
              placeholder={`Filter ${filter.toLowerCase()}…`}
              value={localFilter}
              onChange={(e) => setLocalFilter(e.target.value)}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="card text-center py-12">
              <p className="opacity-80">No matches{localFilter ? ` for “${localFilter}”` : ""}.</p>
            </div>
          ) : (
            <section className="space-y-4">
              {filtered.map((f) => (
                <FriendshipCard key={f.id} friendship={f.attributes} id={f.id} meId={meId} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  )
}
