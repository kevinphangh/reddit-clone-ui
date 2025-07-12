/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        reddit: {
          orange: '#00A3E0',
          orangered: '#0089BC',
          darkOrange: '#006F99',
          lightGray: '#F5F5F5',
          gray: '#666666',
          darkGray: '#333333',
          black: '#000000',
          white: '#FFFFFF',
          blue: '#003F72',
          lightBlue: '#5CB3CC',
          darkBlue: '#002B4F',
          green: '#8CC63F',
          red: '#E31937',
          bg: {
            light: '#DAE0E6',
            dark: '#030303',
            card: '#FFFFFF',
            cardDark: '#1A1A1B',
            hover: '#F6F7F8',
            hoverDark: '#272729'
          }
        }
      },
      fontFamily: {
        'reddit': ['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'mono': ['Noto Mono', 'Monaco', 'Consolas', 'Courier New', 'monospace']
      },
      fontSize: {
        'xxs': '10px',
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '22px',
        '3xl': '24px'
      },
      spacing: {
        'reddit-header': '48px',
        'reddit-sidebar': '312px',
        'reddit-content': '640px'
      },
      borderRadius: {
        'reddit': '4px'
      },
      boxShadow: {
        'reddit': '0 1px 2px rgba(0,0,0,0.1)',
        'reddit-hover': '0 2px 4px rgba(0,0,0,0.1)'
      }
    },
  },
  plugins: [],
}