import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "var(--bg-base)",
        surface: "var(--bg-surface)",
        parchment: "var(--bg-parchment)",
        warm: "var(--bg-warm)",
        dark: "var(--bg-dark)",
        ink: "var(--bg-ink)",
        accent: {
          DEFAULT: "var(--accent-primary)",
          hover: "var(--accent-hover)",
          tan: "var(--accent-tan)",
          soft: "var(--accent-soft)",
        },
        fg: "var(--text-main)",
        muted: "var(--text-muted)",
        subtle: "var(--text-subtle)",
        light: "var(--text-light)",
        ondark: "var(--text-on-dark)",
      },
      fontFamily: {
        heading: ["Merriweather", "Georgia", "serif"],
        body: ["Lato", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
        ui: ["Inter", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        "tight-x": "-0.02em",
        "wide-x": "0.15em",
        "wider-x": "0.3em",
        "widest-x": "0.6em",
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "48px",
        "3xl": "64px",
      },
      boxShadow: {
        sm: "0 2px 4px rgba(0,0,0,0.05)",
        md: "0 10px 30px rgba(0,0,0,0.08)",
        lg: "0 20px 40px rgba(0,0,0,0.12)",
        xl: "0 40px 80px rgba(0,0,0,0.12)",
        book: "0 30px 60px rgba(0,0,0,0.15)",
        btn: "0 4px 12px rgba(188,116,78,0.25)",
        "btn-hover": "0 6px 16px rgba(188,116,78,0.35)",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.25, 0.8, 0.25, 1)",
        levitate: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        reading: "640px",
        narrative: "720px",
        editorial: "800px",
      },
    },
  },
  plugins: [],
};

export default config;
