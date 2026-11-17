import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AppText } from './AppText';
import { useTheme } from '@/theme/provider';
import { motion, radius, size, spacing } from '@/theme/tokens';

function Segment({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  const background = useSharedValue(selected ? colors.tint : colors.surface);
  useEffect(() => { background.set(withTiming(selected ? colors.tint : colors.surface, { duration: motion.release, reduceMotion: ReduceMotion.System })); }, [selected, colors, background]);
  const animated = useAnimatedStyle(() => ({ backgroundColor: background.get() }));
  return <Pressable accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={onPress} style={styles.item}>
    {({ pressed }) => <Animated.View style={[styles.face, animated, { borderBottomColor: selected ? colors.primary : 'transparent', opacity: pressed ? 0.72 : 1 }]}>
      <AppText variant="label" tone={selected ? 'primary' : 'muted'} style={styles.label}>{label}</AppText>
    </Animated.View>}
  </Pressable>;
}

export function SegmentedChoice<T extends string | number>({ options, value, onChange }: {
  options: readonly { value: T; label: string }[]; value: T; onChange: (value: T) => void;
}) {
  const { colors } = useTheme();
  return <View accessibilityRole="radiogroup" style={[styles.group, { backgroundColor: colors.surface }]}>
    {options.map(option => <Segment key={option.value} label={option.label} selected={value === option.value} onPress={() => onChange(option.value)} />)}
  </View>;
}
const styles = StyleSheet.create({
  group: { flexDirection: 'row', flexWrap: 'wrap', borderRadius: radius.control, overflow: 'hidden', gap: spacing.xs },
  item: { flexGrow: 1, flexBasis: 76 },
  face: { minHeight: size.touch, justifyContent: 'center', alignItems: 'center', padding: spacing.sm, borderBottomWidth: 2 },
  label: { textAlign: 'center', fontSize: 13 },
});
