import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { ChoiceRow } from '@/components/ui/ChoiceRow';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { spacing } from '@/theme/tokens';

const operations = ['Mixed', 'Addition', 'Subtraction', 'Multiplication', 'Division'] as const;
type Operation = (typeof operations)[number];

export function PracticeScreen() {
  const [operation, setOperation] = useState<Operation>('Mixed');
  return (
    <Screen>
      <Header title="Practice" />
      <View style={styles.group} accessibilityRole="radiogroup">
        {operations.map((item) => <ChoiceRow key={item} label={item} selected={operation === item} onPress={() => setOperation(item)} />)}
      </View>
      <AppText tone="muted" variant="caption">Practice sessions are not available in this build yet.</AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({ group: { gap: spacing.sm } });
