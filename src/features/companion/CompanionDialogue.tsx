import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';

export function CompanionDialogue({ message }: { message: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.bubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <AppText variant="caption" style={styles.message}>{message}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { flexShrink: 1, borderBottomWidth: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  message: { textAlign: 'center' },
});
