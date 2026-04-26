/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FDFAF6",
          100: "#FBF7F1",
          200: "#F7F1E8",
          300: "#F1E8DA",
          400: "#E9DCC8",
        },
        ink: {
          900: "#1B1A1A",
          800: "#272525",
          700: "#3A3736",
          600: "#5A5654",
          500: "#7A7572",
          400: "#9A938F",
          300: "#B5AEA9",
          200: "#D4CDC6",
        },
        accent: {
          DEFAULT: "#C9421A",
          dark: "#B0381A",
          light: "#E55A28",
          50: "#FCEFE8",
          100: "#F8DFD0",
        },
        night: {
          950: "#0B0A09",
          900: "#111110",
          800: "#161514",
          700: "#1F1D1B",
          600: "#2A2724",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        widest2: "0.22em",
        widest3: "0.32em",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "104rem",
      },
      fontSize: {
        "10xl": ["10rem", { lineHeight: "0.9" }],
        "12xl": ["13rem", { lineHeight: "0.85" }],
      },
      animation: {
        "marquee": "marquee 40s linear infinite",
        "marquee-slow": "marquee 80s linear infinite",
        "marquee-reverse": "marquee-reverse 40s linear infinite",
        "shimmer": "shimmer 8s linear infinite",
        "blob": "blob 14s ease-in-out infinite",
        "spin-slow": "spin 18s linear infinite",
        "fade-up": "fadeUp 1s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0px,0px) scale(1)" },
          "33%": { transform: "translate(40px,-30px) scale(1.08)" },
          "66%": { transform: "translate(-30px,30px) scale(0.95)" },
        },
        fadeUp: {
          from: { opacity: 0, transform: "translateY(28px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
