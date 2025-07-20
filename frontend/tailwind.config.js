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
        // Beige-rosa farver - Rediger i src/config/branding.ts
        primary: {
          50: '#fffaf8',
          100: '#fff5f0',
          200: '#ffebe5',
          300: '#ffe3d8', // Din ønskede farve
          400: '#ffd0b8',
          500: '#ffb69e', // Beige-rosa hovedfarve
          600: '#ff9b7a',
          700: '#e87c5a',
          800: '#c2654a',
          900: '#9c4f3b',
        },
        secondary: {
          50: '#fef6f5',
          100: '#fdecea',
          200: '#fbd8d5',
          300: '#f8c4bf',
          400: '#f4a09a',
          500: '#f07c75', // Blød koral
          600: '#e65850',
          700: '#cc3c3c',
          800: '#a63333',
          900: '#802929',
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
        success: '#a8c09a',
        warning: '#f5c99b',
        error: '#e88b84',
        info: '#c4a4d9',
      }
    },
  },
  plugins: [],
}