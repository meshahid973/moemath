import { StyleSheet, View } from 'react-native';
import { ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Surface } from '@/components/ui/Surface';
import { summarizeAttempts } from '@/engine/scoring';
import type { SessionAttempt } from '@/engine/session/session';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { equation } from './QuestionStage';
import { formatTime } from './SessionTimer';

type Props = { attempts: readonly SessionAttempt[]; onRetry: () => void; onDone: () => void };

export function SessionResults({ attempts, onRetry, onDone }: Props) {
  const { colors } = useTheme();
  const score = summarizeAttempts(attempts);
  const mistakes = attempts.filter((attempt) => attempt.expected !== attempt.submitted);

  return (
    <>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} label="Back" onPress={onDone} />
        <AppText variant="title" accessibilityRole="header" style={styles.headerTitle}>Results</AppText>
        <IconButton icon={RotateCcw} label="Practice again" onPress={onRetry} />
      </View>
      <Surface style={[styles.result, { backgroundColor: colors.tint }]}>
        <AppText variant="caption" tone="muted">Correct answers</AppText>
        <AppText variant="title" tone="primary" style={styles.score}>{score.correct}/{score.total}</AppText>
        <View style={styles.metrics}>
          <Metric label="Accuracy" value={Math.round(score.accuracy * 100) + '%'} />
          <Metric label="Avg. time" value={score.averageMs === null ? '0s' : (score.averageMs / 1000).toFixed(1) + 's'} />
          <Metric label="Total" value={formatTime(score.totalMs)} />
        </View>
      </Surface>
      {mistakes.length > 0 ? (
        <View style={styles.review}>
          <AppText variant="heading" accessibilityRole="header">Review</AppText>
          {mistakes.map((attempt) => (
            <Surface key={attempt.question.key}>
              <AppText variant="label">{equation(attempt.question)}</AppText>
              <View style={styles.answers}>
                <AppText variant="caption" tone="muted">Your answer: {attempt.submitted ?? 'Skipped'}</AppText>
                <AppText variant="label" style={{ color: colors.success }}>{attempt.expected}</AppText>
              </View>
            </Surface>
          ))}
        </View>
      ) : (
        <View style={styles.perfect}>
          <CheckCircle2 color={colors.success} size={22} strokeWidth={1.75} />
          <AppText variant="label">All correct!</AppText>
        </View>
      )}
      <Button label="Practice again" onPress={onRetry} />
      <Button label="Done" variant="secondary" onPress={onDone} />
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <AppText variant="heading" style={styles.metricValue}>{value}</AppText>
      <AppText variant="caption" tone="muted" style={styles.metricLabel}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerTitle: { flex: 1 },
  result: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  score: { fontSize: 56, fontVariant: ['tabular-nums'] },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md, width: '100%', marginTop: spacing.md },
  metric: { flexGrow: 1, flexBasis: 78, alignItems: 'center', gap: spacing.xs },
  metricValue: { fontSize: 20, fontVariant: ['tabular-nums'], textAlign: 'center' },
  metricLabel: { textAlign: 'center' },
  review: { gap: spacing.sm },
  answers: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  perfect: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
});
