/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};
