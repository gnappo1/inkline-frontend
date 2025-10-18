import { lazy, StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import AuthProvider from "./auth/authProvider.jsx";
import RequireAuth from "./auth/RequireAuth.jsx";
import App from "./App.jsx";
import "./index.css";
import ToastProvider from "./notifications/ToastProvider.jsx";
import NewNoteForm from "./routes/NewNoteForm.jsx";
import Profile from "./routes/Profile.jsx";
import RequireGuest from "./auth/RequireGuest.jsx";
import FriendPublicNotes from "./routes/FriendPublicNotes.jsx";

const qc = new QueryClient();

const Home = lazy(() => import("./routes/home.jsx"));
const AuthPage = lazy(() => import("./routes/auth.jsx"));
const Feed = lazy(() => import("./routes/feed.jsx"));
const NotesIndex = lazy(() => import("./routes/notes/NotesContainer.jsx"));
const Friends = lazy(() => import("./routes/friends/FriendsContainer.jsx"));

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/feed", element: <Feed /> },
      {
        element: <RequireGuest />,
        children: [
          {path: "/login", element: <AuthPage /> },
          { path: "/signup", element: <AuthPage /> },
        ]
      },
      {
        element: <RequireAuth />,
        children: [
          { path: "/notes", element: <NotesIndex /> },
          { path: "/notes/new", element: <NewNoteForm /> },
          { path: "/users/:id", element: <FriendPublicNotes /> },
          { path: "/friends", element: <Friends /> },
          { path: "/profile", element: <Profile /> },
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
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);