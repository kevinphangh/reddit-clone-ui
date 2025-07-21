import { brandConfig } from '../config/branding';

// Mapper for at konvertere Tailwind rounded klasser til vores config værdier
export const roundedClassMap = {
  'rounded-none': brandConfig.borderRadius.none,
  'rounded-sm': brandConfig.borderRadius.sm,
  'rounded': brandConfig.borderRadius.base,
  'rounded-md': brandConfig.borderRadius.md,
  'rounded-lg': brandConfig.borderRadius.lg,
  'rounded-xl': brandConfig.borderRadius.xl,
  'rounded-2xl': brandConfig.borderRadius['2xl'],
  'rounded-full': brandConfig.borderRadius.full,
};

// Hjælpefunktion til at få border radius værdi
export const getBorderRadius = (size: keyof typeof brandConfig.borderRadius = 'base') => {
  return brandConfig.borderRadius[size];
};