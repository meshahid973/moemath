import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { adaptiveSchema, progressSchema } from '../src/database/schema.ts';
import { aggregate, daySeries, daysInPeriod, localDay } from '../src/engine/progress/metrics.ts';
import { defaultPreferences, parsePreferences } from '../src/engine/preferences.ts';

test('calendar periods cover local dates including year boundaries', () => {
  const now = new Date(2027, 0, 2, 12).getTime();
  assert.deepEqual(daysInPeriod(now, 7), ['2026-12-27','2026-12-28','2026-12-29','2026-12-30','2026-12-31','2027-01-01','2027-01-02']);
  assert.equal(localDay(now), '2027-01-02');
});

test('missing days are explicit and averages are weighted by questions', () => {
  const rows = daySeries([{ day: 'a', sessions: 1, total: 1, correct: 1, elapsedMs: 1000 }, { day: 'c', sessions: 1, total: 9, correct: 3, elapsedMs: 9000 }], ['a','b','c']);
  assert.equal(rows[1].total, 0);
  assert.equal(aggregate(rows).accuracy, 0.4);
  assert.equal(aggregate(rows).averageMs, 1000);
  assert.equal(aggregate([]).accuracy, null);
});

test('preferences validate persisted values and retain defaults', () => {
  assert.deepEqual(parsePreferences([]), defaultPreferences);
  assert.deepEqual(parsePreferences([{key:'mode',value:'dark'},{key:'haptics',value:'true'},{key:'soundEffects',value:'invalid'}]), {...defaultPreferences,mode:'dark',haptics:true});
});

test('migration preserves old skill rows, history writes and IDs are atomic', () => {
  const db = new DatabaseSync(':memory:');
  db.exec(adaptiveSchema);
  db.exec("INSERT INTO adaptive_profile VALUES (1, '{}')");
  db.exec("INSERT INTO adaptive_completed VALUES ('old')");
  db.exec(progressSchema);
  db.exec(progressSchema);
  assert.equal(db.prepare('SELECT payload FROM adaptive_profile').get().payload, '{}');
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM practice_sessions').get().n, 0);
  db.exec('BEGIN');
  db.exec("INSERT INTO adaptive_completed VALUES ('new')");
  db.exec("INSERT INTO practice_sessions VALUES ('new', 42, '2026-01-01', 10, 8, 1000, '[]')");
  db.exec('ROLLBACK');
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM adaptive_completed').get().n, 1);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM practice_sessions').get().n, 0);
  db.close();
});


test('indexed cursor pagination handles tied timestamps and reset preserves settings', () => {
  const db = new DatabaseSync(':memory:');
  try {
    db.exec(adaptiveSchema);
    db.exec(progressSchema);
    db.exec("INSERT INTO preferences VALUES ('mode','dark')");
    const insert = db.prepare('INSERT INTO practice_sessions VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (let i = 0; i < 205; i++) insert.run(String(i).padStart(4,'0'), Math.floor(i / 5), '2026-01-01', 10, 8, 1000, '[]');
    const results = [];
    let cursor;
    while (true) {
      const page = cursor
        ? db.prepare('SELECT id,completed_at FROM practice_sessions WHERE (completed_at,id) < (?,?) ORDER BY completed_at DESC,id DESC LIMIT 20').all(cursor.completed_at,cursor.id)
        : db.prepare('SELECT id,completed_at FROM practice_sessions ORDER BY completed_at DESC,id DESC LIMIT 20').all();
      if (!page.length) break;
      results.push(...page.map(x => x.id));
      cursor = page.at(-1);
    }
    assert.equal(results.length, 205);
    assert.equal(new Set(results).size, 205);
    db.exec('DELETE FROM practice_sessions; DELETE FROM adaptive_completed; DELETE FROM adaptive_profile;');
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM practice_sessions').get().n, 0);
    assert.equal(db.prepare("SELECT value FROM preferences WHERE key='mode'").get().value, 'dark');
  } finally { db.close(); }
});
