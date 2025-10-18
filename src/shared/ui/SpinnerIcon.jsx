
export default function SpinnerIcon(props) {
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