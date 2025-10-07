/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      colors: {
        // HSL tokens (used in index.css)
        bg: "hsl(var(--bg))",
        fg: "hsl(var(--fg))",
        card: "hsl(var(--card))",
        mute: "hsl(var(--mute))",
        brand: "hsl(var(--brand))",
        ring: "hsl(var(--ring))",
      },
      fontSize: {
        // nice fluid base for body text
        fluid: "clamp(1rem, 1vw + 0.9rem, 1.125rem)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      boxShadow: {
        soft: "0 6px 20px rgba(0,0,0,.06)",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(.22,.61,.36,1)",
      },
    },
  },
  plugins: [],
};
