export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, screen: 20, xl: 24, xxl: 32 } as const;
export const radius = { control: 12, panel: 20 } as const;
export const size = { touch: 48, button: 52, content: 560, icon: 22 } as const;

export const palettes = {
  light: {
    background: '#FAF8FC',
    surface: '#FFFFFF',
    primary: '#7957B3',
    onPrimary: '#FFFFFF',
    tint: '#EDE5F7',
    accent: '#E8A8BC',
    text: '#302638',
    muted: '#695E74',
    border: '#DCD3E5',
  },
  dark: {
    background: '#000000',
    surface: '#141218',
    primary: '#B69BE8',
    onPrimary: '#21152F',
    tint: '#292036',
    accent: '#E6A0BB',
    text: '#F2EDF7',
    muted: '#AAA2B3',
    border: '#38323F',
  },
} as const;

export type Palette = (typeof palettes)[keyof typeof palettes];
export type ThemeMode = 'system' | 'light' | 'dark';

export function resolveTheme(mode: ThemeMode, system: 'light' | 'dark' | null | undefined) {
  return mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode;
}
