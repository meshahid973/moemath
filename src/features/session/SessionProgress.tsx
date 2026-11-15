import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';

export const SessionProgress = memo(function SessionProgress({ total, completed }: { total: number; completed: number }) {
  const { colors } = useTheme();
  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: completed }} style={styles.track}>
      {Array.from({ length: total }, (_, index) => (
        <View key={index} style={[styles.segment, { backgroundColor: index < completed ? colors.primary : colors.border }]} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  track: { flexDirection: 'row', gap: spacing.xs },
  segment: { flex: 1, height: 5, borderRadius: 3 },
});
