import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Check } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { difficulties, difficultyNames } from '@/engine/arithmetic/difficulty';
import type { Difficulty } from '@/engine/arithmetic/types';
import { useTheme } from '@/theme/provider';
import { layout, radius, spacing, size } from '@/theme/tokens';

type Props = { value: Difficulty; onChange: (value: Difficulty) => void };

export function DifficultyPicker({ value, onChange }: Props) {
  const { colors } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const twoColumns = width < 390 || fontScale >= layout.largeText;

  return (
    <View style={styles.group} accessibilityRole="radiogroup">
      {difficulties.map(level => {
        const selected = level === value;
        return (
          <Pressable
            key={level}
            accessibilityRole="radio"
            accessibilityLabel={'Level ' + level + ', ' + difficultyNames[level]}
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(level)}
            style={({ pressed }) => [
              styles.option,
              { flexBasis: twoColumns ? '46%' : '30%' },
              {
                backgroundColor: selected ? colors.character : pressed ? colors.pressed : colors.surface,
                borderColor: selected ? colors.primary : colors.controlBorder,
              },
            ]}
          >
            <AppText variant="metadata" tone={selected ? 'primary' : 'muted'}>{String(level)}</AppText>
            <AppText variant="label" style={styles.name}>{difficultyNames[level]}</AppText>
            {selected && <Check size={16} color={colors.primary} strokeWidth={2} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  option: {
    flexGrow: 1, minWidth: 90, minHeight: size.button + spacing.sm,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, borderRadius: radius.control, borderWidth: 1,
    paddingHorizontal: spacing.sm, paddingVertical: spacing.sm,
  },
  name: { flexShrink: 1, textAlign: 'center' },
});
