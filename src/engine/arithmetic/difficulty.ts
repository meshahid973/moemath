import type { Difficulty, Operation } from './types.ts';

type Range = readonly [min: number, max: number];
type Pair = readonly [Range, Range];

const addition: readonly Pair[] = [
  [[1, 10], [1, 10]],
  [[10, 99], [2, 39]],
  [[100, 399], [10, 99]],
  [[100, 999], [100, 999]],
  [[1000, 4999], [100, 999]],
  [[1000, 9999], [1000, 9999]],
];

const multiplication: readonly Pair[] = [
  [[2, 12], [2, 12]],
  [[2, 19], [2, 12]],
  [[12, 49], [2, 9]],
  [[12, 39], [12, 19]],
  [[21, 69], [12, 49]],
  [[21, 99], [21, 99]],
];

// Division ranges describe the quotient and divisor, not the dividend.
const division: readonly Pair[] = [
  [[2, 9], [2, 9]],
  [[2, 12], [2, 12]],
  [[6, 29], [3, 12]],
  [[12, 39], [12, 19]],
  [[12, 69], [12, 49]],
  [[21, 99], [21, 99]],
];

const ranges: Record<Operation, readonly Pair[]> = {
  addition,
  subtraction: addition,
  multiplication,
  division,
};

export const difficulties = [1, 2, 3, 4, 5, 6] as const;

export const difficultyNames: Record<Difficulty, string> = {
  1: 'Beginner',
  2: 'Easy',
  3: 'Normal',
  4: 'Hard',
  5: 'Expert',
  6: 'Master',
};

export function getRanges(operation: Operation, difficulty: Difficulty): Pair {
  const pair = ranges[operation]?.[difficulty - 1];
  if (!pair || !Number.isInteger(difficulty)) throw new RangeError('Invalid operation or difficulty');
  return pair;
}
