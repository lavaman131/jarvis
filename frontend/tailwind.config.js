/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        exo: ["Exo", "sans-serif"],
      },
      keyframes: {
        grow: {
          "0%": { transform: "transform(1.03)" },
          "50%": { transform: "transform(1.0)" },
          "100%": { transform: "transform(1.03)" },
        },
      },
      animation: {
        growing: "grow 2s linear infinite",
      },
    },
  },
  plugins: [],
};