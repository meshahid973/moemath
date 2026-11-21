import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { useAdaptiveAvailability } from '@/features/adaptive/AdaptiveProvider';
import { sessionParams } from '@/engine/session/options';
import { CompanionStage } from '@/features/companion/CompanionStage';
import { QuickOperations } from '@/features/practice/OperationPicker';

export function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const adaptive = useAdaptiveAvailability();

  return (
    <Screen>
      <Header title="MoeMath" branded />
      <View style={[styles.hero, { borderBottomColor: colors.border }]}>
        <CompanionStage expression="neutral">
          <AppText variant="hero" accessibilityRole="header">Find your{'\n'}rhythm.</AppText>
          <AppText variant="body" tone="muted">A little math, every day.</AppText>
        </CompanionStage>
        <Button label="Start practice" arrow onPress={() => router.navigate({
          pathname: '/session', params: sessionParams('mixed', 1, adaptive),
        })} />
        <View style={styles.details}>
          <AppText variant="metadata" tone="muted">10 questions</AppText>
          <AppText variant="metadata" tone="muted">{adaptive ? 'Personalized · Mixed' : 'Level 1 · Mixed'}</AppText>
        </View>
      </View>
      <View style={styles.quick}>
        <SectionTitle title="Choose your focus" />
        <QuickOperations onChange={operation => router.navigate({
          pathname: '/session', params: sessionParams(operation, 1, adaptive),
        })} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: spacing.lg, paddingBottom: spacing.xl, borderBottomWidth: StyleSheet.hairlineWidth },
  details: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.sm },
  quick: { gap: spacing.sm },
});
