import { memo, useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { CompanionPortrait } from '@/features/companion/CompanionPortrait';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { answerExpression } from '@/features/companion/expressions';
import type { SessionAttempt } from '@/engine/session/session';
import { AppText } from '@/components/ui/AppText';
import { spacing } from '@/theme/tokens';

export const SessionCompanion = memo(function SessionCompanion({ previous }: { previous?: SessionAttempt }) {
  const { showCompanion } = useCompanionSettings();
  const { height, width, fontScale } = useWindowDimensions();
  const visible = showCompanion && height >= 760 && width >= 340 && fontScale <= 1.25;
  const [settled, setSettled] = useState<SessionAttempt>();

  useEffect(() => {
    if (!previous || !visible) return;
    const timeout = setTimeout(() => setSettled(previous), 900);
    return () => clearTimeout(timeout);
  }, [previous, visible]);

  if (!visible) return null;
  const reacting = previous && previous !== settled;
  const correct = previous?.expected === previous?.submitted;
  const expression = reacting ? answerExpression(correct) : 'thinking';
  const message = reacting ? (correct ? 'Nice work!' : 'Keep going!') : 'You’ve got this.';

  return (
    <View style={styles.row}>
      <CompanionPortrait expression={expression} size={44} />
      <AppText variant="caption" tone="muted">{message}</AppText>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, height: 44 },
});
