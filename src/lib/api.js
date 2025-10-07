const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request(path, opts = {}) {
    const res = await fetch(API + path, {
        credentials: "include",
        headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
        ...opts,
    });
    if (!res.ok) {
        let err;
        try { err = await res.json(); } catch { err = { error: res.statusText }; }
        throw Object.assign(new Error(err.error || "Request failed"), { status: res.status, details: err });
    }
    return res.status === 204 ? null : res.json();
}

export const api = {
    me: () => request("/me"),
    login: (email, password) => request("/login", { method: "POST", body: JSON.stringify({ user: { email, password } }) }),
    signup: (u) => request("/signup", { method: "POST", body: JSON.stringify({ user: u }) }),
    logout: () => request("/logout", { method: "DELETE" }),
    myNotes: () => request("/notes"),
    note: (id) => request(`/notes/${id}`),
    createNote: (note) => request("/notes", { method: "POST", body: JSON.stringify({ note }) }),
    updateNote: (id, note) => request(`/notes/${id}`, { method: "PATCH", body: JSON.stringify({ note }) }),
    deleteNote: (id) => request(`/notes/${id}`, { method: "DELETE" }),
    feed: (params) => request("/feed/public" + (params ? `?${new URLSearchParams(params)}` : "")),
    friendships: (params) => request("/friendships" + (params ? `?${new URLSearchParams(params)}` : "")),
    createFriendship: (receiver_id) => request("/friendships", { method: "POST", body: JSON.stringify({ receiver_id }) }),
    actFriendship: (id, action) => request(`/friendships/${id}`, { method: "PATCH", body: JSON.stringify({ action }) }),
    deleteFriendship: (id) => request(`/friendships/${id}`, { method: "DELETE" }),
    myFriends: (params) => request("/me/friends" + (params ? `?${new URLSearchParams(params)}` : "")),
};
