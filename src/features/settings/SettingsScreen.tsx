import { StyleSheet, View } from 'react-native';
import { DataSettings } from './DataSettings';
import { PreferencesStatus } from './PreferencesStatus';
import { AppText } from '@/components/ui/AppText';
import { hasCompanion } from '@/features/companion/CompanionPortrait';
import { useAppearance, useTheme } from '@/theme/provider';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ChoiceRow } from '@/components/ui/ChoiceRow';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { CompanionStage } from '@/features/companion/CompanionStage';
import { spacing, type ThemeMode } from '@/theme/tokens';

const modes: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'Follow device' },
  { value: 'light', label: 'Sakura Light' },
  { value: 'dark', label: 'OLED Dark' },
];

export function SettingsScreen() {
  const { mode, setMode } = useAppearance();
  const { colors } = useTheme();
  const { showCompanion, setShowCompanion, haptics, setHaptics, soundEffects, setSoundEffects } = useCompanionSettings();

  return (
    <Screen full>
      <Header title="Settings" back />
      <CompanionStage expression="happy" placement="inline" style={styles.companion}>
        <AppText variant="heading">Your study space.</AppText>
        <AppText variant="caption" tone="muted">Keep it comfortable and distraction-free.</AppText>
      </CompanionStage>
      <View style={styles.group}>
        <SectionTitle title="Appearance" />
        <View accessibilityRole="radiogroup">
          {modes.map(({ value, label }) => (
            <ChoiceRow key={value} label={label} selected={mode === value} onPress={() => setMode(value)} />
          ))}
        </View>
      </View>
      <View style={styles.group}>
        <SectionTitle title="Practice preferences" />
        {hasCompanion && <SwitchRow label="Show Suu-chan" value={showCompanion} onChange={setShowCompanion} />}
        <SwitchRow label="Haptic feedback" value={haptics} onChange={setHaptics} />
        <SwitchRow label="Sound effects" value={soundEffects} onChange={setSoundEffects} />
      </View>
      <PreferencesStatus />
      <View style={[styles.data, { borderTopColor: colors.border }]}>
        <DataSettings />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  companion: { marginBottom: spacing.xs },
  group: { gap: spacing.sm },
  data: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.lg },
});
