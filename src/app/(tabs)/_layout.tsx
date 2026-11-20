import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Calculator, ChartNoAxesColumn } from 'lucide-react-native';
import { useTheme } from '@/theme/provider';
import { layout, spacing, typography } from '@/theme/tokens';

export default function TabsLayout() {
  const { colors, fontsReady } = useTheme();
  const { width } = useWindowDimensions();
  const wide = width >= layout.rail;
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
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, elevation: 0, ...(wide ? { width: 96, borderRightWidth: 1, borderRightColor: colors.border } : {}) },
      tabBarLabelStyle: { ...typography.metadata, fontFamily: fontsReady ? typography.metadata.fontFamily : undefined, marginTop: spacing.xs },
      tabBarItemStyle: { paddingVertical: spacing.xs, minHeight: 54 },
      tabBarActiveBackgroundColor: colors.tint,
      sceneStyle: { backgroundColor: colors.background },
    }), [colors, wide, fontsReady]);
  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Home color={color} size={size} strokeWidth={1.75} /> }} />
      <Tabs.Screen name="practice" options={{ title: 'Practice', tabBarIcon: ({ color, size }) => <Calculator color={color} size={size} strokeWidth={1.75} /> }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: ({ color, size }) => <ChartNoAxesColumn color={color} size={size} strokeWidth={1.75} /> }} />
    </Tabs>
  );
}
