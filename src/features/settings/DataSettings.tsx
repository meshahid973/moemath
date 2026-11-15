import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useAdaptive } from '@/features/adaptive/AdaptiveProvider';
import { clearExportCache, exportPracticeData } from '@/database/export';
import { spacing } from '@/theme/tokens';

export function DataSettings() {
  const { reset, pending, error } = useAdaptive();
  const [busy, setBusy] = useState(false);

  const exportData = async () => {
    setBusy(true);
    try { await exportPracticeData(); }
    catch { Alert.alert('Export failed', 'Could not export your local data. Try again.'); }
    finally { setBusy(false); }
  };

  const resetData = async () => {
    setBusy(true);
    try {
      await reset();
      try { clearExportCache(); } catch { /* cache cleanup is best effort */ }
      Alert.alert('Progress reset', 'Your settings have been kept.');
    } catch { Alert.alert('Reset failed', 'Could not reset progress. Retry after saving pending sessions.'); }
    finally { setBusy(false); }
  };

  return <View style={styles.group}>
    <SectionTitle title="Local data" />
    <Button label={busy ? 'Working...' : 'Export data'} variant="secondary" disabled={busy || pending || error} onPress={() => { void exportData(); }} />
    <Button label="Reset practice data" variant="secondary" disabled={busy || pending} onPress={() => Alert.alert('Reset practice data?', 'This permanently deletes saved history, skill levels and mistake reviews. Your appearance and sound settings will stay.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => { void resetData(); } },
    ])} />
    <AppText variant="caption" tone="muted">Stored on this device.</AppText>
  </View>;
}
const styles = StyleSheet.create({ group: { gap: spacing.sm } });
