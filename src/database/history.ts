import { afterWrites, write } from './connection';
import { daySeries, daysInPeriod, type DailyTotals, type Period } from '@/engine/progress/metrics';
import type { SessionAttempt } from '@/engine/session/session';

export type HistoryRow = { id: string; completedAt: number; total: number; correct: number; elapsedMs: number };
export type SessionDetail = HistoryRow & { attempts: readonly SessionAttempt[] };
const columns = 'id, completed_at AS completedAt, total, correct, elapsed_ms AS elapsedMs';
export const PAGE_SIZE = 20;

export async function dailyTotals(period: Period, now = Date.now()) {
  const days = daysInPeriod(now, period);
  const db = await afterWrites();
  const rows = await db.getAllAsync<DailyTotals>(
    'SELECT day, COUNT(*) AS sessions, SUM(total) AS total, SUM(correct) AS correct, SUM(elapsed_ms) AS elapsedMs FROM practice_sessions WHERE day BETWEEN ? AND ? GROUP BY day ORDER BY day',
    days[0]!, days.at(-1)!);
  return daySeries(rows, days);
}

export async function historyPage(cursor?: Pick<HistoryRow, 'completedAt' | 'id'>) {
  const db = await afterWrites();
  const rows = cursor
    ? await db.getAllAsync<HistoryRow>('SELECT ' + columns + ' FROM practice_sessions WHERE (completed_at, id) < (?, ?) ORDER BY completed_at DESC, id DESC LIMIT ?', cursor.completedAt, cursor.id, PAGE_SIZE + 1)
    : await db.getAllAsync<HistoryRow>('SELECT ' + columns + ' FROM practice_sessions ORDER BY completed_at DESC, id DESC LIMIT ?', PAGE_SIZE + 1);
  return { rows: rows.slice(0, PAGE_SIZE), more: rows.length > PAGE_SIZE };
}

export async function sessionDetail(id: string): Promise<SessionDetail | null> {
  const db = await afterWrites();
  const row = await db.getFirstAsync<HistoryRow & { attempts: string }>('SELECT ' + columns + ', attempts FROM practice_sessions WHERE id = ?', id);
  return row ? { ...row, attempts: JSON.parse(row.attempts) as SessionAttempt[] } : null;
}

export function resetPracticeData() {
  return write(db => db.withExclusiveTransactionAsync(async tx => {
    await tx.execAsync('DELETE FROM practice_sessions; DELETE FROM adaptive_completed; DELETE FROM adaptive_profile;');
  }));
}
