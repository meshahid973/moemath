import { useEffect, useMemo } from 'react';
import { enableFreeze } from 'react-native-screens';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useFonts } from 'expo-font';
import { NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';
import { ThemeProvider, useTheme } from '@/theme/provider';

import { AdaptiveProvider } from '@/features/adaptive/AdaptiveProvider';
import { PreferencesProvider, usePreferences } from '@/features/settings/PreferencesProvider';

enableFreeze(true);

const fonts = { NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold };

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
        <Stack.Screen name="session" options={{ gestureEnabled: false }} />
      </Stack>
    </>
  );
}

function ReadyApp() {
  const { ready } = usePreferences();
  return ready ? <ThemeProvider><AdaptiveProvider><Navigation /></AdaptiveProvider></ThemeProvider> : null;
}

export default function RootLayout() {
  const [loaded, error] = useFonts(fonts);
  if (!loaded && !error) return null;
  return <PreferencesProvider><ReadyApp /></PreferencesProvider>;
}
