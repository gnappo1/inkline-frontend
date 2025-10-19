import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { api } from "../../../shared/lib/api.js";
import { useAuth } from "../../auth/components/AuthProvider.jsx";
import NoteCard from "../components/NoteCard.jsx";
import EditNoteModal from "../components/EditNoteModal.jsx";
import ConfirmDialog from "../../../shared/ui/ConfirmDialog.jsx";
import { useToast } from "../../../shared/notifications/ToastProvider.jsx";

function NotesContainer() {
  const qc = useQueryClient();
  const { data: currentUser } = useAuth() || {};
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all' | 'public' | 'private'
  const { push } = useToast || { push: () => { } };
  const { data, status, error } = useQuery({
    queryKey: ["my-notes"],
    queryFn: () => api.myNotes(currentUser),
  });

  const notes = data?.data ?? [];

  const filtered = useMemo(() => {
    if (filter === "public") return notes.filter((n) => !!n.public);
    if (filter === "private") return notes.filter((n) => !n.public);
    return notes;
  }, [notes, filter]);

  if (status === "pending") {
    return <div className="container py-8">Loading your notes…</div>;
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
      <motion.header
        initial={{ x: -36, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--accent))]">
            My Notes
          </span>
        </h1>
        <p className="text-mute mt-2">All your notes, public and private.</p>
      </motion.header>

      <div className="mb-4 flex gap-2">
        {["all", "public", "private"].map((k) => (
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

      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="opacity-80">You haven’t written any {filter === "all" ? "" : filter} notes yet.</p>
          <Link to="/notes/new" className="btn btn-primary mt-4">
            Create your first {filter === "all" ? "" : filter} note
          </Link>
        </div>
      ) : (
        <section className="space-y-4">
          {filtered.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              onEdit={() => setEditing(n)}
              onDelete={() => setDeleting(n)}
              isOwner={true}
            />
          ))}
        </section>
      )}

      {editing && (
        <EditNoteModal
          note={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            qc.invalidateQueries({ queryKey: ["my-notes"] });
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
            push("Successfully deleted note", { variant: "success" });
            qc.invalidateQueries({ queryKey: ["my-notes"] });
            qc.invalidateQueries({ queryKey: ["feed"] });
            
          }}
        />
      )}
    </div>
  );
}

export default NotesContainer;
