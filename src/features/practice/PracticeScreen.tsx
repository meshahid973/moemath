import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { AppText } from '@/components/ui/AppText';
import { useAdaptiveAvailability } from '@/features/adaptive/AdaptiveProvider';
import { Button } from '@/components/ui/Button';
import { sessionParams } from '@/engine/session/options';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { difficultyNames } from '@/engine/arithmetic/difficulty';
import type { Difficulty, PracticeOperation } from '@/engine/arithmetic/types';
import { DifficultyPicker } from './DifficultyPicker';
import { OperationPicker } from './OperationPicker';

export function PracticeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const available = useAdaptiveAvailability();
  const [adaptive, setAdaptive] = useState(true);
  const personalized = adaptive && available;
  const [operation, setOperation] = useState<PracticeOperation>('mixed');
  const [difficulty, setDifficulty] = useState<Difficulty>(1);

  return (
    <Screen>
      <View style={styles.intro}>
        <Header title="Practice" />
        <AppText variant="body" tone="muted">Choose your focus, then take on ten questions.</AppText>
      </View>
      <View style={styles.group}>
        <SectionTitle title="Operation" />
        <OperationPicker value={operation} onChange={setOperation} />
      </View>
      <View style={styles.group}>
        <SectionTitle title="Difficulty" />
        <SwitchRow label="Adaptive difficulty" value={personalized} onChange={setAdaptive} disabled={!available} />
        {!available && <AppText variant="caption" tone="muted">Adaptive practice is unavailable. You can still choose a level.</AppText>}
        {personalized
          ? <AppText variant="caption" tone="muted">Questions adjust to your saved skill levels.</AppText>
          : <DifficultyPicker value={difficulty} onChange={setDifficulty} />}
      </View>
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <AppText variant="metadata" tone="muted">
          10 questions · {personalized ? 'Adaptive' : difficultyNames[difficulty]}
        </AppText>
        <Button label="Start practice" arrow onPress={() => router.navigate({
          pathname: '/session', params: sessionParams(operation, difficulty, personalized),
        })} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm },
  group: { gap: spacing.md },
  footer: { paddingTop: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, gap: spacing.md },
});
