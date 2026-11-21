import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { ArrowUpRight, Check } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import type { PracticeOperation } from '@/engine/arithmetic/types';
import { useTheme } from '@/theme/provider';
import { layout, spacing } from '@/theme/tokens';
import { operationChoices } from './operationAppearance';
import { OperationMark } from './OperationMark';

type Props = { value: PracticeOperation; onChange: (value: PracticeOperation) => void };

// Home shortcuts are an open, two-column study index, not a stack of cards.
export function QuickOperations({ onChange }: Pick<Props, 'onChange'>) {
  const { colors } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const narrow = width < 350 || fontScale >= layout.largeText;
  const choices = operationChoices.filter(choice => choice.value !== 'mixed');

  return (
    <View style={[styles.quickGrid, { borderTopColor: colors.border }]}>
      {choices.map((choice, index) => (
        <Pressable
          key={choice.value}
          accessibilityRole="button"
          accessibilityLabel={choice.label}
          accessibilityHint="Start a ten-question practice session"
          onPress={() => onChange(choice.value)}
          style={({ pressed }) => [
            styles.quickItem, narrow ? styles.quickFull : styles.quickHalf,
            !narrow && index % 2 === 0 && styles.quickLeft,
            {
              backgroundColor: pressed ? colors.pressed : 'transparent',
              borderBottomColor: colors.border,
              borderRightColor: colors.border,
            },
          ]}
        >
          <View style={styles.quickTop}>
            <OperationMark operation={choice.value} color={colors.primary} size={27} />
            <ArrowUpRight size={16} color={colors.muted} strokeWidth={1.7} />
          </View>
          <AppText variant="label" style={styles.quickName}>{choice.label}</AppText>
        </Pressable>
      ))}
    </View>
  );
}

// Setup needs a compact, clearly selected radio control without five tall rows.
export function OperationPicker({ value, onChange }: Props) {
  const { colors } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const singleColumn = width < 340 || fontScale >= layout.largeText;

  return (
    <View accessibilityRole="radiogroup" style={styles.choices}>
      {operationChoices.map(choice => {
        const selected = value === choice.value;
        const full = singleColumn || choice.value === 'mixed';
        return (
          <Pressable
            key={choice.value}
            accessibilityRole="radio"
            accessibilityLabel={choice.label}
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(choice.value)}
            style={({ pressed }) => [
              styles.choice,
              full ? styles.choiceFull : styles.choiceHalf,
              {
                backgroundColor: selected ? colors.character : pressed ? colors.pressed : colors.surface,
                borderColor: selected ? colors.primary : colors.border,
              },
            ]}
          >
            <OperationMark operation={choice.value} color={colors.primary} size={22} />
            <View style={styles.choiceCopy}>
              <AppText variant="label">{choice.label}</AppText>
              {choice.value === 'mixed' && <AppText variant="caption" tone="muted">All four operations</AppText>}
            </View>
            {selected && (
              <Check size={19} color={colors.primary} strokeWidth={2.4}
                style={!full && styles.choiceCheck} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: StyleSheet.hairlineWidth },
  quickItem: {
    minHeight: 84, justifyContent: 'space-between', padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth, gap: spacing.sm,
  },
  quickHalf: { width: '50%' },
  quickFull: { width: '100%' },
  quickLeft: { borderRightWidth: StyleSheet.hairlineWidth },
  quickTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  quickName: { flexShrink: 1 },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  choice: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    borderWidth: 1, borderRadius: 6, minHeight: 62, paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  choiceFull: { flexBasis: '100%', flexGrow: 1 },
  choiceHalf: {
    flexBasis: '46%', flexGrow: 1, minHeight: 76,
    flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center',
    gap: spacing.xs,
  },
  choiceCopy: { flexShrink: 1, minWidth: 0, gap: 2 },
  choiceCheck: { position: 'absolute', top: spacing.sm, right: spacing.sm },
});
