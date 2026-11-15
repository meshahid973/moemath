import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { emptyProfile, type Profile } from '@/engine/adaptive/profile';
import type { SessionAttempt } from '@/engine/session/session';
import { loadProfile, saveCompleted } from '@/database/adaptive';

type Adaptive = {
  profile: Profile;
  ready: boolean;
  error: boolean;
  pending: boolean;
  record: (id: string, attempts: readonly SessionAttempt[]) => void;
  retrySave: () => void;
};
const Context = createContext<Adaptive | null>(null);

export function AdaptiveProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState(emptyProfile);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(true);
  const queue = useRef(new Map<string, { attempts: readonly SessionAttempt[]; now: number }>());
  const running = useRef(false);

  const flush = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    try {
      setProfile(await loadProfile());
      setReady(true);
      for (const [id, item] of queue.current) {
        setProfile(await saveCompleted(id, item.attempts, item.now));
        queue.current.delete(id);
      }
      setError(false);
    } catch {
      setError(true);
    } finally {
      running.current = false;
      setPending(false);
    }
  }, []);

  useEffect(() => { void flush(); }, [flush]);

  const record = useCallback((id: string, attempts: readonly SessionAttempt[]) => {
    if (!queue.current.has(id)) queue.current.set(id, { attempts, now: Date.now() });
    setPending(true);
    void flush();
  }, [flush]);
  const retrySave = useCallback(() => {
    setPending(true);
    void flush();
  }, [flush]);
  const value = useMemo(() => ({ profile, ready, error, pending, record, retrySave }), [profile, ready, error, pending, record, retrySave]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAdaptive() {
  const value = useContext(Context);
  if (!value) throw new Error('AdaptiveProvider is missing');
  return value;
}
