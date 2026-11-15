import type { ThemeMode } from '../theme/tokens.ts';
export type Preferences = { mode: ThemeMode; showCompanion: boolean; haptics: boolean; soundEffects: boolean };
export const defaultPreferences: Preferences = { mode: 'system', showCompanion: true, haptics: false, soundEffects: false };

export function parsePreferences(rows: readonly { key: string; value: string }[]): Preferences {
  const values = new Map(rows.map(row => [row.key, row.value]));
  const mode = values.get('mode');
  return {
    mode: mode === 'light' || mode === 'dark' ? mode : 'system',
    showCompanion: values.get('showCompanion') !== 'false',
    haptics: values.get('haptics') === 'true',
    soundEffects: values.get('soundEffects') === 'true',
  };
}
