export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, screen: 24, xl: 24, xxl: 32 } as const;
export const radius = { control: 8, panel: 12 } as const;
export const size = { touch: 48, button: 56, content: 600, icon: 21 } as const;

export const typography = {
  display: { fontSize: 32, lineHeight: 36, letterSpacing: -0.8, fontFamily: 'NunitoSans_900Black_Italic' },
  title: { fontSize: 28, lineHeight: 34, letterSpacing: -0.7, fontFamily: 'NunitoSans_700Bold' },
  heading: { fontSize: 21, lineHeight: 27, letterSpacing: -0.4, fontFamily: 'NunitoSans_700Bold' },
  body: { fontSize: 16, lineHeight: 24, fontFamily: 'NunitoSans_400Regular' },
  label: { fontSize: 15, lineHeight: 21, fontFamily: 'NunitoSans_700Bold' },
  caption: { fontSize: 13, lineHeight: 19, fontFamily: 'NunitoSans_600SemiBold' },
  equation: { fontSize: 48, lineHeight: 62, letterSpacing: -1, fontFamily: 'NunitoSans_700Bold' },
  score: { fontSize: 64, lineHeight: 76, letterSpacing: -2, fontFamily: 'NunitoSans_900Black_Italic' },
} as const;
export const motion = { press: 80, release: 140, state: 180, result: 240 } as const;

export const palettes = {
  light: {
    background: '#F7F3FA',
    surface: '#FFFCFF',
    primary: '#693B82',
    onPrimary: '#FFFFFF',
    tint: '#EEE3F6',
    accent: '#B14673',
    text: '#302238',
    muted: '#6A5775',
    border: '#D8CBDF',
    success: '#17634F',
    danger: '#A12D58',
    stage: '#E5D4F0',
    stageStrong: '#D1B6E4',
    ribbon: '#E8B5CC',
  },
  dark: {
    background: '#16121D',
    surface: '#211B2B',
    primary: '#D8B5F2',
    onPrimary: '#30203E',
    tint: '#30263F',
    accent: '#EDA9C9',
    text: '#F6EFFA',
    muted: '#C3B1CE',
    border: '#4A3B59',
    success: '#8BD9BA',
    danger: '#FFA9C5',
    stage: '#362343',
    stageStrong: '#503260',
    ribbon: '#75415F',
  },
} as const;

export type Palette = (typeof palettes)[keyof typeof palettes];
export type ThemeMode = 'system' | 'light' | 'dark';

export function resolveTheme(mode: ThemeMode, system: 'light' | 'dark' | null | undefined) {
  return mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode;
}
