import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/theme/provider';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { Surface } from '@/components/ui/Surface';
import { Button } from '@/components/ui/Button';
import { historyPage, type HistoryRow } from '@/database/history';
import { formatTime } from '@/engine/session/clock';
import { spacing } from '@/theme/tokens';

export function HistoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [cursors, setCursors] = useState<(HistoryRow | undefined)[]>([undefined]);
  const cursor = cursors.at(-1);
  const [page, setPage] = useState<{ rows: HistoryRow[]; more: boolean; retry: number } | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useFocusEffect(useCallback(() => {
    let active = true;
    void historyPage(cursor).then(result => {
      if (active) { setPage({ ...result, retry }); setError(false); }
    }, () => { if (active) setError(true); });
    return () => { active = false; };
  }, [cursor, retry]));

  return <Screen full>
    <Header title="Session history" back />
    {error ? <Button label="Retry" onPress={() => setRetry(x => x + 1)} /> : !page || page.retry !== retry ? <AppText tone="muted">Loading history...</AppText> : !page.rows.length ? <AppText tone="muted">No saved sessions.</AppText> : <>
      <Surface>
        {page.rows.map(row => <Pressable key={row.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/history-detail', params: { id: row.id } })} style={({ pressed }) => [styles.row, { backgroundColor: pressed ? colors.tint : 'transparent' }]} >
          <View style={styles.copy}>
            <AppText variant="label">{new Date(row.completedAt).toLocaleDateString()}</AppText>
            <AppText variant="caption" tone="muted">{row.correct}/{row.total} correct · {formatTime(row.elapsedMs)}</AppText>
          </View>
          <ChevronRight size={20} color={colors.muted} />
        </Pressable>)}
      </Surface>
      <View style={styles.page}>
        <Button label="Previous" variant="secondary" disabled={cursors.length <= 1} onPress={() => { setPage(null); setCursors(previous => previous.slice(0, -1)); }} />
        <AppText variant="caption">Page {cursors.length}</AppText>
        <Button label="Next" variant="secondary" disabled={!page.more} onPress={() => { setCursors(previous => [...previous, page.rows.at(-1)!]); setPage(null); }} />
      </View>
    </>}
  </Screen>;
}
const styles = StyleSheet.create({
  row: { minHeight: 56, borderRadius: 8, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xs },
  copy: { flex: 1, minWidth: 100, gap: spacing.xs },
  page: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
});
