import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import type { Question } from '@/engine/arithmetic/types';
import { formatEquation } from '@/engine/arithmetic/format';
import type { SessionAttempt } from '@/engine/session/session';
import { useTheme } from '@/theme/provider';
import { radius, spacing } from '@/theme/tokens';
import { SessionCompanion } from './SessionCompanion';
import { AnswerFeedback } from './AnswerFeedback';

// The expression updates immediately on each question: no entrance animation can
// delay a new problem or compete with keypad input.
const Equation = memo(function Equation({ question }: { question: Question }) {
  return (
    <AppText
      variant="equation"
      tone="onMath"
      style={styles.equation}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.5}
    >
      {formatEquation(question)}
    </AppText>
  );
});

export const QuestionStage = memo(function QuestionStage({ question, input, previous }: {
  question: Question;
  input: string;
  previous?: SessionAttempt;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.stage}>
      <SessionCompanion previous={previous} />
      <View style={[styles.mathBand, { backgroundColor: colors.math }]}>
        <Equation question={question} />
        <View style={[styles.answer, { borderTopColor: colors.onMath + '55' }]}>
          <AppText
            variant="answer"
            tone="onMath"
            style={styles.answerText}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
            accessibilityLabel={input ? 'Answer ' + input : 'Answer empty'}
          >
            {input || '?'}
          </AppText>
        </View>
      </View>
      <AnswerFeedback attempt={previous} />
    </View>
  );
});

const styles = StyleSheet.create({
  stage: { flexGrow: 1, justifyContent: 'center', gap: spacing.md },
  mathBand: {
    minHeight: 192, flexGrow: 1, borderRadius: radius.control,
    justifyContent: 'center', gap: spacing.md,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.compact,
  },
  equation: { textAlign: 'center', fontVariant: ['tabular-nums'] },
  answer: {
    minHeight: 70, justifyContent: 'center', paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  answerText: { textAlign: 'center', fontVariant: ['tabular-nums'] },
});
