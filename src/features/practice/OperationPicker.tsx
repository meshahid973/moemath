import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { RadioGroup, RadioGroupItem } from '@/components/radio';
import type { PracticeOperation } from '@/engine/arithmetic/types';
import { useTheme } from '@/theme/provider';
import { layout, spacing } from '@/theme/tokens';
import { operationChoices } from './operationAppearance';
import { OperationMark } from './OperationMark';

type Props = { value: PracticeOperation; onChange: (value: PracticeOperation) => void };

// Open study index: four 48pt+ shortcuts and no boxed cards.
export function QuickOperations({ onChange }: Pick<Props, 'onChange'>) {
  const { colors } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const single = width < 340 || fontScale >= layout.largeText;
  const choices = operationChoices.filter(choice => choice.value !== 'mixed');

  return (
    <View style={styles.quickList}>
      {choices.map((choice, index) => (
        <Pressable
          key={choice.value}
          accessibilityRole="button"
          accessibilityLabel={choice.label}
          accessibilityHint="Start ten practice questions"
          onPress={() => onChange(choice.value)}
          style={({ pressed }) => [
            styles.quickRow, single ? styles.full : styles.half,
            { backgroundColor: pressed ? colors.pressed : 'transparent',
              borderBottomColor: colors.border,
              borderRightColor: colors.border },
            !single && index % 2 === 0 && styles.leftRow,
          ]}
        >
          <OperationMark operation={choice.value} color={colors.primary} size={23} />
          <AppText variant="label" style={styles.quickLabel}>{choice.label}</AppText>
        </Pressable>
      ))}
    </View>
  );
}

// This is the *original installed* beUI Native RadioGroup and RadioGroupItem.
// Its shared animated selection dot and accessibility state are preserved.
export function OperationPicker({ value, onChange }: Props) {
  return (
    <RadioGroup
      value={value}
      onValueChange={next => onChange(next as PracticeOperation)}
      className="gap-0"
    >
      {operationChoices.map(choice => (
        <RadioGroupItem
          key={choice.value}
          value={choice.value}
          label={choice.label}
          description={choice.value === 'mixed' ? 'All four operations' : undefined}
          className="self-stretch min-h-12 py-2 border-b border-border"
        />
      ))}
    </RadioGroup>
  );
}

const styles = StyleSheet.create({
  quickList: { flexDirection: 'row', flexWrap: 'wrap' },
  quickRow: {
    minHeight: 60, flexDirection: 'row', gap: spacing.md,
    alignItems: 'center', paddingVertical: spacing.sm, paddingHorizontal: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  half: { width: '50%' },
  full: { width: '100%' },
  leftRow: { borderRightWidth: StyleSheet.hairlineWidth },
  quickLabel: { flex: 1, flexShrink: 1 },
});
