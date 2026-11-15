import { memo } from 'react';
import { Text, StyleSheet, type TextProps } from 'react-native';
import { useTheme } from '@/theme/provider';

const variants = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '700' },
  heading: { fontSize: 22, fontWeight: '700' },
  body: { fontSize: 16 },
  label: { fontSize: 15, fontWeight: '600' },
  caption: { fontSize: 14 },
});

const families = {
  title: 'NunitoSans_700Bold',
  heading: 'NunitoSans_700Bold',
  body: 'NunitoSans_400Regular',
  label: 'NunitoSans_600SemiBold',
  caption: 'NunitoSans_400Regular',
} as const;

type Props = TextProps & {
  variant?: keyof typeof variants;
  tone?: 'text' | 'muted' | 'primary' | 'onPrimary';
};

export const AppText = memo(function AppText({ variant = 'body', tone = 'text', style, ...props }: Props) {
  const { colors } = useTheme();
  return <Text {...props} style={[variants[variant], { color: colors[tone], fontFamily: families[variant], fontWeight: 'normal' }, style]} />;
});
