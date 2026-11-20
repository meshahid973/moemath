import type { TextStyle } from 'react-native';

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, compact: 20, screen: 24, xl: 24, xxl: 32 } as const;
export const radius = { control: 6, panel: 12 } as const;
export const size = { touch: 48, button: 56, content: 600, icon: 21, brandMark: 24 } as const;
export const layout = {
  compact: 360, rail: 768, characterMargin: 128, characterMinWidth: 300,
  characterPortrait: 224, inlinePortrait: 88, largeText: 1.3,
} as const;
export const fontFamily = { regular: 'MPlus1p_400Regular', bold: 'MPlus1p_700Bold', extraBold: 'MPlus1p_800ExtraBold' } as const;

const numerals = { fontVariant: ['tabular-nums'] } satisfies TextStyle;
export const typography = {
  brand: { fontSize: 28, lineHeight: 36, fontFamily: fontFamily.extraBold },
  hero: { fontSize: 30, lineHeight: 36, fontFamily: fontFamily.bold },
  // Compatibility role; heavy type is reserved for the wordmark and result numeral.
  display: { fontSize: 30, lineHeight: 36, fontFamily: fontFamily.bold },
  title: { fontSize: 24, lineHeight: 30, fontFamily: fontFamily.bold },
  heading: { fontSize: 20, lineHeight: 28, fontFamily: fontFamily.bold },
  body: { fontSize: 16, lineHeight: 24, fontFamily: fontFamily.regular },
  label: { fontSize: 15, lineHeight: 21, fontFamily: fontFamily.bold },
  caption: { fontSize: 13, lineHeight: 19, fontFamily: fontFamily.regular },
  metadata: { fontSize: 13, lineHeight: 19, fontFamily: fontFamily.regular, ...numerals },
  equation: { fontSize: 48, lineHeight: 64, fontFamily: fontFamily.bold, ...numerals },
  answer: { fontSize: 44, lineHeight: 58, fontFamily: fontFamily.bold, ...numerals },
  score: { fontSize: 72, lineHeight: 88, fontFamily: fontFamily.extraBold, ...numerals },
  denominator: { fontSize: 24, lineHeight: 32, fontFamily: fontFamily.bold, ...numerals },
} as const satisfies Record<string, TextStyle>;
export const motion = { press: 80, release: 120, state: 180, portrait: 150, pressedScale: 0.985 } as const;

const light = {
  background: '#FFF8FC', surface: '#F6F1FA', text: '#292D5C', muted: '#646078',
  primary: '#3E429C', onPrimary: '#FFFFFF', character: '#E4DFF8', border: '#D3CBE1',
  math: '#3E429C', onMath: '#FFFFFF', success: '#1D6B58', correction: '#C02B66',
  // Error text also appears at normal sizes on the lavender character/selected surface.
  danger: '#B1245C', controlBorder: '#777087', pressed: '#DCD6F2',
  disabled: '#E8E2EE', onDisabled: '#777087',
} as const;
const dark = {
  background: '#000000', surface: '#13121B', text: '#F1EFFF', muted: '#BDB5CF',
  primary: '#C3C4FF', onPrimary: '#242342', character: '#24203B', border: '#39334E',
  math: '#191C3B', onMath: '#F1EFFF', success: '#8CD8BE', correction: '#FFA2C5',
  danger: '#FFA2C5', controlBorder: '#8C849F', pressed: '#302B4A',
  disabled: '#292634', onDisabled: '#8C849F',
} as const;

// Compatibility boundary for screens whose compositions change in later phases.
function withLegacyRoles<T extends typeof light | typeof dark>(colors: T) {
  return { ...colors, tint: colors.character, accent: colors.correction,
    stage: colors.character, stageStrong: colors.character, ribbon: colors.character };
}
export const palettes = { light: withLegacyRoles(light), dark: withLegacyRoles(dark) } as const;
export type Palette = (typeof palettes)[keyof typeof palettes];
export type ThemeMode = 'system' | 'light' | 'dark';

export function resolveTheme(mode: ThemeMode, system: 'light' | 'dark' | null | undefined) {
  return mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode;
}
