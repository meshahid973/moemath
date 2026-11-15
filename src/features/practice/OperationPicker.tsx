import { useReducedMotion } from 'react-native-reanimated';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import type { PracticeOperation } from '@/engine/arithmetic/types';
import { useTheme } from '@/theme/provider';
import { radius, spacing } from '@/theme/tokens';
import { operationChoices, operationColors } from './operationAppearance';

type Props = { value: PracticeOperation; onChange: (value: PracticeOperation) => void };

export function QuickOperations({ onChange }: Pick<Props, 'onChange'>) {
  return <OperationGrid onChange={onChange} />;
}

export function OperationPicker(props: Props) {
  return <OperationGrid {...props} />;
}

function OperationGrid({ value, onChange }: { value?: PracticeOperation; onChange: Props['onChange'] }) {
  const reducedMotion = useReducedMotion();
  const { colors, scheme } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const singleColumn = width < 350 || fontScale > 1.3;
  const quick = value === undefined;

  return (
    <View style={styles.grid} accessibilityRole={quick ? undefined : 'radiogroup'}>
      {operationChoices.filter((choice) => !quick || choice.value !== 'mixed').map((choice) => {
        const selected = choice.value === value;
        const accent = operationColors[scheme][choice.value];
        return (
          <View key={choice.value} style={choice.value === 'mixed' || singleColumn ? styles.full : styles.half}>
            <Pressable
              accessibilityRole={quick ? 'button' : 'radio'}
              accessibilityLabel={choice.label}
              accessibilityState={quick ? undefined : { checked: selected }}
              onPress={() => onChange(choice.value)}
              style={({ pressed }) => [
                styles.tile, quick && styles.quickTile,
                {
                  borderColor: selected ? accent : colors.border,
                  backgroundColor: selected || pressed ? colors.tint : colors.surface,
                  transform: [{ scale: pressed && !reducedMotion ? 0.98 : 1 }],
                },
              ]}
            >
              <View pointerEvents="none" style={[styles.corner, { backgroundColor: accent + '12' }]} />
              <AppText accessibilityElementsHidden importantForAccessibility="no" style={[styles.mark, { color: accent }]}>{choice.mark}</AppText>
              <AppText variant="label" style={styles.name}>{choice.label}</AppText>
              {!quick && <View style={[styles.selection, { borderColor: selected ? accent : colors.muted }]}>
                {selected && <View style={[styles.dot, { backgroundColor: accent }]} />}
              </View>}
              {quick && <View style={[styles.rail, { backgroundColor: accent }]} />}
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', margin: -spacing.xs },
  full: { width: '100%', padding: spacing.xs },
  half: { width: '50%', padding: spacing.xs },
  tile: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderWidth: 1, borderRadius: radius.control, overflow: 'hidden' },
  quickTile: { minHeight: 102, alignItems: 'flex-start', flexDirection: 'column', gap: spacing.xs },
  corner: { position: 'absolute', width: 90, height: 90, right: -35, top: -44, transform: [{ rotate: '45deg' }] },
  rail: { width: 24, height: 3, borderRadius: 2, marginTop: spacing.xs },
  mark: { fontSize: 30, lineHeight: 36, fontVariant: ['tabular-nums'] },
  name: { flexShrink: 1, fontSize: 14 },
  selection: { marginLeft: 'auto', width: 16, height: 16, borderWidth: 1.5, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
