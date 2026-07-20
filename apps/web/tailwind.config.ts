// Purpose: Define the DiscoveryOS dark-only design tokens from the Stitch source.

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0e14",
        surface: "#0d1117",
        "surface-dim": "#0a0e14",
        "surface-bright": "#36393f",
        "surface-container-lowest": "#060a10",
        "surface-container-low": "#131820",
        "surface-container": "#1a1f2b",
        "surface-container-high": "#242a36",
        "surface-container-highest": "#2e3440",
        "on-surface": "#e4e8f0",
        "on-surface-variant": "#b0b8cc",
        outline: "#6b7394",
        "outline-variant": "#3a4158",
        primary: "#adc6ff",
        "on-primary": "#002e6a",
        "primary-container": "#4d8eff",
        "on-primary-container": "#ffffff",
        secondary: "#c4b5fd",
        "secondary-container": "#4c3d8f",
        tertiary: "#7dd3fc",
        "tertiary-container": "#0e7490",
        accent: {
          cyan: "#22d3ee",
          purple: "#a78bfa",
          amber: "#fbbf24",
          emerald: "#34d399",
          rose: "#fb7185",
        },
        glass: {
          bg: "rgba(15, 20, 30, 0.6)",
          border: "rgba(255, 255, 255, 0.08)",
          "border-hover": "rgba(173, 198, 255, 0.2)",
          highlight: "rgba(255, 255, 255, 0.04)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-geist)", "Geist", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Geist Mono", "monospace"],
      },
      maxWidth: {
        "container-max": "1440px",
      },
      spacing: {
        margin: "40px",
        gutter: "24px",
      },
      boxShadow: {
        ambient: "0 20px 50px rgba(0, 0, 0, 0.5)",
        "glow-sm": "0 0 15px rgba(173, 198, 255, 0.1)",
        "glow-md": "0 0 30px rgba(173, 198, 255, 0.15)",
        "glow-lg": "0 0 60px rgba(173, 198, 255, 0.2)",
        "glow-primary": "0 0 20px rgba(173, 198, 255, 0.25), 0 0 60px rgba(173, 198, 255, 0.1)",
        "glow-cyan": "0 0 20px rgba(34, 211, 238, 0.2), 0 0 60px rgba(34, 211, 238, 0.08)",
        "glow-purple": "0 0 20px rgba(167, 139, 250, 0.2), 0 0 60px rgba(167, 139, 250, 0.08)",
        "inner-glow": "inset 0 1px 0 rgba(255, 255, 255, 0.06), inset 0 0 20px rgba(173, 198, 255, 0.03)",
        "card-hover": "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(173, 198, 255, 0.08)",
      },
      backgroundImage: {
        "dot-grid": "radial-gradient(circle at 1px 1px, rgba(255,255,255,.12) 1px, transparent 0)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
      },
      animation: {
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "orbit-spin": "orbit-spin 20s linear infinite",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "orbit-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
