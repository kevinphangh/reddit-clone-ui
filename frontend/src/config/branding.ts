// Centralized branding configuration
// Rediger denne fil for at ændre farver og branding i hele applikationen

export const brandConfig = {
  // Primære farver
  colors: {
    primary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899', // Rosa - hovedfarve
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
    },
    secondary: {
      50: '#fef3f2',
      100: '#fee5e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Koral/rød
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
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
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#8b5cf6',
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
    bodyColor: '#ec4899', // primary.500 - rosa
    faceColor: '#fdf2f8', // primary.50 - lys rosa
    eyeColor: '#831843',  // primary.900 - mørk rosa
    capColor: '#f472b6',  // primary.400 - lys rosa
    capShadowColor: '#db2777', // primary.600 - mellem rosa
  },
};

// Type for at sikre type-sikkerhed
export type BrandConfig = typeof brandConfig;