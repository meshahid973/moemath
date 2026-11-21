import { useCallback, useState } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { AppText } from '@/components/ui/AppText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
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
    <Screen full contentStyle={styles.screen}>
      <Header title="Session details" back />
      {error ? (
        <View style={styles.notice}>
          <AppText tone="danger">Could not load this session.</AppText>
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
              <AppText variant="label">{detail.total > 0 ? Math.round(detail.correct / detail.total * 100) + '%' : '—'} accuracy</AppText>
              <AppText variant="label">{formatTime(detail.elapsedMs)} elapsed</AppText>
            </View>
          </View>
          <View style={styles.attempts}>
            <AppText variant="heading" accessibilityRole="header">Answers</AppText>
            {detail.attempts.map((attempt, index) => <AttemptRow key={index} attempt={attempt} timing />)}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.lg },
  notice: { gap: spacing.sm },
  summary: { gap: spacing.sm },
  score: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  attempts: { gap: spacing.xs },
});
