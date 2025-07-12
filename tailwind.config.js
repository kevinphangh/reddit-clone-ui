/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
// VIA University College Tailwind Configuration
// Minimalist Danish design - White, Gray, Blue palette
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        via: {
          // Minimalist Danish Blue Palette
          blue: '#2563EB',           // Clean modern blue
          lightBlue: '#60A5FA',      // Light blue accent
          darkBlue: '#1D4ED8',       // Dark blue emphasis
          primary: '#2563EB',        // Primary blue
          
          // Secondary Blue Variations
          secondary: '#3B82F6',      // Secondary blue tone
          lightSecondary: '#93C5FD', // Very light blue
          darkSecondary: '#1E40AF',  // Deep blue
          
          // Minimalist Gray Scale - Pure and Clean
          white: '#FFFFFF',          // Pure white
          lightest: '#FAFAFA',       // Almost white
          lighter: '#F5F5F5',        // Very light gray
          light: '#E5E5E5',          // Light gray borders
          medium: '#737373',         // Medium gray text
          dark: '#404040',           // Dark gray text
          darker: '#262626',         // Darker gray
          darkest: '#171717',        // Almost black
          
          // Minimal Status Colors - Very Subtle
          green: '#10B981',          // Subtle success green
          red: '#EF4444',            // Subtle error red
          yellow: '#F59E0B',         // Subtle warning amber
          teal: '#06B6D4',           // Subtle info cyan
          
          // Educational Blues - Monochromatic
          pedagogy: '#6366F1',       // Indigo for pedagogy
          practice: '#0891B2',       // Cyan for practice
          theory: '#2563EB',         // Blue for theory
          collaboration: '#3B82F6',  // Blue for collaboration
          
          // Background System - Minimal
          bg: {
            light: '#FFFFFF',        // Pure white background
            card: '#FFFFFF',         // Card background
            hover: '#FAFAFA',        // Subtle hover
            muted: '#F5F5F5',        // Muted background
            dark: '#171717',         // Dark theme
            cardDark: '#262626'      // Dark card
          },
          
          // Text System - High Contrast
          text: {
            primary: '#171717',      // Almost black
            secondary: '#404040',    // Dark gray
            muted: '#737373',        // Medium gray
            inverse: '#FFFFFF'       // White
          },
          
          // Border System - Minimal
          border: {
            light: '#E5E5E5',        // Light borders
            DEFAULT: '#737373',      // Default borders
            dark: '#404040'          // Dark borders
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
    function({ addUtilities, addBase }) {
      // CSS Custom Properties for minimalist theming
      addBase({
        ':root': {
          '--via-primary': '#2563EB',
          '--via-secondary': '#3B82F6',
          '--via-background': '#FFFFFF',
          '--via-surface': '#FFFFFF',
          '--via-text-primary': '#171717',
          '--via-text-secondary': '#404040',
          '--via-text-muted': '#737373',
          '--via-border-light': '#E5E5E5',
          '--via-border-medium': '#737373'
        }
      })
      
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
        },
        // Minimalist VIA Theme Utilities
        '.via-gradient-primary': {
          'background': 'linear-gradient(135deg, var(--via-primary) 0%, #60A5FA 100%)',
        },
        '.via-gradient-secondary': {
          'background': 'linear-gradient(135deg, var(--via-secondary) 0%, #93C5FD 100%)',
        },
        '.via-gradient-hero': {
          'background': 'linear-gradient(135deg, var(--via-primary) 0%, var(--via-secondary) 100%)',
        },
        '.via-minimal-card': {
          'background': 'rgba(255, 255, 255, 0.8)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(229, 229, 229, 0.3)',
        }
      }
      addUtilities(newUtilities)
    }
  ],
}