import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useAdaptive } from '@/features/adaptive/AdaptiveProvider';
import { sessionParams } from '@/engine/session/options';
import { formatEquation } from '@/engine/arithmetic/format';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';

export function ReviewScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { profile, ready, error, pending, retrySave } = useAdaptive();
  const [now, setNow] = useState(() => Date.now());
  useFocusEffect(useCallback(() => {
    const timer = setTimeout(() => setNow(Date.now()), 0);
    return () => clearTimeout(timer);
  }, []));

  const items = profile.review.slice(0, 10);
  const dueCount = profile.review.filter(item => item.due <= now).length;

  return (
    <Screen full contentStyle={styles.screen}>
      <Header title="Mistake review" back />
      {!ready && !error ? (
        <AppText tone="muted">Loading reviews...</AppText>
      ) : error ? (
        <View style={styles.notice}>
          <AppText tone="danger">Review data could not be loaded or saved.</AppText>
          <Button label="Retry storage" variant="secondary" disabled={pending} onPress={retrySave} />
        </View>
      ) : (
        <>
          <View style={styles.overview}>
            <View style={styles.counts}>
              <View style={styles.count}>
                <AppText variant="score" tone="primary" style={styles.bigNumber}>{dueCount}</AppText>
                <AppText variant="label">due now</AppText>
              </View>
              <AppText variant="caption" tone="muted">{profile.review.length} questions in review</AppText>
            </View>
            {items.length > 0 && (
              <Button label="Start review" arrow disabled={pending}
                onPress={() => router.push({ pathname: '/session', params: { ...sessionParams('mixed', 1), review: '1' } })} />
            )}
          </View>
          {!items.length ? (
            <EmptyState title="All caught up" message="Mistakes from future sessions will appear here."
              action="Go to practice" onPress={() => router.push('/practice')} />
          ) : (
            <View style={styles.list}>
              <AppText variant="heading" accessibilityRole="header">Your questions</AppText>
              {items.map(item => (
                <View key={item.question.key} style={[styles.row, { borderBottomColor: colors.border }]}>
                  <AppText variant="label" style={styles.equation}>{formatEquation(item.question)}</AppText>
                  <AppText variant="caption" tone={item.due <= now ? 'primary' : 'muted'}>
                    {item.due <= now ? 'Due' : 'Available early'}
                  </AppText>
                </View>
              ))}
              <AppText variant="caption" tone="muted">
                Early review does not clear a scheduled review.
                {profile.review.length > items.length ? ' Showing the first ten questions.' : ''}
              </AppText>
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.lg },
  notice: { gap: spacing.sm },
  overview: { gap: spacing.lg },
  counts: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: spacing.lg },
  count: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  bigNumber: { fontSize: 56, lineHeight: 68, fontVariant: ['tabular-nums'] },
  list: { gap: spacing.xs },
  row: { minHeight: 58, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', gap: spacing.sm, paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth },
  equation: { flexShrink: 1, fontVariant: ['tabular-nums'] },
});
