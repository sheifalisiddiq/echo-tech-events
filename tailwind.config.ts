import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#05070a", electric: "#246BFD", ice: "#eaf1ff" },
      fontFamily: {
        display: ["Space Grotesk", "Arial Black", "sans-serif"],
        sans: ["Inter", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
