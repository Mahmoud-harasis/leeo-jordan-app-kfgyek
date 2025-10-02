
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  // Leeo App Colors - Jordan Edition
  background: '#202222',        // Dark Gray Background
  textPrimary: '#FFFFFF',       // White Text
  textSecondary: '#F5F5F5',     // Light Gray Text
  primaryRed: '#EE3F40',        // Primary Red
  accentGradientStart: '#EE3F40', // Red for gradients
  accentGradientEnd: '#000000',   // Black for gradients
  card: '#282A28',              // Slightly lighter card background
  highlight: '#F25455',         // Lighter red for interactive elements
  
  // Additional utility colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  border: '#3A3C3A',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const typography = {
  fontFamily: 'Inter_400Regular', // Will use Inter as San Francisco alternative
  fontFamilyBold: 'Inter_700Bold',
  fontFamilyMedium: 'Inter_500Medium',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 50,
};

export const shadows = {
  small: {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  medium: {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  large: {
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
    elevation: 8,
  },
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primaryRed,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  secondary: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primaryRed,
  },
  primaryText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: typography.fontFamilyBold,
  },
  secondaryText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: typography.fontFamilyBold,
  },
  ghostText: {
    color: colors.primaryRed,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: typography.fontFamilyBold,
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  
  // Typography
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBold,
    marginBottom: spacing.sm,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBold,
    marginBottom: spacing.xs,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
  },
  
  // Cards
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.xs,
    ...shadows.medium,
  },
  productCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    margin: spacing.xs,
    width: 160,
    height: 220,
    ...shadows.medium,
  },
  categoryCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    margin: spacing.xs,
    width: 120,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  
  // Input fields
  input: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: typography.fontFamily,
  },
  inputFocused: {
    borderColor: colors.primaryRed,
  },
  
  // Search bar
  searchBar: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.small,
  },
  
  // Navigation
  headerButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  
  // Layout helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Spacing
  marginTop: {
    marginTop: spacing.md,
  },
  marginBottom: {
    marginBottom: spacing.md,
  },
  paddingHorizontal: {
    paddingHorizontal: spacing.md,
  },
  paddingVertical: {
    paddingVertical: spacing.md,
  },
});

// Gradient button style helper (to be used with LinearGradient)
export const gradientButtonColors = [colors.accentGradientStart, colors.accentGradientEnd];
