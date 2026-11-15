import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import { AppText } from '@/components/ui/AppText';
import { symbols, type Question } from '@/engine/arithmetic/types';
import type { SessionAttempt } from '@/engine/session/session';
import { useTheme } from '@/theme/provider';
import { PanelMotif } from '@/components/ui/PanelMotif';
import { SessionCompanion } from './SessionCompanion';
import { AnswerFeedback } from './AnswerFeedback';
import { radius, spacing } from '@/theme/tokens';

const questionAnimation = FadeIn.duration(100).reduceMotion(ReduceMotion.System);
export function equation(question: Question) {
  return question.left + ' ' + symbols[question.operation] + ' ' + question.right;
}

const Equation = memo(function Equation({ question }: { question: Question }) {
  return (
    <Animated.View key={question.key} entering={questionAnimation}>
      <AppText variant="title" style={styles.equation} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>{equation(question)}</AppText>
    </Animated.View>
  );
});

export const QuestionStage = memo(function QuestionStage({ question, input, previous }: {
  question: Question;
  input: string;
  previous?: SessionAttempt;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <PanelMotif subtle />
      <SessionCompanion previous={previous} />
      <Equation question={question} />
      <View style={[styles.answer, { backgroundColor: colors.tint }]}>
        <AppText variant="title" tone="primary" style={styles.answerText} accessibilityLabel={input ? 'Answer ' + input : 'Answer empty'}>{input || '?'}</AppText>
      </View>
      <AnswerFeedback attempt={previous} />
    </View>
  );
});

const styles = StyleSheet.create({
  panel: { flexGrow: 1, justifyContent: 'center', gap: spacing.md, padding: spacing.lg, borderWidth: 1, borderRadius: radius.panel, overflow: 'hidden' },
  equation: { fontSize: 46, textAlign: 'center', fontVariant: ['tabular-nums'] },
  answer: { minHeight: 64, borderRadius: radius.control, justifyContent: 'center', padding: spacing.sm },
  answerText: { fontSize: 36, textAlign: 'center', fontVariant: ['tabular-nums'] },
});
