import { useState, type PropsWithChildren } from 'react';
import { StyleSheet, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { layout, size, spacing } from '@/theme/tokens';
import { CompanionPortrait, hasCompanion } from './CompanionPortrait';
import { useCompanionSettings } from './CompanionSettings';
import type { Expression } from './expressions';

type Props = PropsWithChildren<{
  expression: Expression;
  placement?: 'margin' | 'inline';
  style?: StyleProp<ViewStyle>;
}>;

// Character art belongs to the canvas, not to a rounded avatar or feature card.
export function CompanionStage({ expression, placement = 'margin', children, style }: Props) {
  const { width, fontScale } = useWindowDimensions();
  const { showCompanion } = useCompanionSettings();
  const [available, setAvailable] = useState(0);
  const visible = showCompanion && hasCompanion;
  const predicted = Math.min(size.content, width - (width < layout.compact ? spacing.compact : spacing.screen) * 2);
  const contentWidth = available > 0 ? available : predicted;
  const portraitSize = placement === 'margin' ? 178 : 100;
  const stacked = visible && (fontScale >= layout.largeText || contentWidth < (placement === 'margin' ? 355 : 280));

  return (
    <View
      onLayout={event => {
        const next = event.nativeEvent.layout.width;
        setAvailable(current => current === next ? current : next);
      }}
      style={[styles.stage, stacked && styles.stacked, style]}
    >
      <View style={[styles.content, stacked && styles.full]}>{children}</View>
      {visible && (
        <View pointerEvents="none" style={[styles.portrait, { width: portraitSize, height: portraitSize }]}>
          <CompanionPortrait expression={expression} size={portraitSize} />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  stage: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stacked: { flexDirection: 'column', alignItems: 'flex-start' },
  content: { flex: 1, minWidth: 0, gap: spacing.sm },
  full: { flex: 0, width: '100%' },
  portrait: { alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' },
});
