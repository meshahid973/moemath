import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/theme/provider';
import { size, spacing } from '@/theme/tokens';
import { AppText } from './AppText';

type Props = Omit<PressableProps, 'children' | 'style'> & { label: string; selected: boolean; style?: StyleProp<ViewStyle> };

export function ChoiceRow({ label, selected, disabled = false, style, accessibilityState, ...props }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable {...props} disabled={disabled} accessibilityRole="radio" accessibilityState={{ ...accessibilityState, checked: selected, disabled }}
      style={({ pressed }) => [styles.row, { backgroundColor: pressed ? colors.pressed : selected ? colors.character : 'transparent', borderBottomColor: colors.border, opacity: disabled ? 0.5 : 1 }, style]}>
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
