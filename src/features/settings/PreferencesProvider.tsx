import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { defaultPreferences, type Preferences } from '@/engine/preferences';
import { loadPreferences, savePreference } from '@/database/preferences';

type ContextValue = { preferences: Preferences; setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void; error: boolean; ready: boolean; retry: () => void };
const Context = createContext<ContextValue | null>(null);

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
      setPreferences({ ...saved, ...Object.fromEntries(dirty.current) });
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
    setPreferences(previous => ({ ...previous, [key]: value }));
    if (!loading.current) void flush();
  }, [flush]);

  const retry = useCallback(() => { void load(); }, [load]);
  const result = useMemo(() => ({ preferences, setPreference, error, ready, retry }), [preferences, setPreference, error, ready, retry]);
  return <Context.Provider value={result}>{children}</Context.Provider>;
}

export function usePreferences() {
  const value = useContext(Context);
  if (!value) throw new Error('PreferencesProvider missing');
  return value;
}
