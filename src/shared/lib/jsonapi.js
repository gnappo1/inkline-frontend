
export function flattenNotes(json, currentUser) {
    if (!json) return { data: [], next_cursor: null, prev_cursor: null };

    if (Array.isArray(json.data) && !json.data[0]?.attributes) {
        return {
            data: json.data.map((n) => ({
                ...n,
                author: n.author || deriveSelf(currentUser),
                categories: Array.isArray(n.categories) ? n.categories : [],
            })),
            next_cursor: json.next_cursor ?? json.meta?.next_cursor ?? null,
            prev_cursor: json.prev_cursor ?? json.meta?.prev_cursor ?? null,
        };
    }

    const list = Array.isArray(json.data) ? json.data : [];
    const flat = list.map((r) => {
        const a = r.attributes || {};
        return {
            id: r.id,
            title: a.title,
            body: a.body,
            public: a.public,
            created_at: a.created_at,
            updated_at: a.updated_at,
            author: a.author || deriveSelf(currentUser),
            categories: Array.isArray(a.categories) ? a.categories : [],
        };
    });

    return {
        data: flat,
        next_cursor: json.next_cursor ?? json.meta?.next_cursor ?? null,
        prev_cursor: json.prev_cursor ?? json.meta?.prev_cursor ?? null,
    };
}

function deriveSelf(currentUser) {
    const u = currentUser?.data || currentUser || {};
    return {
        id: u.id,
        first_name: u.first_name,
        last_name: u.last_name,
    };
}
