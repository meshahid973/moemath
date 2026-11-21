import { memo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Check } from 'lucide-react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { Keypad as NativeKeypad, KeypadDelete, KeypadKey, KeypadRow } from '@/components/keypad';
import { AppText } from '@/components/ui/AppText';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';

export type Key = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'delete' | 'submit';

const rows: readonly (readonly Key[])[] = [
  ['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['delete', '0', 'submit'],
];

export const Keypad = memo(function Keypad({ onKey, canSubmit }: { onKey: (key: Key) => void; canSubmit: boolean }) {
  const { colors } = useTheme();
  const { height, fontScale } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const compact = height < 760 && fontScale < 1.3;

  // Use the original beUI Native keypad/key components. Only the submit cell
  // has a product-specific label and fill; digit/delete motion is upstream.
  return (
    <NativeKeypad
      size={compact ? 'sm' : 'md'}
      variant="plain"
      disableAnimation={reducedMotion}
      onKeyPress={value => {
        if (/^[0-9]$/.test(value) || value === 'delete' || value === 'submit') onKey(value as Key);
      }}
      style={styles.pad}
    >
      {rows.map((row, index) => (
        <KeypadRow key={index} style={styles.row}>
          {row.map(key => key === 'delete'
            ? <KeypadDelete key={key} testID="key-delete" accessibilityLabel="Delete digit" />
            : key === 'submit'
              ? (
                <KeypadKey key={key} value="submit" testID="key-submit" accessibilityLabel="Submit answer" disabled={!canSubmit}>
                  <View style={[styles.submit, { backgroundColor: canSubmit ? colors.primary : colors.disabled }]}>
                    <Check size={23} color={canSubmit ? colors.onPrimary : colors.onDisabled} strokeWidth={2.3} />
                  </View>
                </KeypadKey>
              )
              : (
                <KeypadKey key={key} value={key} testID={'key-' + key} accessibilityLabel={key}>
                  <AppText variant="heading" style={styles.digit}>{key}</AppText>
                </KeypadKey>
              ),
          )}
        </KeypadRow>
      ))}
    </NativeKeypad>
  );
});

const styles = StyleSheet.create({
  pad: { gap: spacing.xs },
  row: { gap: spacing.sm },
  digit: { fontSize: 24, fontVariant: ['tabular-nums'] },
  submit: { flex: 1, alignSelf: 'stretch', marginHorizontal: 4, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center' },
});
