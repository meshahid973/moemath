import { useCallback, useState } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { AppText } from '@/components/ui/AppText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { Surface } from '@/components/ui/Surface';
import { sessionDetail, type SessionDetail } from '@/database/history';
import { AttemptRow } from './AttemptRow';

export function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{id: string}>();
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [loaded, setDetail] = useState<{ data: SessionDetail | null; retry: number } | undefined>(undefined);
  const detail = loaded?.retry === retry ? loaded.data : undefined;
  useFocusEffect(useCallback(() => {
    let active = true;
    void sessionDetail(typeof id === 'string' ? id : '').then(row => { if (active) { setDetail({ data: row, retry }); setError(false); } }, () => { if (active) setError(true); });
    return () => { active = false; };
  }, [id, retry]));
  return <Screen full>
    <Header title="Session details" back />
    {error ? <><AppText tone="muted">Could not load session.</AppText><Button label="Retry" variant="secondary" onPress={() => setRetry(x => x + 1)} /></> : detail === undefined ? <AppText tone="muted">Loading session...</AppText> : detail === null ? <AppText tone="muted">Session unavailable.</AppText> : <>
      <Surface>
        <AppText variant="caption" tone="muted">{new Date(detail.completedAt).toLocaleString()}</AppText>
        <AppText variant="display" tone="primary">{detail.correct}/{detail.total}</AppText>
        <AppText variant="label">{Math.round(detail.correct / detail.total * 100)}% accuracy</AppText>
      </Surface>
      <Surface style={{ gap: 0, paddingVertical: 0 }}>
        {detail.attempts.map((attempt, index) => <AttemptRow key={index} attempt={attempt} timing />)}
      </Surface>
    </>}
  </Screen>;
}
