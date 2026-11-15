import { useCallback, useMemo } from 'react';
import { useStoredCompanion } from '@/features/settings/PreferencesProvider';

export function useCompanionSettings() {
  const { showCompanion, haptics, soundEffects, setPreference } = useStoredCompanion();
  const setShowCompanion = useCallback((value: boolean) => setPreference('showCompanion', value), [setPreference]);
  const setHaptics = useCallback((value: boolean) => setPreference('haptics', value), [setPreference]);
  const setSoundEffects = useCallback((value: boolean) => setPreference('soundEffects', value), [setPreference]);
  return useMemo(() => ({ showCompanion, haptics, soundEffects, setShowCompanion, setHaptics, setSoundEffects }),
    [showCompanion, haptics, soundEffects, setShowCompanion, setHaptics, setSoundEffects]);
}
