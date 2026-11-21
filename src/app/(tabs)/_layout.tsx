import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { Home, Calculator, ChartNoAxesColumn } from 'lucide-react-native';
import { useTheme } from '@/theme/provider';
import { layout, spacing, typography } from '@/theme/tokens';

export default function TabsLayout() {
  const { colors, fontsReady } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const wide = width >= layout.rail;
  // A fixed minimum is essential on Android: icons and labels previously
  // exceeded the default tab bar height, clipping all three labels.
  const bottomHeight = 62 + insets.bottom + Math.ceil(Math.max(0, fontScale - 1) * 20);

  const screenOptions = useMemo(() => ({
    headerShown: false,
    animation: 'none' as const,
    tabBarPosition: wide ? 'left' as const : 'bottom' as const,
    tabBarLabelPosition: 'below-icon' as const,
    tabBarVariant: wide ? 'material' as const : 'uikit' as const,
    lazy: true,
    freezeOnBlur: true,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.muted,
    tabBarStyle: {
      backgroundColor: colors.surface, borderTopColor: colors.border,
      borderTopWidth: 1, elevation: 0,
      ...(wide
        ? { width: 96, borderRightWidth: 1, borderRightColor: colors.border }
        : { height: bottomHeight, paddingTop: spacing.xs, paddingBottom: insets.bottom }),
    },
    tabBarLabelStyle: {
      ...typography.metadata,
      fontFamily: fontsReady ? typography.metadata.fontFamily : undefined,
      fontSize: 12, lineHeight: 16, marginTop: 2, marginBottom: 0,
    },
    tabBarItemStyle: wide
      ? { paddingVertical: spacing.xs, minHeight: 54 }
      : { paddingVertical: 0, minHeight: 54 },
    tabBarActiveBackgroundColor: 'transparent',
    sceneStyle: { backgroundColor: colors.background },
  }), [colors, wide, fontsReady, bottomHeight, insets.bottom]);

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="index" options={{
        title: 'Home',
        tabBarIcon: ({ color, size }) => <Home color={color} size={size} strokeWidth={1.9} />,
      }} />
      <Tabs.Screen name="practice" options={{
        title: 'Practice',
        tabBarIcon: ({ color, size }) => <Calculator color={color} size={size} strokeWidth={1.9} />,
      }} />
      <Tabs.Screen name="progress" options={{
        title: 'Progress',
        tabBarIcon: ({ color, size }) => <ChartNoAxesColumn color={color} size={size} strokeWidth={1.9} />,
      }} />
    </Tabs>
  );
}
