import { useReducedMotion } from 'react-native-reanimated';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { ArrowUpRight, Check } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import type { PracticeOperation } from '@/engine/arithmetic/types';
import { useTheme } from '@/theme/provider';
import { radius, spacing } from '@/theme/tokens';
import { operationChoices, operationColors } from './operationAppearance';
import { OperationMark } from './OperationMark';

type Props = { value: PracticeOperation; onChange: (value: PracticeOperation) => void };
export function QuickOperations({ onChange }: Pick<Props, 'onChange'>) { return <OperationGrid onChange={onChange} />; }
export function OperationPicker(props: Props) { return <OperationGrid {...props} />; }

function OperationGrid({ value, onChange }: { value?: PracticeOperation; onChange: Props['onChange'] }) {
  const reducedMotion = useReducedMotion();
  const { colors, scheme } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const singleColumn = width < 350 || fontScale > 1.3;
  const quick = value === undefined;
  return <View style={styles.grid} accessibilityRole={quick ? undefined : 'radiogroup'}>
    {operationChoices.filter(choice => !quick || choice.value !== 'mixed').map(choice => {
      const selected = choice.value === value;
      const accent = operationColors[scheme][choice.value];
      return <Pressable key={choice.value}
        accessibilityRole={quick ? 'button' : 'radio'} accessibilityLabel={choice.label}
        accessibilityState={quick ? undefined : { checked: selected }}
        onPress={() => onChange(choice.value)}
        style={({ pressed }) => [styles.tile, quick && styles.quickTile, !quick && choice.value !== 'mixed' && !singleColumn && styles.operationTile, choice.value === 'mixed' || singleColumn ? styles.full : styles.half, {
          borderColor: selected ? colors.primary : colors.border,
          ...(quick ? { borderBottomColor: accent + '55' } : {}),
          backgroundColor: selected || pressed ? colors.tint : quick ? 'transparent' : colors.surface,
          transform: [{ translateY: pressed && !reducedMotion ? 2 : 0 }],
        }]}>
        <View style={[styles.symbol, { backgroundColor: quick ? 'transparent' : accent + '12' }]}><OperationMark operation={choice.value} color={accent} size={quick ? 34 : 26} /></View>
        <View style={[styles.copy, (quick || (!singleColumn && choice.value !== 'mixed')) && styles.quickCopy]}><AppText variant="label" style={styles.name}>{choice.label}</AppText>
          {choice.value === 'mixed' && <AppText variant="caption" tone="muted">All four operations</AppText>}
        </View>
        {quick ? <ArrowUpRight style={styles.quickArrow} size={17} color={colors.muted} /> : <View style={[styles.selection, choice.value !== 'mixed' && !singleColumn && styles.cornerSelection, { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.primary : 'transparent' }]}>{selected && <Check size={12} strokeWidth={2.5} color={colors.onPrimary} />}</View>}
      </Pressable>;
    })}
  </View>;
}
const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  full: { flexBasis: '100%' },
  half: { flexBasis: '47%', flexGrow: 1 },
  tile: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderWidth: 1, borderRadius: radius.control, overflow: 'hidden' },
  quickTile: { minHeight: 88, alignItems: 'flex-start', flexDirection: 'column', gap: spacing.xs, borderWidth: 0, borderBottomWidth: 1, borderRadius: 0, paddingVertical: spacing.sm, paddingHorizontal: spacing.xs },
  operationTile: { minHeight: 88, flexDirection: 'column', alignItems: 'flex-start', gap: spacing.xs },
  cornerSelection: { position: 'absolute', top: 14, right: 12 },
  quickCopy: { flex: 0 },
  quickArrow: { position: 'absolute', top: 14, right: 12 },
  symbol: { width: 36, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 3 },
  copy: { flex: 1, gap: 2 },
  name: { fontSize: 13, lineHeight: 19 },
  selection: { width: 18, height: 18, borderWidth: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
});
