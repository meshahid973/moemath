import { useRouter } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { PanelMotif } from '@/components/ui/PanelMotif';
import { Screen } from '@/components/ui/Screen';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useTheme } from '@/theme/provider';
import { radius, spacing } from '@/theme/tokens';
import { useAdaptiveAvailability } from '@/features/adaptive/AdaptiveProvider';
import { sessionParams } from '@/engine/session/options';
import { CompanionPortrait } from '@/features/companion/CompanionPortrait';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { QuickOperations } from '@/features/practice/OperationPicker';

export function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const { showCompanion } = useCompanionSettings();
  const adaptive = useAdaptiveAvailability();
  const stacked = width < 360 || fontScale > 1.3;
  return <Screen>
    <Header title="MoeMath" branded />
    <View style={styles.feature}>
      <View style={[styles.stage, { backgroundColor: colors.stage }, stacked && styles.stacked]}>
        <PanelMotif />
        <View style={[styles.copy, !showCompanion && styles.solo]}>
          <AppText variant="display" style={styles.title}>Find your{'\n'}math rhythm.</AppText>
          <AppText variant="caption" style={styles.description}>One answer at a time.</AppText>
          {showCompanion && <AppText variant="label" tone="primary" style={styles.name}>With Suu-chan</AppText>}
        </View>
        {showCompanion && <View pointerEvents="none" style={styles.portrait}><CompanionPortrait expression="neutral" size={stacked ? 176 : 192} /></View>}
      </View>
      <Button label="Start practice" arrow onPress={() => router.navigate({ pathname: '/session', params: sessionParams('mixed', 1, adaptive) })} />
      <View style={styles.sessionNote}>
        <AppText variant="caption" tone="muted">{adaptive ? '10 personalized questions' : '10 questions'}</AppText>
        <AppText variant="caption" tone="muted">Your pace.</AppText>
      </View>
    </View>
    <View style={styles.quick}>
      <SectionTitle title="Quick practice" />
      <QuickOperations onChange={operation => router.navigate({ pathname: '/session', params: sessionParams(operation, 1, adaptive) })} />
    </View>
  </Screen>;
}
const styles = StyleSheet.create({
  feature: { gap: spacing.md },
  stage: { minHeight: 208, borderRadius: radius.panel, overflow: 'hidden', flexDirection: 'row', alignItems: 'center' },
  stacked: { flexDirection: 'column', alignItems: 'stretch' },
  copy: { flex: 1, paddingVertical: spacing.xl, paddingLeft: spacing.lg, zIndex: 1 },
  solo: { paddingRight: spacing.lg },
  title: { fontSize: 25, lineHeight: 29, letterSpacing: -0.7 },
  description: { marginTop: spacing.md },
  name: { marginTop: spacing.lg, fontSize: 12 },
  portrait: { width: '47%', alignItems: 'center', alignSelf: 'flex-end', marginRight: -8 },
  sessionNote: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.sm },
  quick: { gap: spacing.md },
});
