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
        // Rose/beige palette - Rediger i src/config/branding.ts
        primary: {
          50: '#fffaf8',   // Meget lys rose
          100: '#fff5f0',  // Lys rose-hvid
          200: '#ffebe5',  // Blød rose
          300: '#ffe3d8',  // Lys beige-rose
          400: '#ffd0b8',  // Mellembeige
          500: '#ffb69e',  // Rose-beige hovedfarve
          600: '#ff9b7a',  // Varm rose
          700: '#e87c5a',  // Dyb rose-orange
          800: '#c2654a',  // Mørk rose-brun
          900: '#9c4f3b',  // Meget mørk rose-brun
        },
        secondary: {
          50: '#fef6f5',   // Meget lys koral
          100: '#fdecea',  // Lys koral-hvid
          200: '#fbd8d5',  // Blød koral
          300: '#f8c4bf',  // Lys koral-rose
          400: '#f4a09a',  // Mellemkoral
          500: '#f07c75',  // Blød koral - accent
          600: '#e65850',  // Varm koral
          700: '#cc3c3c',  // Dyb koral-rød
          800: '#a63333',  // Mørk koral
          900: '#802929',  // Meget mørk koral
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