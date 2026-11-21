import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { operationChoices } from '@/features/practice/operationAppearance';
import { OperationMark } from '@/features/practice/OperationMark';
import { accuracy } from '@/engine/adaptive/profile';
import { useAdaptive } from './AdaptiveProvider';

export function SkillLevels() {
  const { profile, ready, error, pending, retrySave } = useAdaptive();
  const { colors } = useTheme();

  return (
    <View style={styles.list}>
      {error && (
        <View style={styles.notice}>
          <AppText tone="danger">Skill data could not be saved or loaded.</AppText>
          <Button label="Retry storage" onPress={retrySave} disabled={pending} variant="secondary" />
        </View>
      )}
      {!ready && !error && <AppText tone="muted">Loading skills...</AppText>}
      {ready && operationChoices.map(choice => {
        if (choice.value === 'mixed') return null;
        const skill = profile.skills[choice.value];
        const a = accuracy(skill);
        return (
          <View key={choice.value} style={[styles.skill, { borderBottomColor: colors.border }]}>
            <View style={styles.row}>
              <OperationMark operation={choice.value} color={colors.primary} size={19} />
              <AppText variant="label" style={styles.label}>{choice.label}</AppText>
              <AppText variant="caption" tone="muted">
                {skill.seen > 0 && a !== null ? Math.round(a * 100) + '% · ' : ''}Level {skill.level}/6
              </AppText>
            </View>
            <View style={styles.bar} accessibilityRole="progressbar" accessibilityLabel={choice.label + ' level'}
              accessibilityValue={{ min: 0, max: 6, now: skill.level }}>
              {Array.from({ length: 6 }, (_, i) => (
                <View key={i} style={[styles.segment, { backgroundColor: i < skill.level ? colors.primary : colors.border }]} />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 0 },
  notice: { gap: spacing.xs },
  skill: { paddingVertical: spacing.md, gap: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm },
  label: { flex: 1, minWidth: 88 },
  bar: { flexDirection: 'row', gap: spacing.xs },
  segment: { flex: 1, height: 3, borderRadius: 1 },
});
