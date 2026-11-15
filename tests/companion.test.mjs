import { test } from 'node:test';
import assert from 'node:assert/strict';
import { answerExpression, resultExpression, expressions } from '../src/features/companion/expressions.ts';

test('answer reactions encourage rather than punish', () => {
  assert.equal(answerExpression(true), 'happy');
  assert.equal(answerExpression(false), 'encouraging');
});

test('result reactions are based on actual accuracy', () => {
  assert.equal(resultExpression(10, 10), 'surprised');
  assert.equal(resultExpression(8, 10), 'happy');
  assert.equal(resultExpression(7, 10), 'encouraging');
  assert.equal(resultExpression(0, 0), 'encouraging');
  assert.equal(new Set(expressions).size, 6);
});
