import * as SQLite from 'expo-sqlite';
import { adaptiveSchema, progressSchema } from './schema';

let opening: Promise<SQLite.SQLiteDatabase> | undefined;
let writes: Promise<unknown> = Promise.resolve();

export function database() {
  if (!opening) {
    opening = (async () => {
      const db = await SQLite.openDatabaseAsync('moemath.db');
      try {
        await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
        await db.withExclusiveTransactionAsync(async tx => {
          const version = await tx.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
          if ((version?.user_version ?? 0) > 2) throw new Error('Unsupported database version');
          if ((version?.user_version ?? 0) < 2) {
            await tx.execAsync(adaptiveSchema);
            await tx.execAsync(progressSchema);
            await tx.execAsync('PRAGMA user_version = 2');
          }
        });
        return db;
      } catch (error) {
        await db.closeAsync();
        throw error;
      }
    })().catch(error => { opening = undefined; throw error; });
  }
  return opening;
}

// All writers share one queue; a failed transaction never poisons later writes.
export function write<T>(task: (db: SQLite.SQLiteDatabase) => Promise<T>): Promise<T> {
  const result = writes.then(async () => task(await database()));
  writes = result.catch(() => {});
  return result;
}

export async function afterWrites() {
  await writes;
  return database();
}
