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
          orange: '#FF4500',
          orangered: '#FF5700',
          darkOrange: '#CC3700',
          lightGray: '#DAE0E6',
          gray: '#878A8C',
          darkGray: '#1A1A1B',
          black: '#030303',
          white: '#FFFFFF',
          blue: '#0079D3',
          lightBlue: '#24A0ED',
          darkBlue: '#0060A8',
          green: '#46D160',
          red: '#EA0027',
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