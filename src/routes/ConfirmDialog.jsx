import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ConfirmDialog({
    title = "Are you sure?",
    message = "",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",     // "default" | "danger"
    onConfirm,
    onCancel,
    closeOnBackdrop = true,
}) {
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onCancel?.();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onCancel]);

    const confirmClasses =
        variant === "danger"
            ? "bg-red-500/90 hover:bg-red-500 text-white"
            : "bg-[hsl(var(--brand))] text-white hover:opacity-90";

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={closeOnBackdrop ? onCancel : undefined}
                />

                {/* Panel */}
                <motion.div
                    className="relative w-[min(92vw,560px)] rounded-2xl bg-card border border-black/10 dark:border-white/10 p-6 shadow-xl"
                    initial={{ y: 20, scale: 0.98, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    exit={{ y: 10, scale: 0.98, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    role="dialog"
                    aria-modal="true"
                >
                    <h2 className="text-xl font-semibold mb-2">{title}</h2>
                    <p className="text-mute mb-6">{message}</p>

                    <div className="flex items-center justify-end gap-2">
                        <button
                            className="btn btn-ghost"
                            onClick={onCancel}
                            autoFocus
                        >
                            {cancelText}
                        </button>
                        <button
                            className={`btn ${confirmClasses}`}
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default ConfirmDialog;
