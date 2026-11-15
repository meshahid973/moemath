import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/theme/provider';
import { radius, size, spacing } from '@/theme/tokens';

export function SegmentedChoice<T extends string | number>({ options, value, onChange }: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const { colors } = useTheme();
  return (
    <View accessibilityRole="radiogroup" style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {options.map(option => {
        const selected = value === option.value;
        return <Pressable key={option.value} accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={() => onChange(option.value)} style={({ pressed }) => [styles.item, { backgroundColor: selected ? colors.primary : pressed ? colors.tint : 'transparent' }]}>
          <AppText variant="caption" tone={selected ? 'onPrimary' : 'text'} style={styles.label}>{option.label}</AppText>
        </Pressable>;
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  group: { flexDirection: 'row', flexWrap: 'wrap', borderWidth: 1, borderRadius: radius.control, padding: spacing.xs, gap: spacing.xs },
  item: { flexGrow: 1, flexBasis: 76, minHeight: size.touch, borderRadius: radius.control - 3, justifyContent: 'center', alignItems: 'center', padding: spacing.sm },
  label: { textAlign: 'center' },
});
