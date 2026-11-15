import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatTime, nextSecondDelay } from '../src/engine/session/clock.ts';
test('display clock schedules only the next second boundary', () => {
  assert.equal(nextSecondDelay(0), 1000);
  assert.equal(nextSecondDelay(250), 750);
  assert.equal(nextSecondDelay(1900), 100);
  assert.equal(nextSecondDelay(1999), 16);
  assert.equal(formatTime(61999), '01:01');
});
