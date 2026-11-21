import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { ArrowUpRight, Check } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import type { PracticeOperation } from '@/engine/arithmetic/types';
import { useTheme } from '@/theme/provider';
import { size, spacing } from '@/theme/tokens';
import { operationChoices } from './operationAppearance';
import { OperationMark } from './OperationMark';

type Props = { value: PracticeOperation; onChange: (value: PracticeOperation) => void };

export function QuickOperations({ onChange }: Pick<Props, 'onChange'>) {
  const { colors } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const narrow = width < 350 || fontScale >= 1.35;

  return (
    <View style={styles.quickGrid}>
      {operationChoices.filter(choice => choice.value !== 'mixed').map(choice => (
        <Pressable
          key={choice.value}
          accessibilityRole="button"
          accessibilityLabel={choice.label}
          accessibilityHint="Start a ten-question practice session"
          onPress={() => onChange(choice.value)}
          style={({ pressed }) => [
            styles.quickTile, narrow ? styles.quickFull : styles.quickHalf,
            { backgroundColor: pressed ? colors.pressed : colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.quickTop}>
            <OperationMark operation={choice.value} color={colors.primary} size={31} />
            <ArrowUpRight size={18} color={colors.muted} strokeWidth={1.7} />
          </View>
          <AppText variant="label" style={styles.quickName}>{choice.label}</AppText>
        </Pressable>
      ))}
    </View>
  );
}

export function OperationPicker(props: Props) {
  return <OperationRows {...props} />;
}

// Setup remains a radio list; Home uses a more compact two-column shortcut grid.
function OperationRows({ value, onChange }: Props) {
  const { colors } = useTheme();
  return (
    <View accessibilityRole="radiogroup" style={styles.list}>
      {operationChoices.map(choice => {
        const selected = value === choice.value;
        return (
          <Pressable
            key={choice.value}
            accessibilityRole="radio"
            accessibilityLabel={choice.label}
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(choice.value)}
            style={({ pressed }) => [
              styles.row,
              { borderBottomColor: colors.border,
                backgroundColor: pressed ? colors.pressed : selected ? colors.character : 'transparent' },
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
            {selected
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
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  quickTile: {
    flexGrow: 1, minWidth: 0, minHeight: 106, borderWidth: 1, borderRadius: 10,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    justifyContent: 'space-between', gap: spacing.sm,
  },
  quickHalf: { flexBasis: '46%' },
  quickFull: { flexBasis: '100%', minHeight: 76 },
  quickTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  quickName: { flexShrink: 1 },
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
