/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1f1",
          100: "#ffe0e0",
          200: "#ffc5c5",
          300: "#ff9d9d",
          400: "#fb6464",
          500: "#ef2b2b",
          600: "#d61f2d",
          700: "#b3171f",
          800: "#8c151a",
          900: "#5f0f12",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
