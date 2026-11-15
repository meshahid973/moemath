export type DailyTotals = { day: string; sessions: number; total: number; correct: number; elapsedMs: number };
export type Period = 1 | 7 | 30;

export function localDay(timestamp: number): string {
  const date = new Date(timestamp);
  return String(date.getFullYear()).padStart(4, '0') + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

export function daysInPeriod(now: number, period: Period): string[] {
  const date = new Date(now);
  return Array.from({ length: period }, (_, i) => {
    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate() - period + i + 1);
    return localDay(day.getTime());
  });
}

export function daySeries(rows: readonly DailyTotals[], days: readonly string[]): DailyTotals[] {
  const byDay = new Map(rows.map(row => [row.day, row]));
  return days.map(day => byDay.get(day) ?? { day, sessions: 0, total: 0, correct: 0, elapsedMs: 0 });
}

export function aggregate(rows: readonly DailyTotals[]) {
  let sessions = 0, total = 0, correct = 0, elapsedMs = 0;
  for (const row of rows) {
    sessions += row.sessions;
    total += row.total;
    correct += row.correct;
    elapsedMs += row.elapsedMs;
  }
  return { sessions, total, correct, elapsedMs, accuracy: total ? correct / total : null, averageMs: total ? elapsedMs / total : null };
}
