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
          50: '#fef7f0',
          100: '#fdeee0',
          200: '#fad9bf',
          300: '#f7c094',
          400: '#f39d66',
          500: '#ef7f44',
          600: '#e06530',
          700: '#bb4e26',
          800: '#954027',
          900: '#793624',
        },
        warm: {
          50: '#fef9f5',
          100: '#fdf2e9',
          200: '#fae3d0',
          300: '#f6d0b0',
          400: '#f1b888',
          500: '#eb9d5f',
          600: '#e1853f',
          700: '#d16b2a',
          800: '#b05524',
          900: '#8f4522',
        }
      }
    },
  },
  plugins: [],
}