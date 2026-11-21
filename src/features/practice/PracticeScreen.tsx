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

  const startPractice = () => router.navigate({
    pathname: '/session', params: sessionParams(operation, difficulty, personalized),
  });

  return (
    <Screen
      contentStyle={styles.screen}
      footer={
        <>
          <AppText variant="metadata" tone="muted" style={styles.footerNote}>
            10 questions · {personalized ? 'Adaptive difficulty' : difficultyNames[difficulty]}
          </AppText>
          <Button label="Start practice" arrow onPress={startPractice} />
        </>
      }
    >
      <View style={styles.intro}>
        <Header title="Practice" />
        <AppText variant="body" tone="muted">Pick what you want to practice.</AppText>
      </View>
      <View style={styles.group}>
        <SectionTitle title="Operation" />
        <OperationPicker value={operation} onChange={setOperation} />
      </View>
      <View style={styles.group}>
        <SectionTitle title="Difficulty" />
        <SwitchRow label="Adaptive difficulty" value={personalized} onChange={setAdaptive} disabled={!available} />
        {!available && <AppText variant="caption" tone="muted">Adaptive practice is unavailable. Manual practice still works.</AppText>}
        {personalized
          ? <AppText variant="caption" tone="muted">Questions adapt to your saved skill levels.</AppText>
          : <DifficultyPicker value={difficulty} onChange={setDifficulty} />}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.compact },
  intro: { gap: spacing.sm },
  group: { gap: spacing.md },
  footerNote: { textAlign: 'center' },
});
