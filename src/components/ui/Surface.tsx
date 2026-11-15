import { StyleSheet, View, type ViewProps } from 'react-native';
import { useTheme } from '@/theme/provider';
import { radius, spacing } from '@/theme/tokens';

export function Surface({ style, ...props }: ViewProps) {
  const { colors } = useTheme();
  return <View {...props} style={[styles.surface, { backgroundColor: colors.surface, borderColor: colors.border }, style]} />;
}

const styles = StyleSheet.create({
  surface: { padding: spacing.lg, gap: spacing.md, borderRadius: radius.panel, borderWidth: StyleSheet.hairlineWidth },
});
