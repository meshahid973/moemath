import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { write } from './connection';
import { parsePreferences } from '@/engine/preferences';

export async function exportPracticeData() {
  if (!await Sharing.isAvailableAsync()) throw new Error('File sharing unavailable');
  const file = new File(Paths.cache, 'moemath-export.json');
  file.create({ overwrite: true });
  const handle = file.open();
  const encoder = new TextEncoder();
  const append = (text: string) => handle.writeBytes(encoder.encode(text));
  try {
    // Hold the write queue while exporting a consistent snapshot, in bounded pages.
    await write(async db => {
      const prefs = parsePreferences(await db.getAllAsync<{key: string; value: string}>('SELECT key,value FROM preferences'));
      const profile = await db.getFirstAsync<{payload: string}>('SELECT payload FROM adaptive_profile WHERE id = 1');
      const metadata = { schema: 2, exportedAt: new Date().toISOString(), preferences: prefs, profile: profile ? JSON.parse(profile.payload) : null };
      await append(JSON.stringify(metadata).slice(0, -1) + ',"sessions":[');
      let cursor: { completed_at: number; id: string } | undefined;
      let first = true;
      while (true) {
        type Row = { id: string; completed_at: number; day: string; total: number; correct: number; elapsed_ms: number; attempts: string };
        const rows: Row[] = cursor
          ? await db.getAllAsync<Row>('SELECT * FROM practice_sessions WHERE (completed_at,id) < (?,?) ORDER BY completed_at DESC,id DESC LIMIT 20', cursor.completed_at, cursor.id)
          : await db.getAllAsync<Row>('SELECT * FROM practice_sessions ORDER BY completed_at DESC,id DESC LIMIT 20');
        if (!rows.length) break;
        for (const row of rows) {
          await append((first ? '' : ',') + JSON.stringify({ ...row, attempts: JSON.parse(row.attempts) }));
          first = false;
        }
        cursor = rows.at(-1);
      }
      await append(']}');
    });
  } catch (error) {
    handle.close();
    if (file.exists) file.delete();
    throw error;
  }
  handle.close();
  await Sharing.shareAsync(file.uri, { mimeType: 'application/json', UTI: 'public.json', dialogTitle: 'Export MoeMath data' });
}

export function clearExportCache() {
  const file = new File(Paths.cache, 'moemath-export.json');
  if (file.exists) file.delete();
}
