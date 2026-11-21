import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { AppState, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SegmentedChoice } from '@/components/ui/SegmentedChoice';
import { SkillLevels } from '@/features/adaptive/SkillLevels';
import { dailyTotals } from '@/database/history';
import { aggregate, type DailyTotals, type Period } from '@/engine/progress/metrics';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { ProgressChart } from './ProgressChart';
import { useAdaptive } from '@/features/adaptive/AdaptiveProvider';

const periods = [{ value: 1, label: 'Today' }, { value: 7, label: '7 days' }, { value: 30, label: '30 days' }] as const;
const metrics = [{ value: 'activity', label: 'Questions' }, { value: 'accuracy', label: 'Accuracy' }, { value: 'speed', label: 'Speed' }] as const;

export function ProgressScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { profile } = useAdaptive();
  const revision = Object.values(profile.skills).reduce((sum, skill) => sum + skill.seen, 0);
  const [period, setPeriod] = useState<Period>(7);
  const [metric, setMetric] = useState<'activity' | 'accuracy' | 'speed'>('activity');
  const [data, setData] = useState<{ period: Period; revision: number; retry: number; rows: DailyTotals[] } | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useFocusEffect(useCallback(() => {
    let active = true;
    let request = 0;
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      const current = ++request;
      void dailyTotals(period).then(rows => {
        if (active && current === request) { setData({ period, revision, retry, rows }); setError(false); }
      }, () => { if (active && current === request) setError(true); });
      clearTimeout(timer);
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      timer = setTimeout(refresh, Math.max(1000, midnight.getTime() - Date.now()));
    };
    refresh();
    const sub = AppState.addEventListener('change', state => { if (state === 'active') refresh(); });
    return () => { active = false; clearTimeout(timer); sub.remove(); };
  }, [period, retry, revision]));

  const rows = data?.period === period && data.revision === revision && data.retry === retry ? data.rows : undefined;
  const totals = rows ? aggregate(rows) : null;

  return (
    <Screen contentStyle={styles.screen}>
      <Header title="Progress" />
      <SegmentedChoice options={periods} value={period} onChange={setPeriod} />
      {error ? (
        <View style={styles.notice}>
          <AppText tone="danger">Could not load your statistics.</AppText>
          <Button label="Retry" variant="secondary" onPress={() => setRetry(x => x + 1)} />
        </View>
      ) : !totals ? (
        <AppText tone="muted">Loading progress...</AppText>
      ) : (
        <View style={styles.overview}>
          <View style={[styles.lead, { borderBottomColor: colors.border }]}>
            <AppText variant="score" tone="primary" style={styles.count} numberOfLines={1}>{String(totals.total)}</AppText>
            <View style={styles.leadCopy}>
              <AppText variant="label">questions answered</AppText>
              <AppText variant="caption" tone="muted">{period === 1 ? 'today' : 'in the selected period'}</AppText>
            </View>
          </View>
          <View style={styles.metrics}>
            <Metric label="Accuracy" value={totals.accuracy === null ? '—' : Math.round(totals.accuracy * 100) + '%'} />
            <Metric label="Avg. response" value={totals.averageMs === null ? '—' : (totals.averageMs / 1000).toFixed(1) + 's'} />
            <Metric label="Sessions" value={String(totals.sessions)} />
          </View>
          {totals.total > 0 && rows ? (
            <View style={styles.chart}>
              <AppText variant="heading" accessibilityRole="header">Practice rhythm</AppText>
              <SegmentedChoice options={metrics} value={metric} onChange={setMetric} />
              <ProgressChart key={period + ':' + metric} rows={rows} metric={metric} />
            </View>
          ) : (
            <View style={styles.empty}>
              <AppText variant="heading">A quiet {period === 1 ? 'day' : 'stretch'}.</AppText>
              <AppText variant="caption" tone="muted">No practice recorded for this period.</AppText>
              <Button label="Start a session" variant="secondary" arrow onPress={() => router.push('/practice')} />
            </View>
          )}
        </View>
      )}
      <View style={styles.skills}>
        <AppText variant="heading" accessibilityRole="header">Skill levels</AppText>
        <SkillLevels />
      </View>
      <View style={[styles.links, { borderTopColor: colors.border }]}>
        <Button label="Session history" arrow variant="secondary" onPress={() => router.push('/history')} />
        <Button label="Review mistakes" arrow variant="secondary" onPress={() => router.push('/review')} />
      </View>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <AppText variant="heading" tone="primary" style={styles.metricValue}>{value}</AppText>
      <AppText variant="caption" tone="muted">{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.lg },
  notice: { gap: spacing.sm },
  overview: { gap: spacing.md },
  lead: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: spacing.sm, gap: spacing.lg },
  count: { fontSize: 58, lineHeight: 72, fontVariant: ['tabular-nums'] },
  leadCopy: { flexShrink: 1, gap: spacing.xs },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.md },
  metric: { flexGrow: 1, flexBasis: 80, gap: spacing.xs },
  metricValue: { fontVariant: ['tabular-nums'] },
  chart: { gap: spacing.md, marginTop: spacing.md },
  empty: { gap: spacing.xs, paddingVertical: spacing.md },
  skills: { gap: spacing.sm },
  links: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.sm, gap: 0 },
});
