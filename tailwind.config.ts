import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
          nova: ['Nova Square', 'serif']
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        maincolor: "var(--maincolor)"
      },
    },
  },
  plugins: [],
} satisfies Config;
