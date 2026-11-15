import { AppText } from '@/components/ui/AppText';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { Surface } from '@/components/ui/Surface';

export function ProgressScreen() {
  return (
    <Screen>
      <Header title="Progress" />
      <Surface>
        <AppText variant="heading">No sessions yet</AppText>
        <AppText tone="muted">Your practice history will appear here.</AppText>
      </Surface>
    </Screen>
  );
}
