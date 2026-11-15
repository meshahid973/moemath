import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { spacing } from '@/theme/tokens';
import type { Difficulty, PracticeOperation } from '@/engine/arithmetic/types';
import { DifficultyPicker } from './DifficultyPicker';
import { OperationPicker } from './OperationPicker';

export function PracticeScreen() {
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
      <AppText tone="muted" variant="caption">Playable sessions are coming in the next build.</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({ group: { gap: spacing.md } });
