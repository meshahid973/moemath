import { DataSettings } from './DataSettings';
import { PreferencesStatus } from './PreferencesStatus';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { hasCompanion } from '@/features/companion/CompanionPortrait';
import { useAppearance } from '@/theme/provider';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ChoiceRow } from '@/components/ui/ChoiceRow';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { CompanionStage } from '@/features/companion/CompanionStage';
import { spacing, type ThemeMode } from '@/theme/tokens';

const modes: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Sakura Light' },
  { value: 'dark', label: 'Midnight Moe' },
];

export function SettingsScreen() {
  const { mode, setMode } = useAppearance();
  const { showCompanion, setShowCompanion, haptics, setHaptics, soundEffects, setSoundEffects } = useCompanionSettings();
  return (
    <Screen full>
      <Header title="Settings" back />
      {showCompanion && <CompanionStage expression="happy" placement="inline">
        <AppText variant="heading">Your study companion.</AppText>
        <AppText variant="caption" tone="muted">A space that feels like you.</AppText>
      </CompanionStage>}
      <View style={styles.group} accessibilityRole="radiogroup">
        <SectionTitle title="Appearance" />
        {modes.map(({ value, label }) => <ChoiceRow key={value} label={label} selected={mode === value} onPress={() => setMode(value)} />)}
      </View>
      <View style={styles.group}>
        <SectionTitle title="Practice" />
        {hasCompanion && <SwitchRow label="Show Suu-chan" value={showCompanion} onChange={setShowCompanion} />}
        <SwitchRow label="Haptic feedback" value={haptics} onChange={setHaptics} />
        <SwitchRow label="Sound effects" value={soundEffects} onChange={setSoundEffects} />
      </View>
      <PreferencesStatus />
      <DataSettings />
    </Screen>
  );
}

const styles = StyleSheet.create({ group: { gap: spacing.sm } });
