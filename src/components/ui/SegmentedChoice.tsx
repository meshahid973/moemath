import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '@/theme/provider';
import { size, spacing } from '@/theme/tokens';

export function SegmentedChoice<T extends string | number>({ options, value, onChange, disabled = false, style }: {
  options: readonly { value: T; label: string }[]; value: T; onChange: (value: T) => void;
  disabled?: boolean; style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return (
    <View accessibilityRole="radiogroup" style={[styles.group, { borderBottomColor: colors.border }, style]}>
      {options.map(option => {
        const selected = value === option.value;
        return (
          <Pressable
            key={option.value}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: selected, disabled }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.item,
              {
                backgroundColor: pressed ? colors.pressed : 'transparent',
                borderBottomColor: selected ? colors.primary : 'transparent',
                opacity: disabled ? 0.5 : 1,
              },
            ]}
          >
            <AppText variant="label" tone={selected ? 'primary' : 'muted'} style={styles.label}>{option.label}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', flexWrap: 'wrap', borderBottomWidth: StyleSheet.hairlineWidth },
  item: {
    flexGrow: 1, flexBasis: 76, minHeight: size.touch, justifyContent: 'center',
    alignItems: 'center', paddingVertical: spacing.sm, paddingHorizontal: spacing.xs,
    borderBottomWidth: 3,
  },
  label: { textAlign: 'center', flexShrink: 1 },
});
