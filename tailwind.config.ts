import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          1: "#ffffff",
          2: "#f8fafc",
          3: "#f2f5fa",
        },
        ink: {
          1: "#0f172a",
          2: "#475569",
          3: "#64748b",
          hint: "#94a3b8",
        },
        line: {
          1: "rgba(15,23,42,0.08)",
          2: "rgba(15,23,42,0.14)",
        },
        brand: {
          blue: "#2563eb",
          "blue-bg": "#eff6ff",
          "blue-tx": "#1d4ed8",
        },
        ok: { DEFAULT: "#059669", bg: "#ecfdf5", tx: "#047857" },
        warn: { DEFAULT: "#d97706", bg: "#fff7ed", tx: "#b45309" },
        danger: { DEFAULT: "#dc2626", bg: "#fef2f2", tx: "#b91c1c" },
        accent: {
          purple: "#5b4ce6",
          "purple-bg": "#f3f0ff",
          "purple-tx": "#4338ca",
          pink: "#db2777",
          "pink-bg": "#fdf2f8",
          "pink-tx": "#be185d",
          teal: "#0f766e",
          "teal-bg": "#ecfeff",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "sans-serif"],
      },
      fontSize: {
        xs: ["11px", { lineHeight: "1.4" }],
        sm: ["12px", { lineHeight: "1.4" }],
        base: ["13px", { lineHeight: "1.45" }],
        md: ["14px", { lineHeight: "1.45" }],
        lg: ["16px", { lineHeight: "1.5" }],
        xl: ["18px", { lineHeight: "1.4" }],
        "2xl": ["22px", { lineHeight: "1.3" }],
        display: ["30px", { lineHeight: "1.2" }],
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        lg: "18px",
        xl: "20px",
      },
      boxShadow: {
        sm: "0 8px 24px rgba(15,23,42,0.06)",
        md: "0 16px 40px rgba(15,23,42,0.08)",
        lg: "0 14px 32px rgba(15,23,42,0.12)",
        xl: "0 20px 60px rgba(15,23,42,0.16)",
        logo: "0 6px 14px rgba(79,123,247,0.32), inset 0 1px 0 rgba(255,255,255,0.18)",
        "nav-active": "inset 0 0 0 1px rgba(37,99,235,0.14), 0 8px 24px rgba(15,23,42,0.06)",
      },
    },
  },
  plugins: [],
}

export default config
