import { Platform, StyleSheet, Switch, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/provider';
import { size, spacing } from '@/theme/tokens';
import { AppText } from './AppText';

export function SwitchRow({ label, value, onChange, disabled = false, style }: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }, style]}>
      <AppText variant="label" style={styles.label}>{label}</AppText>
      <Switch
        accessibilityLabel={label}
        accessibilityState={{ disabled, checked: value }}
        hitSlop={spacing.sm}
        disabled={disabled}
        value={value}
        onValueChange={onChange}
        thumbColor={Platform.OS === 'android' ? value ? colors.onPrimary : colors.surface : undefined}
        trackColor={{ false: colors.controlBorder, true: colors.primary }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: size.button, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth, gap: spacing.md },
  label: { flex: 1 },
});
