export type Attempt = Readonly<{
  expected: number;
  submitted: number | null;
  elapsedMs: number;
}>;

export function parseAnswer(input: string): number | null {
  if (!/^\d{1,10}$/.test(input)) return null;
  const value = Number(input);
  return Number.isSafeInteger(value) ? value : null;
}

export function summarizeAttempts(attempts: readonly Attempt[]) {
  let correct = 0;
  let totalMs = 0;
  let correctMs = 0;
  for (const attempt of attempts) {
    if (!Number.isSafeInteger(attempt.expected) || attempt.expected < 0 ||
        (attempt.submitted !== null && (!Number.isSafeInteger(attempt.submitted) || attempt.submitted < 0)) ||
        !Number.isFinite(attempt.elapsedMs) || attempt.elapsedMs < 0) {
      throw new RangeError('Invalid attempt');
    }
    totalMs += attempt.elapsedMs;
    if (attempt.expected === attempt.submitted) {
      correct++;
      correctMs += attempt.elapsedMs;
    }
  }
  const total = attempts.length;
  return {
    total,
    correct,
    incorrect: total - correct,
    accuracy: total === 0 ? 0 : correct / total,
    totalMs,
    averageMs: total === 0 ? null : totalMs / total,
    averageCorrectMs: correct === 0 ? null : correctMs / correct,
  };
}
