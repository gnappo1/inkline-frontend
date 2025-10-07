import { memo } from "react";
import { motion } from "framer-motion";

function formatWhen(s) {
    try {
        return new Date(s).toLocaleString();
    } catch {
        return s;
    }
}

function PencilIcon(props) {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
            <path
                fill="currentColor"
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm14.71-9.04c.39-.39.39-1.02 0-1.41l-1.51-1.51a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.99-1.66Z"
            />
        </svg>
    );
}

function TrashIcon(props) {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
            <path
                fill="currentColor"
                d="M9 3h6v2h5v2H4V5h5V3Zm1 6h2v8h-2V9Zm4 0h2v8h-2V9ZM6 7h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z"
            />
        </svg>
    );
}

function Chip({ children }) {
    return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[hsl(var(--card))] border border-black/5 dark:border-white/10">
            {children}
        </span>
    );
}

function NoteCard({ note, onEdit, onDelete, isOwner }) {
    const { title, body, created_at, author, categories = [] } = note;

    return (
        <motion.article
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.995 }}
            className="relative overflow-hidden rounded-2xl p-4 bg-card border border-black/10 dark:border-white/10 shadow-sm
                 transition-all duration-200 ease-out group"
        >
            {/* soft gradient glow on hover */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[hsl(var(--brand))]/20 to-[hsl(var(--accent))]/20 blur-2xl" />
            </div>

            <header className="relative flex items-start gap-3">
                <div className="flex-1">
                    <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                    <div className="text-xs text-mute mt-1">
                        {formatWhen(created_at)}
                        {author ? <> • {author.first_name} {author.last_name}</> : null}
                    </div>
                </div>

                {isOwner && (
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full
                         text-[hsl(var(--brand))] hover:bg-black/5 dark:hover:bg-white/10
                         focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand))]/50"
                            onClick={onEdit}
                            aria-label="Edit note"
                            title="Edit"
                        >
                            <PencilIcon />
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full
                         text-red-500 hover:bg-black/5 dark:hover:bg-white/10
                         focus:outline-none focus:ring-2 focus:ring-red-500/40"
                            onClick={onDelete}
                            aria-label="Delete note"
                            title="Delete"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                )}
            </header>

            <p className="mt-2 whitespace-pre-wrap">{body}</p>

            {categories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {categories.map((c) => (
                        <Chip key={c.id}>{c.name}</Chip>
                    ))}
                </div>
            )}
        </motion.article>
    );
}

export default memo(NoteCard);
