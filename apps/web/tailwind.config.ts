// Purpose: Define the DiscoveryOS dark-only design tokens from the Stitch source.

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#101419",
        surface: "#101419",
        "surface-dim": "#101419",
        "surface-bright": "#36393f",
        "surface-container-lowest": "#0a0e13",
        "surface-container-low": "#181c21",
        "surface-container": "#1c2025",
        "surface-container-high": "#262a30",
        "surface-container-highest": "#31353b",
        "on-surface": "#e0e2ea",
        "on-surface-variant": "#c2c6d6",
        outline: "#8c909f",
        "outline-variant": "#424754",
        primary: "#adc6ff",
        "on-primary": "#002e6a",
        "primary-container": "#4d8eff",
        secondary: "#c0c6db",
        "secondary-container": "#404758",
        tertiary: "#bec7db",
        "tertiary-container": "#8891a4",
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
      },
      backgroundImage: {
        "dot-grid": "radial-gradient(circle at 1px 1px, rgba(255,255,255,.12) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;

