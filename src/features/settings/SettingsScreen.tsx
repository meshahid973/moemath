import { DataSettings } from './DataSettings';
import { PreferencesStatus } from './PreferencesStatus';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { CompanionPortrait, hasCompanion } from '@/features/companion/CompanionPortrait';
import { PanelMotif } from '@/components/ui/PanelMotif';
import { useTheme, useAppearance } from '@/theme/provider';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ChoiceRow } from '@/components/ui/ChoiceRow';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { spacing, type ThemeMode } from '@/theme/tokens';

const modes: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Sakura Light' },
  { value: 'dark', label: 'Midnight Moe' },
];

export function SettingsScreen() {
  const { colors } = useTheme();
  const { mode, setMode } = useAppearance();
  const { showCompanion, setShowCompanion, haptics, setHaptics, soundEffects, setSoundEffects } = useCompanionSettings();
  return (
    <Screen full>
      <Header title="Settings" back />
      {showCompanion && <View style={[styles.companion, { backgroundColor: colors.tint }]}>
        <PanelMotif subtle />
        <View style={styles.companionCopy}><AppText variant="heading">Your study companion.</AppText><AppText variant="caption" tone="muted">A space that feels like you.</AppText></View>
        <CompanionPortrait expression="happy" size={84} />
      </View>}
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

const styles = StyleSheet.create({ group: { gap: spacing.sm }, companion: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.md, overflow: 'hidden', borderRadius: 12 }, companionCopy: { flex: 1, gap: spacing.xs } });
