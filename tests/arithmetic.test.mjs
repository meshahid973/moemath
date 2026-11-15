import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateQuestions } from '../src/engine/arithmetic/questions.ts';
import { getRanges } from '../src/engine/arithmetic/difficulty.ts';
import { createRandom } from '../src/engine/arithmetic/random.ts';
import { operations } from '../src/engine/arithmetic/types.ts';
import { parseAnswer, summarizeAttempts } from '../src/engine/scoring.ts';

test('120,000 seeded questions are valid, distinct and within difficulty bounds', () => {
  for (const operation of [...operations, 'mixed']) {
    for (let difficulty = 1; difficulty <= 6; difficulty++) {
      for (let seed = 0; seed < 400; seed++) {
        const questions = generateQuestions({ operation, difficulty, seed });
        assert.equal(questions.length, 10);
        assert.equal(new Set(questions.map((q) => q.key)).size, 10);
        for (const q of questions) {
          const [[aMin, aMax], [bMin, bMax]] = getRanges(q.operation, difficulty);
          const within = (a, b) => a >= aMin && a <= aMax && b >= bMin && b <= bMax;
          assert.equal(q.difficulty, difficulty);
          assert.ok(Number.isSafeInteger(q.answer) && q.answer >= 0);
          if (operation !== 'mixed') assert.equal(q.operation, operation);
          switch (q.operation) {
            case 'addition':
              assert.ok(within(q.left, q.right));
              assert.equal(q.answer, q.left + q.right);
              break;
            case 'subtraction':
              assert.ok(within(q.left, q.right) || within(q.right, q.left));
              assert.equal(q.answer, q.left - q.right);
              break;
            case 'multiplication':
              assert.ok(within(q.left, q.right));
              assert.equal(q.answer, q.left * q.right);
              break;
            case 'division':
              assert.ok(q.right > 0);
              assert.ok(within(q.answer, q.right));
              assert.equal(q.left % q.right, 0);
              assert.equal(q.answer, q.left / q.right);
              break;
            default:
              assert.fail('Unknown operation');
          }
        }
      }
    }
  }
});

test('maximum-size sessions work at every difficulty', () => {
  for (const operation of [...operations, 'mixed']) {
    for (let difficulty = 1; difficulty <= 6; difficulty++) {
      const questions = generateQuestions({ operation, difficulty, count: 50, seed: 42 });
      assert.equal(new Set(questions.map((q) => q.key)).size, 50);
    }
  }
});

test('seeds reproduce sessions and mixed sessions stay balanced', () => {
  const options = { operation: 'mixed', difficulty: 3, count: 50, seed: 10 };
  const questions = generateQuestions(options);
  assert.deepEqual(questions, generateQuestions(options));
  assert.notDeepEqual(questions, generateQuestions({ ...options, seed: 11 }));
  const counts = operations.map((op) => questions.filter((q) => q.operation === op).length);
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1);
  for (let i = 1; i < questions.length; i++) assert.notEqual(questions[i].operation, questions[i - 1].operation);
});

test('rejects invalid input', () => {
  for (const count of [0, 51, -1, 1.5, NaN, Infinity]) {
    assert.throws(() => generateQuestions({ operation: 'mixed', difficulty: 1, count }), RangeError);
  }
  for (const difficulty of [0, 7, 1.5, NaN]) {
    assert.throws(() => generateQuestions({ operation: 'mixed', difficulty }), RangeError);
  }
  assert.throws(() => generateQuestions({ operation: 'unknown', difficulty: 1 }), RangeError);
  assert.throws(() => createRandom(-1), RangeError);
  assert.throws(() => createRandom(2 ** 32), RangeError);
});

test('answers are parsed without coercion or partial matches', () => {
  assert.equal(parseAnswer('0'), 0);
  assert.equal(parseAnswer('0042'), 42);
  for (const value of ['', ' ', '-1', '1.2', '1e2', '0x10', '2a', 'Infinity', '12345678901']) {
    assert.equal(parseAnswer(value), null);
  }
});

test('scoring handles missed answers, correct zero and empty sessions', () => {
  assert.deepEqual(summarizeAttempts([
    { expected: 0, submitted: 0, elapsedMs: 500 },
    { expected: 7, submitted: null, elapsedMs: 1200 },
    { expected: 8, submitted: 9, elapsedMs: 800 },
    { expected: 12, submitted: 12, elapsedMs: 1500 },
  ]), { total: 4, correct: 2, incorrect: 2, accuracy: 0.5, totalMs: 4000, averageMs: 1000, averageCorrectMs: 1000 });
  assert.equal(summarizeAttempts([]).averageMs, null);
  assert.equal(summarizeAttempts([]).averageCorrectMs, null);
  assert.equal(summarizeAttempts([]).accuracy, 0);
  assert.throws(() => summarizeAttempts([{ expected: 1, submitted: 1, elapsedMs: -1 }]), RangeError);
});
