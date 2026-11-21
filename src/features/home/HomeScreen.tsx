import { useRouter } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { layout, spacing } from '@/theme/tokens';
import { useAdaptiveAvailability } from '@/features/adaptive/AdaptiveProvider';
import { sessionParams } from '@/engine/session/options';
import { CompanionPortrait, hasCompanion } from '@/features/companion/CompanionPortrait';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { QuickOperations } from '@/features/practice/OperationPicker';

export function HomeScreen() {
  const router = useRouter();
  const { showCompanion } = useCompanionSettings();
  const { width, fontScale } = useWindowDimensions();
  const adaptive = useAdaptiveAvailability();
  const showArt = showCompanion && hasCompanion && fontScale < layout.largeText && width >= 340;
  const portraitSize = Math.min(292, Math.max(246, width * 0.73));

  return (
    <Screen contentStyle={styles.screen}>
      <Header title="MoeMath" branded />
      <View style={styles.welcome}>
        <View style={[styles.hero, !showArt && styles.heroWithoutArt]}>
          <View style={[styles.copy, showArt && styles.copyWithArt]}>
            <AppText variant="hero" accessibilityRole="header" style={styles.headline}>
              A little{'\n'}math?
            </AppText>
            <AppText variant="caption" tone="muted">Ten questions. Your own pace.</AppText>
          </View>
          {showArt && (
            <View pointerEvents="none" style={styles.portrait}>
              <CompanionPortrait expression="neutral" size={portraitSize} />
            </View>
          )}
        </View>
        <Button label="Start practice" arrow onPress={() => router.navigate({
          pathname: '/session', params: sessionParams('mixed', 1, adaptive),
        })} />
      </View>
      <View style={styles.shortcuts}>
        <AppText variant="label">Or pick a focus</AppText>
        <QuickOperations onChange={operation => router.navigate({
          pathname: '/session', params: sessionParams(operation, 1, adaptive),
        })} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.lg },
  welcome: { gap: spacing.sm },
  hero: { height: 252, justifyContent: 'center', overflow: 'hidden' },
  heroWithoutArt: { height: 164 },
  copy: { justifyContent: 'center', gap: spacing.md },
  copyWithArt: { width: '53%', zIndex: 1 },
  headline: { fontSize: 33, lineHeight: 44 },
  portrait: {
    position: 'absolute', right: -16, bottom: -18,
    height: '100%', width: '61%',
    alignItems: 'flex-end', justifyContent: 'flex-end',
  },
  shortcuts: { gap: spacing.sm },
});
