import { memo, useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { elapsedAt } from '@/engine/session/session';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { formatTime, nextSecondDelay } from '@/engine/session/clock';

export const SessionTimer = memo(function SessionTimer({ activeSince, elapsedBefore }: {
  activeSince: number | null;
  elapsedBefore: number;
}) {
  const { colors } = useTheme();
  const [clock, setClock] = useState({ origin: activeSince, elapsed: elapsedBefore });

  useEffect(() => {
    if (activeSince === null) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const elapsed = elapsedAt({ activeSince, elapsedBefore }, performance.now());
      setClock({ origin: activeSince, elapsed });
      timer = setTimeout(tick, nextSecondDelay(elapsed));
    };
    timer = setTimeout(tick, nextSecondDelay(elapsedAt({ activeSince, elapsedBefore }, performance.now())));
    return () => clearTimeout(timer);
  }, [activeSince, elapsedBefore]);

  const elapsed = activeSince === null || clock.origin !== activeSince ? elapsedBefore : clock.elapsed;
  return (
    <View style={styles.row}>
      <Clock3 size={16} color={colors.muted} strokeWidth={1.75} />
      <AppText variant="caption" tone="muted" style={styles.time}>{formatTime(elapsed)}</AppText>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  time: { fontVariant: ['tabular-nums'] },
});
