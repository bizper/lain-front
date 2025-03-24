import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/subpage/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
          nova: ['Nova Square', 'serif'],
          Monoton: ['Monoton', 'serif']
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        maincolor: "var(--maincolorrgb)"
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
} satisfies Config;
