import { useEffect, useMemo } from 'react';
import { enableFreeze } from 'react-native-screens';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useFonts } from 'expo-font';
import { fontAssets } from '@/theme/fonts';
import { ThemeProvider, useTheme } from '@/theme/provider';

import { AdaptiveProvider } from '@/features/adaptive/AdaptiveProvider';
import { PreferencesProvider, usePreferencesReady } from '@/features/settings/PreferencesProvider';

enableFreeze(true);

function Navigation() {
  const { colors, scheme } = useTheme();
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, [colors.background]);

  const screenOptions = useMemo(() => ({ headerShown: false, freezeOnBlur: true, contentStyle: { backgroundColor: colors.background } }), [colors.background]);

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="history" />
        <Stack.Screen name="history-detail" />
        <Stack.Screen name="review" />
        <Stack.Screen name="session" options={{ gestureEnabled: false }} />
      </Stack>
    </>
  );
}

function ReadyApp({ fontsReady }: { fontsReady: boolean }) {
  const ready = usePreferencesReady();
  return ready ? <ThemeProvider fontsReady={fontsReady}><AdaptiveProvider><Navigation /></AdaptiveProvider></ThemeProvider> : null;
}

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);
  if (!loaded && !error) return null;
  return <PreferencesProvider><ReadyApp fontsReady={loaded} /></PreferencesProvider>;
}
