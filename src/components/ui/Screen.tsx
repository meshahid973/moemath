import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions, type StyleProp, type ViewStyle, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/provider';
import { layout, size, spacing } from '@/theme/tokens';

const tabEdges: Edge[] = ['top', 'left', 'right'];
const fullEdges: Edge[] = ['top', 'left', 'right', 'bottom'];

type Props = Pick<ViewProps, 'children'> & {
  full?: boolean; fill?: boolean; compact?: boolean;
  style?: StyleProp<ViewStyle>; contentStyle?: StyleProp<ViewStyle>;
  footer?: ReactNode;
};

export function Screen({ children, full = false, fill = false, compact = false, style, contentStyle, footer }: Props) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const horizontalPadding = width < layout.compact ? spacing.compact : spacing.screen;
  return (
    <SafeAreaView edges={full ? fullEdges : tabEdges} style={[styles.root, { backgroundColor: colors.background }, style]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scroll, { paddingHorizontal: horizontalPadding }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.content, fill && styles.fill, compact && styles.compact, contentStyle]}>
          {children}
        </View>
      </ScrollView>
      {footer != null && (
        <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <View style={[styles.footerContent, { paddingHorizontal: horizontalPadding }]}>
            {footer}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollView: { flex: 1 },
  scroll: { flexGrow: 1, padding: spacing.screen, alignItems: 'center' },
  fill: { flexGrow: 1 },
  compact: { gap: spacing.md },
  content: { width: '100%', maxWidth: size.content, gap: spacing.xl },
  footer: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.sm, paddingBottom: spacing.sm },
  footerContent: { width: '100%', maxWidth: size.content + spacing.screen * 2, alignSelf: 'center', gap: spacing.xs },
});
