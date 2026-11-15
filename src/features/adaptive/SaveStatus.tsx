import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { useAdaptive } from './AdaptiveProvider';

export function SaveStatus() {
  const { error, pending, retrySave } = useAdaptive();
  if (error) return <>
    <AppText tone="muted" variant="caption">Your session could not be saved. Retry before closing the app.</AppText>
    <Button label="Retry save" variant="secondary" onPress={retrySave} disabled={pending} />
  </>;
  return pending ? <AppText tone="muted" variant="caption">Saving session...</AppText> : null;
}
