import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Surface } from '@/components/ui/Surface';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/provider';
import { spacing } from '@/theme/tokens';
import { operationChoices, operationColors } from '@/features/practice/operationAppearance';
import { OperationMark } from '@/features/practice/OperationMark';
import { accuracy } from '@/engine/adaptive/profile';
import { useAdaptive } from './AdaptiveProvider';

export function SkillLevels() {
  const { profile, ready, error, pending, retrySave } = useAdaptive();
  const { colors, scheme } = useTheme();
  return (
    <Surface>
      {error && <>
        <AppText tone="muted">Skill data could not be saved or loaded.</AppText>
        <Button label="Retry storage" onPress={retrySave} disabled={pending} variant="secondary" />
      </>}
      {!ready && !error && <AppText tone="muted">Loading skills...</AppText>}
      {ready && operationChoices.map(choice => {
        if (choice.value === 'mixed') return null;
        const skill = profile.skills[choice.value];
        const a = accuracy(skill);
        return (
          <View key={choice.value} style={styles.skill}>
            <View style={styles.row}>
              <OperationMark operation={choice.value} color={operationColors[scheme][choice.value]} size={20} />
              <AppText variant="label" style={styles.label}>{choice.label}</AppText>
              <AppText variant="caption" tone="muted">Level {skill.level}/6</AppText>
            </View>
            <View style={styles.bar} accessibilityRole="progressbar" accessibilityLabel={choice.label + ' level'} accessibilityValue={{ min: 0, max: 6, now: skill.level }}>
              {Array.from({ length: 6 }, (_, i) => <View key={i} style={[styles.segment, { backgroundColor: i < skill.level ? operationColors[scheme][choice.value] : colors.border }]} />)}
            </View>
            <AppText variant="caption" tone="muted">{skill.seen === 0 ? 'Not practiced yet' : a === null ? 'Building new level' : Math.round(a * 100) + '% recent accuracy'}</AppText>
          </View>
        );
      })}
    </Surface>
  );
}

const styles = StyleSheet.create({
  skill: { gap: spacing.sm, paddingVertical: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { flex: 1 },
  bar: { flexDirection: 'row', gap: spacing.xs },
  segment: { flex: 1, height: 4, borderRadius: 1 },
});
