// VIA University College Color Configuration
// Minimalist Danish Design - inspired by Scandinavian design tradition
// Colors: White, Gray, Blue - very clean and minimal

export const VIA_COLORS = {
  // Primary Blue - minimal and clean
  primary: {
    blue: '#2563EB',        // Clean, modern blue
    lightBlue: '#60A5FA',   // Light blue for accents
    darkBlue: '#1D4ED8',    // Darker blue for emphasis
  },
  
  // Secondary - very minimal accent
  secondary: {
    blue: '#3B82F6',        // Slightly different blue tone
    lightBlue: '#93C5FD',   // Very light blue
    darkBlue: '#1E40AF',    // Deep blue
  },
  
  // Danish Minimalist Grays - pure and clean
  neutrals: {
    white: '#FFFFFF',       // Pure white
    lightest: '#FAFAFA',    // Almost white
    lighter: '#F5F5F5',     // Very light gray
    light: '#E5E5E5',       // Light gray
    medium: '#737373',      // Medium gray
    dark: '#404040',        // Dark gray
    darker: '#262626',      // Darker gray
    darkest: '#171717',     // Almost black
  },
  
  // Minimal accent colors - very subtle
  accents: {
    success: '#10B981',     // Subtle green
    warning: '#F59E0B',     // Subtle amber
    danger: '#EF4444',      // Subtle red
    info: '#06B6D4',        // Subtle cyan
  },
  
  // Educational context - monochromatic blues
  education: {
    pedagogy: '#6366F1',    // Indigo for pedagogy
    practice: '#0891B2',    // Cyan for practical work
    theory: '#2563EB',      // Blue for theoretical work
    collaboration: '#3B82F6', // Blue for collaboration
  }
} as const;

// Minimalist color themes - Danish design philosophy
export const COLOR_THEMES = {
  default: {
    primary: VIA_COLORS.primary.blue,
    secondary: VIA_COLORS.secondary.blue,
    background: VIA_COLORS.neutrals.white,
    surface: VIA_COLORS.neutrals.white,
    text: {
      primary: VIA_COLORS.neutrals.darkest,
      secondary: VIA_COLORS.neutrals.dark,
      muted: VIA_COLORS.neutrals.medium,
    },
    border: {
      light: VIA_COLORS.neutrals.light,
      medium: VIA_COLORS.neutrals.medium,
    }
  },
  
  // Minimal dark theme
  dark: {
    primary: VIA_COLORS.primary.lightBlue,
    secondary: VIA_COLORS.secondary.lightBlue,
    background: VIA_COLORS.neutrals.darkest,
    surface: VIA_COLORS.neutrals.darker,
    text: {
      primary: VIA_COLORS.neutrals.white,
      secondary: VIA_COLORS.neutrals.lighter,
      muted: VIA_COLORS.neutrals.medium,
    },
    border: {
      light: VIA_COLORS.neutrals.dark,
      medium: VIA_COLORS.neutrals.medium,
    }
  }
} as const;

// Export current active minimalist theme
export const ACTIVE_THEME = COLOR_THEMES.default;

// Utility function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

// CSS Custom Properties for minimalist theming
export const CSS_VARIABLES = {
  '--via-primary': ACTIVE_THEME.primary,
  '--via-secondary': ACTIVE_THEME.secondary,
  '--via-background': ACTIVE_THEME.background,
  '--via-surface': ACTIVE_THEME.surface,
  '--via-text-primary': ACTIVE_THEME.text.primary,
  '--via-text-secondary': ACTIVE_THEME.text.secondary,
  '--via-text-muted': ACTIVE_THEME.text.muted,
  '--via-border-light': ACTIVE_THEME.border.light,
  '--via-border-medium': ACTIVE_THEME.border.medium,
} as const;