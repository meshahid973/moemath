import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import { palettes, resolveTheme, type Palette, type ThemeMode } from './tokens';

type Theme = {
  mode: ThemeMode;
  scheme: 'light' | 'dark';
  colors: Palette;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');
  const scheme = resolveTheme(mode, system);
  const value = useMemo(() => ({ mode, scheme, colors: palettes[scheme], setMode }), [mode, scheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('ThemeProvider is missing');
  return theme;
}
