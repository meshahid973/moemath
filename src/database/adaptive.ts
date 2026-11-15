import { afterWrites, write } from './connection';
import { emptyProfile, learn, type Profile } from '@/engine/adaptive/profile';
import { sessionRecord } from '@/engine/progress/sessionRecord';
import { claimSql, saveProfileSql, insertSessionSql } from './queries';
import type { SessionAttempt } from '@/engine/session/session';

export async function loadProfile(): Promise<Profile> {
  const db = await afterWrites();
  const row = await db.getFirstAsync<{ payload: string }>('SELECT payload FROM adaptive_profile WHERE id = 1');
  return row ? JSON.parse(row.payload) as Profile : emptyProfile();
}

export function saveCompleted(id: string, attempts: readonly SessionAttempt[], now: number, day?: string): Promise<Profile> {
  const record = sessionRecord(id, attempts, now, day);
  return write(async db => {
    let next = emptyProfile();
    await db.withExclusiveTransactionAsync(async tx => {
      const row = await tx.getFirstAsync<{ payload: string }>('SELECT payload FROM adaptive_profile WHERE id = 1');
      next = row ? JSON.parse(row.payload) as Profile : emptyProfile();
      const claim = await tx.runAsync(claimSql, id);
      if (!claim.changes) return;
      next = learn(next, attempts, now);
      await tx.runAsync(saveProfileSql, JSON.stringify(next));
      await tx.runAsync(insertSessionSql,
        record.id, record.completedAt, record.day, record.total, record.correct, record.elapsedMs, record.attempts);
    });
    return next;
  });
}
