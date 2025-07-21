// Centralized branding configuration
// Rediger denne fil for at ændre farver og branding i hele applikationen

export const brandConfig = {
  // Primære farver
  colors: {
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
    // Neutrale farver - mørkere for bedre læsbarhed
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
    success: '#a8c09a',
    warning: '#f5c99b',
    error: '#e88b84',
    info: '#c4a4d9',
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
  
  // Border radius - Juster disse værdier for at ændre hvor runde hjørnerne er
  // VIGTIGT: Hvis du ændrer disse værdier, skal du også opdatere tailwind.config.js
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px - små elementer
    base: '0.5rem',   // 8px - standard elementer
    md: '0.75rem',    // 12px - mellemstore elementer  
    lg: '1rem',       // 16px - store elementer
    xl: '1.25rem',    // 20px - ekstra store elementer
    '2xl': '1.5rem',  // 24px - meget store elementer
    full: '9999px',   // Helt rund
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
    bodyColor: '#ffb69e', // primary.500 - beige-rosa
    faceColor: '#fffaf8', // primary.50 - meget lys beige
    eyeColor: '#9c4f3b',  // primary.900 - mørk brun-rosa
    capColor: '#ffd0b8',  // primary.400 - lys beige-rosa
    capShadowColor: '#ff9b7a', // primary.600 - mellem beige-rosa
  },
};

// Type for at sikre type-sikkerhed
export type BrandConfig = typeof brandConfig;