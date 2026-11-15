import { operations, type Difficulty, type Operation, type Question } from '../arithmetic/types.ts';
import type { SessionAttempt } from '../session/session.ts';

export type Observation = { correct: boolean; ratio: number | null };
export type Skill = { level: Difficulty; recent: readonly Observation[]; seen: number };
export type Review = { question: Question; due: number; failures: number };
export type Profile = { skills: Record<Operation, Skill>; review: readonly Review[] };

const DAY = 86400000;
const WINDOW = 12;
const REVIEW_LIMIT = 120;
const targets: Record<Operation, readonly number[]> = {
  addition: [3000, 4500, 6500, 8500, 12000, 16000],
  subtraction: [3500, 5000, 7000, 9500, 13000, 18000],
  multiplication: [3500, 5000, 7000, 11000, 16000, 22000],
  division: [4000, 5500, 8000, 12000, 17000, 23000],
};

export function emptyProfile(): Profile {
  const skill = (): Skill => ({ level: 1, recent: [], seen: 0 });
  return { skills: { addition: skill(), subtraction: skill(), multiplication: skill(), division: skill() }, review: [] };
}

export function accuracy(skill: Skill): number | null {
  return skill.recent.length ? skill.recent.filter(x => x.correct).length / skill.recent.length : null;
}

function median(values: number[]): number {
  values.sort((a, b) => a - b);
  const i = Math.floor(values.length / 2);
  return values.length % 2 ? values[i]! : (values[i - 1]! + values[i]!) / 2;
}

export function learn(profile: Profile, attempts: readonly SessionAttempt[], now: number): Profile {
  const skills = { ...profile.skills };
  const review = new Map(profile.review.map(item => [item.question.key, item]));
  for (const attempt of attempts) {
    const q = attempt.question;
    const correct = attempt.expected === attempt.submitted;
    const before = skills[q.operation];
    if (!correct) {
      const old = review.get(q.key);
      review.set(q.key, { question: q, due: now + DAY, failures: Math.min(10, (old?.failures ?? 0) + 1) });
    } else {
      const old = review.get(q.key);
      if (old && old.due <= now) {
        if (old.failures <= 1) review.delete(q.key);
        else review.set(q.key, { ...old, due: now + 3 * DAY, failures: old.failures - 1 });
      }
    }
    // Only evidence at the current level changes mastery. Pauses never count as speed evidence.
    const recent = q.difficulty === before.level
      ? [...before.recent, { correct, ratio: correct && !attempt.interrupted && attempt.elapsedMs >= 150 ? attempt.elapsedMs / targets[q.operation][q.difficulty - 1]! : null }].slice(-WINDOW)
      : before.recent;
    skills[q.operation] = { ...before, seen: before.seen + 1, recent };
  }
  // At most one level change per operation per completed session.
  for (const op of operations) {
    const skill = skills[op];
    if (skill.recent === profile.skills[op].recent || skill.recent.length < WINDOW) continue;
    const a = accuracy(skill)!;
    const speeds = skill.recent.flatMap(x => x.ratio === null ? [] : [x.ratio]);
    const level = a >= 0.9 && speeds.length >= 8 && median(speeds) <= 1 && skill.level < 6
      ? skill.level + 1
      : a <= 0.5 && skill.level > 1 ? skill.level - 1 : skill.level;
    if (level !== skill.level) skills[op] = { ...skill, level: level as Difficulty, recent: [] };
  }
  return { skills, review: [...review.values()].sort((a, b) => a.due - b.due || b.failures - a.failures).slice(0, REVIEW_LIMIT) };
}
