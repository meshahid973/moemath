import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/theme/provider';
import { radius, size } from '@/theme/tokens';
import { pressTransition, pressedTransform } from './pressFeedback';

type Props = Omit<PressableProps, 'children' | 'style'> & { icon: LucideIcon; label: string; style?: StyleProp<ViewStyle> };

export function IconButton({ icon: Icon, label, disabled = false, style, accessibilityState, ...props }: Props) {
  const { colors } = useTheme();
  const reducedMotion = useReducedMotion();
  return (
    <Pressable {...props} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ ...accessibilityState, disabled }} disabled={disabled} style={style}>
      {({ pressed }) => <Animated.View style={[styles.button, { backgroundColor: pressed ? colors.pressed : 'transparent' }, !reducedMotion && pressTransition, !reducedMotion && pressed && pressedTransform]}>
        <Icon size={size.icon} color={disabled ? colors.onDisabled : colors.text} strokeWidth={1.75} />
      </Animated.View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: size.touch, height: size.touch, borderRadius: radius.control, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center' },
});
