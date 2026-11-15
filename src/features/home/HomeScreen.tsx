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
  const showPortrait = showArtwork && showCompanion && hasCompanion;

  return (
    <Screen>
      <Header title="MoeMath" />
      <Surface style={[styles.panel, { backgroundColor: colors.tint }]}>
        {showPortrait ? <View pointerEvents="none" style={styles.portrait}><CompanionPortrait expression="neutral" size={148} /></View> : showArtwork && <PracticeArtwork />}
        <View style={[styles.hero, showArtwork && styles.illustrated]}>
          <AppText variant="heading" style={styles.title}>Daily practice</AppText>
          <AppText tone="muted">10 questions</AppText>
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
  portrait: { position: 'absolute', right: spacing.sm, top: spacing.xs },
  quick: { gap: spacing.md },
  hero: { gap: spacing.sm, minHeight: 100, justifyContent: 'center', paddingVertical: spacing.lg },
  illustrated: { paddingRight: 138 },
  title: { fontSize: 26, lineHeight: 32 },
});
