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
        // Dansk minimalistisk palette - Rediger i src/config/branding.ts
        primary: {
          50: '#fdfcfb',   // Næsten hvid med varm tone
          100: '#faf8f6',  // Meget lys beige
          200: '#f5f0eb',  // Lys sand
          300: '#ede5dd',  // Varm grå-beige
          400: '#dfd3c6',  // Mellemsand
          500: '#cbb5a0',  // Dansk sand/beige - hovedfarve
          600: '#b39a84',  // Mørkere sand
          700: '#8f7a65',  // Brun-beige
          800: '#6b5c4e',  // Mørk brun
          900: '#4a3f36',  // Meget mørk brun
        },
        secondary: {
          50: '#f8fafb',   // Næsten hvid med kold tone
          100: '#f1f5f7',  // Meget lys grå-blå
          200: '#e3ebef',  // Lys nordisk grå
          300: '#d0dce3',  // Dansk himmel grå
          400: '#a8bcc8',  // Mellemgrå-blå
          500: '#7a95a7',  // Nordisk blå-grå - accent
          600: '#5e7a8c',  // Mørkere blå-grå
          700: '#475e6f',  // Mørk blå-grå
          800: '#364753',  // Meget mørk blå-grå
          900: '#263038',  // Næsten sort blå
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        success: '#8ca583',  // Dæmpet grøn
        warning: '#d4a574',  // Varm gul-brun
        error: '#c17b7b',    // Dæmpet rød
        info: '#7a95a7',     // Nordisk blå-grå
      },
      // Border radius - Rediger i src/config/branding.ts
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',    // 4px
        'DEFAULT': '0.5rem', // 8px
        'md': '0.75rem',     // 12px
        'lg': '1rem',        // 16px
        'xl': '1.25rem',     // 20px
        '2xl': '1.5rem',     // 24px
        'full': '9999px',
      }
    },
  },
  plugins: [],
}