import { useState } from 'react';
import { useRouter } from 'expo-router';
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
  const { profile, ready, error } = useAdaptive();
  const [now] = useState(() => Date.now());
  const items = profile.review.slice(0, 10);
  return <Screen full>
    <Header title="Review mistakes" back />
    <Surface>
      <AppText variant="heading">{profile.review.length} questions to review</AppText>
      <AppText tone="muted">Practice previously missed questions at your own pace. Due questions return first.</AppText>
      <Button label="Start review" arrow disabled={!ready || error || !items.length} onPress={() => router.push({ pathname: '/session', params: { ...sessionParams('mixed', 1), review: '1' } })} />
    </Surface>
    {items.map(item => <Surface key={item.question.key}>
      <AppText variant="heading">{formatEquation(item.question)}</AppText>
      <AppText variant="caption" tone="muted">{item.due <= now ? 'Due for review' : 'Early review available'}</AppText>
    </Surface>)}
  </Screen>;
}
