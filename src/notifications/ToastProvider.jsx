import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const push = useCallback((msg, opts = {}) => {
        const id = Math.random().toString(36).slice(2);
        setToasts((t) => [...t, { id, msg, variant: opts.variant || "info", ttl: opts.ttl ?? 3000 }]);
        return id;
    }, []);
    const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

    useEffect(() => {
        const timers = toasts.map((t) => setTimeout(() => remove(t.id), t.ttl));
        return () => timers.forEach(clearTimeout);
    }, [toasts, remove]);

    return (
        <ToastCtx.Provider value={{ push, remove }}>
            {children}
            {createPortal(
                <div
                    className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] w-full max-w-xl px-4 pointer-events-none"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <AnimatePresence initial={false}>
                        {toasts.map((t) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                transition={{ duration: 0.18, ease: [0.2, 0.9, 0.2, 1] }}
                                className="pointer-events-auto mb-2 rounded-xl border shadow-lg backdrop-blur px-4 py-3 text-sm bg-[hsl(var(--card))]/90 border-black/10 dark:border-white/10"
                                onClick={() => remove(t.id)}
                                role="status"
                            >
                                <div
                                    className={`font-medium ${t.variant === "success" ? "text-green-600 dark:text-green-400" : t.variant === "error" ? "text-red-600 dark:text-red-400" : "text-fg"}`}
                                >
                                    {t.msg}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>,
                document.body
            )}
        </ToastCtx.Provider>
    );
}

export default ToastProvider;