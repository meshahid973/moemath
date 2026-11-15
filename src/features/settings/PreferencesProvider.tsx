import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { defaultPreferences, type Preferences } from '@/engine/preferences';
import { loadPreferences, savePreference } from '@/database/preferences';

type ContextValue = { preferences: Preferences; setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void; error: boolean; ready: boolean; retry: () => void };
const Context = createContext<ContextValue | null>(null);
const ModeContext = createContext<Pick<ContextValue, 'setPreference'> & { mode: Preferences['mode'] } | null>(null);
const CompanionContext = createContext<Pick<ContextValue, 'setPreference'> & Omit<Preferences, 'mode'> | null>(null);
const ReadyContext = createContext(false);

export function PreferencesProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const dirty = useRef(new Map<keyof Preferences, Preferences[keyof Preferences]>());
  const loading = useRef(false);
  const flushing = useRef(false);

  const flush = useCallback(async () => {
    if (flushing.current) return;
    flushing.current = true;
    try {
      while (dirty.current.size) {
        const [key, value] = dirty.current.entries().next().value!;
        await savePreference(key, value);
        if (dirty.current.get(key) === value) dirty.current.delete(key);
      }
      setError(false);
    } catch {
      setError(true);
    } finally {
      flushing.current = false;
    }
  }, []);

  const load = useCallback(async () => {
    if (loading.current) return;
    loading.current = true;
    try {
      const saved = await loadPreferences();
      const next = { ...saved, ...Object.fromEntries(dirty.current) };
      setPreferences(previous => {
        return (Object.keys(next) as (keyof Preferences)[]).every(key => next[key] === previous[key]) ? previous : next;
      });
      setReady(true);
      await flush();
    } catch {
      setError(true);
      setReady(true);
    } finally {
      loading.current = false;
    }
  }, [flush]);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => { if (active) return load(); });
    return () => { active = false; };
  }, [load]);

  const setPreference = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    dirty.current.set(key, value);
    setPreferences(previous => previous[key] === value ? previous : { ...previous, [key]: value });
    if (!loading.current) void flush();
  }, [flush]);

  const retry = useCallback(() => { void load(); }, [load]);
  const result = useMemo(() => ({ preferences, setPreference, error, ready, retry }), [preferences, setPreference, error, ready, retry]);
  const { mode, showCompanion, haptics, soundEffects } = preferences;
  const appearance = useMemo(() => ({ mode, setPreference }), [mode, setPreference]);
  const companion = useMemo(() => ({ showCompanion, haptics, soundEffects, setPreference }), [showCompanion, haptics, soundEffects, setPreference]);
  return <Context.Provider value={result}>
    <ReadyContext.Provider value={ready}>
      <ModeContext.Provider value={appearance}>
        <CompanionContext.Provider value={companion}>{children}</CompanionContext.Provider>
      </ModeContext.Provider>
    </ReadyContext.Provider>
  </Context.Provider>;
}

export function usePreferences() {
  const value = useContext(Context);
  if (!value) throw new Error('PreferencesProvider missing');
  return value;
}

export function usePreferencesReady() { return useContext(ReadyContext); }

export function useStoredAppearance() {
  const value = useContext(ModeContext);
  if (!value) throw new Error('PreferencesProvider missing');
  return value;
}

export function useStoredCompanion() {
  const value = useContext(CompanionContext);
  if (!value) throw new Error('PreferencesProvider missing');
  return value;
}
