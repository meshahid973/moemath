import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';

const enter = FadeIn.duration(180).reduceMotion(ReduceMotion.System);

export const SessionProgress = memo(function SessionProgress({ total, completed }: { total: number; completed: number }) {
  const { colors } = useTheme();
  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: completed }} style={styles.track}>
      {Array.from({ length: total }, (_, index) => (
        <View key={index} style={[styles.segment, { backgroundColor: colors.border }]}>
          {index < completed && <Animated.View entering={enter} style={[StyleSheet.absoluteFill, { backgroundColor: colors.primary }]} />}
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  track: { flexDirection: 'row', gap: spacing.xs },
  segment: { flex: 1, height: 4, borderRadius: 1, overflow: 'hidden' },
});
