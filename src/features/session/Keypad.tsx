import { useReducedMotion } from 'react-native-reanimated';
import { memo } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Check, Delete } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { useTheme } from '@/theme/provider';
import { radius, spacing } from '@/theme/tokens';

export type Key = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'delete' | 'submit';
const rows: readonly (readonly Key[])[] = [
  ['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['delete', '0', 'submit'],
];

type Props = { onKey: (key: Key) => void; canSubmit: boolean };

export const Keypad = memo(function Keypad({ onKey, canSubmit }: Props) {
  const reducedMotion = useReducedMotion();
  const { colors } = useTheme();
  const { height } = useWindowDimensions();
  const minHeight = height < 700 ? 50 : 62;

  return (
    <View style={styles.grid}>
      {rows.map((row, index) => (
        <View key={index} style={styles.row}>
          {row.map(key => {
            const submit = key === 'submit';
            const disabled = submit && !canSubmit;
            return (
              <Pressable
                key={key}
                testID={'key-' + key}
                accessibilityRole="button"
                accessibilityLabel={key === 'delete' ? 'Delete digit' : submit ? 'Submit answer' : key}
                accessibilityState={{ disabled }}
                disabled={disabled}
                onPress={() => onKey(key)}
                style={({ pressed }) => [
                  styles.key,
                  {
                    minHeight,
                    backgroundColor: disabled ? colors.disabled : submit ? colors.primary : pressed ? colors.pressed : colors.surface,
                    borderColor: disabled ? colors.disabled : submit ? colors.primary : colors.controlBorder,
                    borderBottomColor: disabled ? colors.disabled : submit ? colors.primary : pressed ? colors.primary : colors.border,
                    transform: [{ scale: pressed && !reducedMotion ? 0.985 : 1 }],
                  },
                ]}
              >
                {key === 'delete'
                  ? <Delete size={24} color={colors.muted} strokeWidth={1.75} />
                  : submit
                    ? <Check size={27} color={disabled ? colors.onDisabled : colors.onPrimary} strokeWidth={2} />
                    : <AppText variant="heading" style={styles.digit}>{key}</AppText>}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  grid: { gap: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  key: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderBottomWidth: 2, borderRadius: radius.control,
    paddingVertical: spacing.xs,
  },
  digit: { fontSize: 27, fontVariant: ['tabular-nums'] },
});
