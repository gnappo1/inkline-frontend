import { useEffect } from "react";

function Modal({ open = true, onClose, children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed inset-0 z-50 grid place-items-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-card border border-black/10 dark:border-white/10 shadow-xl">
          {children}
        </div>
      </div>
    </>
  );
}

export default Modal;
