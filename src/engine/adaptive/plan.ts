import { createRandom, randomInt } from '../arithmetic/random.ts';
import { uniqueQuestion } from '../arithmetic/questions.ts';
import { operations, type Difficulty, type PracticeOperation, type Question } from '../arithmetic/types.ts';
import { accuracy, type Profile } from './profile.ts';

export function adaptiveQuestions(profile: Profile, operation: PracticeOperation, seed: number, now: number): readonly Question[] {
  const random = createRandom(seed);
  const pool = operation === 'mixed' ? [...operations] : [operation];
  const weakest = [...pool].sort((a, b) => (accuracy(profile.skills[a]) ?? 0.75) - (accuracy(profile.skills[b]) ?? 0.75) || profile.skills[a].seen - profile.skills[b].seen);
  const seen = new Set<string>();
  const questions: Question[] = [];
  const add = (q: Question) => { if (!seen.has(q.key)) { seen.add(q.key); questions.push(q); } };
  for (const item of profile.review) {
    if (questions.length === 3) break;
    if (item.due <= now && pool.includes(item.question.operation)) add(item.question);
  }
  // Fill unused revision slots with easier questions from weaker operations.
  while (questions.length < 3) {
    const op = weakest[questions.length % weakest.length]!;
    add(uniqueQuestion(op, Math.max(1, profile.skills[op].level - 1) as Difficulty, random, seen));
  }
  for (let i = 0; i < 6; i++) {
    const op = i < pool.length ? pool[i]! : weakest[(i - pool.length) % weakest.length]!;
    add(uniqueQuestion(op, profile.skills[op].level, random, seen));
  }
  const op = weakest[0]!;
  add(uniqueQuestion(op, Math.min(6, profile.skills[op].level + 1) as Difficulty, random, seen));
  for (let i = questions.length - 1; i > 0; i--) {
    const j = randomInt(random, 0, i);
    [questions[i], questions[j]] = [questions[j]!, questions[i]!];
  }
  return questions;
}
