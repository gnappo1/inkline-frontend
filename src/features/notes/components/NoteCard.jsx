import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { Link, useParams } from "react-router";
import Chip from "../../../shared/ui/Chip"
import TrashIcon from "../../../shared/ui/TrashIcon"
import PencilIcon from "../../../shared/ui/PencilIcon"

export function formatWhen(s) {
    try {
        return new Date(s).toLocaleString();
    } catch {
        return s;
    }
}

function NoteCard({ note, onEdit, onDelete, isOwner, isFriend }) {
    const { title, body, created_at, author, categories = [] } = note;
    const { id } = useParams() || 0;

    const safeHtml = useMemo(
        () =>
            DOMPurify.sanitize(body || "", {
                ALLOWED_TAGS: [
                    "p", "br", "strong", "em", "u", "s", "a",
                    "ul", "ol", "li",
                    "h1", "h2", "h3", "blockquote", "code", "pre", "hr", "span"
                ],
                ALLOWED_ATTR: ["href", "target", "rel"],
            }),
        [body]
    );


    return (
        <motion.article
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.995 }}
            className="relative overflow-hidden rounded-2xl p-4 bg-card border border-black/10 dark:border-white/10 shadow-sm transition-all duration-200 ease-out group"
        >
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[hsl(var(--brand))]/20 to-[hsl(var(--accent))]/20 blur-2xl" />
            </div>

            <header className="relative flex items-start gap-3">
                <div className="flex-1">
                    <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                    <div className="text-xs text-mute mt-1">
                        {formatWhen(created_at)}
                        {author ? (
                            <>
                                {" • "}
                                {id && Number(id) === Number(author.id) ? (
                                    <span>{author.first_name} {author.last_name}</span>
                                ) : isFriend?.(author.id) ? (
                                    <Link to={`/users/${author.id}`} className="underline hover:opacity-80">
                                        {author.first_name} {author.last_name}
                                    </Link>
                                ) : (
                                    <span>{author.first_name} {author.last_name}</span>
                                )}
                            </>
                        ) : null}
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

            <div
                className="prose dark:prose-invert max-w-none mt-2 prose-a:underline hover:prose-a:opacity-80"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
            />

            {categories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {categories.map((c) => (
                        <Chip key={c.id ?? c.name}>{c.name}</Chip>
                    ))}
                </div>
            )}
        </motion.article>
    );
}

export default memo(NoteCard);
