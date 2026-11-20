import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Button } from './Button';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { CompanionStage } from '@/features/companion/CompanionStage';

export function EmptyState({ title, message, action, onPress }: { title: string; message: string; action?: string; onPress?: () => void }) {
  const { colors } = useTheme();
  return <View style={[styles.state, { borderColor: colors.border }]}>
    <CompanionStage expression="encouraging" placement="inline">
      <View style={styles.copy}><AppText variant="heading">{title}</AppText><AppText tone="muted" variant="caption">{message}</AppText></View>
    </CompanionStage>
    {action && onPress && <Button label={action} onPress={onPress} arrow />}
  </View>;
}
const styles = StyleSheet.create({
  state: { paddingVertical: spacing.xl, borderTopWidth: StyleSheet.hairlineWidth, gap: spacing.lg },
  copy: { flex: 1, gap: spacing.sm },
});
