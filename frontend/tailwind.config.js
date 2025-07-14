/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cfc5',
          400: '#d2bab0',
          500: '#b8997d',
          600: '#a08262',
          700: '#8b6914',
          800: '#723f06',
          900: '#5c2b02',
        },
        warm: {
          50: '#faf8f5',
          100: '#f5f1eb',
          200: '#ede6d9',
          300: '#e3d4c1',
          400: '#d6bf9f',
          500: '#c8a882',
          600: '#b8956b',
          700: '#9a7c5a',
          800: '#7d654c',
          900: '#66523f',
        }
      }
    },
  },
  plugins: [],
}