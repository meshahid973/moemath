import { useRouter } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { Surface } from '@/components/ui/Surface';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { sessionParams } from '@/engine/session/options';
import { CompanionPortrait, hasCompanion } from '@/features/companion/CompanionPortrait';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { QuickOperations } from '@/features/practice/OperationPicker';
import { PracticeArtwork } from './PracticeArtwork';

export function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const { showCompanion } = useCompanionSettings();
  const showArtwork = width >= 370 && fontScale <= 1.2;
  const showPortrait = showCompanion && hasCompanion;

  return (
    <Screen>
      <Header title="MoeMath" />
      <Surface style={[styles.panel, { backgroundColor: colors.tint }]}>
        {!showPortrait && showArtwork && <PracticeArtwork />}
        <View style={[styles.hero, showPortrait && showArtwork && styles.horizontal, !showPortrait && showArtwork && styles.illustrated]}>
          <View style={styles.copy}>
            <AppText variant="heading" style={styles.title}>Daily practice</AppText>
            <AppText tone="muted">10 questions</AppText>
          </View>
          {showPortrait && <View pointerEvents="none" style={styles.portrait}>
            <CompanionPortrait expression="neutral" size={showArtwork ? 136 : 110} />
          </View>}
        </View>
        <Button label="Start practice" onPress={() => router.navigate({ pathname: '/session', params: sessionParams('mixed', 1) })} />
      </Surface>
      <View style={styles.quick}>
        <AppText variant="heading">Quick practice</AppText>
        <QuickOperations onChange={(operation) => router.navigate({ pathname: '/session', params: sessionParams(operation, 1) })} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  panel: { overflow: 'hidden' },
  portrait: { alignSelf: 'center' },
  horizontal: { flexDirection: 'row', alignItems: 'center' },
  copy: { flexShrink: 1, gap: spacing.sm },
  quick: { gap: spacing.md },
  hero: { gap: spacing.sm, minHeight: 100, justifyContent: 'center', paddingVertical: spacing.sm },
  illustrated: { paddingRight: 138 },
  title: { fontSize: 26, lineHeight: 32 },
});
