import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#002147",
          "navy-light": "#0A3A6B",
          sage: "#9DC183",
          "sage-light": "#E8F0E0",
          "sage-bg": "#F2F7ED",
          sand: "#F7E9C7",
          "sand-light": "#FBF4E4",
          charcoal: "#37474F",
          gray: "#7B8A92",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
