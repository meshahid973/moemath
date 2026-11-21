import { createContext, useCallback, useContext, useLayoutEffect, useMemo, type PropsWithChildren } from 'react';
import { useStoredAppearance } from '@/features/settings/PreferencesProvider';
import { useColorScheme } from 'react-native';
import { Uniwind } from 'uniwind';
import { palettes, resolveTheme, type Palette, type ThemeMode } from './tokens';

type Appearance = { mode: ThemeMode; setMode: (mode: ThemeMode) => void };
type Theme = { scheme: 'light' | 'dark'; colors: Palette; fontsReady: boolean };
const ThemeContext = createContext<Theme | null>(null);
const AppearanceContext = createContext<Appearance | null>(null);
const themes = {
  light: { scheme: 'light', colors: palettes.light },
  dark: { scheme: 'dark', colors: palettes.dark },
} as const;

export function ThemeProvider({ children, fontsReady = true }: PropsWithChildren<{ fontsReady?: boolean }>) {
  const system = useColorScheme();
  const { mode, setPreference } = useStoredAppearance();
  const setMode = useCallback((value: ThemeMode) => setPreference('mode', value), [setPreference]);
  const appearance = useMemo(() => ({ mode, setMode }), [mode, setMode]);
  const base = themes[resolveTheme(mode, system)];
  const theme = useMemo(() => ({ ...base, fontsReady }), [base, fontsReady]);
  // The stored preference remains the single source of truth. beUI's Uniwind
  // tokens must follow it, including when the device appearance changes.
  useLayoutEffect(() => {
    Uniwind.setTheme(mode);
  }, [mode]);

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
