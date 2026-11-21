import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { AppText } from '@/components/ui/AppText';
import { useAdaptiveAvailability } from '@/features/adaptive/AdaptiveProvider';
import { Button } from '@/components/ui/Button';
import { sessionParams } from '@/engine/session/options';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { spacing } from '@/theme/tokens';
import { difficultyNames } from '@/engine/arithmetic/difficulty';
import type { Difficulty, PracticeOperation } from '@/engine/arithmetic/types';
import { DifficultyPicker } from './DifficultyPicker';
import { OperationPicker } from './OperationPicker';

export function PracticeScreen() {
  const router = useRouter();
  const available = useAdaptiveAvailability();
  const [adaptive, setAdaptive] = useState(true);
  const personalized = adaptive && available;
  const [operation, setOperation] = useState<PracticeOperation>('mixed');
  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  const start = () => router.navigate({ pathname: '/session', params: sessionParams(operation, difficulty, personalized) });

  return (
    <Screen
      contentStyle={styles.screen}
      footer={
        <View style={styles.action}>
          <AppText variant="caption" tone="muted">10 questions · {personalized ? 'Adaptive' : difficultyNames[difficulty]}</AppText>
          <Button label="Start practice" arrow onPress={start} />
        </View>
      }
    >
      <Header title="Practice" />
      <View style={styles.intro}>
        <AppText variant="heading">What shall we solve?</AppText>
        <AppText variant="caption" tone="muted">Pick one focus, or mix them together.</AppText>
      </View>
      <View style={styles.options}>
        <OperationPicker value={operation} onChange={setOperation} />
      </View>
      <View style={styles.difficulty}>
        <AppText variant="label">Difficulty</AppText>
        <SwitchRow label="Adaptive" value={personalized} onChange={setAdaptive} disabled={!available} />
        {!available && <AppText variant="caption" tone="muted">Adaptive mode is unavailable. Manual levels still work.</AppText>}
        {personalized
          ? <AppText variant="caption" tone="muted">Questions adjust to your saved skill levels.</AppText>
          : <DifficultyPicker value={difficulty} onChange={setDifficulty} />}
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  screen: { gap: spacing.lg },
  intro: { gap: spacing.xs },
  options: { gap: 0 },
  difficulty: { gap: spacing.sm },
  action: { gap: spacing.xs },
});
