import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme/provider';

// The sleeve fold is the only background motif: no raster or repeating pattern.
export const PanelMotif = memo(function PanelMotif({ subtle = false }: { subtle?: boolean }) {
  const { colors } = useTheme();
  return <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={StyleSheet.absoluteFill}>
    <Svg width="100%" height="100%" viewBox="0 0 360 260" preserveAspectRatio="none" opacity={subtle ? 0.25 : 1}>
      <Path d="M252 0H360V260H140Z" fill={colors.stageStrong} />
      <Path d="M350 0H360V260H240Z" fill={colors.ribbon} />
      <Path d="M232 0L120 260" stroke={colors.primary} strokeWidth="0.6" opacity="0.2" />
    </Svg>
  </View>;
});
