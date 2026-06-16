import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        brand: {
          bg: "#0a0f1a",
          primary: "#f1efe8",
          muted: "#888780",
          "muted-dark": "#5F5E5A",
          accent: "#378ADD",
          teal: "#5DCAA5",
        },
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        "ping-slow": {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        "marquee-reverse": "marquee-reverse 35s linear infinite",
        "ping-slow": "ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "pulse-slow": "pulse-slow 2s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
