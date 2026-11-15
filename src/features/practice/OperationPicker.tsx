import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { symbols, type PracticeOperation } from '@/engine/arithmetic/types';
import { useTheme } from '@/theme/provider';
import { radius, spacing } from '@/theme/tokens';

const choices = [
  { value: 'mixed', label: 'Mixed', mark: '±', color: '#A48AD5' },
  { value: 'addition', label: 'Addition', mark: symbols.addition, color: '#56BEB2' },
  { value: 'subtraction', label: 'Subtraction', mark: symbols.subtraction, color: '#DF9DB6' },
  { value: 'multiplication', label: 'Multiplication', mark: symbols.multiplication, color: '#A48AD5' },
  { value: 'division', label: 'Division', mark: symbols.division, color: '#82B6DC' },
] as const;

type Props = { value: PracticeOperation; onChange: (value: PracticeOperation) => void };

export function OperationPicker({ value, onChange }: Props) {
  const { colors } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const singleColumn = width < 350 || fontScale > 1.3;

  return (
    <View style={styles.grid} accessibilityRole="radiogroup">
      {choices.map((choice) => {
        const selected = choice.value === value;
        return (
          <View key={choice.value} style={choice.value === 'mixed' || singleColumn ? styles.full : styles.half}>
            <Pressable
              accessibilityRole="radio"
              accessibilityLabel={choice.label}
              accessibilityState={{ checked: selected }}
              onPress={() => onChange(choice.value)}
              style={({ pressed }) => [
                styles.tile,
                {
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: selected || pressed ? colors.tint : colors.surface,
                },
              ]}
            >
              <View style={[styles.rail, { backgroundColor: choice.color }]} />
              <AppText accessibilityElementsHidden importantForAccessibility="no" style={styles.mark}>{choice.mark}</AppText>
              <AppText variant="label" style={styles.name}>{choice.label}</AppText>
              <View style={[styles.selection, { borderColor: selected ? colors.primary : colors.muted }]}>
                {selected && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
              </View>
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
  tile: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, paddingLeft: spacing.lg, borderWidth: 1, borderRadius: radius.control, overflow: 'hidden' },
  rail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  mark: { fontSize: 24, lineHeight: 31, fontVariant: ['tabular-nums'] },
  name: { flex: 1, fontSize: 14 },
  selection: { width: 16, height: 16, borderWidth: 1.5, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
