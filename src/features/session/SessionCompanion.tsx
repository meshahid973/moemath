import { memo, useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { CompanionPortrait } from '@/features/companion/CompanionPortrait';
import { CompanionDialogue } from '@/features/companion/CompanionDialogue';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { answerExpression } from '@/features/companion/expressions';
import type { SessionAttempt } from '@/engine/session/session';
import { spacing } from '@/theme/tokens';

export const SessionCompanion = memo(function SessionCompanion({ previous }: { previous?: SessionAttempt }) {
  const { showCompanion } = useCompanionSettings();
  const { height, width, fontScale } = useWindowDimensions();
  const [settled, setSettled] = useState<SessionAttempt>();

  useEffect(() => {
    if (!previous) return;
    const timeout = setTimeout(() => setSettled(previous), 900);
    return () => clearTimeout(timeout);
  }, [previous]);

  if (!showCompanion || height < 740 || width < 350 || fontScale > 1.2) return null;
  const reacting = previous && previous !== settled;
  const correct = previous?.expected === previous?.submitted;
  const expression = reacting ? answerExpression(correct) : 'thinking';
  const message = reacting ? correct ? 'Nice work!' : 'Keep going!' : previous ? 'You can do it.' : 'Ready when you are!';

  return (
    <View style={styles.row}>
      <CompanionPortrait expression={expression} size={76} />
      <View style={styles.dialogue}><CompanionDialogue message={message} /></View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: 76 },
  dialogue: { flexShrink: 1, width: 156 },
});
