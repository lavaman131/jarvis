/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: "rgb(124, 240, 243)",
      },
      fontFamily: {
        exo: ["Exo", "sans-serif"],
      },
      keyframes: {
        grow: {
          "0%": { transform: "scale(1.03)" },
          "50%": { transform: "scale(1.0)" },
          "100%": { transform: "scale(1.03)" },
        },
      },
      animation: {
        growing: "grow 2s linear infinite",
      },
    },
  },
  plugins: [],
};
