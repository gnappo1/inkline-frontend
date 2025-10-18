export default function Chip({ children }) {
    return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[hsl(var(--card))] border border-black/5 dark:border-white/10">
            {children}
        </span>
    );
}