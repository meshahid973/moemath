import { memo, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions, type DimensionValue } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { SaveStatus } from '@/features/adaptive/SaveStatus';
import { summarizeAttempts } from '@/engine/scoring';
import type { SessionAttempt } from '@/engine/session/session';
import { useTheme } from '@/theme/provider';
import { layout, spacing } from '@/theme/tokens';
import { CompanionPortrait, hasCompanion } from '@/features/companion/CompanionPortrait';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { resultExpression } from '@/features/companion/expressions';
import { AttemptRow } from '@/features/progress/AttemptRow';
import { formatTime } from '@/engine/session/clock';

type Props = { attempts: readonly SessionAttempt[]; onRetry: () => void; onDone: () => void; saving: boolean };

export const SessionResults = memo(function SessionResults({ attempts, onRetry, onDone, saving }: Props) {
  const { colors } = useTheme();
  const { showCompanion } = useCompanionSettings();
  const { width, fontScale } = useWindowDimensions();
  const score = useMemo(() => summarizeAttempts(attempts), [attempts]);
  const mistakes = useMemo(() => attempts.filter(attempt => attempt.expected !== attempt.submitted), [attempts]);
  const perfect = mistakes.length === 0;
  const showArt = showCompanion && hasCompanion && width >= 350 && fontScale < layout.largeText;

  return (
    <>
      <View style={styles.heading}>
        <AppText variant="title" accessibilityRole="header">Results</AppText>
        <Button label="Done" variant="secondary" disabled={saving} onPress={onDone} />
      </View>
      <View style={styles.hero}>
        <View style={[styles.heroText, showArt && styles.heroTextWithArt]}>
          <AppText variant="caption" tone="muted">{perfect ? 'Flawless round.' : 'Practice complete.'}</AppText>
          <View style={styles.scoreLine}>
            <AppText variant="score" tone="primary" style={styles.score} numberOfLines={1}>{score.correct}</AppText>
            <AppText variant="denominator" tone="muted">/ {score.total}</AppText>
          </View>
        </View>
        {showArt && (
          <View pointerEvents="none" style={styles.portrait}>
            <CompanionPortrait expression={resultExpression(score.correct, score.total)} size={212} />
          </View>
        )}
      </View>
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
        <Metric label="Avg. answer" value={score.averageMs === null ? '—' : (score.averageMs / 1000).toFixed(1) + 's'} />
        <Metric label="Elapsed" value={formatTime(score.totalMs)} />
      </View>
      <SaveStatus />
      <Button label="Practice again" arrow onPress={onRetry} disabled={saving} />
      {mistakes.length > 0 && (
        <View style={styles.review}>
          <AppText variant="heading" accessibilityRole="header">Review your answers</AppText>
          {mistakes.map(attempt => <AttemptRow key={attempt.question.key} attempt={attempt} />)}
        </View>
      )}
      {perfect && <AppText variant="caption" tone="success">Every answer was correct.</AppText>}
    </>
  );
});

function Metric({ label, value }: { label: string; value: string }) {
  return <View style={styles.metric}>
    <AppText variant="heading" style={styles.metricValue}>{value}</AppText>
    <AppText variant="caption" tone="muted">{label}</AppText>
  </View>;
}

const styles = StyleSheet.create({
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hero: { minHeight: 208, justifyContent: 'center', overflow: 'hidden' },
  heroText: { gap: spacing.xs },
  heroTextWithArt: { width: '54%', zIndex: 1 },
  scoreLine: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: spacing.xs },
  score: { fontVariant: ['tabular-nums'] },
  portrait: { position: 'absolute', right: -12, bottom: -18, width: '57%',
    height: '100%', alignItems: 'flex-end', justifyContent: 'flex-end' },
  progress: { height: 3, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  metric: { flexGrow: 1, flexBasis: 86, gap: spacing.xs },
  metricValue: { fontVariant: ['tabular-nums'] },
  review: { gap: spacing.sm, paddingTop: spacing.lg },
});
