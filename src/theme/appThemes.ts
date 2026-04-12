import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

/** Dim red on near-black — preserves night vision while staying readable. */
const nightRed = '#FF5252';
const nightBg = '#0a0a0a';
const nightSurface = '#161616';

/** Richer light palette: deep sky primary, teal secondary, warm tertiary — still MD3-shaped. */
export const lightAppTheme = {
  ...MD3LightTheme,
  roundness: 5,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1565C0',
    onPrimary: '#FFFFFF',
    primaryContainer: '#D3E4FF',
    onPrimaryContainer: '#001C3B',
    secondary: '#006874',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#9EEFFD',
    onSecondaryContainer: '#001F24',
    tertiary: '#7D5700',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FFDE9F',
    onTertiaryContainer: '#281800',
    background: '#F4F7FB',
    onBackground: '#1A1C1E',
    surface: '#FCFCFF',
    onSurface: '#1A1C1E',
    surfaceVariant: '#DDE3EA',
    onSurfaceVariant: '#41484D',
    outline: '#71787E',
    outlineVariant: '#C1C7CE',
  },
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
