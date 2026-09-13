import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FDFBF7",
        surface: "#FFFFFF",
        card: "#FFFFFF",
        foreground: "#1C1917",
        muted: {
          DEFAULT: "#F5F2EB",
          foreground: "#66615B",
        },
        border: {
          subtle: "#EAE5DC",
          strong: "#D6CEBF",
        },
        // Saffron & Golden Sunlight (Breakfast & Energy)
        saffron: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        },
        // Fresh Emerald & Basil (Lunch & Wholesome Freshness)
        basil: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        // Warm Paprika & Sunset Coral (Dinner & Cozy Warmth)
        paprika: {
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
        },
        tangerine: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          500: "#F97316",
          600: "#EA580C",
        },
        // Electric Lavender / Lilac (Snack & Cravings)
        lavender: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
        },
        ink: "#1C1917",
      },
      fontFamily: {
        display: ["Outfit", "system-ui", "sans-serif"],
        serif: ["Newsreader", "Fraunces", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Outfit", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        brutal: "4px 4px 0px #1C1917",
        "brutal-sm": "2px 2px 0px #1C1917",
        "brutal-xs": "1.5px 1.5px 0px #1C1917",
        "brutal-lg": "6px 6px 0px #1C1917",
        "brutal-hover": "5px 5px 0px #1C1917",
        "brutal-pressed": "1px 1px 0px #1C1917",
        "brutal-dark": "4px 4px 0px #000000",
        "brutal-dark-sm": "2px 2px 0px #000000",
        "brutal-white": "3px 3px 0px rgba(255, 255, 255, 0.2)",
        vibrant: "0 10px 30px -10px rgba(245, 158, 11, 0.15), 0 4px 12px -4px rgba(16, 185, 129, 0.12)",
        "vibrant-lg": "0 20px 40px -15px rgba(245, 158, 11, 0.22), 0 10px 20px -8px rgba(244, 63, 94, 0.15)",
        card: "0 2px 10px -2px rgba(28, 25, 23, 0.05), 0 1px 3px -1px rgba(28, 25, 23, 0.03)",
        glow: "0 0 25px -5px rgba(16, 185, 129, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
