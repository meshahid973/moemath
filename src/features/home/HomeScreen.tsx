import { useRouter } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { PanelMotif } from '@/components/ui/PanelMotif';
import { Screen } from '@/components/ui/Screen';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Surface } from '@/components/ui/Surface';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { sessionParams } from '@/engine/session/options';
import { CompanionPortrait } from '@/features/companion/CompanionPortrait';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { QuickOperations } from '@/features/practice/OperationPicker';

export function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const { showCompanion } = useCompanionSettings();
  const horizontal = width >= 360 && fontScale <= 1.2;

  return (
    <Screen>
      <Header title="MoeMath" branded />
      <Surface style={[styles.panel, { backgroundColor: colors.tint }]}>
        <PanelMotif />
        <View style={[styles.hero, horizontal && styles.horizontal]}>
          <View style={styles.copy}>
            <AppText tone="primary" variant="caption" style={styles.eyebrow}>DAILY PRACTICE</AppText>
            <AppText variant="heading" style={styles.title}>{showCompanion ? 'Ready to practice?' : 'Start your session'}</AppText>
            <AppText tone="muted">10 questions</AppText>
          </View>
          {showCompanion && <View pointerEvents="none" style={styles.portrait}>
            <CompanionPortrait expression="neutral" size={horizontal ? 152 : 128} />
          </View>}
        </View>
        <Button label="Start practice" arrow onPress={() => router.navigate({ pathname: '/session', params: sessionParams('mixed', 1) })} />
      </Surface>
      <View style={styles.quick}>
        <SectionTitle title="Quick practice" />
        <QuickOperations onChange={(operation) => router.navigate({ pathname: '/session', params: sessionParams(operation, 1) })} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  panel: { overflow: 'hidden' },
  portrait: { alignSelf: 'center' },
  horizontal: { flexDirection: 'row', alignItems: 'center' },
  copy: { flexShrink: 1, flexGrow: 1, gap: spacing.sm },
  quick: { gap: spacing.md },
  hero: { gap: spacing.sm, minHeight: 112, justifyContent: 'center' },
  eyebrow: { fontSize: 11, letterSpacing: 1.2 },
  title: { fontSize: 26, lineHeight: 32 },
});
