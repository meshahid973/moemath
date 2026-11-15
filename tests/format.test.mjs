import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatEquation } from '../src/engine/arithmetic/format.ts';

test('equations use consistent arithmetic symbols without revealing the answer', () => {
  for (const [operation, mark] of [['addition', '+'], ['subtraction', '−'], ['multiplication', '×'], ['division', '÷']]) {
    assert.equal(formatEquation({ left: 12, right: 3, operation }), '12 ' + mark + ' 3');
  }
});
