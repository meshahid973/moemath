import { ScrollView, StyleSheet, View, useWindowDimensions, type StyleProp, type ViewStyle, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/provider';
import { layout, size, spacing } from '@/theme/tokens';

const tabEdges: Edge[] = ['top', 'left', 'right'];
const fullEdges: Edge[] = ['top', 'left', 'right', 'bottom'];

type Props = Pick<ViewProps, 'children'> & { full?: boolean; fill?: boolean; compact?: boolean; style?: StyleProp<ViewStyle>; contentStyle?: StyleProp<ViewStyle> };

export function Screen({ children, full = false, fill = false, compact = false, style, contentStyle }: Props) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  return (
    <SafeAreaView edges={full ? fullEdges : tabEdges} style={[styles.root, { backgroundColor: colors.background }, style]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: width < layout.compact ? spacing.compact : spacing.screen }]} keyboardShouldPersistTaps="handled">
        <View style={[styles.content, fill && styles.fill, compact && styles.compact, contentStyle]}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1, padding: spacing.screen, alignItems: 'center' },
  fill: { flexGrow: 1 },
  compact: { gap: spacing.md },
  content: { width: '100%', maxWidth: size.content, gap: spacing.xl },
});
