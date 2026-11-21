import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { historyPage, type HistoryRow } from '@/database/history';
import { formatTime } from '@/engine/session/clock';
import { useTheme } from '@/theme/provider';
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

  return (
    <Screen full>
      <Header title="Session history" back />
      <AppText variant="body" tone="muted">Every completed session, in order.</AppText>
      {error ? (
        <View style={styles.notice}>
          <AppText tone="muted">Could not load your history.</AppText>
          <Button label="Retry" variant="secondary" onPress={() => setRetry(x => x + 1)} />
        </View>
      ) : !page || page.retry !== retry ? (
        <AppText tone="muted">Loading history...</AppText>
      ) : !page.rows.length ? (
        <EmptyState title="Your story starts here." message="Complete a session to build your practice record." action="Start practice" onPress={() => router.push('/practice')} />
      ) : (
        <>
          <View style={styles.ledger}>
            {page.rows.map(row => {
              const date = new Date(row.completedAt).toLocaleDateString();
              return (
                <Pressable
                  key={row.id}
                  accessibilityRole="button"
                  accessibilityLabel={date + ', ' + row.correct + ' of ' + row.total + ' correct, ' + formatTime(row.elapsedMs)}
                  accessibilityHint="Open session details"
                  onPress={() => router.push({ pathname: '/history-detail', params: { id: row.id } })}
                  style={({ pressed }) => [styles.row, {
                    backgroundColor: pressed ? colors.pressed : 'transparent',
                    borderBottomColor: colors.border,
                  }]}
                >
                  <View style={styles.copy}>
                    <AppText variant="label">{date}</AppText>
                    <AppText variant="caption" tone="muted">{formatTime(row.elapsedMs)} practice time</AppText>
                  </View>
                  <View style={styles.result}>
                    <AppText variant="heading" tone="primary" style={styles.numerals}>{row.correct}/{row.total}</AppText>
                    <AppText variant="caption" tone="muted">correct</AppText>
                  </View>
                  <ChevronRight size={20} color={colors.muted} />
                </Pressable>
              );
            })}
          </View>
          <View style={styles.page}>
            <Button label="Previous" variant="secondary" disabled={cursors.length <= 1} style={styles.pageButton}
              onPress={() => { setPage(null); setCursors(previous => previous.slice(0, -1)); }} />
            <AppText variant="metadata" tone="muted">Page {cursors.length}</AppText>
            <Button label="Next" variant="secondary" disabled={!page.more} style={styles.pageButton}
              onPress={() => { setCursors(previous => [...previous, page.rows.at(-1)!]); setPage(null); }} />
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  notice: { gap: spacing.md },
  ledger: { gap: 0 },
  row: { minHeight: 84, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row',
    alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, paddingHorizontal: spacing.xs },
  copy: { flex: 1, minWidth: 0, gap: spacing.xs },
  result: { alignItems: 'flex-end', gap: spacing.xs },
  numerals: { fontVariant: ['tabular-nums'] },
  page: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: spacing.sm },
  pageButton: { flexGrow: 1, flexBasis: 104 },
});
