import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { AppState, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { SegmentedChoice } from '@/components/ui/SegmentedChoice';
import { SkillLevels } from '@/features/adaptive/SkillLevels';
import { EmptyState } from '@/components/ui/EmptyState';
import { Surface } from '@/components/ui/Surface';
import { dailyTotals } from '@/database/history';
import { aggregate, type DailyTotals, type Period } from '@/engine/progress/metrics';
import { spacing } from '@/theme/tokens';
import { ProgressChart } from './ProgressChart';
import { useAdaptive } from '@/features/adaptive/AdaptiveProvider';

const periods = [{ value: 1, label: 'Today' }, { value: 7, label: '7 days' }, { value: 30, label: '30 days' }] as const;
const metrics = [{ value: 'activity', label: 'Activity' }, { value: 'accuracy', label: 'Accuracy' }, { value: 'speed', label: 'Speed' }] as const;

export function ProgressScreen() {
  const router = useRouter();
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
    <Screen>
      <Header title="Progress" />
      <SegmentedChoice options={periods} value={period} onChange={setPeriod} />
      <Surface>
        {error ? <>
          <AppText tone="muted">Could not load statistics.</AppText>
          <Button label="Retry" variant="secondary" onPress={() => setRetry(x => x + 1)} />
        </> : !totals ? <AppText tone="muted">Loading progress...</AppText> : <>
          <View style={styles.grid}>
            <Metric label="Answered" value={String(totals.total)} />
            <Metric label="Accuracy" value={totals.accuracy === null ? 'N/A' : Math.round(totals.accuracy * 100) + '%'} />
            <Metric label="Avg. response" value={totals.averageMs === null ? 'N/A' : (totals.averageMs / 1000).toFixed(1) + 's'} />
            <Metric label="Sessions" value={String(totals.sessions)} />
          </View>
          {totals.total > 0 && rows ? <>
            <SegmentedChoice options={metrics} value={metric} onChange={setMetric} />
            <ProgressChart key={period + ':' + metric} rows={rows} metric={metric} />
          </> : <EmptyState title="Every answer adds up." message="Complete a session to start your practice record." action="Start practice" onPress={() => router.push('/practice')} />}
        </>}
      </Surface>
      <SectionTitle title="Your skills" />
      <SkillLevels />
      <Button label="Session history" arrow variant="secondary" onPress={() => router.push('/history')} />
      <Button label="Review mistakes" arrow variant="secondary" onPress={() => router.push('/review')} />
    </Screen>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return <View style={styles.metric}><AppText variant="display" tone="primary">{value}</AppText><AppText variant="caption" tone="muted">{label}</AppText></View>;
}
const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metric: { flexBasis: '40%', flexGrow: 1, gap: 2, paddingVertical: spacing.sm },
});
