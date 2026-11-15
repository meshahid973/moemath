import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/provider';
import { size, spacing } from '@/theme/tokens';

const tabEdges: Edge[] = ['top', 'left', 'right'];
const fullEdges: Edge[] = ['top', 'left', 'right', 'bottom'];

type Props = Pick<ViewProps, 'children'> & { full?: boolean };

export function Screen({ children, full = false }: Props) {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={full ? fullEdges : tabEdges} style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1, padding: spacing.screen, alignItems: 'center' },
  content: { width: '100%', maxWidth: size.content, gap: spacing.xl },
});
