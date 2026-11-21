import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { difficulties, difficultyNames } from '@/engine/arithmetic/difficulty';
import type { Difficulty } from '@/engine/arithmetic/types';
import { useTheme } from '@/theme/provider';
import { layout, spacing } from '@/theme/tokens';

type Props = { value: Difficulty; onChange: (value: Difficulty) => void };

// A compact six-step manual difficulty scale replaces six separate cards.
export function DifficultyPicker({ value, onChange }: Props) {
  const { colors } = useTheme();
  const { fontScale, width } = useWindowDimensions();
  const wrap = fontScale >= layout.largeText || width < 340;
  return (
    <View style={styles.group}>
      <View accessibilityRole="radiogroup" style={styles.scale}>
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
                styles.step,
                wrap && styles.stepWrap,
                {
                  borderBottomColor: selected ? colors.primary : colors.border,
                  backgroundColor: pressed ? colors.pressed : 'transparent',
                },
              ]}
            >
              <AppText variant="heading" tone={selected ? 'primary' : 'muted'}>{String(level)}</AppText>
            </Pressable>
          );
        })}
      </View>
      <AppText variant="caption" tone="muted">{difficultyNames[value]}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.sm },
  scale: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  step: { flexGrow: 1, flexBasis: 42, minWidth: 44, minHeight: 52,
    borderBottomWidth: 2, alignItems: 'center', justifyContent: 'center' },
  stepWrap: { flexBasis: '27%' },
});
