import { lazy, StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import AuthProvider from "./features/auth/components/AuthProvider.jsx";
import RequireAuth from "./features/auth/components/RequireAuth.jsx";
import App from "./app/App.jsx";
import "./app/index.css";
import ToastProvider from "./shared/notifications/ToastProvider.jsx";
import NewNoteForm from "./features/notes/routes/NewNoteForm.jsx";
import Profile from "./features/profile/routes/Profile.jsx";
import RequireGuest from "./features/auth/components/RequireGuest.jsx";
import FriendPublicNotes from "./features/friendships/routes/FriendPublicNotes.jsx";

const qc = new QueryClient();

const Home = lazy(() => import("./routes/home.jsx"));
const AuthPage = lazy(() => import("./features/auth/routes/AuthPage.jsx"));
const Feed = lazy(() => import("./features/notes/routes/Feed.jsx"));
const NotesIndex = lazy(() => import("./features/notes/routes/NotesContainer.jsx"));
const Friends = lazy(() => import("./features/friendships/routes/FriendsContainer.jsx"));

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/feed", element: <Feed /> },
      {
        element: <RequireGuest />,
        children: [
          { path: "/login", element: <AuthPage /> },
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