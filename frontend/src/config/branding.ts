// Centralized branding configuration
// Rediger denne fil for at ændre farver og branding i hele applikationen

export const brandConfig = {
  // Primære farver
  colors: {
    primary: {
      50: '#e6f4ff',
      100: '#b3dfff',
      200: '#80c9ff',
      300: '#4db3ff',
      400: '#1a9dff',
      500: '#0080ff', // VIA Blue - hovedfarve
      600: '#0066cc',
      700: '#004d99',
      800: '#003366',
      900: '#001a33',
    },
    secondary: {
      50: '#e8f5e9',
      100: '#c8e6c9',
      200: '#a5d6a7',
      300: '#81c784',
      400: '#66bb6a',
      500: '#4caf50', // VIA Green
      600: '#43a047',
      700: '#388e3c',
      800: '#2e7d32',
      900: '#1b5e20',
    },
    // Neutrale farver
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
    // Status farver
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
  },
  
  // Font størrelser
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  
  // Branding tekst
  siteName: 'VIA Pædagoger Forum',
  siteShortName: 'VIA Forum',
  siteDescription: 'Forum for pædagogstuderende på VIA University College',
  
  // Mascot farver (bruger primary og secondary)
  mascot: {
    bodyColor: '#0080ff', // primary.500
    faceColor: '#e6f4ff', // primary.50
    eyeColor: '#003366',  // primary.800
    capColor: '#4caf50',  // secondary.500
    capShadowColor: '#388e3c', // secondary.700
  },
};

// Type for at sikre type-sikkerhed
export type BrandConfig = typeof brandConfig;