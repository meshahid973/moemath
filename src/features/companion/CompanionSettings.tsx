import { useCallback, useMemo } from 'react';
import { usePreferences } from '@/features/settings/PreferencesProvider';

export function useCompanionSettings() {
  const { preferences, setPreference } = usePreferences();
  const { showCompanion, haptics, soundEffects } = preferences;
  const setShowCompanion = useCallback((value: boolean) => setPreference('showCompanion', value), [setPreference]);
  const setHaptics = useCallback((value: boolean) => setPreference('haptics', value), [setPreference]);
  const setSoundEffects = useCallback((value: boolean) => setPreference('soundEffects', value), [setPreference]);
  return useMemo(() => ({ showCompanion, haptics, soundEffects, setShowCompanion, setHaptics, setSoundEffects }),
    [showCompanion, haptics, soundEffects, setShowCompanion, setHaptics, setSoundEffects]);
}
