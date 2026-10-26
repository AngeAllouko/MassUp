import { Platform } from 'react-native';

export const colors = {
  bg: '#05090B',
  surface: '#0B1316',
  surfaceAlt: '#101B1F',
  surfaceHi: '#172A2F',
  border: 'rgba(255,255,255,0.07)',
  borderTeal: 'rgba(45,226,208,0.30)',

  text: '#F3F8F8',
  textDim: '#B4C4C6',
  textMuted: '#7D9195',
  textFaint: '#4A5C60',

  teal: '#2DE2D0',
  tealSoft: 'rgba(45,226,208,0.12)',
  tealDeep: '#0E4A52',
  tealMid: '#1BA9A0',

  protein: '#2DE2D0',
  carbs: '#F6C26B',
  fat: '#7AA8FF',
  water: '#4CC9F0',

  danger: '#FF6B6B',
  white: '#FFFFFF',
  ink: '#041012',
};

export const radius = { sm: 12, md: 18, lg: 26, xl: 32, pill: 999 };

export const fonts = {
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
};

export const TAB_BAR_SPACE = 132;
