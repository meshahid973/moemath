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
    <Screen full>
      <Header title="Review mistakes" back />
      <View style={styles.intro}>
        <AppText variant="heading">Keep what you've learned.</AppText>
        <AppText variant="body" tone="muted">
          Due questions come first. Reviewing early does not clear a scheduled review.
        </AppText>
      </View>
      {!ready && !error ? (
        <AppText tone="muted">Loading reviews...</AppText>
      ) : error ? (
        <View style={styles.notice}>
          <AppText tone="danger">Review data could not be loaded or saved.</AppText>
          <Button label="Retry storage" variant="secondary" disabled={pending} onPress={retrySave} />
        </View>
      ) : (
        <>
          <View style={[styles.summary, { borderBottomColor: colors.border }]}>
            <View style={styles.counts}>
              <View style={styles.count}>
                <AppText variant="score" tone="primary" style={styles.countValue} numberOfLines={1}>{profile.review.length}</AppText>
                <AppText variant="caption" tone="muted">To review</AppText>
              </View>
              <View style={styles.count}>
                <AppText variant="heading" tone="primary">{dueCount}</AppText>
                <AppText variant="caption" tone="muted">Due now</AppText>
              </View>
            </View>
            <Button label="Start review" arrow disabled={pending || !items.length}
              onPress={() => router.push({ pathname: '/session', params: { ...sessionParams('mixed', 1), review: '1' } })} />
          </View>
          {!items.length ? (
            <EmptyState title="A clean slate." message="Mistakes from future sessions will return here for another try."
              action="Go to practice" onPress={() => router.push('/practice')} />
          ) : (
            <View style={styles.list}>
              <AppText variant="heading" accessibilityRole="header">Questions</AppText>
              {items.map(item => (
                <View key={item.question.key} style={[styles.row, { borderBottomColor: colors.border }]}>
                  <AppText variant="heading" style={styles.equation}>{formatEquation(item.question)}</AppText>
                  <AppText variant="caption" tone={item.due <= now ? 'primary' : 'muted'}>
                    {item.due <= now ? 'Due for review' : 'Early review available'}
                  </AppText>
                </View>
              ))}
              {profile.review.length > items.length && (
                <AppText variant="caption" tone="muted">Showing the first {items.length} questions.</AppText>
              )}
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  notice: { gap: spacing.md },
  intro: { gap: spacing.sm },
  summary: { gap: spacing.lg, paddingBottom: spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth },
  counts: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', gap: spacing.xxl },
  count: { gap: spacing.xs },
  countValue: { fontVariant: ['tabular-nums'] },
  list: { gap: spacing.sm },
  row: { minHeight: 72, justifyContent: 'center', borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.md, gap: spacing.xs },
  equation: { fontVariant: ['tabular-nums'] },
});
