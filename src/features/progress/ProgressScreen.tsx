import { AppText } from '@/components/ui/AppText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { Surface } from '@/components/ui/Surface';

export function ProgressScreen() {
  return (
    <Screen>
      <Header title="Progress" />
      <Surface>
        <AppText variant="heading">Session history</AppText>
        <AppText tone="muted">History is not saved in this build.</AppText>
      </Surface>
    </Screen>
  );
}
