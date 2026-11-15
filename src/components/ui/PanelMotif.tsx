import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '@/theme/provider';

// One vector path instead of a rasterized repeating SVG pattern.
const pluses = Array.from({ length: 8 }, (_, row) =>
  Array.from({ length: 6 }, (_, column) => {
    const x = 196 + column * 24;
    const y = 12 + row * 24;
    return x > 230 - y * 0.62 && x < 320
      ? `M${x} ${y - 4}v8M${x - 4} ${y}h8` : '';
  }).join(' '),
).join(' ');

export const PanelMotif = memo(function PanelMotif({ subtle = false }: { subtle?: boolean }) {
  const { colors } = useTheme();
  return (
    <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        <Path d="M216 0H320V180H105Z" fill={colors.primary} opacity={subtle ? 0.035 : 0.08} />
        <Path d="M302 0H320V180H194Z" fill={colors.accent} opacity={subtle ? 0.03 : 0.12} />
        <Path d={pluses} stroke={colors.primary} strokeWidth={1.1} opacity={subtle ? 0.035 : 0.07} />
        <Path d="M242 0L131 180" stroke={colors.primary} strokeWidth={1} opacity={0.08} />
        {!subtle && <Circle cx="258" cy="83" r="62" fill={colors.accent} opacity={0.12} />}
      </Svg>
    </View>
  );
});
