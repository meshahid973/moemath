import { useCallback, useState } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { AppText } from '@/components/ui/AppText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { sessionDetail, type SessionDetail } from '@/database/history';
import { formatTime } from '@/engine/session/clock';
import { spacing } from '@/theme/tokens';
import { AttemptRow } from './AttemptRow';

export function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [loaded, setDetail] = useState<{ data: SessionDetail | null; retry: number } | undefined>();
  const detail = loaded?.retry === retry ? loaded.data : undefined;

  useFocusEffect(useCallback(() => {
    let active = true;
    void sessionDetail(typeof id === 'string' ? id : '').then(
      row => { if (active) { setDetail({ data: row, retry }); setError(false); } },
      () => { if (active) setError(true); },
    );
    return () => { active = false; };
  }, [id, retry]));

  return (
    <Screen full>
      <Header title="Session details" back />
      {error ? (
        <View style={styles.notice}>
          <AppText tone="muted">Could not load this session.</AppText>
          <Button label="Retry" variant="secondary" onPress={() => setRetry(x => x + 1)} />
        </View>
      ) : detail === undefined ? (
        <AppText tone="muted">Loading session...</AppText>
      ) : detail === null ? (
        <AppText tone="muted">Session unavailable.</AppText>
      ) : (
        <>
          <View style={styles.summary}>
            <AppText variant="metadata" tone="muted">{new Date(detail.completedAt).toLocaleString()}</AppText>
            <View style={styles.score}>
              <AppText variant="score" tone="primary">{detail.correct}</AppText>
              <AppText variant="denominator" tone="muted">/ {detail.total}</AppText>
            </View>
            <View style={styles.metrics}>
              <View style={styles.metric}>
                <AppText variant="heading" tone="primary">{detail.total > 0 ? Math.round(detail.correct / detail.total * 100) + '%' : '—'}</AppText>
                <AppText variant="caption" tone="muted">Accuracy</AppText>
              </View>
              <View style={styles.metric}>
                <AppText variant="heading" tone="primary">{formatTime(detail.elapsedMs)}</AppText>
                <AppText variant="caption" tone="muted">Time</AppText>
              </View>
            </View>
          </View>
          <View style={styles.attempts}>
            <SectionTitle title="Answers" />
            {detail.attempts.map((attempt, index) => <AttemptRow key={index} attempt={attempt} timing />)}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  notice: { gap: spacing.md },
  summary: { gap: spacing.sm },
  score: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: spacing.sm },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xl },
  metric: { flexGrow: 1, flexBasis: 108, gap: spacing.xs },
  attempts: { gap: spacing.sm },
});
