import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";

function Toolbar({ editor }) {
    if (!editor) return null;
    const btn = "px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-sm";

    return (
        <div className="flex flex-wrap gap-1 border-b border-black/10 dark:border-white/10 p-2">
            <button type="button" className={btn}
                onClick={() => editor.chain().focus().toggleBold().run()}
                aria-pressed={editor.isActive("bold")}>B</button>

            <button type="button" className={btn}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                aria-pressed={editor.isActive("italic")}>I</button>

            <button type="button" className={btn}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                aria-pressed={editor.isActive("bulletList")}>• List</button>

            <button type="button" className={btn}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                aria-pressed={editor.isActive("orderedList")}>1. List</button>

            <button type="button" className={btn}
                onClick={() => {
                    const url = prompt("Enter URL");
                    if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                }}>Link</button>

            <button type="button" className={btn}
                onClick={() => editor.chain().focus().unsetLink().run()}>Unlink</button>

            <button type="button" className={btn}
                onClick={() => editor.chain().focus().unsetAllMarks().run()}>
                Clear formatting
            </button>

            <button type="button" className={btn}
                onClick={() => editor.chain().focus().clearContent(true).run()}>
                Clear content
            </button>
        </div>
    );
}

function RichEditor({ value, onChange, onBlur, placeholder = "Write your note…" }) {
    const editor = useEditor({
        content: value || "",
        extensions: [
            StarterKit,                             
            Link.configure({ openOnClick: false }),
            Placeholder.configure({ placeholder }),
        ],
        editorProps: {
            attributes: {
                class: "tiptap-content prose dark:prose-invert max-w-none min-h-[200px] p-3 focus:outline-none",
            },
        },
        onUpdate({ editor }) {
            onChange?.(editor.getHTML());
        },
        onBlur() { onBlur?.(); },
    });

    useEffect(() => {
        if (!editor) return;
        const cur = editor.getHTML();
        if (value != null && value !== cur) editor.commands.setContent(value, false);
    }, [value, editor]);

    return (
        <div className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden bg-card">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}

export default RichEditor;
