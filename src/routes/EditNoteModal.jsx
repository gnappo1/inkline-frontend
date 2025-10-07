import { useState } from "react";
import Modal from "./Modal";
import PublicToggle from "./PublicToggle";
import CategoryInput from "./CategoryInput";
import { api } from "../lib/api";

function EditNoteModal({ note, onClose, onSaved }) {
  const [title, setTitle] = useState(note.title || "");
  const [body, setBody] = useState(note.body || "");
  const [isPublic, setIsPublic] = useState(!!note.public);
  const [cats, setCats] = useState((note.categories || []).map((c) => c.name));
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  async function submit() {
    setSubmitting(true);
    setErr(null);
    try {
      await api.updateNote(note.id, {
        title,
        body,
        public: isPublic,
        categories: cats, // Backend will find-or-create and associate
      });
      onSaved?.();
    } catch (e) {
      setErr(e?.details?.errors || e?.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="p-5">
        <h3 className="text-lg font-semibold">Edit note</h3>

        <div className="mt-4 space-y-3">
          <div>
            <label className="label">Title</label>
            <input
              className="input w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Body</label>
            <textarea
              className="input w-full min-h-[120px]"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="label">Public</span>
            <PublicToggle checked={isPublic} onChange={setIsPublic} />
          </div>

          <div>
            <label className="label">Categories</label>
            <CategoryInput value={cats} onChange={setCats} />
          </div>

          {err && (
            <div className="text-red-500 text-sm">
              {Array.isArray(err) ? err.join(", ") : String(err)}
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default EditNoteModal;
