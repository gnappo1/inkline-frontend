import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../features/auth/components/AuthProvider.jsx";
import { useAuthActions } from "../features/auth/hooks/useAuth.js";
import { LogOut, UserRound, Users, StickyNote } from "lucide-react";

function Avatar({ first, last }) {
    const initials = useMemo(() => {
        const a = (first || "").trim()[0] || "";
        const b = (last || "").trim()[0] || "";
        return (a + b || "🙂").toUpperCase();
    }, [first, last]);

    return (
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--brand)/.15)] text-[hsl(var(--brand))] font-semibold">
            {initials}
        </div>
    );
}

function AccountMenu() {
    const { data: me } = useAuth() || {};
    const { logout } = useAuthActions() || {};
    const qc = useQueryClient();
    const nav = useNavigate();
    const loc = useLocation();

    const first = me?.data?.attributes?.first_name ?? me?.first_name ?? "";
    const last = me?.data?.attributes?.last_name ?? me?.last_name ?? "";

    const [open, setOpen] = useState(false);
    const btnRef = useRef(null);
    const popRef = useRef(null);

    useEffect(() => { setOpen(false); }, [loc.pathname]);

    useEffect(() => {
        if (!open) return;
        const onDocClick = (e) => {
            if (
                popRef.current &&
                !popRef.current.contains(e.target) &&
                btnRef.current &&
                !btnRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    async function handleLogout() {
        try {
            await logout?.();
            await qc.invalidateQueries();
            nav("/login", { replace: true });
        } catch {
            nav("/login", { replace: true });
        }
    }

    return (
        <div className="relative">
            <button
                ref={btnRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand))]/40"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <Avatar first={first} last={last} />
            </button>

            {open && (
                <div
                    ref={popRef}
                    role="menu"
                    aria-label="Account menu"
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-black/10 dark:border-white/10 bg-card shadow-lg overflow-hidden z-50"
                >
                    <div className="px-3 py-2 text-sm opacity-70">
                        Signed in as <span className="font-medium">{first} {last}</span>
                    </div>
                    <div className="h-px bg-black/10 dark:bg-white/10" />

                    <MenuLink to="/profile" icon={<UserRound className="h-4 w-4" />} onClick={() => setOpen(false)}>
                        Profile
                    </MenuLink>
                    <MenuLink to="/friends" icon={<Users className="h-4 w-4" />} onClick={() => setOpen(false)}>
                        Friends
                    </MenuLink>
                    <MenuLink to="/notes" icon={<StickyNote className="h-4 w-4" />} onClick={() => setOpen(false)}>
                        My Notes
                    </MenuLink>

                    <div className="h-px bg-black/10 dark:bg-white/10" />
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-black/5 dark:hover:bg-white/10"
                        role="menuitem"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

function MenuLink({ to, icon, children, onClick }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
        >
            {icon}
            {children}
        </Link>
    );
}

export default AccountMenu;