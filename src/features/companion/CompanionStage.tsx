import { useState, type PropsWithChildren } from 'react';
import { StyleSheet, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/provider';
import { layout, size, spacing } from '@/theme/tokens';
import { CompanionPortrait, hasCompanion } from './CompanionPortrait';
import { useCompanionSettings } from './CompanionSettings';
import type { Expression } from './expressions';

type Props = PropsWithChildren<{
  expression: Expression;
  placement?: 'margin' | 'inline';
  style?: StyleProp<ViewStyle>;
}>;

// The companion occupies a deliberate right-hand margin. On very narrow
// layouts or large text, the content comes first and the small portrait follows.
export function CompanionStage({ expression, placement = 'margin', children, style }: Props) {
  const { colors } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const { showCompanion } = useCompanionSettings();
  const [available, setAvailable] = useState(0);
  const visible = showCompanion && hasCompanion;
  const predictedWidth = Math.min(size.content, Math.max(0, width - (width < layout.compact ? spacing.compact : spacing.screen) * 2));
  const contentWidth = available > 0 ? available : predictedWidth;
  const reflow = visible && (fontScale >= layout.largeText || contentWidth < (placement === 'margin' ? 292 : 260));
  const margin = visible && placement === 'margin' && !reflow;
  const frameWidth = margin ? Math.min(132, contentWidth * 0.36) : layout.inlinePortrait;
  const portraitSize = margin ? 160 : layout.inlinePortrait;

  return (
    <View
      onLayout={event => {
        const next = event.nativeEvent.layout.width;
        setAvailable(previous => previous === next ? previous : next);
      }}
      style={[styles.stage, reflow && styles.reflow, style]}
    >
      <View style={[styles.content, reflow && styles.fullWidth]}>{children}</View>
      {visible && (
        <View pointerEvents="none" style={[styles.portrait, { width: frameWidth, height: portraitSize }]}>
          <View style={[styles.portraitHalo, {
            width: frameWidth, height: frameWidth, borderRadius: frameWidth / 2,
            backgroundColor: colors.character,
          }]} />
          <CompanionPortrait expression={expression} size={portraitSize} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  reflow: { flexDirection: 'column', alignItems: 'stretch' },
  portrait: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  portraitHalo: { position: 'absolute', bottom: 0 },
  content: { flex: 1, minWidth: 0, gap: spacing.sm },
  fullWidth: { flex: 0, width: '100%' },
});
