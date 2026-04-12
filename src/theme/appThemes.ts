import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

/** Dim red on near-black — preserves night vision while staying readable. */
const nightRed = '#FF5252';
const nightBg = '#0a0a0a';
const nightSurface = '#161616';

export const lightAppTheme = {
  ...MD3LightTheme,
  roundness: 5,
};

export const nightVisionTheme = {
  ...MD3DarkTheme,
  dark: true,
  roundness: 5,
  colors: {
    ...MD3DarkTheme.colors,
    primary: nightRed,
    onPrimary: '#1a0000',
    primaryContainer: '#5c1a1a',
    onPrimaryContainer: '#ffcdd2',
    background: nightBg,
    surface: nightSurface,
    surfaceVariant: '#242424',
    onSurface: nightRed,
    onSurfaceVariant: '#E57373',
    onBackground: nightRed,
    outline: '#B71C1C',
    outlineVariant: '#4a2828',
  },
};
