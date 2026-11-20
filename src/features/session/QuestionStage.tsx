import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import type { Question } from '@/engine/arithmetic/types';
import { formatEquation } from '@/engine/arithmetic/format';
import type { SessionAttempt } from '@/engine/session/session';
import { useTheme } from '@/theme/provider';
import { SessionCompanion } from './SessionCompanion';
import { AnswerFeedback } from './AnswerFeedback';
import { radius, spacing } from '@/theme/tokens';

const Equation = memo(function Equation({ question }: { question: Question }) {
  return (
    <View>
      <AppText variant="equation" style={styles.equation} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>{formatEquation(question)}</AppText>
    </View>
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
      <SessionCompanion previous={previous} />
      <Equation question={question} />
      <View style={[styles.answer, { backgroundColor: colors.tint, borderBottomColor: colors.primary }]}>
        <AppText variant="equation" tone="primary" style={styles.answerText} accessibilityLabel={input ? 'Answer ' + input : 'Answer empty'}>{input || '?'}</AppText>
      </View>
      <AnswerFeedback attempt={previous} />
    </View>
  );
});

const styles = StyleSheet.create({
  panel: { flexGrow: 1, justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderWidth: 0, borderRadius: radius.panel, overflow: 'hidden' },
  equation: { textAlign: 'center', fontVariant: ['tabular-nums'] },
  answer: { minHeight: 64, marginHorizontal: spacing.lg, borderRadius: radius.control, borderBottomWidth: 2, justifyContent: 'center', padding: spacing.sm },
  answerText: { fontSize: 38, textAlign: 'center', fontVariant: ['tabular-nums'] },
});
