/**
 * Central export file for all styles
 * Single import point: import { tokens, patterns, navbarStyles } from '@/styles'
 */

// Tokens
export * from './tokens/spacing';
export * from './tokens/typography';
export * from './tokens/layout';
export * from './tokens/z-index';
export * from './tokens/colors';

// Patterns
export * from './patterns/layout';
export * from './patterns/navigation';
export * from './patterns/buttons';

// Variants
export * from './variants/navigation';
export * from './variants/containers';

// Component styles
export * from './components/navbar.styles';
export * from './components/sidebar.styles';
export * from './components/breadcrumbs.styles';
export * from './components/pages.styles';
export * from './components/forms.styles';

// Convenience exports
export { SPACING as spacing } from './tokens/spacing';
export { TYPOGRAPHY as typography } from './tokens/typography';
export { LAYOUT as layout } from './tokens/layout';
export { Z_INDEX as zIndex } from './tokens/z-index';
export { COLORS as colors } from './tokens/colors';

export { LAYOUT_PATTERNS as layoutPatterns } from './patterns/layout';
export { NAVIGATION_PATTERNS as navigationPatterns } from './patterns/navigation';
export { BUTTON_PATTERNS as buttonPatterns } from './patterns/buttons';
