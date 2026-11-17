import { Platform, StyleSheet, Switch, View } from 'react-native';
import { useTheme } from '@/theme/provider';
import { size, spacing } from '@/theme/tokens';
import { AppText } from './AppText';

export function SwitchRow({ label, value, onChange, disabled = false }: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: 'transparent', borderBottomColor: colors.border }]}>
      <AppText variant="label" style={styles.label}>{label}</AppText>
      <Switch
        accessibilityLabel={label}
        disabled={disabled}
        value={value}
        onValueChange={onChange}
        thumbColor={Platform.OS === 'android' ? value ? colors.surface : colors.muted : undefined}
        trackColor={{ false: colors.border, true: colors.primary }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: size.button, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth, gap: spacing.md },
  label: { flex: 1 },
});
