import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { symbols, type Question } from '@/engine/arithmetic/types';
import type { SessionAttempt } from '@/engine/session/session';
import { useTheme } from '@/theme/provider';
import { radius, spacing } from '@/theme/tokens';

const feedbackAnimation = FadeIn.duration(150).reduceMotion(ReduceMotion.System);
export function equation(question: Question) {
  return question.left + ' ' + symbols[question.operation] + ' ' + question.right;
}

export const QuestionStage = memo(function QuestionStage({ question, input, previous }: {
  question: Question;
  input: string;
  previous?: SessionAttempt;
}) {
  const { colors } = useTheme();
  const correct = previous && previous.expected === previous.submitted;
  const feedbackColor = correct ? colors.success : colors.danger;
  const FeedbackIcon = correct ? CheckCircle2 : XCircle;

  return (
    <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <AppText variant="caption" tone="muted" style={styles.label}>Solve</AppText>
      <AppText variant="title" style={styles.equation} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>{equation(question)}</AppText>
      <View style={[styles.answer, { backgroundColor: colors.tint }]}>
        <AppText variant="title" tone="primary" style={styles.answerText} accessibilityLabel={input ? 'Answer ' + input : 'Answer empty'}>{input || '?'}</AppText>
      </View>
      <View style={styles.feedback}>
        {previous && (
          <Animated.View key={previous.question.key} entering={feedbackAnimation} style={styles.feedbackRow}>
            <FeedbackIcon size={18} color={feedbackColor} strokeWidth={1.75} />
            <AppText variant="caption" accessibilityLiveRegion="polite" style={[styles.feedbackText, { color: feedbackColor }]}>
              {correct ? 'Correct!' : equation(previous.question) + ' = ' + previous.expected}
            </AppText>
          </Animated.View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  panel: { flexGrow: 1, justifyContent: 'center', gap: spacing.md, padding: spacing.lg, borderWidth: 1, borderRadius: radius.panel },
  label: { textAlign: 'center' },
  equation: { fontSize: 46, textAlign: 'center', fontVariant: ['tabular-nums'] },
  answer: { minHeight: 64, borderRadius: radius.control, justifyContent: 'center', padding: spacing.sm },
  answerText: { fontSize: 36, textAlign: 'center', fontVariant: ['tabular-nums'] },
  feedback: { minHeight: 26, justifyContent: 'center', alignItems: 'center' },
  feedbackRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  feedbackText: { flexShrink: 1 },
});
