import React from "react";
import { Link, NavLink } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../auth/authProvider.jsx";
import { useAuthActions } from "../hooks/useAuth.js";

function Sidebar({ open, onClose }) {
  const { data: user } = useAuth() || {};
  const { logout } = useAuthActions?.() || { logout: null };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-card border-r border-black/10 dark:border-white/10 p-5"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
          >
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="font-semibold text-lg" onClick={onClose}>
                Inkline<span className="text-brand">.</span>
              </Link>
              <button
                className="btn btn-ghost"
                onClick={onClose}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className="space-y-2">
              <NavLink
                to="/feed"
                onClick={onClose}
                className="block rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10"
              >
                Public Feed
              </NavLink>

              {user ? (
                <>
                  <NavLink
                    to="/notes"
                    onClick={onClose}
                    className="block rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    My Notes
                  </NavLink>
                  <NavLink
                    to="/friends"
                    onClick={onClose}
                    className="block rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    Friends
                  </NavLink>
                </>
              ) : null}
            </nav>

            <div className="mt-6 grid grid-cols-2 gap-2">
              {!user ? (
                <>
                  <NavLink
                    to="/login"
                    onClick={onClose}
                    className="btn btn-ghost w-full"
                  >
                    Log in
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={onClose}
                    className="btn btn-primary w-full"
                  >
                    Sign up
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/notes"
                    onClick={onClose}
                    className="btn btn-primary w-full"
                  >
                    New Note
                  </NavLink>
                  <button
                    className="btn btn-ghost w-full"
                    onClick={async () => {
                      try {
                        await logout?.();
                      } finally {
                        onClose();
                      }
                    }}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default Sidebar;
