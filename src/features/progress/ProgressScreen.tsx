import { AppText } from '@/components/ui/AppText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { SkillLevels } from '@/features/adaptive/SkillLevels';
import { Surface } from '@/components/ui/Surface';

export function ProgressScreen() {
  return (
    <Screen>
      <Header title="Progress" />
      <SectionTitle title="Your skills" />
      <SkillLevels />
      <Surface>
        <AppText variant="heading">Session history</AppText>
        <AppText tone="muted">Full session history comes later.</AppText>
      </Surface>
    </Screen>
  );
}
