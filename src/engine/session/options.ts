import { DEFAULT_QUESTIONS, type SessionOptions } from '../arithmetic/questions.ts';
import { operations, type Difficulty, type PracticeOperation } from '../arithmetic/types.ts';

export const defaultOptions = { operation: 'mixed', difficulty: 1, count: DEFAULT_QUESTIONS } as const;

export type SessionParams = { operation?: string; difficulty?: string; seed?: string };

export function createSeed(): number {
  return Math.floor(Math.random() * 0x100000000);
}

export function sessionParams(operation: PracticeOperation, difficulty: Difficulty) {
  return { operation, difficulty: String(difficulty), seed: String(createSeed()) };
}

export function readSessionOptions(params: SessionParams): SessionOptions {
  const operation = operations.find((item) => item === params.operation) ?? 'mixed';
  const level = Number(params.difficulty);
  const difficulty = Number.isInteger(level) && level >= 1 && level <= 6 ? level as Difficulty : defaultOptions.difficulty;
  const seed = Number(params.seed);
  return {
    operation,
    difficulty,
    count: DEFAULT_QUESTIONS,
    seed: Number.isSafeInteger(seed) && seed >= 0 && seed <= 0xffffffff ? seed : 0,
  };
}
