import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { AppText } from '@/components/ui/AppText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { Surface } from '@/components/ui/Surface';
import { Button } from '@/components/ui/Button';
import { useAdaptive } from '@/features/adaptive/AdaptiveProvider';
import { sessionParams } from '@/engine/session/options';
import { formatEquation } from '@/engine/arithmetic/format';

export function ReviewScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { profile, ready, error, pending } = useAdaptive();
  const [now, setNow] = useState(() => Date.now());
  useFocusEffect(useCallback(() => {
    const timer = setTimeout(() => setNow(Date.now()), 0);
    return () => clearTimeout(timer);
  }, []));
  const items = profile.review.slice(0, 10);
  return <Screen full>
    <Header title="Review mistakes" back />
    <Surface>
      <AppText variant="heading">{profile.review.length} questions to review</AppText>
      <AppText tone="muted">Due questions return first. Early practice does not clear a scheduled review.</AppText>
      <Button label="Start review" arrow disabled={!ready || error || pending || !items.length} onPress={() => router.push({ pathname: '/session', params: { ...sessionParams('mixed', 1), review: '1' } })} />
    </Surface>
    {ready && !items.length && <EmptyState title="A clean slate." message="Mistakes from future sessions will return here for another try." action="Go to practice" onPress={() => router.push('/practice')} />}
    <View>
    {items.map(item => <View key={item.question.key} style={{ paddingVertical: spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border, gap: spacing.xs }}>
      <AppText variant="heading">{formatEquation(item.question)}</AppText>
      <AppText variant="caption" tone="muted">{item.due <= now ? 'Due for review' : 'Early review available'}</AppText>
    </View>)}
    </View>
  </Screen>;
}
