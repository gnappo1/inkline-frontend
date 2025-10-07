// src/lib/jsonapi.js

// Optional: index helper for old JSON:API included
function indexIncluded(included = []) {
    const m = new Map();
    for (const r of included) {
        const key = `${r.type}:${r.id}`;
        m.set(key, r.attributes || {});
    }
    return m;
}

/**
 * Accepts either:
 * 1) Flattened payload:
 *    { data:[{id,type,attributes:{..., author:{}, categories:[{id,name}]}}], next_cursor, prev_cursor }
 * 2) Classic JSON:API with relationships + included:
 *    { data:[{id,type,attributes:{...},relationships:{user:{data},categories:{data}}}], included:[...], meta:{...} }
 */
export function flattenNotes(json) {
    if (!json) return { data: [], next_cursor: null, prev_cursor: null };

    const next_cursor = json?.meta?.next_cursor ?? json?.next_cursor ?? null;
    const prev_cursor = json?.meta?.prev_cursor ?? json?.prev_cursor ?? null;
    const arr = Array.isArray(json.data) ? json.data : [];

    // Case 1: flattened — detect author on the first item
    if (arr[0]?.attributes?.author || arr[0]?.author) {
        const notes = arr.map((r) => {
            const a = r.attributes ?? {};
            const author = a.author || r.author || null;
            const categories = a.categories || r.categories || [];
            return { id: r.id, ...a, author, categories };
        });
        return { data: notes, next_cursor, prev_cursor };
    }

    // Case 2: classic JSON:API
    const inc = indexIncluded(json.included);
    const notes = arr
        .filter((r) => r.type === "notes")
        .map((r) => {
            const attrs = r.attributes || {};

            let author = null;
            const relUser = r.relationships?.user?.data;
            if (relUser) {
                const ua = inc.get(`${relUser.type}:${relUser.id}`);
                if (ua) author = { id: relUser.id, ...ua };
            }

            let categories = [];
            const relCats = r.relationships?.categories?.data || [];
            if (relCats.length) {
                categories = relCats
                    .map(({ type, id }) => {
                        const ca = inc.get(`${type}:${id}`);
                        return ca ? { id, ...ca } : null;
                    })
                    .filter(Boolean);
            }

            return { id: r.id, ...attrs, author, categories };
        });

    return { data: notes, next_cursor, prev_cursor };
}
  