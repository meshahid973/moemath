import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { spacing } from '@/theme/tokens';
import { useAdaptiveAvailability } from '@/features/adaptive/AdaptiveProvider';
import { sessionParams } from '@/engine/session/options';
import { CompanionStage } from '@/features/companion/CompanionStage';
import { useCompanionSettings } from '@/features/companion/CompanionSettings';
import { QuickOperations } from '@/features/practice/OperationPicker';

export function HomeScreen() {
  const router = useRouter();
  const { showCompanion } = useCompanionSettings();
  const adaptive = useAdaptiveAvailability();
  return <Screen>
    <Header title="MoeMath" branded />
    <View style={styles.feature}>
      <CompanionStage expression="neutral">
        <AppText variant="hero">Find your{'\n'}math rhythm.</AppText>
        <AppText variant="caption">One answer at a time.</AppText>
        {showCompanion && <AppText variant="caption" tone="primary">With Suu-chan</AppText>}
      </CompanionStage>
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
  sessionNote: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.sm },
  quick: { gap: spacing.md },
});
