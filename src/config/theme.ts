// VIA University College Theme Configuration
// Easy color management and theme switching

import { VIA_COLORS, COLOR_THEMES } from './colors';

// Theme configuration interface for type safety
export interface ThemeConfig {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: {
      light: string;
      medium: string;
    };
  };
}

// Available themes
export const AVAILABLE_THEMES: Record<string, ThemeConfig> = {
  via_light: {
    name: 'VIA Light',
    description: 'Standard VIA farver - lys tema',
    colors: COLOR_THEMES.default
  },
  via_dark: {
    name: 'VIA Dark',
    description: 'VIA farver - mørk tema',
    colors: COLOR_THEMES.dark
  }
};

// Current active theme
export const CURRENT_THEME = AVAILABLE_THEMES.via_light;

// Utility functions for theme management
export const ThemeUtils = {
  // Get current theme colors
  getCurrentColors: () => CURRENT_THEME.colors,
  
  // Get specific color from current theme
  getColor: (path: string): string => {
    const keys = path.split('.');
    let value: any = CURRENT_THEME.colors;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return value || '';
  },
  
  // Generate CSS custom properties for the current theme
  getCSSVariables: (): Record<string, string> => {
    const colors = CURRENT_THEME.colors;
    return {
      '--via-primary': colors.primary,
      '--via-secondary': colors.secondary,
      '--via-background': colors.background,
      '--via-surface': colors.surface,
      '--via-text-primary': colors.text.primary,
      '--via-text-secondary': colors.text.secondary,
      '--via-text-muted': colors.text.muted,
      '--via-border-light': colors.border.light,
      '--via-border-medium': colors.border.medium,
    };
  },
  
  // Apply theme to document root
  applyTheme: (themeName: string = 'via_light') => {
    const theme = AVAILABLE_THEMES[themeName];
    if (!theme) {
      console.warn(`Theme ${themeName} not found`);
      return;
    }
    
    const root = document.documentElement;
    const cssVars = ThemeUtils.getCSSVariables();
    
    Object.entries(cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }
};

// Export VIA color constants for direct use
export { VIA_COLORS };

// Quick access to VIA brand colors
export const VIA_BRAND = {
  PRIMARY: VIA_COLORS.primary.blue,
  SECONDARY: VIA_COLORS.secondary.blue,
  LIGHT_BLUE: VIA_COLORS.primary.lightBlue,
  DARK_BLUE: VIA_COLORS.primary.darkBlue,
  LIGHT_SECONDARY: VIA_COLORS.secondary.lightBlue,
  DARK_SECONDARY: VIA_COLORS.secondary.darkBlue,
  
  // Educational colors
  PEDAGOGY: VIA_COLORS.education.pedagogy,
  PRACTICE: VIA_COLORS.education.practice,
  THEORY: VIA_COLORS.education.theory,
  COLLABORATION: VIA_COLORS.education.collaboration,
  
  // Status colors
  SUCCESS: VIA_COLORS.accents.success,
  WARNING: VIA_COLORS.accents.warning,
  DANGER: VIA_COLORS.accents.danger,
  INFO: VIA_COLORS.accents.info,
} as const;