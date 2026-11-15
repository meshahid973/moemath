import { useRouter } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { Surface } from '@/components/ui/Surface';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { PracticeArtwork } from './PracticeArtwork';

export function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const showArtwork = width >= 370 && fontScale <= 1.2;

  return (
    <Screen>
      <Header title="MoeMath" />
      <Surface style={[styles.panel, { backgroundColor: colors.tint }]}>
        {showArtwork && <PracticeArtwork />}
        <View style={[styles.hero, showArtwork && styles.illustrated]}>
          <AppText variant="heading" style={styles.title}>Daily practice</AppText>
          <AppText tone="muted">10 questions</AppText>
        </View>
        <Button label="Choose practice" onPress={() => router.navigate('/practice')} />
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  panel: { overflow: 'hidden' },
  hero: { gap: spacing.sm, minHeight: 100, justifyContent: 'center', paddingVertical: spacing.lg },
  illustrated: { paddingRight: 138 },
  title: { fontSize: 26, lineHeight: 32 },
});
