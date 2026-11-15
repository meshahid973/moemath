import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

type Preferences = {
  showCompanion: boolean;
  setShowCompanion: (value: boolean) => void;
  soundEffects: boolean;
  setSoundEffects: (value: boolean) => void;
  haptics: boolean;
  setHaptics: (value: boolean) => void;
};

const Context = createContext<Preferences | null>(null);

export function CompanionSettingsProvider({ children }: PropsWithChildren) {
  const [showCompanion, setShowCompanion] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [haptics, setHaptics] = useState(false);
  const value = useMemo(() => ({ showCompanion, setShowCompanion, haptics, setHaptics, soundEffects, setSoundEffects }), [showCompanion, haptics, soundEffects]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useCompanionSettings() {
  const value = useContext(Context);
  if (!value) throw new Error('CompanionSettingsProvider is missing');
  return value;
}
