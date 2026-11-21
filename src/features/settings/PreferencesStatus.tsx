import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { usePreferences } from './PreferencesProvider';

export function PreferencesStatus() {
  const { error, retry } = usePreferences();
  if (!error) return null;
  return <>
    <AppText tone="danger">Settings could not be loaded or saved.</AppText>
    <Button label="Retry settings storage" variant="secondary" onPress={retry} />
  </>;
}
