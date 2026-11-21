import { StyleSheet, View } from 'react-native';
import { RadioGroup, RadioGroupItem } from '@/components/radio';
import { DataSettings } from './DataSettings';
import { PreferencesStatus } from './PreferencesStatus';
import { AppText } from '@/components/ui/AppText';
import { hasCompanion } from '@/features/companion/CompanionPortrait';
import { useAppearance } from '@/theme/provider';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { spacing, type ThemeMode } from '@/theme/tokens';

const modes: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'Follow device' },
  { value: 'light', label: 'Sakura Light' },
  { value: 'dark', label: 'OLED Dark' },
];

export function SettingsScreen() {
  const { mode, setMode } = useAppearance();
  const { showCompanion, setShowCompanion, haptics, setHaptics, soundEffects, setSoundEffects } = useCompanionSettings();

  return (
    <Screen full contentStyle={styles.screen}>
      <Header title="Settings" back />
      <View style={styles.group}>
        <AppText variant="heading" accessibilityRole="header">Appearance</AppText>
        <RadioGroup value={mode} onValueChange={next => setMode(next as ThemeMode)} className="gap-0">
          {modes.map(item => (
            <RadioGroupItem key={item.value} value={item.value} label={item.label}
              className="self-stretch min-h-12 py-2 border-b border-border" />
          ))}
        </RadioGroup>
      </View>
      <View style={styles.group}>
        <AppText variant="heading" accessibilityRole="header">Preferences</AppText>
        {hasCompanion && <SwitchRow label="Show Suu-chan" value={showCompanion} onChange={setShowCompanion} />}
        <SwitchRow label="Haptics" value={haptics} onChange={setHaptics} />
        <SwitchRow label="Sound effects" value={soundEffects} onChange={setSoundEffects} />
      </View>
      <PreferencesStatus />
      <DataSettings />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl },
  group: { gap: spacing.sm },
});
