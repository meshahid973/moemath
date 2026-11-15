import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { emptyProfile, type Profile } from '@/engine/adaptive/profile';
import type { SessionAttempt } from '@/engine/session/session';
import { loadProfile, saveCompleted } from '@/database/adaptive';

type Snapshot = { profile: Profile; ready: boolean; error: boolean; pending: boolean };
type Adaptive = Snapshot & {
  record: (id: string, attempts: readonly SessionAttempt[]) => void;
  retrySave: () => void;
};
const Context = createContext<Adaptive | null>(null);
const Availability = createContext(false);

export function AdaptiveProvider({ children }: PropsWithChildren) {
  const [snapshot, setSnapshot] = useState<Snapshot>(() => ({ profile: emptyProfile(), ready: false, error: false, pending: true }));
  const queue = useRef(new Map<string, { attempts: readonly SessionAttempt[]; now: number }>());
  const running = useRef(false);
  const initialized = useRef(false);

  const flush = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    let latest: Profile | undefined;
    let error = false;
    try {
      // Completed-session transactions already read the latest stored profile.
      if (!initialized.current && queue.current.size === 0) {
        latest = await loadProfile();
        initialized.current = true;
      }
      for (const [id, item] of queue.current) {
        latest = await saveCompleted(id, item.attempts, item.now);
        initialized.current = true;
        queue.current.delete(id);
      }
    } catch {
      error = true;
    } finally {
      running.current = false;
      const ready = initialized.current;
      setSnapshot(previous => ({
        profile: latest ?? previous.profile,
        ready, error, pending: false,
      }));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled) return flush();
    });
    return () => { cancelled = true; };
  }, [flush]);

  const startFlush = useCallback(() => {
    setSnapshot(previous => previous.pending ? previous : { ...previous, pending: true });
    void flush();
  }, [flush]);
  const record = useCallback((id: string, attempts: readonly SessionAttempt[]) => {
    if (!queue.current.has(id)) queue.current.set(id, { attempts, now: Date.now() });
    startFlush();
  }, [startFlush]);

  const value = useMemo(() => ({ ...snapshot, record, retrySave: startFlush }), [snapshot, record, startFlush]);
  return (
    <Context.Provider value={value}>
      <Availability.Provider value={snapshot.ready && !snapshot.error}>{children}</Availability.Provider>
    </Context.Provider>
  );
}

export function useAdaptive() {
  const value = useContext(Context);
  if (!value) throw new Error('AdaptiveProvider is missing');
  return value;
}

export function useAdaptiveAvailability() {
  return useContext(Availability);
}
