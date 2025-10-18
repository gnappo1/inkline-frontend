import { useEffect, useRef, useState } from "react";

const LANGS = [
    { code: "en-US", label: "English (US)" },
    { code: "en-GB", label: "English (UK)" },
    { code: "es-ES", label: "Español (ES)" },
    { code: "fr-FR", label: "Français" },
    { code: "de-DE", label: "Deutsch" },
    { code: "it-IT", label: "Italiano" },
    { code: "pt-BR", label: "Português (BR)" },
    { code: "ja-JP", label: "日本語" },
    { code: "ko-KR", label: "한국어" },
    { code: "zh-CN", label: "中文 (简体)" },
];

function LanguageMenu({ open, onClose, onPick }) {
    const [query, setQuery] = useState("");
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onDoc = (e) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target)) onClose?.();
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, [open, onClose]);

    const items = LANGS.filter(
        (l) =>
            l.code.toLowerCase().includes(query.toLowerCase()) ||
            l.label.toLowerCase().includes(query.toLowerCase())
    );

    if (!open) return null;

    return (
        <div
            ref={ref}
            className="absolute z-50 mt-2 w-64 rounded-xl border border-black/10 dark:border-white/10 bg-card shadow-xl p-2"
            role="menu"
        >
            <input
                autoFocus
                placeholder="Search languages…"
                className="input w-full mb-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <ul className="max-h-56 overflow-auto space-y-1">
                {items.map((l) => (
                    <li key={l.code}>
                        <button
                            type="button"
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                            onClick={() => {
                                onPick?.(l.code);
                                onClose?.();
                            }}
                        >
                            <div className="font-medium">{l.label}</div>
                            <div className="text-xs opacity-70">{l.code}</div>
                        </button>
                    </li>
                ))}
                {!items.length && (
                    <li className="px-3 py-2 text-sm opacity-70">No matches</li>
                )}
            </ul>
        </div>
    );
}

export default LanguageMenu;
