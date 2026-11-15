import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, FadeIn, ReduceMotion, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { symbols } from '@/engine/arithmetic/types';
import type { SessionAttempt } from '@/engine/session/session';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';

const enter = FadeIn.duration(120).reduceMotion(ReduceMotion.System);

export const AnswerFeedback = memo(function AnswerFeedback({ attempt }: { attempt?: SessionAttempt }) {
  const { colors } = useTheme();
  const offset = useSharedValue(0);
  const motion = useAnimatedStyle(() => ({ transform: [{ translateX: offset.get() }] }));
  useEffect(() => {
    if (!attempt || attempt.expected === attempt.submitted) {
      offset.set(0);
      return;
    }
    offset.set(withSequence(
      ReduceMotion.System,
      withTiming(-4, { duration: 40 }),
      withTiming(4, { duration: 40 }),
      withTiming(-2, { duration: 40 }),
      withTiming(0, { duration: 40 }),
    ));
    return () => cancelAnimation(offset);
  }, [attempt, offset]);

  const correct = attempt?.expected === attempt?.submitted;
  const color = correct ? colors.success : colors.danger;
  const Icon = correct ? CheckCircle2 : XCircle;
  return (
    <View style={styles.slot}>
      {attempt && <Animated.View style={motion}>
        <Animated.View key={attempt.question.key} entering={enter} style={styles.row}>
          <Icon size={18} color={color} strokeWidth={1.75} />
          <AppText variant="caption" accessibilityLiveRegion="polite" style={[styles.text, { color }]}>
            {correct ? 'Correct!' : attempt.question.left + ' ' + symbols[attempt.question.operation] + ' ' + attempt.question.right + ' = ' + attempt.expected}
          </AppText>
        </Animated.View>
      </Animated.View>}
    </View>
  );
});

const styles = StyleSheet.create({
  slot: { minHeight: 40, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  text: { flexShrink: 1, textAlign: 'center' },
});
