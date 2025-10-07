import { Link } from "react-router";
import { useAuth } from "../auth/authProvider";
function Footer() {
  const { data: user } = useAuth() || {};

  return (
    <footer className="mt-16 border-t border-black/5 dark:border-white/10">
      <div className="container py-8 text-sm flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-between">
        <p className="opacity-70">
          © {new Date().getFullYear()} Inkline. Be kind. Write often.
        </p>
        <nav className="flex gap-4">
          <Link to="/feed" className="hover:underline">
            Feed
          </Link>
          {user ? (
            <>
              <Link to="/notes" className="hover:underline">
                My Notes
              </Link>
              <Link to="/friends" className="hover:underline">
                Friends
              </Link>
            </>
          ) : null}
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
