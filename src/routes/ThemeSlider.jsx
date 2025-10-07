import { useEffect, useState } from "react";

function ThemeSlider() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });

  useEffect(() => {
    const el = document.documentElement;
    if (dark) {
      el.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      el.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={() => setDark((v) => !v)}
      className="relative inline-flex h-7 w-14 items-center rounded-full bg-black/10 dark:bg-white/15 transition-colors"
    >
      <span
        className={`absolute left-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-black shadow
          transition-transform ${dark ? "translate-x-7" : "translate-x-0"}`}
      >
        <span className="text-[11px]">{dark ? "🌙" : "☀️"}</span>
      </span>
    </button>
  );
}

export default ThemeSlider;
