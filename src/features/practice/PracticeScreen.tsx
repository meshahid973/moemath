import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { sessionParams } from '@/engine/session/options';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { spacing } from '@/theme/tokens';
import type { Difficulty, PracticeOperation } from '@/engine/arithmetic/types';
import { DifficultyPicker } from './DifficultyPicker';
import { OperationPicker } from './OperationPicker';

export function PracticeScreen() {
  const router = useRouter();
  const [operation, setOperation] = useState<PracticeOperation>('mixed');
  const [difficulty, setDifficulty] = useState<Difficulty>(1);

  return (
    <Screen>
      <Header title="Practice" />
      <View style={styles.group}>
        <AppText variant="heading" accessibilityRole="header">Operation</AppText>
        <OperationPicker value={operation} onChange={setOperation} />
      </View>
      <View style={styles.group}>
        <AppText variant="heading" accessibilityRole="header">Difficulty</AppText>
        <DifficultyPicker value={difficulty} onChange={setDifficulty} />
      </View>
      <Button label="Start practice" onPress={() => router.navigate({ pathname: '/session', params: sessionParams(operation, difficulty) })} />
    </Screen>
  );
}

const styles = StyleSheet.create({ group: { gap: spacing.md } });
