import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSession, elapsedAt, sessionReducer } from '../src/engine/session/session.ts';
import { readSessionOptions, sessionParams } from '../src/engine/session/options.ts';

const options = { operation: 'mixed', difficulty: 1, count: 10, seed: 10 };
const start = () => sessionReducer(createSession(options), { type: 'start', now: 100 });
function enter(state, answer) {
  const index = state.attempts.length;
  for (const digit of String(answer)) state = sessionReducer(state, { type: 'digit', index, digit });
  return state;
}

test('ten answers finish exactly one session', () => {
  let state = start();
  for (let index = 0; index < 10; index++) {
    state = enter(state, state.questions[index].answer);
    state = sessionReducer(state, { type: 'submit', index, now: 100 + 600 * (index + 1) });
    assert.equal(state.attempts.length, index + 1);
    assert.equal(state.attempts[index].elapsedMs, 600);
    assert.equal(state.attempts[index].expected, state.attempts[index].submitted);
    assert.equal(state.input, '');
  }
  assert.equal(state.phase, 'completed');
  assert.equal(elapsedAt(state, 20000), 6000);
  assert.equal(sessionReducer(state, { type: 'submit', index: 9, now: 30000 }), state);
});

test('empty, duplicate and stale events do not advance the session', () => {
  let state = start();
  assert.equal(sessionReducer(state, { type: 'submit', index: 0, now: 200 }), state);
  state = enter(state, 1);
  state = sessionReducer(state, { type: 'submit', index: 0, now: 300 });
  const next = enter(state, 2);
  assert.equal(sessionReducer(next, { type: 'submit', index: 0, now: 400 }), next);
  assert.equal(sessionReducer(next, { type: 'digit', index: 0, digit: '9' }), next);
  assert.equal(sessionReducer(next, { type: 'backspace', index: 0 }), next);
  assert.equal(next.input, '2');
});

test('pause freezes the clock and preserves input', () => {
  let state = enter(start(), 12);
  state = sessionReducer(state, { type: 'pause', now: 350 });
  assert.equal(state.phase, 'paused');
  assert.equal(elapsedAt(state, 10000), 250);
  assert.equal(state.input, '12');
  assert.equal(sessionReducer(state, { type: 'digit', index: 0, digit: '3' }), state);
  assert.equal(sessionReducer(state, { type: 'submit', index: 0, now: 10000 }), state);
  state = sessionReducer(state, { type: 'resume', now: 10000 });
  state = sessionReducer(state, { type: 'submit', index: 0, now: 10250 });
  assert.equal(state.attempts[0].elapsedMs, 500);
  assert.equal(state.attempts[0].interrupted, true);
  assert.equal(state.interrupted, false);
});

test('ready sessions can pause before the initial start event', () => {
  const paused = sessionReducer(createSession(options), { type: 'pause', now: 50 });
  assert.equal(sessionReducer(paused, { type: 'start', now: 100 }), paused);
  const active = sessionReducer(paused, { type: 'resume', now: 200 });
  assert.equal(elapsedAt(active, 350), 150);
  assert.equal(active.interrupted, false);
});

test('input is bounded and backspace works', () => {
  let state = enter(start(), '000123456789');
  assert.equal(state.input, '12345');
  assert.equal(sessionReducer(state, { type: 'digit', index: 0, digit: 'x' }), state);
  state = sessionReducer(state, { type: 'backspace', index: 0 });
  assert.equal(state.input, '1234');
});

test('restarting clears attempts, input and timestamps', () => {
  let state = enter(start(), 1);
  state = sessionReducer(state, { type: 'submit', index: 0, now: 200 });
  state = sessionReducer(state, { type: 'restart', options: { ...options, seed: 22 }, now: 500 });
  assert.equal(state.attempts.length, 0);
  assert.equal(state.phase, 'active');
  assert.equal(state.input, '');
  assert.equal(elapsedAt(state, 500), 0);
  assert.deepEqual(state.questions, createSession({ ...options, seed: 22 }).questions);
});

test('route values are validated before generation', () => {
  assert.deepEqual(readSessionOptions({ operation: 'division', difficulty: '6', seed: '40' }), { operation: 'division', difficulty: 6, count: 10, seed: 40 });
  assert.deepEqual(readSessionOptions({ operation: 'bad', difficulty: '99', seed: '-1' }), { operation: 'mixed', difficulty: 1, count: 10, seed: 0 });
});


test('generated session IDs round trip through route params', () => {
  const params = sessionParams('mixed', 3, true);
  const options = readSessionOptions(params);
  assert.equal(options.id, params.id);
  assert.equal(options.adaptive, true);
  assert.equal(readSessionOptions({ id: 'invalid' }).id, undefined);
});
