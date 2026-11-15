import { summarizeAttempts } from '../scoring.ts';
import type { SessionAttempt } from '../session/session.ts';
import { localDay } from './metrics.ts';

export function sessionRecord(id: string, attempts: readonly SessionAttempt[], completedAt: number, day = localDay(completedAt)) {
  if (!id || !Number.isSafeInteger(completedAt) || completedAt < 0 || !attempts.length) throw new RangeError('Invalid completed session');
  for (const attempt of attempts) {
    if (attempt.expected !== attempt.question.answer) throw new RangeError('Inconsistent question answer');
  }
  const score = summarizeAttempts(attempts);
  return { id, completedAt, day, total: score.total, correct: score.correct, elapsedMs: score.totalMs, attempts: JSON.stringify(attempts) };
}
