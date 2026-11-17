import { useEffect, useMemo } from 'react';
import { enableFreeze } from 'react-native-screens';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useFonts } from 'expo-font';
import { NunitoSans_400Regular } from '@expo-google-fonts/nunito-sans/400Regular';
import { NunitoSans_600SemiBold } from '@expo-google-fonts/nunito-sans/600SemiBold';
import { NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans/700Bold';
import { NunitoSans_900Black_Italic } from '@expo-google-fonts/nunito-sans/900Black_Italic';
import { ThemeProvider, useTheme } from '@/theme/provider';

import { AdaptiveProvider } from '@/features/adaptive/AdaptiveProvider';
import { PreferencesProvider, usePreferencesReady } from '@/features/settings/PreferencesProvider';

enableFreeze(true);

const fonts = { NunitoSans_400Regular, NunitoSans_600SemiBold, NunitoSans_700Bold, NunitoSans_900Black_Italic };

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

function ReadyApp() {
  const ready = usePreferencesReady();
  return ready ? <ThemeProvider><AdaptiveProvider><Navigation /></AdaptiveProvider></ThemeProvider> : null;
}

export default function RootLayout() {
  const [loaded, error] = useFonts(fonts);
  if (!loaded && !error) return null;
  return <PreferencesProvider><ReadyApp /></PreferencesProvider>;
}
