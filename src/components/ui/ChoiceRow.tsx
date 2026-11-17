import { Pressable, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/theme/provider';
import { size, spacing } from '@/theme/tokens';
import { AppText } from './AppText';

type Props = { label: string; selected: boolean; onPress: () => void };

export function ChoiceRow({ label, selected, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={onPress}
      style={({ pressed }) => [styles.row, { backgroundColor: selected || pressed ? colors.tint : 'transparent', borderBottomColor: colors.border }]}>
      <AppText variant="label" style={styles.label}>{label}</AppText>
      <View style={styles.indicator}>{selected && <Check size={20} color={colors.primary} />}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: size.button, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth, gap: spacing.md },
  label: { flex: 1 },
  indicator: { width: 24, alignItems: 'center' },
});
