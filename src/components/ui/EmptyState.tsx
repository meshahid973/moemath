import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Button } from './Button';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { CompanionPortrait } from '@/features/companion/CompanionPortrait';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';

export function EmptyState({ title, message, action, onPress }: { title: string; message: string; action?: string; onPress?: () => void }) {
  const { colors } = useTheme();
  const { showCompanion } = useCompanionSettings();
  return <View style={[styles.state, { borderColor: colors.border }]}>
    <View style={styles.row}>
      {showCompanion && <CompanionPortrait expression="encouraging" size={88} />}
      <View style={styles.copy}><AppText variant="heading">{title}</AppText><AppText tone="muted" variant="caption">{message}</AppText></View>
    </View>
    {action && onPress && <Button label={action} onPress={onPress} arrow />}
  </View>;
}
const styles = StyleSheet.create({
  state: { paddingVertical: spacing.xl, borderTopWidth: StyleSheet.hairlineWidth, gap: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  copy: { flex: 1, gap: spacing.sm },
});
