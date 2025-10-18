export const CheckIcon = (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
        <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
    </svg>
);

export const UserMinusIcon = (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
        <path fill="currentColor" d="M15 12c2.76 0 5-2.24 5-5S17.76 2 15 2s-5 2.24-5 5 2.24 5 5 5zM1 20c0-3.31 6.69-5 10-5 1.09 0 2.34.13 3.59.36A7.98 7.98 0 0 0 9 22H1v-2zm14 0v-2h8v2h-8z" />
    </svg>
);

export const BanIcon = (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
        <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm5.65 14.35A8 8 0 0 1 7.65 4.35l10 10zM4.35 7.65l10 10A8 8 0 0 1 4.35 7.65z" />
    </svg>
);

export const UndoIcon = (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
        <path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6a6 6 0 0 1-6 6H6v2h6a8 8 0 1 0 0-16z" />
    </svg>
);

export function PlusIcon(props) {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
            <path fill="currentColor" d="M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2h5z" />
        </svg>
    );
}

export function SpinnerIcon(props) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            className={`animate-spin ${props.className || ""}`}
            style={{ transformOrigin: "center" }}
        >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
            <path d="M12 2 a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" fill="none" />
        </svg>
    );
}

export function ProfileIcon(props) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" {...props}>
            <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
        </svg>
    );
}

export function PencilIcon(props) {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
            <path
                fill="currentColor"
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm14.71-9.04c.39-.39.39-1.02 0-1.41l-1.51-1.51a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.99-1.66Z"
            />
        </svg>
    );
}

export function TrashIcon(props) {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
            <path
                fill="currentColor"
                d="M9 3h6v2h5v2H4V5h5V3Zm1 6h2v8h-2V9Zm4 0h2v8h-2V9ZM6 7h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z"
            />
        </svg>
    );
}

export function Chip({ children }) {
    return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[hsl(var(--card))] border border-black/5 dark:border-white/10">
            {children}
        </span>
    );
}