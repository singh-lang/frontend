import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import animate from "tailwindcss-animate";
import scrollbar from "tailwind-scrollbar";
import scrollbarHide from "tailwind-scrollbar-hide";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ Add if you use src/
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "site-primary": "#597884",
        "dark-base": "#1A1A1A",
        "site-secondary": "#597884",
        "site-grey": "#4E4E4E",
        "site-accent": "#09B4C6",
        "slate-teal": "#597884",
        "soft-grey": "#D3D3D3",
        "off-white": "#F5F5F5",

        // Neutral Colors
        grey: "#666666",

        // State Colors
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      spacing: {
        0.5: "0.125rem",
        1: "0.25rem",
        1.5: "0.375rem",
        2: "0.5rem",
        2.5: "0.625rem",
        3: "0.75rem",
        3.5: "0.875rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        7: "1.75rem",
        8: "2rem",
        9: "2.25rem",
        10: "2.5rem",
        11: "2.75rem",
        12: "3rem",
        14: "3.5rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        28: "7rem",
        32: "8rem",
        36: "9rem",
        40: "10rem",
        44: "11rem",
        48: "12rem",
        52: "13rem",
        56: "14rem",
        60: "15rem",
        64: "16rem",
        72: "18rem",
        80: "20rem",
        96: "24rem",
      },
      borderRadius: {
        none: "0",
        sm: "0.5rem",
        DEFAULT: "0.75rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        none: "none",
      },

      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.5" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        xl: ["1.25rem", { lineHeight: "1.5" }],
        "2xl": ["1.5rem", { lineHeight: "1.2" }],
        "3xl": ["1.875rem", { lineHeight: "1.2" }],
        "4xl": ["2.25rem", { lineHeight: "1.2" }],
        "5xl": ["3rem", { lineHeight: "1.2" }],
        "6xl": ["3.75rem", { lineHeight: "1.2" }],
        "7xl": ["4.5rem", { lineHeight: "1.2" }],
        "8xl": ["6rem", { lineHeight: "1.2" }],
        "9xl": ["8rem", { lineHeight: "1.2" }],
      },

      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },

      lineHeight: {
        tight: "1.2",
        normal: "1.5",
        relaxed: "1.75",
      },

      transitionDuration: {
        150: "150ms",
        200: "200ms",
        300: "300ms",
      },

      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    animate,
    scrollbar,
    scrollbarHide,
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-pretty": {
          "scrollbar-width": "thin",
          "scrollbar-color": "rgba(100,100,100,0.3) transparent",
        },
        ".scrollbar-pretty::-webkit-scrollbar": {
          width: "6px",
        },
        ".scrollbar-pretty::-webkit-scrollbar-track": {
          background: "transparent",
        },
        ".scrollbar-pretty::-webkit-scrollbar-thumb": {
          background: "rgba(100,100,100,0.3)",
          "border-radius": "9999px",
          transition: "background 0.2s ease-in-out",
        },
        ".scrollbar-pretty::-webkit-scrollbar-thumb:hover": {
          background: "rgba(100,100,100,0.5)",
        },
      });
    }),
  ],
};

export default config;
