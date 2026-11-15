import { useMemo } from 'react';
import { Tabs } from 'expo-router';
import { Home, Calculator, ChartNoAxesColumn } from 'lucide-react-native';
import { useTheme } from '@/theme/provider';

export default function TabsLayout() {
  const { colors } = useTheme();
  const screenOptions = useMemo(() => ({
      headerShown: false,
      lazy: true,
      freezeOnBlur: true,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.muted,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      tabBarLabelStyle: { fontFamily: 'NunitoSans_600SemiBold', fontSize: 12 },
      sceneStyle: { backgroundColor: colors.background },
    }), [colors]);
  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Home color={color} size={size} strokeWidth={1.75} /> }} />
      <Tabs.Screen name="practice" options={{ title: 'Practice', tabBarIcon: ({ color, size }) => <Calculator color={color} size={size} strokeWidth={1.75} /> }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: ({ color, size }) => <ChartNoAxesColumn color={color} size={size} strokeWidth={1.75} /> }} />
    </Tabs>
  );
}
