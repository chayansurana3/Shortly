/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Extend the theme to add custom utilities
      scrollBehavior: ['responsive', 'smooth'],
    },
 },
  plugins: [],
}