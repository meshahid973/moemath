import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import type { Question } from '@/engine/arithmetic/types';
import { formatEquation } from '@/engine/arithmetic/format';
import type { SessionAttempt } from '@/engine/session/session';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { SessionCompanion } from './SessionCompanion';
import { AnswerFeedback } from './AnswerFeedback';

// Keep math immediate. Neither the equation nor the typed answer animates.
const Equation = memo(function Equation({ question }: { question: Question }) {
  return (
    <AppText
      variant="equation"
      style={styles.equation}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.55}
      accessibilityRole="text"
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
      <View style={styles.work}>
        <Equation question={question} />
        <View style={[styles.answer, { borderBottomColor: colors.primary }]}>
          <AppText
            variant="answer"
            tone={input ? 'primary' : 'muted'}
            style={styles.answerText}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.55}
            accessibilityLabel={input ? 'Answer ' + input : 'Answer empty'}
            accessibilityLiveRegion="polite"
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
  stage: { flexGrow: 1, minHeight: 208, justifyContent: 'space-around', gap: spacing.sm },
  work: { flexGrow: 1, justifyContent: 'center', gap: spacing.xl },
  equation: { fontSize: 52, lineHeight: 72, textAlign: 'center', fontVariant: ['tabular-nums'] },
  answer: { alignSelf: 'center', width: '62%', minWidth: 136, maxWidth: 260,
    minHeight: 60, borderBottomWidth: 2, alignItems: 'center', justifyContent: 'center' },
  answerText: { textAlign: 'center', fontVariant: ['tabular-nums'] },
});
