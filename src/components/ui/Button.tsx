import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/theme/provider';
import { radius, size, spacing } from '@/theme/tokens';
import { AppText } from './AppText';

type Props = Pick<PressableProps, 'onPress' | 'disabled' | 'testID'> & { label: string; variant?: 'primary' | 'secondary'; arrow?: boolean };

export function Button({ label, disabled, variant = 'primary', arrow = false, ...props }: Props) {
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
        <AppText variant="label" style={{ flexShrink: 1, textAlign: 'center' }} tone={variant === 'primary' ? 'onPrimary' : 'text'}>{label}</AppText>
        {arrow && <ChevronRight size={18} color={variant === 'primary' ? colors.onPrimary : colors.text} strokeWidth={2} />}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: size.button, borderWidth: 1, padding: spacing.md, borderRadius: radius.control, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.sm },
});
