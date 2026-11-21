import { memo, useMemo } from 'react';
import { StyleSheet, View, type DimensionValue } from 'react-native';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Surface } from '@/components/ui/Surface';
import { SaveStatus } from '@/features/adaptive/SaveStatus';
import { summarizeAttempts } from '@/engine/scoring';
import type { SessionAttempt } from '@/engine/session/session';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { CompanionStage } from '@/features/companion/CompanionStage';
import { resultExpression } from '@/features/companion/expressions';
import { AttemptRow } from '@/features/progress/AttemptRow';
import { formatTime } from '@/engine/session/clock';

const enter = FadeInDown.duration(180).reduceMotion(ReduceMotion.System);
type Props = { attempts: readonly SessionAttempt[]; onRetry: () => void; onDone: () => void; saving: boolean };

export const SessionResults = memo(function SessionResults({ attempts, onRetry, onDone, saving }: Props) {
  const { colors } = useTheme();
  const score = useMemo(() => summarizeAttempts(attempts), [attempts]);
  const mistakes = useMemo(() => attempts.filter(attempt => attempt.expected !== attempt.submitted), [attempts]);
  const perfect = mistakes.length === 0;

  return (
    <>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} label="Back" onPress={onDone} disabled={saving} />
        <AppText variant="title" accessibilityRole="header" style={styles.headerTitle}>Results</AppText>
      </View>
      <Animated.View entering={enter} style={[styles.hero, { borderBottomColor: colors.border }]}>
        <CompanionStage expression={resultExpression(score.correct, score.total)}>
          <AppText variant="heading">{perfect ? 'All correct.' : 'Session complete.'}</AppText>
          <View style={styles.scoreLine}>
            <AppText variant="score" tone="primary" style={styles.score} numberOfLines={1}>
              {score.correct}
            </AppText>
            <AppText variant="denominator" tone="muted">/ {score.total}</AppText>
          </View>
          <AppText variant="caption" tone="muted">
            {perfect ? 'Beautiful work.' : 'Every question counts.'}
          </AppText>
        </CompanionStage>
      </Animated.View>
      <View style={styles.summary}>
        <View
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: score.total, now: score.correct }}
          style={[styles.progress, { backgroundColor: colors.border }]}
        >
          <View style={[styles.fill, {
            width: (Math.round(score.accuracy * 100) + '%') as DimensionValue,
            backgroundColor: colors.primary,
          }]} />
        </View>
        <View style={styles.metrics}>
          <Metric label="Accuracy" value={Math.round(score.accuracy * 100) + '%'} />
          <Metric label="Avg. time" value={score.averageMs === null ? '—' : (score.averageMs / 1000).toFixed(1) + 's'} />
          <Metric label="Total time" value={formatTime(score.totalMs)} />
        </View>
      </View>
      {perfect ? (
        <View style={styles.perfect}>
          <CheckCircle2 color={colors.success} size={22} strokeWidth={1.75} />
          <AppText variant="label" style={{ color: colors.success }}>No mistakes to review</AppText>
        </View>
      ) : (
        <View style={styles.review}>
          <SectionTitle title="Review mistakes" />
          <Surface style={styles.reviewPanel}>
            {mistakes.map(attempt => <AttemptRow key={attempt.question.key} attempt={attempt} />)}
          </Surface>
        </View>
      )}
      <SaveStatus />
      <Button label="Practice again" arrow onPress={onRetry} disabled={saving} />
      <Button label="Done" variant="secondary" onPress={onDone} disabled={saving} />
    </>
  );
});

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
  hero: { paddingBottom: spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth },
  scoreLine: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: spacing.xs },
  score: { fontVariant: ['tabular-nums'] },
  summary: { gap: spacing.lg },
  progress: { height: 6, overflow: 'hidden', borderRadius: 3 },
  fill: { height: '100%' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metric: { flexGrow: 1, flexBasis: 84, gap: spacing.xs },
  metricValue: { fontVariant: ['tabular-nums'] },
  metricLabel: { flexShrink: 1 },
  perfect: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  review: { gap: spacing.sm },
  reviewPanel: { gap: 0 },
});
