import { StyleSheet, View, type ViewProps } from 'react-native';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';

export function Surface({ style, ...props }: ViewProps) {
  const { colors } = useTheme();
  return <View {...props} style={[styles.surface, { borderColor: colors.border }, style]} />;
}

const styles = StyleSheet.create({
  surface: { paddingVertical: spacing.lg, gap: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth },
});
