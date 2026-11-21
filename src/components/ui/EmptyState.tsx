import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Button } from './Button';
import { CompanionPortrait, hasCompanion } from '@/features/companion/CompanionPortrait';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { spacing } from '@/theme/tokens';

export function EmptyState({ title, message, action, onPress }: {
  title: string; message: string; action?: string; onPress?: () => void;
}) {
  const { showCompanion } = useCompanionSettings();
  return (
    <View style={styles.state}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <AppText variant="heading" accessibilityRole="header">{title}</AppText>
          <AppText variant="body" tone="muted">{message}</AppText>
        </View>
        {showCompanion && hasCompanion && (
          <View pointerEvents="none">
            <CompanionPortrait expression="encouraging" size={94} />
          </View>
        )}
      </View>
      {action && onPress && <Button label={action} variant="secondary" arrow onPress={onPress} />}
    </View>
  );
}

const styles = StyleSheet.create({
  state: { paddingVertical: spacing.lg, gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  copy: { flex: 1, minWidth: 0, gap: spacing.sm },
});
