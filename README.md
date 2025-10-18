# Inkline Frontend

A modern React client for **Inkline** — write notes, publish to a public feed, and connect with friends. Built for speed, clarity, and a delightful feel (subtle motion, friction scroll, and light/dark themes). Pairs with the Rails JSON:API backend.


## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Environment](#environment)
- [Project Structure](#project-structure)
- [Routing & Protection](#routing--protection)
- [Data Layer (React Query)](#data-layer-react-query)
- [API Conventions (Rails JSONAPI)](#api-conventions-rails-jsonapi)
- [Forms & Validation](#forms--validation)
- [Styling & Theming](#styling--theming)
- [Accessibility](#accessibility)
- [Production Build & Deploy](#production-build--deploy)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)



## ✨ Features

* **Routing & Layouts**: Global layout (App) with navigational chrome (Navbar/Sidebar/Footer). Auth-only branches via RequireAuth.
* **Auth**: Session-based auth against Rails (/login, /signup, /me, /logout). Context provider persists session.
* **Notes**: Public feed (keyset pagination), personal notes (CRUD), rich editor (TipTap). Optimistic-ish UX with cache invalidations.
* **Friendships**: Search people, send/accept/reject/cancel/unfriend/block. Single index backing all states.
* **Profile**: Update first/last/email; optional password change gated by current password. Summary counts (notes, friends).
* **Styling**: Tailwind CSS with design tokens; clean cards; icon primitives.
* **Motion**: Framer Motion micro-interactions (cards, chips) + custom scroll friction.
* **Validation**: Formik + Yup mirroring backend rules.



## 🛠️ Tech Stack

* **Build/Dev**: Vite
* **Framework**: React 19
* **Router**: `react-router` v7
* **Data**: `@tanstack/react-query`
* **Forms**: `formik` + `yup`
* **Editor**: `@tiptap/react` + `@tiptap/starter-kit`
* **Styling**: Tailwind CSS (+ PostCSS/Autoprefixer)
* **Animation**: `framer-motion`
* **Icons**: lucide-react (plus local SVG primitives)



## 📦 Getting Started

```bash
# clone, then
npm i        # or: yarn
npm run dev      # start Vite dev server
```

**Defaults:**

* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:3000` (Rails)

Be sure the Rails app has **CORS enabled** and **cookie sessions** configured (`ActionController::API` + `session_store :cookie_store` + CORS `origins` to `http://localhost:5173` or `*` while developing).

> If you see CORS or cookie issues, confirm:
>
> * `credentials: true` when needed on the backend
> * Frontend fetch uses `credentials: 'include'` for session endpoints
> * `SameSite` is compatible with your origin during local dev



## 🔧 Environment

Create `.env` (or `.env.local`) at the project root to centralize API endpoints:

```bash
VITE_API_BASE=http://localhost:3000
```

Use it in code:

```js
// src/api/client.js
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
```



## 📁 Project Structure

```
inkline-frontend/
 |- src/
    ├─ app/                      # app chrome and global wiring
    │  ├─ App.jsx
    │  ├─ index.css              # Tailwind layers + tokens
    │  └─ navigation/            # nav UI shared across routes
    │     ├─ Navbar.jsx
    │     ├─ Sidebar.jsx
    │     └─ Footer.jsx
    ├─ features/
    │  ├─ auth/
    │  │  ├─ components/
    │  │  │  ├─ AuthProvider.jsx
    │  │  │  ├─ RequireAuth.jsx
    │  │  │  └─ RequireGuest.jsx
    │  │  ├─ hooks/useAuth.js
    │  │  └─ routes/AuthPage.jsx
    │  ├─ friendships/
    │  │  ├─ components/{FriendshipCard.jsx,PeopleSearch.jsx}
    │  │  └─ routes/{FriendsContainer.jsx,FriendPublicNotes.jsx}
    │  ├─ notes/
    │  │  ├─ components/{CategoryInput.jsx,EditNoteModal.jsx,NoteCard.jsx,RichEditor.jsx}
    │  │  └─ routes/{Feed.jsx,NewNoteForm.jsx,NotesContainer.jsx}
    │  └─ profile/
    │     ├─ components/         # (reserved)
    │     └─ routes/Profile.jsx
    ├─ routes/
    │  └─ home.jsx               # landing/hero
    ├─ shared/
    │  ├─ assets/                # static assets (logos, svgs)
    │  ├─ hooks/{useScrollFriction.js,useSpeech.js}
    │  ├─ lib/{api.js,jsonapi.js}
    │  ├─ notifications/ToastProvider.jsx
    │  ├─ ui/                    # small UI+icon primitives
    │  │  ├─ AnimatedHeadline.jsx
    │  │  ├─ AnimatedWaveText.jsx
    │  │  ├─ Modal.jsx
    │  │  ├─ ConfirmDialog.jsx
    │  │  ├─ PublicToggle.jsx
    │  │  └─ *Icon.jsx (Ban, Check, Chip, Pencil, Plus, Profile, Spinner, Trash, Undo, UserMinus)
    │  └─ widgets/               # compound widgets
    │     ├─ AccountMenu.jsx     # avatar dropdown w/ Profile, Friends, My Notes, Logout
    │     ├─ LanguageMenu.jsx
    │     └─ ThemeSlider.jsx
    ├─ main.jsx                  # router + providers
    └─ index.html
├─ public/
├─ index.html
├─ package.json
└─ tailwind.config.js
└─ vite.config.js
└─ eslint.config.js
└─ .gitignore
```
**Why this shape?**

* **features**/ keeps each domain (auth/notes/friendships/profile) self-contained.
* **shared/** holds primitives and cross-cutting utilities.
* **app/** owns shell/layout navigation.
* **Route** screens live either inside features/*/routes or in routes/ for general pages.



## 🧭 Routing & Protection

`App` is the global layout (header/sidebar/footer + `<Outlet/>`). Protected routes are nested under a `RequireAuth` element.

```jsx
// src/main.jsx (router snippet)
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
```

`RequireAuth` and `RequireGuest` use `useAuth()` from `./auth/authProvider.jsx`. On refresh, the provider revalidates session via `/me`.



## 🔐 Auth Flow

* **Login/Signup**: POST to Rails, which sets a cookie session.
* **Persist**: On app mount, the provider calls `/me`. If ok → `user` is set in context.
* **Guard**: Protected routes render only if `user` exists; else navigate to `/login` (preserving `from` location).
* **Logout**: DELETE `/logout`, then invalidate cache and context.

> All auth requests use `fetch(..., { credentials: 'include' })`.



## Data Layer (React Query)

* **Query keys** are scoped (e.g., ["feed", params], ["notes"], ["friendships"], ["me"]).
* **Mutations** invalidate affected caches (e.g., sending a request invalidates friendships and the PeopleSearch query).
* **Cursor-based lists** keep getNextPageParam = last.meta.next_cursor.

**Example**:

```javascript
// feed
const {
  data,
  fetchNextPage,
  hasNextPage,
} = useInfiniteQuery({
  queryKey: ["feed", { user_id }],
  queryFn: ({ pageParam }) =>
    api.feed({ user_id, limit: 20, ...(pageParam && { before: pageParam }) }),
  getNextPageParam: (last) => last?.next_cursor || undefined,
});
```




## 📡 API Conventions (JSON:API)

The Rails backend uses **jsonapi-serializer**. Responses are shaped like:

```json
{
  "data": { "type": "notes", "id": "41", "attributes": { ... }, "relationships": { ... }},
  "included": [ ... ],
  "meta": { "next_cursor": "...", "prev_cursor": "..." }
}
```

Client helpers in `src/api/client.js` can:

* unwrap `data`/`included`
* build maps by `[type,id]`
* surface `meta` cursors

**Keyset pagination**: the feed (and friendships) accept `?before=` and `?after=` cursors. The client stores the last cursor and requests the next page without using offsets.



## 📝 Forms & Validation

* **Formik + Yup** mirror backend rules:

  * `first_name`, `last_name`: required, 1..50 chars (squish)
  * `email`: required, max 320, valid format (normalized lowercase, no spaces)
  * `password`: 8..25

Formik status fields surface backend errors (`{ errors: [...] }` or `{ error: "..." }`).



## 🌈 Styling Theming (Tailwind + Tokens)

* Tailwind with a small set of CSS variables (HSL tokens) for **light/dark** modes.
* Most components use minimal utility classes; anything reusable lives in shared/ui.
* **ThemeSlider** + **PublicToggle** are examples of tiny, accessible UI controls.



## 🔍 Accessibility

* Respects `prefers-reduced-motion`.
* Focus outlines preserved (`focus-visible` utilities).
* Labels associated with inputs; buttons have `aria-label` where needed.
* Keyboard navigation for sidebar / menu.



## Production Build & Deploy

```bash
npm run build   # outputs to dist/
npm run preview
```

SPA hosting must serve index.html for unknown routes (history API fallback).

**Backend notes for production:**

* Rails API should be on HTTPS with proper CORS origins and cookie settings (SameSite=None; Secure when cross-site).
* If you migrate the backend DB to **PostgreSQL**, no frontend changes are required—only the API base URL and CORS/cookies must remain correct.



## 🧰 Troubleshooting

**CORS / Cookies not sent**

* Ensure backend CORS allows your frontend origin and methods.
* Use `credentials: 'include'` in fetch for session endpoints.
* Check `SameSite`/`Secure` flags in the cookie for your environment.

**Router 404 on refresh**

* Configure hosting to serve `index.html` for unknown routes (SPA fallback).

**Animations feel too fast/slow**

* Tweak `DURATION`, `STAGGER` in the hero’s `AnimatedHeadline`.
* Reduce parallax strength in `useScrollFriction`.

**Feed shows wrong authors**

* Confirm api.feed({ user_id }) is actually supported by the backend route or use a dedicated /users/:id/public_notes endpoint.

**Validation mismatch**

*Keep Yup rules in sync with Rails model validations and strong params.



## 🗺️ Roadmap

* Category filters on feed + personal notes
* Avatars & profile cards
* Optimistic updates for friendship ops
* Search-as-you-type across more lists
* Tests (RTL + MSW), CI pipeline


