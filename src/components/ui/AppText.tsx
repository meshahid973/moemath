import { memo } from 'react';
import { Text, type TextProps } from 'react-native';
import { useTheme } from '@/theme/provider';
import { typography } from '@/theme/tokens';

type Props = TextProps & {
  variant?: keyof typeof typography;
  tone?: 'text' | 'muted' | 'primary' | 'onPrimary' | 'onMath' | 'success' | 'danger';
};

export const AppText = memo(function AppText({ variant = 'body', tone = 'text', style, ...props }: Props) {
  const { colors, fontsReady } = useTheme();
  return <Text {...props} style={[
    typography[variant],
    { color: colors[tone] },
    style,
    !fontsReady && {
      fontFamily: undefined,
      fontWeight: typography[variant].fontFamily === typography.body.fontFamily ? '400' : '700',
    },
  ]} />;
});
