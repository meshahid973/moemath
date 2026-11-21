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

// Reserve a character margin only when the copy has enough width to remain legible.
// Below that width, place the small portrait above full-width text rather than
// shrinking typography. A hidden companion never reserves an empty margin.
export function CompanionStage({ expression, placement = 'margin', children, style }: Props) {
  const { colors } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const { showCompanion } = useCompanionSettings();
  const [available, setAvailable] = useState(0);
  const visible = showCompanion && hasCompanion;
  const predictedWidth = Math.min(size.content, Math.max(0, width - (width < layout.compact ? spacing.compact : spacing.screen) * 2));
  const contentWidth = available > 0 ? available : predictedWidth;
  const columnWidth = placement === 'margin' ? layout.characterMargin : layout.inlinePortrait;
  const minTextWidth = placement === 'margin' ? 210 : 190;
  const reflow = visible && (fontScale >= layout.largeText || contentWidth < columnWidth + spacing.lg + minTextWidth);
  const margin = visible && placement === 'margin' && !reflow;
  const portraitSize = margin ? layout.characterPortrait : layout.inlinePortrait;

  return (
    <View onLayout={event => setAvailable(event.nativeEvent.layout.width)}
      style={[styles.stage, reflow && styles.reflow, style]}>
      {visible && (
        <View pointerEvents="none" style={[
          styles.portrait, { backgroundColor: colors.character },
          margin ? { width: layout.characterMargin, alignSelf: 'stretch' } : styles.inline,
        ]}>
          <CompanionPortrait expression={expression} size={portraitSize} />
        </View>
      )}
      <View style={[styles.content, reflow && styles.fullWidth]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center' },
  reflow: { flexDirection: 'column', alignItems: 'stretch' },
  portrait: { overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-start' },
  inline: { width: layout.inlinePortrait, height: layout.inlinePortrait, alignSelf: 'flex-start' },
  content: { flex: 1, minWidth: 0, gap: spacing.sm },
  fullWidth: { flex: 0, width: '100%' },
});
