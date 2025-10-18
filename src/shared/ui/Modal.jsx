import { useEffect } from "react";

function Modal({
    children,
    onClose,
    closeOnBackdrop = true,
    ariaLabel = "Dialog",
}) {
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center"
            aria-modal="true"
            role="dialog"
            aria-label={ariaLabel}
        >
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
                onClick={closeOnBackdrop ? onClose : undefined}
            />

            <div
                className="relative z-[1001] w-full max-w-2xl rounded-2xl bg-card border border-black/10 dark:border-white/10 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

export default Modal;