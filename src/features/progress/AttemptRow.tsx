import { StyleSheet, View } from 'react-native';
import { Check, Minus } from 'lucide-react-native';
import { AppText } from '@/components/ui/AppText';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { formatEquation } from '@/engine/arithmetic/format';
import type { SessionAttempt } from '@/engine/session/session';

export function AttemptRow({ attempt, timing = false }: { attempt: SessionAttempt; timing?: boolean }) {
  const { colors } = useTheme();
  const correct = attempt.expected === attempt.submitted;
  const Icon = correct ? Check : Minus;
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={styles.top}>
        <Icon size={18} color={correct ? colors.success : colors.danger} strokeWidth={1.8} />
        <AppText variant="heading" style={styles.formula}>{formatEquation(attempt.question)}</AppText>
        {timing && <AppText variant="metadata" tone="muted">
          {(attempt.elapsedMs / 1000).toFixed(1)}s{attempt.interrupted ? ' · Interrupted' : ''}
        </AppText>}
      </View>
      <View style={styles.answers}>
        <AppText variant="caption" tone={correct ? 'success' : 'danger'}>
          {correct ? 'Correct' : 'Your answer'}: {attempt.submitted ?? 'Skipped'}
        </AppText>
        {!correct && <AppText variant="label" tone="success">Expected: {attempt.expected}</AppText>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: spacing.md, gap: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth },
  top: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm },
  formula: { flex: 1, minWidth: 90, fontVariant: ['tabular-nums'] },
  answers: { flexDirection: 'row', justifyContent: 'space-between',
    flexWrap: 'wrap', paddingLeft: 26, gap: spacing.sm },
});
