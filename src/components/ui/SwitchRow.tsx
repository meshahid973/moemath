import { StyleSheet, Switch, View } from 'react-native';
import { useTheme } from '@/theme/provider';
import { radius, size, spacing } from '@/theme/tokens';
import { AppText } from './AppText';

export function SwitchRow({ label, value, onChange }: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: colors.surface }]}>
      <AppText variant="label" style={styles.label}>{label}</AppText>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primary }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: size.button, paddingHorizontal: spacing.lg, borderRadius: radius.control, gap: spacing.md },
  label: { flex: 1 },
});
