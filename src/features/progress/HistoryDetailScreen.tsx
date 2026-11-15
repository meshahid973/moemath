import { useCallback, useState } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { AppText } from '@/components/ui/AppText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { Surface } from '@/components/ui/Surface';
import { sessionDetail, type SessionDetail } from '@/database/history';
import { formatEquation } from '@/engine/arithmetic/format';
import { useTheme } from '@/theme/provider';

export function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{id: string}>();
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [detail, setDetail] = useState<SessionDetail | null | undefined>(undefined);
  const { colors } = useTheme();
  useFocusEffect(useCallback(() => {
    let active = true;
    void sessionDetail(typeof id === 'string' ? id : '').then(row => { if (active) { setDetail(row); setError(false); } }, () => { if (active) setError(true); });
    return () => { active = false; };
  }, [id, retry]));
  return <Screen full>
    <Header title="Session details" back />
    {error ? <><AppText tone="muted">Could not load session.</AppText><Button label="Retry" variant="secondary" onPress={() => setRetry(x => x + 1)} /></> : detail === undefined ? <AppText tone="muted">Loading session...</AppText> : detail === null ? <AppText tone="muted">Session unavailable.</AppText> : <>
      <Surface>
        <AppText variant="caption" tone="muted">{new Date(detail.completedAt).toLocaleString()}</AppText>
        <AppText variant="title" tone="primary">{detail.correct}/{detail.total}</AppText>
        <AppText variant="label">{Math.round(detail.correct / detail.total * 100)}% accuracy</AppText>
      </Surface>
      {detail.attempts.map((attempt, index) => <Surface key={index}>
        <AppText variant="heading">{formatEquation(attempt.question)}</AppText>
        <AppText variant="label" style={{ color: attempt.expected === attempt.submitted ? colors.success : colors.danger }}>Your answer: {attempt.submitted ?? 'Skipped'}</AppText>
        {attempt.expected !== attempt.submitted && <AppText variant="caption">Correct: {attempt.expected}</AppText>}
        <AppText variant="caption" tone="muted">{(attempt.elapsedMs / 1000).toFixed(1)}s{attempt.interrupted ? ' · Interrupted' : ''}</AppText>
      </Surface>)}
    </>}
  </Screen>;
}
