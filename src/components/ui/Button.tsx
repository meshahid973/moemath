import { ArrowUpRight } from 'lucide-react-native';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/theme/provider';
import { motion, radius, size, spacing } from '@/theme/tokens';
import { AppText } from './AppText';

type Props = Pick<PressableProps, 'onPress' | 'disabled' | 'testID'> & { label: string; variant?: 'primary' | 'secondary'; arrow?: boolean };

export function Button({ label, disabled, variant = 'primary', arrow = false, ...props }: Props) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  function animate(value: number, duration: number) {
    scale.set(withTiming(value, { duration, reduceMotion: ReduceMotion.System }));
  }

  return (
    <Animated.View style={pressStyle}>
      <Pressable
        {...props}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        onPressIn={() => animate(0.985, motion.press)}
        onPressOut={() => animate(1, motion.release)}
        style={[styles.button, { backgroundColor: variant === 'primary' ? colors.primary : colors.surface, borderColor: variant === 'primary' ? colors.primary : colors.border, opacity: disabled ? 0.5 : 1 }]}
      >
        <AppText variant="label" style={{ flexShrink: 1, flexGrow: arrow ? 1 : 0, textAlign: arrow ? 'left' : 'center' }} tone={variant === 'primary' ? 'onPrimary' : 'text'}>{label}</AppText>
        {arrow && <ArrowUpRight size={22} color={variant === 'primary' ? colors.onPrimary : colors.primary} strokeWidth={1.8} />}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: size.button, borderWidth: 1, paddingVertical: spacing.lg, paddingHorizontal: spacing.lg, borderRadius: radius.control, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.sm },
});
