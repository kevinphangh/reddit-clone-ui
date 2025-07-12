/** @type {import('tailwindcss').Config} */
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
          // VIA Brand Colors - Enhanced
          orange: '#FF6B35',
          orangered: '#FF5722',
          darkOrange: '#E65100',
          
          // VIA Blues - More sophisticated
          blue: '#003F72',
          lightBlue: '#4A90A4',
          darkBlue: '#002B4F',
          primary: '#003F72',
          secondary: '#00A3E0',
          
          // Neutrals - Better contrast and hierarchy
          white: '#FFFFFF',
          black: '#0F172A',
          darkGray: '#1E293B',
          gray: '#64748B',
          lightGray: '#E2E8F0',
          
          // Status colors - More vibrant
          green: '#059669',
          red: '#DC2626',
          yellow: '#D97706',
          purple: '#7C3AED',
          
          // Accent colors
          accent: '#FF6B35',
          
          // Background system
          bg: {
            light: '#F8FAFC',
            dark: '#0F172A',
            card: '#FFFFFF',
            cardDark: '#1E293B',
            hover: '#F1F5F9',
            hoverDark: '#334155',
            muted: '#F8FAFC'
          },
          
          // Text colors for better readability
          text: {
            primary: '#0F172A',
            secondary: '#475569',
            muted: '#64748B',
            inverse: '#F8FAFC'
          },
          
          // Border colors
          border: {
            light: '#E2E8F0',
            DEFAULT: '#CBD5E1',
            dark: '#475569'
          }
        }
      },
      fontFamily: {
        'via': ['Inter', 'IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'display': ['Inter', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'Courier New', 'monospace']
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900'
      },
      fontSize: {
        'xxs': ['10px', { lineHeight: '14px' }],
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
        '5xl': ['48px', { lineHeight: '1' }]
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em'
      },
      spacing: {
        'via-header': '64px',
        'via-sidebar': '312px',
        'via-content': '640px',
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' }
        }
      },
      borderRadius: {
        'via': '8px',
        'via-sm': '4px',
        'via-md': '6px',
        'via-lg': '12px',
        'via-xl': '16px',
        'via-2xl': '20px'
      },
      boxShadow: {
        'via': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'via-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'via-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'via-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'via-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
      },
      backdropBlur: {
        'via': '8px'
      }
    }
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          'background': 'rgba(0, 0, 0, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        }
      }
      addUtilities(newUtilities)
    }
  ],
}