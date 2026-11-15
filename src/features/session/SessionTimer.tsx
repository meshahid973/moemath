import { memo, useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { elapsedAt } from '@/engine/session/session';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';

export function formatTime(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
}

export const SessionTimer = memo(function SessionTimer({ activeSince, elapsedBefore }: {
  activeSince: number | null;
  elapsedBefore: number;
}) {
  const { colors } = useTheme();
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (activeSince === null) return;
    const timer = setInterval(() => setNow(performance.now()), 250);
    return () => clearInterval(timer);
  }, [activeSince]);

  return (
    <View style={styles.row}>
      <Clock3 size={16} color={colors.muted} strokeWidth={1.75} />
      <AppText variant="caption" tone="muted" style={styles.time}>{formatTime(elapsedAt({ activeSince, elapsedBefore }, now))}</AppText>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  time: { fontVariant: ['tabular-nums'] },
});
