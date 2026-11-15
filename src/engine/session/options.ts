import { DEFAULT_QUESTIONS, type SessionOptions } from '../arithmetic/questions.ts';
import { operations, type Difficulty, type PracticeOperation } from '../arithmetic/types.ts';

export const defaultOptions = { operation: 'mixed', difficulty: 1, count: DEFAULT_QUESTIONS } as const;

export type SessionParams = { operation?: string; difficulty?: string; seed?: string; adaptive?: string; id?: string };

export function createSeed(): number {
  return Math.floor(Math.random() * 0x100000000);
}

export function sessionParams(operation: PracticeOperation, difficulty: Difficulty, adaptive = false) {
  const seed = createSeed();
  return { operation, difficulty: String(difficulty), seed: String(seed), adaptive: adaptive ? '1' : '0', id: Date.now() + ':' + seed };
}

export function readSessionOptions(params: SessionParams): SessionOptions {
  const operation = operations.find((item) => item === params.operation) ?? 'mixed';
  const level = Number(params.difficulty);
  const difficulty = Number.isInteger(level) && level >= 1 && level <= 6 ? level as Difficulty : defaultOptions.difficulty;
  const seed = Number(params.seed);
  return {
    operation,
    difficulty,
    ...(params.adaptive === '1' ? { adaptive: true } : {}),
    ...(typeof params.id === 'string' && /^\d{1,16}:\d{1,10}$/.test(params.id) ? { id: params.id } : {}),
    count: DEFAULT_QUESTIONS,
    seed: Number.isSafeInteger(seed) && seed >= 0 && seed <= 0xffffffff ? seed : 0,
  };
}
