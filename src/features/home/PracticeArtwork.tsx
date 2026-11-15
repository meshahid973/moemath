import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

export function PracticeArtwork() {
  return (
    <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.art}>
      <Svg width="100%" height="100%" viewBox="0 0 156 148">
        <Path d="M100 -10 L170 48 L96 155 L22 140 Z" fill="#A48AD5" opacity={0.18} />
        <Path d="M148 6 L172 47 L68 150 L39 139 Z" fill="#56BEB2" opacity={0.26} />
        <Rect x="54" y="24" width="72" height="79" rx="10" fill="#F8F4FF" stroke="#A48AD5" strokeWidth="2" transform="rotate(12 90 64)" />
        <Rect x="43" y="35" width="72" height="79" rx="10" fill="#E8A8BC" transform="rotate(-12 79 74)" />
        <Rect x="38" y="31" width="72" height="79" rx="10" fill="#FFFDFE" stroke="#A48AD5" strokeWidth="2" transform="rotate(-12 74 71)" />
        <Path d="M53 55 H95 M53 67 H95 M53 79 H95" stroke="#DCD3E5" strokeWidth="2" strokeLinecap="round" transform="rotate(-12 74 71)" />
        <Path d="M66 57 V77 M56 67 H76 M84 86 L94 96 M94 86 L84 96" stroke="#7957B3" strokeWidth="3" strokeLinecap="round" transform="rotate(-12 74 71)" />
        <Circle cx="128" cy="112" r="9" fill="#56BEB2" opacity={0.85} />
        <Circle cx="25" cy="22" r="5" fill="#E8A8BC" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  art: { position: 'absolute', right: 0, top: 0, width: 156, height: 148 },
});
