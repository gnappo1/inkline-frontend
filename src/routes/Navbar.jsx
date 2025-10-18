import { Link, NavLink } from "react-router";
import ThemeSlider from "./ThemeSlider";
import { useAuth } from "../auth/authProvider.jsx";
import AccountMenu from "./AccountMenu.jsx";

function Navbar({ onOpen, onClose }) {
    const { data: user } = useAuth() || {};

    return (
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
                            <NavLink to="/notes/new" className="hover:opacity-80">
                                New Note
                            </NavLink>
                            <AccountMenu />

                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className="btn btn-ghost">
                                Log in
                            </NavLink>
                            <NavLink to="/signup" className="btn btn-primary">
                                Sign up
                            </NavLink>
                        </>
                    )}
                </nav>

                <button
                    className="md:hidden btn btn-ghost"
                    aria-label="Open menu"
                    onClick={onOpen}
                >
                    ☰
                </button>
            </div>
        </header>
    );
}

export default Navbar;