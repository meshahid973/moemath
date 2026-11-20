import { cubicBezier } from 'react-native-reanimated';
import { motion } from '@/theme/tokens';

// Reanimated evaluates the transition on the UI thread. Pressable owns dispatch;
// the action never waits for motion. Reduced motion omits spatial feedback entirely.
export const pressTransition = {
  transform: [{ scale: 1 }],
  transitionProperty: 'transform' as const,
  transitionDuration: motion.release,
  transitionTimingFunction: cubicBezier(0.23, 1, 0.32, 1),
};
export const pressedTransform = { transform: [{ scale: motion.pressedScale }] };
