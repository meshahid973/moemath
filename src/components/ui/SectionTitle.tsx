import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';

export function SectionTitle({ title }: { title: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.accent, { backgroundColor: colors.primary }]} />
      <AppText variant="heading" accessibilityRole="header" style={styles.title}>{title}</AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  accent: { width: 4, height: 20, borderRadius: 2 },
  title: { flex: 1 },
});
