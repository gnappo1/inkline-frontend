import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "../../../shared/ui/Modal.jsx";
import PublicToggle from "../../../shared/ui/PublicToggle.jsx";
import CategoryInput from "./CategoryInput.jsx";
import RichEditor from "./RichEditor.jsx";
import { api } from "../../../shared/lib/api.js";
import { useToast } from "../../../shared/notifications/ToastProvider.jsx";

const plain = (html) =>
    typeof html === "string"
        ? html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
        : "";

const noteSchema = Yup.object({
    title: Yup.string().transform(v => (typeof v === "string" ? v.trim() : v))
        .min(1, "Title can't be empty")
        .max(50, "Keep the title under 50 characters")
        .required("Title is required"),
    body: Yup.string()
        .test("not-empty", "Body is required", (v) => plain(v).length > 0)
        .test("max-plain", "Body is too long", (v) => plain(v).length <= 10000),
    public: Yup.boolean(),
    categories: Yup.array()
        .of(
            Yup.string()
                .transform(v => (typeof v === "string" ? v.trim() : v))
                .min(2, "Category name too short")
                .max(30, "Category name too long")
        )
        .max(10, "Too many categories"),
});

function EditNoteModal({ note, onClose, onSaved }) {
    const { push } = useToast() || { push: () => { } };

    return (
        <Modal onClose={onClose}>
            <div className="p-5">
                <h3 className="text-lg font-semibold">Edit note</h3>

                <Formik
                    initialValues={{
                        title: note.title || "",
                        body: note.body || "",
                        public: !!note.public,
                        categories: (note.categories || []).map((c) => c.name),
                    }}
                    validationSchema={noteSchema}
                    onSubmit={async (values, helpers) => {
                        helpers.setStatus(null);
                        try {
                            await api.updateNote(note.id, {
                                title: values.title,
                                body: values.body,
                                public: values.public,
                                categories: values.categories,
                            });
                            push("Note updated", { variant: "success" });
                            onSaved?.();
                        } catch (e) {
                            const details = e?.details?.errors || e?.details?.error || e?.message;
                            if (details && typeof details === "object" && !Array.isArray(details)) {
                                const mapped = {};
                                for (const [k, v] of Object.entries(details)) {
                                    mapped[k] = Array.isArray(v) ? v.join(", ") : String(v);
                                }
                                helpers.setErrors(mapped);
                                push("Fix the highlighted fields", { variant: "error" });
                            } else {
                                const msg = Array.isArray(details) ? details.join(", ") : String(details || "Update failed");
                                helpers.setStatus(msg);
                                push(msg, { variant: "error" });
                            }
                        } finally {
                            helpers.setSubmitting(false);
                        }
                    }}
                >
                    {({ values, setFieldValue, isSubmitting, status }) => (
                        <Form className="mt-4 space-y-4">
                            <div>
                                <label className="label" htmlFor="title">Title</label>
                                <Field id="title" name="title" className="input w-full" />
                                <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="label">Body</label>
                                <RichEditor
                                    value={values.body}
                                    onChange={(html) => setFieldValue("body", html)}
                                />
                                <ErrorMessage name="body" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="label">Public</span>
                                <PublicToggle
                                    checked={values.public}
                                    onChange={(v) => setFieldValue("public", v)}
                                />
                            </div>

                            <div>
                                <label className="label">Categories</label>
                                <CategoryInput
                                    value={values.categories}
                                    onChange={(arr) => setFieldValue("categories", arr)}
                                />
                            </div>

                            {status && <div className="text-red-500 text-sm">{String(status)}</div>}

                            <div className="mt-4 flex justify-end gap-2">
                                <button className="btn btn-ghost" type="button" onClick={onClose} disabled={isSubmitting}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving…" : "Save"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default EditNoteModal;