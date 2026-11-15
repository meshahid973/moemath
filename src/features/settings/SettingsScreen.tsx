import { StyleSheet, View } from 'react-native';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ChoiceRow } from '@/components/ui/ChoiceRow';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { useTheme } from '@/theme/provider';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { hasCompanion } from '@/features/companion/CompanionPortrait';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { spacing, type ThemeMode } from '@/theme/tokens';

const modes: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Sakura Light' },
  { value: 'dark', label: 'Midnight Moe' },
];

export function SettingsScreen() {
  const { mode, setMode } = useTheme();
  const { showCompanion, setShowCompanion, haptics, setHaptics } = useCompanionSettings();
  return (
    <Screen full>
      <Header title="Settings" back />
      <View style={styles.group} accessibilityRole="radiogroup">
        <SectionTitle title="Appearance" />
        {modes.map(({ value, label }) => <ChoiceRow key={value} label={label} selected={mode === value} onPress={() => setMode(value)} />)}
      </View>
      <View style={styles.group}>
        <SectionTitle title="Practice" />
        {hasCompanion && <SwitchRow label="Show Suu-chan" value={showCompanion} onChange={setShowCompanion} />}
        <SwitchRow label="Haptic feedback" value={haptics} onChange={setHaptics} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ group: { gap: spacing.sm } });
