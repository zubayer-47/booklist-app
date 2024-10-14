/** @type {import('tailwindcss').Config} */
export default {
content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        primary: "rgb(var(--color-primary-dark))",
        book: "rgb(var(--color-primary-book))",
        "book-hover": "rgb(var(--color-primary-book-hover))",
        muted: "rgb(var(--color-muted))"
      }
    },
  },
  plugins: [],
}

