import React, { useEffect, useState } from "react";
import { Outlet, Link, NavLink, useLocation } from "react-router";
import Sidebar from "./routes/sidebar.jsx";
import Footer from "./routes/footer.jsx";
import { useAuth } from "./auth/authProvider.jsx";

/** Theme slider (toggle) — persists to localStorage and applies `.dark` to <html> */
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

function App() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const { data: user } = useAuth() || {};

  useEffect(() => setOpen(false), [loc.pathname]);

  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* subtle brand blobs so light theme doesn’t feel flat */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.08] dark:opacity-[0.12]">
        <div className="absolute -top-20 -left-24 w-[45rem] h-[45rem] rounded-full blur-3xl grad-brand" />
        <div className="absolute -bottom-28 -right-28 w-[40rem] h-[40rem] rounded-full blur-3xl grad-accent" />
      </div>

      <header className="sticky top-0 z-40 backdrop-blur bg-bg/70 border-b border-black/5 dark:border-white/10">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="font-semibold text-lg">
            Inkline<span className="text-brand">.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 text-sm">
            <ThemeSlider />
            
            <NavLink to="/feed" className="hover:opacity-80">
              Public Feed
            </NavLink>
            {user ? (
              <>
                <NavLink to="/notes" className="hover:opacity-80">
                  My Notes
                </NavLink>
                <NavLink to="/friends" className="hover:opacity-80">
                  Friends
                </NavLink>
              </>
            ) : null}

            {!user ? (
              <>
                <NavLink to="/login" className="btn btn-ghost">
                  Log in
                </NavLink>
                <NavLink to="/signup" className="btn btn-primary">
                  Sign up
                </NavLink>
              </>
            ) : (
              <NavLink to="/notes" className="btn btn-primary">
                New Note
              </NavLink>
            )}
          </nav>

          <button
            className="md:hidden btn btn-ghost"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      <Sidebar open={open} onClose={() => setOpen(false)} />

      <main className="container py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
