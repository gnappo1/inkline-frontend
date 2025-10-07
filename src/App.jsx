import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import Sidebar from "./routes/sidebar.jsx";
import Footer from "./routes/footer.jsx";
import Navbar from "./routes/Navbar.jsx";

function App() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => setOpen(false), [loc.pathname]);
  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.08] dark:opacity-[0.12]">
        <div className="absolute -top-20 -left-24 w-[45rem] h-[45rem] rounded-full blur-3xl grad-brand" />
        <div className="absolute -bottom-28 -right-28 w-[40rem] h-[40rem] rounded-full blur-3xl grad-accent" />
      </div>

      <Navbar onOpen={onOpen} onClose={onClose} />

      <Sidebar open={open} onClose={onClose} />

      <main className="container py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
