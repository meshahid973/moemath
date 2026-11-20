import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/theme/provider';
import { radius, size, spacing } from '@/theme/tokens';

export function SegmentedChoice<T extends string | number>({ options, value, onChange, disabled = false, style }: {
  options: readonly { value: T; label: string }[]; value: T; onChange: (value: T) => void;
  disabled?: boolean; style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return <View accessibilityRole="radiogroup" style={[styles.group, style]}>
    {options.map(option => {
      const selected = value === option.value;
      return <Pressable key={option.value} disabled={disabled} accessibilityRole="radio" accessibilityState={{ checked: selected, disabled }} onPress={() => onChange(option.value)}
        style={({ pressed }) => [styles.item, { backgroundColor: pressed ? colors.pressed : selected ? colors.character : colors.surface,
          borderBottomColor: selected ? colors.primary : colors.controlBorder, opacity: disabled ? 0.5 : 1 }]}>
        {selected && <Check size={14} color={colors.primary} />}
        <AppText variant="label" tone={selected ? 'primary' : 'muted'} style={styles.label}>{option.label}</AppText>
      </Pressable>;
    })}
  </View>;
}
const styles = StyleSheet.create({
  group: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  item: { flexGrow: 1, flexBasis: 76, flexDirection: 'row', minHeight: size.touch, justifyContent: 'center', alignItems: 'center', padding: spacing.sm, borderBottomWidth: 2, borderTopLeftRadius: radius.control, borderTopRightRadius: radius.control, gap: spacing.xs },
  label: { textAlign: 'center', flexShrink: 1 },
});
