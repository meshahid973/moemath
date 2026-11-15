import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Defs, Pattern, Rect, Circle } from 'react-native-svg';
import { useTheme } from '@/theme/provider';

export const PanelMotif = memo(function PanelMotif({ subtle = false }: { subtle?: boolean }) {
  const { colors } = useTheme();
  return (
    <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <Pattern id="plus" width="24" height="24" patternUnits="userSpaceOnUse">
            <Path d="M12 8V16M8 12H16" stroke={colors.primary} strokeWidth={1.1} opacity={0.13} />
          </Pattern>
        </Defs>
        <Path d="M216 0H320V180H105Z" fill={colors.primary} opacity={subtle ? 0.045 : 0.1} />
        <Path d="M302 0H320V180H194Z" fill={colors.accent} opacity={subtle ? 0.04 : 0.15} />
        <Path d="M230 0H320V180H119Z" fill="url(#plus)" opacity={subtle ? 0.5 : 1} />
        <Path d="M242 0L131 180" stroke={colors.primary} strokeWidth={1} opacity={0.14} />
        {!subtle && <Circle cx="258" cy="83" r="62" fill={colors.accent} opacity={0.12} />}
      </Svg>
    </View>
  );
});
