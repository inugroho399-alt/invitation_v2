/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'inv-bg': '#2b1b19',
        'inv-base': '#B6A38B',
        'inv-accent': '#B6A38B',
        'inv-border': '#B6A38B',
        'menu-bg': '#271b19',
        'menu-inactive': '#e3cfbe',
        'menu-active': '#66353d',
        'btn-color': '#2b1b19',
      },
      fontFamily: {
        base: ['var(--font-playfair)', 'serif'],
        accent: ['var(--font-grenze)', 'serif'],
        latin: ['var(--font-great-vibes)', 'cursive'],
        handwriting: ['var(--font-homemade-apple)', 'cursive'],
      },
      animation: {
        'spin-slow': 'spin 15s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
}
