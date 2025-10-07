function PublicToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${
            checked ? "bg-[hsl(var(--brand))]" : "bg-black/20 dark:bg-white/20"
          }`}
      aria-pressed={checked}
      aria-label="Public"
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform
            ${checked ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  );
}

export default PublicToggle;
