import { lazy, StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import AuthProvider from "./auth/authProvider.jsx";
import RequireAuth from "./auth/RequireAuth.jsx";
import App from "./App.jsx";
import "./index.css";

const qc = new QueryClient();

// Lazy route loaders
const Home = lazy(() => import("./routes/home.jsx"));
const AuthPage = lazy(() => import("./routes/auth.jsx"));
const Feed = lazy(() => import("./routes/feed.jsx"));
const NotesIndex = lazy(() => import("./routes/notes/index.jsx"));
const NoteShow = lazy(() => import("./routes/notes/show.jsx"));
const Friends = lazy(() => import("./routes/friends/index.jsx"));

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <AuthPage /> },
      { path: "/signup", element: <AuthPage /> },
      { path: "/feed", element: <Feed /> },
      {
        element: <RequireAuth />,
        children: [
          { path: "/notes", element: <NotesIndex /> },
          { path: "/notes/:id", element: <NoteShow /> },
          { path: "/friends", element: <Friends /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <Suspense fallback={<div className="container p-8">Loading…</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);