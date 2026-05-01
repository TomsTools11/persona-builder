import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          0: "#0b0d10",
          1: "#11141a",
          2: "#161a21",
          3: "#1c2129",
          border: "#232830",
          "border-strong": "#2c333d",
        },
        brand: {
          DEFAULT: "#2e9df1",
          hover: "#4eb1ff",
          soft: "rgba(46,157,241,0.14)",
          ring: "rgba(46,157,241,0.32)",
          deep: "#1c5e92",
        },
        fg: {
          primary: "#f4f5f7",
          secondary: "#9aa3af",
          tertiary: "#5f6772",
        },
        success: {
          DEFAULT: "#34d399",
          soft: "rgba(52,211,153,0.12)",
          border: "rgba(52,211,153,0.28)",
        },
        danger: "#ef5e5e",
        warning: "#f59e0b",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "Consolas", "monospace"],
      },
      maxWidth: {
        container: "1100px",
        narrow: "720px",
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
