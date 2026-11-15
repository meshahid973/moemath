import * as SQLite from 'expo-sqlite';
import { adaptiveSchema } from './schema';
import { emptyProfile, learn, type Profile } from '@/engine/adaptive/profile';
import type { SessionAttempt } from '@/engine/session/session';

let opening: Promise<SQLite.SQLiteDatabase> | undefined;

function database() {
  if (!opening) {
    opening = (async () => {
      const db = await SQLite.openDatabaseAsync('moemath.db');
      try {
        await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
        await db.execAsync(adaptiveSchema);
        return db;
      } catch (error) {
        await db.closeAsync();
        throw error;
      }
    })().catch(error => { opening = undefined; throw error; });
  }
  return opening;
}

export async function loadProfile(): Promise<Profile> {
  const db = await database();
  const row = await db.getFirstAsync<{ payload: string }>('SELECT payload FROM adaptive_profile WHERE id = 1');
  return row ? JSON.parse(row.payload) as Profile : emptyProfile();
}

export async function saveCompleted(id: string, attempts: readonly SessionAttempt[], now: number): Promise<Profile> {
  const db = await database();
  let next = emptyProfile();
  await db.withExclusiveTransactionAsync(async transaction => {
    const row = await transaction.getFirstAsync<{ payload: string }>('SELECT payload FROM adaptive_profile WHERE id = 1');
    next = row ? JSON.parse(row.payload) as Profile : emptyProfile();
    const claim = await transaction.runAsync('INSERT OR IGNORE INTO adaptive_completed(id) VALUES (?)', id);
    if (!claim.changes) return;
    next = learn(next, attempts, now);
    await transaction.runAsync('INSERT INTO adaptive_profile(id, payload) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload', JSON.stringify(next));
  });
  return next;
}
