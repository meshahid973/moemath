import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyProfile, learn } from '../src/engine/adaptive/profile.ts';
import { adaptiveQuestions } from '../src/engine/adaptive/plan.ts';
import { generateQuestions } from '../src/engine/arithmetic/questions.ts';

const now = 1000000000;
const questions = generateQuestions({ operation: 'addition', difficulty: 1, count: 12, seed: 11 });
function attempts(correct, elapsedMs = 1000, interrupted = false) {
  return questions.map(question => ({ question, expected: question.answer, submitted: correct ? question.answer : question.answer + 1, elapsedMs, interrupted }));
}

test('mastery needs enough fast accurate evidence and advances one operation only', () => {
  const initial = emptyProfile();
  assert.equal(learn(initial, attempts(true).slice(0, 10), now).skills.addition.level, 1);
  const next = learn(initial, attempts(true), now);
  assert.equal(next.skills.addition.level, 2);
  assert.equal(next.skills.division.level, 1);
  assert.equal(next.skills.addition.recent.length, 0);
  assert.equal(initial.skills.addition.seen, 0);
});

test('slow and interrupted correct answers do not promote', () => {
  assert.equal(learn(emptyProfile(), attempts(true, 20000), now).skills.addition.level, 1);
  assert.equal(learn(emptyProfile(), attempts(true, 1000, true), now).skills.addition.level, 1);
});

test('repeated errors lower a skill but never below one', () => {
  const profile = { ...emptyProfile(), skills: { ...emptyProfile().skills, addition: { level: 2, recent: [], seen: 0 } } };
  const wrong = attempts(false).map(a => ({ ...a, question: { ...a.question, difficulty: 2 } }));
  assert.equal(learn(profile, wrong, now).skills.addition.level, 1);
  assert.equal(learn(emptyProfile(), attempts(false), now).skills.addition.level, 1);
});

test('mistakes are scheduled and due correct reviews retire them', () => {
  const p = learn(emptyProfile(), attempts(false).slice(0, 1), now);
  assert.equal(p.review.length, 1);
  assert.equal(p.review[0].due, now + 86400000);
  assert.equal(learn(p, attempts(true).slice(0, 1), now).review.length, 1);
  assert.equal(learn(p, attempts(true).slice(0, 1), now + 86400000).review.length, 0);
});

test('adaptive sessions stay deterministic, distinct, bounded and include due mistakes', () => {
  const p = learn(emptyProfile(), attempts(false).slice(0, 3), now);
  const due = now + 86400000;
  for (const op of ['mixed', 'addition', 'subtraction', 'multiplication', 'division']) {
    for (let seed = 0; seed < 100; seed++) {
      const q = adaptiveQuestions(p, op, seed, due);
      assert.equal(q.length, 10);
      assert.equal(new Set(q.map(x => x.key)).size, 10);
      assert.deepEqual(q, adaptiveQuestions(p, op, seed, due));
      assert.ok(q.every(x => Number.isSafeInteger(x.answer) && x.difficulty >= 1 && x.difficulty <= 6));
      if (op !== 'mixed') assert.ok(q.every(x => x.operation === op));
      if (op === 'mixed' || op === 'addition') assert.ok(p.review.every(r => q.some(x => x.key === r.question.key)));
    }
  }
});


test('long practice runs keep mastery windows and review memory bounded', () => {
  let profile = emptyProfile();
  for (let i = 0; i < 1000; i++) {
    const date = now + i * 3600000;
    const questions = adaptiveQuestions(profile, 'mixed', i, date);
    const attempts = questions.map((question, j) => ({
      question, expected: question.answer, submitted: (i + j) % 3 === 0 ? question.answer : question.answer + 1,
      elapsedMs: 2000, interrupted: false,
    }));
    profile = learn(profile, attempts, date);
    assert.ok(profile.review.length <= 120);
    assert.ok(Object.values(profile.skills).every(skill => skill.recent.length <= 12 && skill.level >= 1 && skill.level <= 6));
    assert.equal(new Set(profile.review.map(item => item.question.key)).size, profile.review.length);
  }
  assert.equal(Object.values(profile.skills).reduce((sum, skill) => sum + skill.seen, 0), 10000);
});
