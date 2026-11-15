import { memo, useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { CompanionPortrait, hasCompanion } from '@/features/companion/CompanionPortrait';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { answerExpression } from '@/features/companion/expressions';
import type { SessionAttempt } from '@/engine/session/session';

export const SessionCompanion = memo(function SessionCompanion({ previous }: { previous?: SessionAttempt }) {
  const { showCompanion } = useCompanionSettings();
  const { height, width, fontScale } = useWindowDimensions();
  const [settled, setSettled] = useState<SessionAttempt>();

  useEffect(() => {
    if (!previous) return;
    const timeout = setTimeout(() => setSettled(previous), 900);
    return () => clearTimeout(timeout);
  }, [previous]);

  if (!hasCompanion || !showCompanion || height < 740 || width < 350 || fontScale > 1.2) return null;

  const expression = previous && previous !== settled
    ? answerExpression(previous.expected === previous.submitted)
    : 'thinking';

  return <CompanionPortrait expression={expression} size={76} />;
});
