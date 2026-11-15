import { afterWrites, write } from './connection';
import { emptyProfile, learn, type Profile } from '@/engine/adaptive/profile';
import { summarizeAttempts } from '@/engine/scoring';
import { localDay } from '@/engine/progress/metrics';
import type { SessionAttempt } from '@/engine/session/session';

export async function loadProfile(): Promise<Profile> {
  const db = await afterWrites();
  const row = await db.getFirstAsync<{ payload: string }>('SELECT payload FROM adaptive_profile WHERE id = 1');
  return row ? JSON.parse(row.payload) as Profile : emptyProfile();
}

export function saveCompleted(id: string, attempts: readonly SessionAttempt[], now: number): Promise<Profile> {
  return write(async db => {
    let next = emptyProfile();
    await db.withExclusiveTransactionAsync(async tx => {
      const row = await tx.getFirstAsync<{ payload: string }>('SELECT payload FROM adaptive_profile WHERE id = 1');
      next = row ? JSON.parse(row.payload) as Profile : emptyProfile();
      const claim = await tx.runAsync('INSERT OR IGNORE INTO adaptive_completed(id) VALUES (?)', id);
      if (!claim.changes) return;
      if (!attempts.length) throw new Error('Cannot save empty session');
      const score = summarizeAttempts(attempts);
      next = learn(next, attempts, now);
      await tx.runAsync('INSERT INTO adaptive_profile(id, payload) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload', JSON.stringify(next));
      await tx.runAsync('INSERT INTO practice_sessions(id, completed_at, day, total, correct, elapsed_ms, attempts) VALUES (?, ?, ?, ?, ?, ?, ?)',
        id, now, localDay(now), score.total, score.correct, score.totalMs, JSON.stringify(attempts));
    });
    return next;
  });
}
