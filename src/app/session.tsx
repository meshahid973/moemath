import { useLocalSearchParams } from 'expo-router';
import { readSessionOptions, type SessionParams } from '@/engine/session/options';
import { SessionScreen } from '@/features/session/SessionScreen';
import { useAdaptive } from '@/features/adaptive/AdaptiveProvider';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';

export default function SessionRoute() {
  const params = useLocalSearchParams<SessionParams & { review?: string }>();
  const options = readSessionOptions(params);
  const { profile, ready, error } = useAdaptive();
  if (params.review === '1') {
    if (!ready || error) return <Screen full><Header title="Review" back /><AppText tone="muted">Review is unavailable.</AppText></Screen>;
    return <ReviewSession key={options.id ?? String(options.seed)} options={options} questions={profile.review.slice(0, 10).map(item => item.question)} />;
  }
  return <SessionScreen key={options.operation + ':' + options.difficulty + ':' + options.seed + ':' + options.id + ':' + options.adaptive} options={options} />;
}

import { useState } from 'react';
import type { SessionOptions } from '@/engine/arithmetic/questions';
import type { Question } from '@/engine/arithmetic/types';

function ReviewSession({ options, questions }: { options: SessionOptions; questions: readonly Question[] }) {
  // Freeze the selected review questions for this route's lifetime, even after a save.
  const [planned] = useState(() => questions);
  if (!planned.length) return <Screen full><Header title="Review" back /><AppText tone="muted">No mistakes to review.</AppText></Screen>;
  return <SessionScreen options={{ ...options, planned, adaptive: false }} />;
}
