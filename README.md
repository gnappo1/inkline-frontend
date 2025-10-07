# Inkline Frontend

A modern React client for **Inkline** — write notes, publish to a public feed, and connect with friends. Built for speed, clarity, and a delightful feel (parallax/friction scroll, staged hero headline, and light/dark themes). Pairs with the Rails JSON:API backend.

---

## ✨ Features

* **Routing & Layouts**: React Router v7 with a global layout (`App`) and a protected branch (`RequireAuth`).
* **Data Layer**: TanStack Query for caching, mutations, retries, and request status handling.
* **Auth**: Login / Signup / Logout with server sessions; refresh persists user via `/me`.
* **Notes**: Public feed (keyset pagination), personal notes (CRUD), rich editor (TipTap).
* **Friendships**: Send / accept / cancel / unfriend; unified index with both directions.
* **Styling**: Tailwind CSS with tokenized themes (light/dark) and small utility classes for components.
* **Motion**: Framer Motion micro-interactions (hero, cards, chips).
* **Validation**: Formik + Yup, mirroring backend rules (first/last name, email, password length).

---

## 🛠️ Tech Stack

* **Build/Dev**: Vite
* **Framework**: React 19
* **Router**: `react-router` v7 (imports from `"react-router"`, not `react-router-dom`)
* **Data**: `@tanstack/react-query`
* **Forms**: `formik` + `yup`
* **Editor**: `@tiptap/react` + `@tiptap/starter-kit`
* **Styling**: Tailwind CSS (+ PostCSS/Autoprefixer)
* **Animation**: `framer-motion`

---

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

---

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

---

## 📁 Project Structure

```
inkline-frontend/
├─ src/
│  ├─ api/
│  │  ├─ client.js            # fetch wrapper (JSON:API helpers, credentials)
│  │  └─ endpoints.js         # typed endpoints (notes, auth, friendships, feed)
│  ├─ auth/
│  │  ├─ authProvider.jsx     # useAuth() + session bootstrap (/me)
│  │  └─ requireAuth.jsx      # route guard (wraps protected branch)
│  ├─ components/
│  │  ├─ editor/              # TipTap editor setup (extensions, toolbar)
│  │  └─ ui/                  # small UI bits (ThemeToggle, buttons, inputs)
│  ├─ hooks/
│  │  ├─ useScrollFriction.js # parallax/friction utilities
│  │  └─ useAuth.js           # auth actions (login/signup/logout)
│  ├─ routes/
│  │  ├─ home.jsx             # animated hero + sections
│  │  ├─ auth.jsx             # login/signup in one page (mode toggle)
│  │  ├─ feed.jsx             # public feed (cursor pagination)
│  │  ├─ notes/
│  │  │  ├─ index.jsx         # my notes
│  │  │  └─ show.jsx          # single note view
│  │  ├─ friends/
│  │  │  └─ index.jsx         # unified friendships
│  │  ├─ sidebar.jsx          # mobile/sidebar navigation
│  │  └─ footer.jsx
│  ├─ App.jsx                 # header/footer/sidebar frame + <Outlet/>
│  ├─ main.jsx                # router & providers
│  └─ index.css               # Tailwind layers + CSS tokens
├─ public/
├─ index.html
├─ package.json
└─ tailwind.config.js
```

---

## 🧭 Routing & Protection

`App` is the global layout (header/sidebar/footer + `<Outlet/>`). Protected routes are nested under a `RequireAuth` element.

```jsx
// src/main.jsx (router snippet)
const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/",       element: <Home /> },
      { path: "/login",  element: <AuthPage /> },
      { path: "/signup", element: <AuthPage /> },
      { path: "/feed",   element: <Feed /> },

      // Protected subtree:
      {
        element: <RequireAuth />, // checks useAuth(); redirects to /login if needed
        children: [
          { path: "/notes",     element: <NotesIndex /> },
          { path: "/notes/:id", element: <NoteShow /> },
          { path: "/friends",   element: <Friends /> },
        ],
      },
    ],
  },
]);
```

`RequireAuth` uses `useAuth()` from `./auth/authProvider.jsx`. On refresh, the provider revalidates session via `/me`.

---

## 🔐 Auth Flow

* **Login/Signup**: POST to Rails, which sets a cookie session.
* **Persist**: On app mount, the provider calls `/me`. If ok → `user` is set in context.
* **Guard**: Protected routes render only if `user` exists; else navigate to `/login` (preserving `from` location).
* **Logout**: DELETE `/logout`, then invalidate cache and context.

> All auth requests use `fetch(..., { credentials: 'include' })`.

---

## 🌈 Theming (Tailwind + Tokens)

Theme variables in `:root` and `.dark` control colors app-wide. Example “Sunset Graphite”:

```css
:root {
  --bg:    20 25% 98%;
  --fg:    230 20% 16%;
  --card:  0 0% 100%;
  --mute:  230 10% 45%;
  --brand: 12 85% 60%;  /* coral */
  --accent:246 72% 55%; /* indigo */
}

.dark {
  --bg:    220 22% 12%;
  --fg:    210 18% 95%;
  --card:  220 20% 14%;
  --mute:  215 10% 66%;
  --brand: 12 90% 66%;
  --accent:248 75% 66%;
}
```

Use in classes:

```html
<div class="bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
  <button class="bg-[hsl(var(--brand))] text-white">...</button>
</div>
```

A small **ThemeToggle** component toggles `document.documentElement.classList.toggle('dark')` and can persist preference (e.g., `localStorage`).

---

## 🎞️ Motion & Interactions

* **Hero headline**: staged “Write / Share / Connect” (Framer Motion `staggerChildren`).
* **Parallax**: `useScrollFriction` provides smoothed transforms on scroll.
* **Cards/Chips**: subtle hover lifts; chips have **solid backgrounds** so they remain readable over the hero image.

All motion respects `prefers-reduced-motion`.

---

## 📝 Forms & Validation

* **Formik + Yup** mirror backend rules:

  * `first_name`, `last_name`: required, 1..50 chars (squish)
  * `email`: required, max 320, valid format (normalized lowercase, no spaces)
  * `password`: 8..25

Formik status fields surface backend errors (`{ errors: [...] }` or `{ error: "..." }`).

---

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

---

## 🔁 React Query

* **Query keys** are namespaced (`["feed", { before }]`, `["me"]`, `["notes"]`).
* **Mutations** invalidate relevant keys (`feed`, `notes`, `friendships`).
* Retries: limited; authentication endpoints usually **no retry**.
* Errors displayed via Formik status or small toasts/snacks.

---

## 🔍 Accessibility

* Respects `prefers-reduced-motion`.
* Focus outlines preserved (`focus-visible` utilities).
* Labels associated with inputs; buttons have `aria-label` where needed.
* Keyboard navigation for sidebar / menu.

---

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

---

## 🗺️ Roadmap

* Categories UI (filters on feed & my notes)
* Profile cards / avatars
* Optimistic updates for friendships
* Skeleton states + prefetch-on-hover
* Editor enhancements (links, mentions, code)
* Tests (RTL + MSW), CI setup

