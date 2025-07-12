/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        via: {
          orange: '#FF6B35',
          orangered: '#FF5722',
          darkOrange: '#E65100',
          lightGray: '#F5F5F5',
          gray: '#666666',
          darkGray: '#333333',
          black: '#1A1A1A',
          white: '#FFFFFF',
          blue: '#003F72',
          lightBlue: '#5CB3CC',
          darkBlue: '#002B4F',
          green: '#4CAF50',
          red: '#F44336',
          primary: '#003F72',
          secondary: '#00A3E0',
          accent: '#FF6B35',
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
        'via': ['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
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
        'via-header': '48px',
        'via-sidebar': '312px',
        'via-content': '640px'
      },
      borderRadius: {
        'via': '4px'
      },
      boxShadow: {
        'via': '0 1px 2px rgba(0,0,0,0.1)',
        'via-hover': '0 2px 4px rgba(0,0,0,0.1)'
      }
    },
  },
  plugins: [],
}