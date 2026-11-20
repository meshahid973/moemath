import { ArrowUpRight } from 'lucide-react-native';
import { ActivityIndicator, Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { useTheme } from '@/theme/provider';
import { motion, radius, size, spacing } from '@/theme/tokens';
import { AppText } from './AppText';
import { pressTransition, pressedTransform } from './pressFeedback';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  label: string; variant?: 'primary' | 'secondary'; arrow?: boolean;
  loading?: boolean; style?: StyleProp<ViewStyle>;
};

export function Button({ label, disabled = false, loading = false, variant = 'primary', arrow = false, style, accessibilityState, ...props }: Props) {
  const { colors } = useTheme();
  const reducedMotion = useReducedMotion();
  const blocked = disabled || loading;
  const foreground = blocked ? colors.onDisabled : variant === 'primary' ? colors.onPrimary : colors.primary;

  return (
    <Pressable
      {...props}
      disabled={blocked}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel ?? label}
      accessibilityState={{ ...accessibilityState, disabled: blocked, busy: loading }}
      pressRetentionOffset={spacing.lg}
      style={style}
    >
      {({ pressed }) => <Animated.View style={[styles.button,
        { backgroundColor: blocked ? colors.disabled : variant === 'primary' ? colors.primary : pressed ? colors.pressed : colors.surface,
          borderColor: blocked ? colors.disabled : variant === 'primary' ? colors.primary : colors.controlBorder },
        !reducedMotion && pressTransition, !reducedMotion && pressed && !blocked && pressedTransform,
        { transitionDuration: pressed ? motion.press : motion.release, opacity: pressed && variant === 'primary' ? 0.88 : 1 }]}>
        <AppText variant="label" style={{ flexShrink: 1, flexGrow: arrow ? 1 : 0, textAlign: arrow ? 'left' : 'center', color: foreground }}>{label}</AppText>
        {loading ? <ActivityIndicator color={foreground} /> : arrow ? <ArrowUpRight size={size.icon} color={foreground} strokeWidth={1.8} /> : null}
      </Animated.View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: size.button, borderWidth: 1, paddingVertical: spacing.lg, paddingHorizontal: spacing.lg, borderRadius: radius.control, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.sm },
});
