import { useReducedMotion } from 'react-native-reanimated';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { difficulties, difficultyNames } from '@/engine/arithmetic/difficulty';
import type { Difficulty } from '@/engine/arithmetic/types';
import { useTheme } from '@/theme/provider';
import { radius, spacing, size } from '@/theme/tokens';

type Props = { value: Difficulty; onChange: (value: Difficulty) => void };

export function DifficultyPicker({ value, onChange }: Props) {
  const reducedMotion = useReducedMotion();
  const { colors } = useTheme();
  return (
    <View style={styles.group} accessibilityRole="radiogroup">
      {difficulties.map((level) => {
        const selected = level === value;
        return (
          <Pressable key={level}
            accessibilityRole="radio"
            accessibilityLabel={difficultyNames[level]}
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(level)}
            style={({ pressed }) => [styles.option, {
              backgroundColor: selected ? colors.primary : pressed ? colors.tint : colors.surface,
              borderColor: selected ? colors.primary : colors.border,
              transform: [{ scale: pressed && !reducedMotion ? 0.98 : 1 }],
            }]}
          >
            <AppText variant="caption" tone={selected ? 'onPrimary' : 'muted'} style={{ fontVariant: ['tabular-nums'] }}>0{level}</AppText>
            <AppText tone={selected ? 'onPrimary' : 'text'} variant="label">{difficultyNames[level]}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  option: { flexBasis: '30%', flexGrow: 1, minWidth: 92, minHeight: size.button, borderRadius: radius.control, borderWidth: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.sm },
});
