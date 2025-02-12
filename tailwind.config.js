/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    colors: {
      background: "var(--color-bg)",
      text: "var(--color-text)",
      board: "var(--color-board)",
      info: "var(--color-info)"
    }
  },
  plugins: [],
}

