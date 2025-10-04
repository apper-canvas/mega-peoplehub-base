/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1E40AF",
          light: "#3B82F6"
        },
        secondary: {
          DEFAULT: "#475569",
          dark: "#334155",
          light: "#64748B"
        },
        accent: {
          DEFAULT: "#F59E0B",
          dark: "#D97706",
          light: "#FBBF24"
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    },
  },
  plugins: [],
};