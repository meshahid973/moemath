import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import { palettes, resolveTheme, type Palette, type ThemeMode } from './tokens';

type Appearance = { mode: ThemeMode; setMode: (mode: ThemeMode) => void };
type Theme = { scheme: 'light' | 'dark'; colors: Palette };
const ThemeContext = createContext<Theme | null>(null);
const AppearanceContext = createContext<Appearance | null>(null);
const themes = {
  light: { scheme: 'light', colors: palettes.light },
  dark: { scheme: 'dark', colors: palettes.dark },
} as const;

export function ThemeProvider({ children }: PropsWithChildren) {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');
  const appearance = useMemo(() => ({ mode, setMode }), [mode]);
  const theme = themes[resolveTheme(mode, system)];
  return (
    <AppearanceContext.Provider value={appearance}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </AppearanceContext.Provider>
  );
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('ThemeProvider is missing');
  return theme;
}

export function useAppearance() {
  const appearance = useContext(AppearanceContext);
  if (!appearance) throw new Error('ThemeProvider is missing');
  return appearance;
}
