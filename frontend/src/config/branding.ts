// Centralized branding configuration
// Rediger denne fil for at ændre farver og branding i hele applikationen

export const brandConfig = {
  // Primære farver - Dansk minimalistisk palette
  colors: {
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
    // Status farver - Dæmpede danske toner
    success: '#8ca583',  // Dæmpet grøn
    warning: '#d4a574',  // Varm gul-brun
    error: '#c17b7b',    // Dæmpet rød
    info: '#7a95a7',     // Nordisk blå-grå
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
    bodyColor: '#cbb5a0',    // primary.500 - dansk sand
    faceColor: '#fdfcfb',    // primary.50 - næsten hvid
    eyeColor: '#4a3f36',     // primary.900 - meget mørk brun
    capColor: '#7a95a7',     // secondary.500 - nordisk blå-grå
    capShadowColor: '#5e7a8c', // secondary.600 - mørkere blå-grå
  },
};

// Type for at sikre type-sikkerhed
export type BrandConfig = typeof brandConfig;