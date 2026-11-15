import { Pressable, StyleSheet, type PressableProps } from 'react-native';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/theme/provider';
import { radius, size, spacing } from '@/theme/tokens';
import { AppText } from './AppText';

type Props = Pick<PressableProps, 'onPress' | 'disabled' | 'testID'> & { label: string; variant?: 'primary' | 'secondary' };

export function Button({ label, disabled, variant = 'primary', ...props }: Props) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const motion = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  function animate(value: number, duration: number) {
    scale.set(withTiming(value, { duration, reduceMotion: ReduceMotion.System }));
  }

  return (
    <Animated.View style={motion}>
      <Pressable
        {...props}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        onPressIn={() => animate(0.97, 80)}
        onPressOut={() => animate(1, 140)}
        style={[styles.button, { backgroundColor: variant === 'primary' ? colors.primary : colors.surface, borderColor: variant === 'primary' ? colors.primary : colors.border, opacity: disabled ? 0.5 : 1 }]}
      >
        <AppText variant="label" tone={variant === 'primary' ? 'onPrimary' : 'text'}>{label}</AppText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: size.button, borderWidth: 1, padding: spacing.md, borderRadius: radius.control, alignItems: 'center', justifyContent: 'center' },
});
