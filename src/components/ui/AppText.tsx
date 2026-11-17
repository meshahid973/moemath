import { memo } from 'react';
import { Text, type TextProps } from 'react-native';
import { useTheme } from '@/theme/provider';
import { typography } from '@/theme/tokens';

type Props = TextProps & {
  variant?: keyof typeof typography;
  tone?: 'text' | 'muted' | 'primary' | 'onPrimary';
};

export const AppText = memo(function AppText({ variant = 'body', tone = 'text', style, ...props }: Props) {
  const { colors } = useTheme();
  return <Text {...props} style={[typography[variant], { color: colors[tone], fontWeight: 'normal' }, style]} />;
});
