import { getRanges } from './difficulty.ts';
import { createRandom, randomInt, type Random } from './random.ts';
import { operations, type Difficulty, type Operation, type PracticeOperation, type Question } from './types.ts';

export const MAX_QUESTIONS = 50;
export const DEFAULT_QUESTIONS = 10;

export type SessionOptions = Readonly<{
  operation: PracticeOperation;
  difficulty: Difficulty;
  count?: number;
  seed?: number;
}>;

function makeQuestion(operation: Operation, difficulty: Difficulty, a: number, b: number): Question {
  let left = a;
  let right = b;
  let answer: number;
  switch (operation) {
    case 'addition':
      answer = a + b;
      break;
    case 'subtraction':
      left = Math.max(a, b);
      right = Math.min(a, b);
      answer = left - right;
      break;
    case 'multiplication':
      answer = a * b;
      break;
    case 'division':
      left = a * b;
      answer = a;
      break;
  }

  const commutative = operation === 'addition' || operation === 'multiplication';
  const first = commutative ? Math.min(left, right) : left;
  const second = commutative ? Math.max(left, right) : right;
  return { operation, difficulty, left, right, answer, key: operation + ':' + first + ':' + second };
}

function uniqueQuestion(operation: Operation, difficulty: Difficulty, random: Random, seen: Set<string>): Question {
  const [[minA, maxA], [minB, maxB]] = getRanges(operation, difficulty);
  for (let attempt = 0; attempt < 24; attempt++) {
    const question = makeQuestion(operation, difficulty, randomInt(random, minA, maxA), randomInt(random, minB, maxB));
    if (!seen.has(question.key)) return question;
  }

  // Deterministic fallback prevents unbounded retries when small pools fill up.
  for (let a = minA; a <= maxA; a++) {
    for (let b = minB; b <= maxB; b++) {
      const question = makeQuestion(operation, difficulty, a, b);
      if (!seen.has(question.key)) return question;
    }
  }
  throw new RangeError('Not enough unique questions');
}

function shuffle<T>(items: T[], random: Random): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = randomInt(random, 0, i);
    const a = items[i]!;
    items[i] = items[j]!;
    items[j] = a;
  }
  return items;
}

export function generateQuestions(options: SessionOptions): readonly Question[] {
  const { operation, difficulty, count = DEFAULT_QUESTIONS, seed } = options;
  if (!Number.isInteger(count) || count < 1 || count > MAX_QUESTIONS) throw new RangeError('Invalid question count');
  if (operation !== 'mixed' && !operations.includes(operation)) throw new RangeError('Invalid operation');
  getRanges('addition', difficulty);

  const random = seed === undefined ? Math.random : createRandom(seed);
  const plan: Operation[] = [];

  if (operation === 'mixed') {
    // Every group of four contains each operation once.
    while (plan.length < count) {
      const group = shuffle([...operations], random);
      if (group[0] === plan.at(-1)) group.push(group.shift()!);
      plan.push(...group);
    }
  } else {
    for (let i = 0; i < count; i++) plan.push(operation);
  }

  const seen = new Set<string>();
  return plan.slice(0, count).map((item) => {
    const question = uniqueQuestion(item, difficulty, random, seen);
    seen.add(question.key);
    return question;
  });
}
