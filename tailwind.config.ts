import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Near Black backgrounds
        primary: {
          DEFAULT: "#1F1F1F",
          dark: "#191919",
        },
        // Primary Accent - Teal
        accent: {
          DEFAULT: "#2383E2",
          hover: "#1a6fc4",
        },
        // Secondary Accents
        secondary: {
          teal: "#014379",
          cyan: "#448361",
        },
        // System Colors
        success: "#27C93F",
        warning: "#FFBD2E",
        error: "#FF5F56",
        // Text Colors
        text: {
          primary: "#2F2F2F",
          secondary: "#A0A0A0",
        },
        // Surface colors for cards/containers
        surface: {
          DEFAULT: "#2A2A2A",
          light: "#3A3A3A",
        },
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
        mono: ["ui-monospace", "Consolas", "monospace"],
      },
      fontSize: {
        display: ["48px", { lineHeight: "1.1", fontWeight: "700" }],
        h1: ["28px", { lineHeight: "1.2", fontWeight: "600" }],
        h2: ["18px", { lineHeight: "1.3", fontWeight: "600" }],
        h3: ["16px", { lineHeight: "1.4", fontWeight: "500" }],
        body: ["14px", { lineHeight: "1.5" }],
        "body-sm": ["12px", { lineHeight: "1.5" }],
      },
      spacing: {
        "space-1": "4px",
        "space-2": "8px",
        "space-3": "12px",
        "space-4": "16px",
        "space-5": "20px",
        "space-6": "24px",
        "space-8": "32px",
        "space-10": "40px",
        "space-12": "48px",
        "space-16": "64px",
      },
      maxWidth: {
        container: "1280px",
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
