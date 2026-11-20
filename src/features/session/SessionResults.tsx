import { memo, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
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
import { CompanionPortrait } from '@/features/companion/CompanionPortrait';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { resultExpression } from '@/features/companion/expressions';
import { AttemptRow } from '@/features/progress/AttemptRow';
import { formatTime } from '@/engine/session/clock';

const enter = FadeInDown.duration(220).reduceMotion(ReduceMotion.System);
type Props = { attempts: readonly SessionAttempt[]; onRetry: () => void; onDone: () => void; saving: boolean };

export const SessionResults = memo(function SessionResults({ attempts, onRetry, onDone, saving }: Props) {
  const { colors } = useTheme();
  const { showCompanion } = useCompanionSettings();
  const { width, fontScale } = useWindowDimensions();
  const score = useMemo(() => summarizeAttempts(attempts), [attempts]);
  const mistakes = useMemo(() => attempts.filter((attempt) => attempt.expected !== attempt.submitted), [attempts]);
  const perfect = mistakes.length === 0;
  const horizontal = width >= 360 && fontScale <= 1.2;

  return (
    <>
      <View style={styles.header}>
        <IconButton icon={ArrowLeft} label="Back" onPress={onDone} disabled={saving} />
        <AppText variant="title" accessibilityRole="header" style={styles.headerTitle}>Results</AppText>
      </View>
      <Animated.View entering={enter}>
        <Surface style={[styles.result, { backgroundColor: colors.stage }]}>
          <View style={[styles.summary, horizontal && styles.horizontal]}>
            <View style={styles.scoreGroup}>
              <AppText variant="heading">{perfect ? 'Beautifully done.' : 'Session complete.'}</AppText>
              <AppText variant="score" tone="primary" style={styles.score} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.65}>{score.correct}/{score.total}</AppText>
              <AppText variant="caption">{perfect ? 'Amazing!' : score.accuracy >= 0.8 ? 'Nice work!' : 'Keep practicing!'}</AppText>
            </View>
            {showCompanion && <CompanionPortrait expression={resultExpression(score.correct, score.total)} size={horizontal ? 156 : 128} />}
          </View>
          <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: score.total, now: score.correct }} style={[styles.bar, { backgroundColor: colors.border }]}>
            <View style={[styles.fill, { width: `${Math.round(score.accuracy * 100)}%`, backgroundColor: colors.primary }]} />
          </View>
          <View style={styles.metrics}>
            <Metric label="Accuracy" value={Math.round(score.accuracy * 100) + '%'} />
            <Metric label="Avg. time" value={score.averageMs === null ? '0s' : (score.averageMs / 1000).toFixed(1) + 's'} />
            <Metric label="Total" value={formatTime(score.totalMs)} />
          </View>
        </Surface>
      </Animated.View>
      {perfect ? (
        <View style={styles.perfect}>
          <CheckCircle2 color={colors.success} size={22} strokeWidth={1.75} />
          <AppText variant="label" style={{ color: colors.success }}>All correct!</AppText>
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
      <AppText variant="caption" style={styles.metricLabel}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerTitle: { flex: 1 },
  result: { overflow: 'hidden', gap: spacing.lg, borderTopWidth: 0, borderRadius: 12, padding: spacing.lg },
  summary: { alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  horizontal: { flexDirection: 'row' },
  scoreGroup: { flexShrink: 1, flexGrow: 1, gap: spacing.xs },
  score: { fontSize: 60, fontVariant: ['tabular-nums'] },
  bar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm },
  metric: { flexGrow: 1, flexBasis: 78, alignItems: 'center', gap: spacing.xs },
  metricValue: { fontSize: 20, fontVariant: ['tabular-nums'], textAlign: 'center' },
  metricLabel: { textAlign: 'center' },
  review: { gap: spacing.sm },
  reviewPanel: { gap: 0 },
  perfect: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
});
