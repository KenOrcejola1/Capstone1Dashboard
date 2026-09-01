/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        garamond: ['"Cormorant Garamond"', 'Georgia', '"Times New Roman"', 'serif'],
        opensans: ['"Open Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
