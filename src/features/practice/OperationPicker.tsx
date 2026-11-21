import { Pressable, StyleSheet, View } from 'react-native';
import { ArrowUpRight, Check } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import type { PracticeOperation } from '@/engine/arithmetic/types';
import { useTheme } from '@/theme/provider';
import { size, spacing } from '@/theme/tokens';
import { operationChoices } from './operationAppearance';
import { OperationMark } from './OperationMark';

type Props = { value: PracticeOperation; onChange: (value: PracticeOperation) => void };

export function QuickOperations({ onChange }: Pick<Props, 'onChange'>) {
  return <OperationRows onChange={onChange} />;
}

export function OperationPicker(props: Props) {
  return <OperationRows {...props} />;
}

// The same open-row layout works for quick-start links and mutually exclusive setup.
function OperationRows({ value, onChange }: { value?: PracticeOperation; onChange: Props['onChange'] }) {
  const { colors } = useTheme();
  const quick = value === undefined;

  return (
    <View accessibilityRole={quick ? undefined : 'radiogroup'} style={styles.list}>
      {operationChoices.filter(choice => !quick || choice.value !== 'mixed').map(choice => {
        const selected = !quick && value === choice.value;
        return (
          <Pressable
            key={choice.value}
            accessibilityRole={quick ? 'button' : 'radio'}
            accessibilityLabel={choice.label}
            accessibilityHint={quick ? 'Start a ten-question session' : undefined}
            accessibilityState={quick ? undefined : { checked: selected }}
            onPress={() => onChange(choice.value)}
            style={({ pressed }) => [
              styles.row,
              {
                borderBottomColor: colors.border,
                backgroundColor: pressed ? colors.pressed : selected ? colors.character : 'transparent',
              },
            ]}
          >
            {selected && <View style={[styles.selectionRail, { backgroundColor: colors.primary }]} />}
            <View style={styles.symbol}>
              <OperationMark operation={choice.value} color={colors.primary} size={28} />
            </View>
            <View style={styles.copy}>
              <AppText variant="label">{choice.label}</AppText>
              {choice.value === 'mixed' && <AppText variant="caption" tone="muted">All four operations</AppText>}
            </View>
            {quick
              ? <ArrowUpRight size={size.icon} color={colors.muted} strokeWidth={1.75} />
              : selected
                ? <View style={[styles.checked, { backgroundColor: colors.primary }]}>
                    <Check size={16} color={colors.onPrimary} strokeWidth={2.5} />
                  </View>
                : <View style={[styles.unchecked, { borderColor: colors.controlBorder }]} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 0 },
  row: {
    minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  selectionRail: { position: 'absolute', top: spacing.sm, bottom: spacing.sm, left: 0, width: 3 },
  symbol: { width: 36, height: 44, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0, gap: spacing.xs },
  checked: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  unchecked: { width: 22, height: 22, borderWidth: 1.5, borderRadius: 11, marginRight: 1 },
});
