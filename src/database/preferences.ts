import { afterWrites, write } from './connection';
import { parsePreferences, type Preferences } from '@/engine/preferences';

export async function loadPreferences() {
  const db = await afterWrites();
  return parsePreferences(await db.getAllAsync<{ key: string; value: string }>('SELECT key, value FROM preferences'));
}

export function savePreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
  return write(async db => {
    await db.runAsync('INSERT INTO preferences(key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', key, String(value));
  });
}
