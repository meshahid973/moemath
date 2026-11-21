import { useRouter } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { useAdaptiveAvailability } from '@/features/adaptive/AdaptiveProvider';
import { sessionParams } from '@/engine/session/options';
import { CompanionPortrait, hasCompanion } from '@/features/companion/CompanionPortrait';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { QuickOperations } from '@/features/practice/OperationPicker';

export function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { showCompanion } = useCompanionSettings();
  const { width, fontScale } = useWindowDimensions();
  const adaptive = useAdaptiveAvailability();

  // Avoid trapping the welcome copy in a narrow column at large text sizes.
  const portraitVisible = showCompanion && hasCompanion && width >= 350 && fontScale < 1.3;
  const portraitSize = Math.min(224, Math.max(192, width * 0.56));
  const start = () => router.navigate({
    pathname: '/session',
    params: sessionParams('mixed', 1, adaptive),
  });

  return (
    <Screen contentStyle={styles.home}>
      <Header title="MoeMath" branded />
      <View style={styles.welcome}>
        <View style={[styles.hero, { backgroundColor: colors.character }]}>
          <View style={[styles.heroCopy, portraitVisible && styles.heroCopyWithArt]}>
            <AppText variant="hero" accessibilityRole="header" style={styles.heroTitle}>
              Math time.{'\n'}Let’s go!
            </AppText>
            <AppText variant="caption" style={styles.heroSubtitle}>
              Ten questions. Your pace.
            </AppText>
          </View>
          {portraitVisible && (
            <View pointerEvents="none" style={styles.heroArt}>
              <CompanionPortrait expression="happy" size={portraitSize} />
            </View>
          )}
        </View>
        <Button label="Start practice" arrow onPress={start} />
        <AppText variant="metadata" tone="muted" style={styles.mode}>
          {adaptive ? 'Personalized mixed practice' : 'Level 1 mixed practice'}
        </AppText>
      </View>
      <View style={styles.quick}>
        <SectionTitle title="Choose a topic" />
        <QuickOperations onChange={operation => router.navigate({
          pathname: '/session',
          params: sessionParams(operation, 1, adaptive),
        })} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  home: { gap: spacing.compact },
  welcome: { gap: spacing.md },
  hero: {
    minHeight: 196, borderRadius: 16, overflow: 'hidden', justifyContent: 'center',
    paddingHorizontal: spacing.compact, paddingVertical: spacing.lg,
  },
  heroCopy: { justifyContent: 'center', gap: spacing.md, zIndex: 1 },
  heroCopyWithArt: { width: '55%' },
  heroTitle: { fontSize: 29, lineHeight: 38 },
  heroSubtitle: { fontSize: 13, lineHeight: 20 },
  heroArt: {
    position: 'absolute', right: 0, bottom: 0, width: '45%', height: '100%',
    alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden',
  },
  mode: { textAlign: 'center' },
  quick: { gap: spacing.md },
});
