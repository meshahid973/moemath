import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { adaptiveSchema, progressSchema } from '../src/database/schema.ts';
import { claimSql, insertSessionSql, saveProfileSql, dailyTotalsSql, firstPageSql, nextPageSql, resetSql } from '../src/database/queries.ts';
import { sessionRecord } from '../src/engine/progress/sessionRecord.ts';
import { generateQuestions } from '../src/engine/arithmetic/questions.ts';
import { emptyProfile, learn } from '../src/engine/adaptive/profile.ts';
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
        ? db.prepare(nextPageSql).all(cursor.completedAt,cursor.id,20)
        : db.prepare(firstPageSql).all(20);
      if (!page.length) break;
      results.push(...page.map(x => x.id));
      cursor = page.at(-1);
    }
    assert.equal(results.length, 205);
    assert.equal(new Set(results).size, 205);
    db.exec(resetSql)
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM practice_sessions').get().n, 0);
    assert.equal(db.prepare("SELECT value FROM preferences WHERE key='mode'").get().value, 'dark');
  } finally { db.close(); }
});


test('production SQL records atomic unique sessions and computes accurate daily totals', () => {
  const db = new DatabaseSync(':memory:');
  try {
    db.exec(adaptiveSchema);
    db.exec(progressSchema);
    const questions = generateQuestions({operation:'addition', difficulty:1, seed:42, count:10});
    const attempts = questions.map((question,i) => ({question,expected:question.answer,submitted:i < 7 ? question.answer : question.answer + 1,elapsedMs: i < 7 ? 1000 : 3000,interrupted:false}));
    const single = attempts.slice(0,1);
    const first = new Date(2026, 10, 14, 23, 59, 59).getTime();
    let profile = emptyProfile();
    function persist(id, entries, time, day) {
      const r = sessionRecord(id,entries,time,day);
      db.exec('BEGIN');
      try {
        if (!Number(db.prepare(claimSql).run(id).changes)) {
          db.exec('COMMIT');
          return false;
        }
        const next = learn(profile,entries,time);
        db.prepare(saveProfileSql).run(JSON.stringify(next));
        db.prepare(insertSessionSql).run(r.id,r.completedAt,r.day,r.total,r.correct,r.elapsedMs,r.attempts);
        db.exec('COMMIT');
        profile = next;
        return true;
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    }
    assert.equal(persist('one',attempts,first,'2026-11-14'),true);
    assert.equal(persist('one',attempts,first,'2026-11-14'),false);
    assert.equal(persist('two',single,first+2000,'2026-11-15'),true);
    const rows = db.prepare(dailyTotalsSql).all('2026-11-14','2026-11-15');
    const totals = aggregate(rows);
    assert.equal(totals.total,11);
    assert.equal(totals.correct,8);
    assert.equal(totals.sessions,2);
    assert.equal(totals.elapsedMs,17000);
    assert.equal(totals.accuracy,8/11);
    assert.equal(totals.averageMs,17000/11);
    assert.equal(db.prepare('SELECT attempts FROM practice_sessions WHERE id=?').get('one').attempts,JSON.stringify(attempts));
    assert.equal(JSON.parse(db.prepare('SELECT payload FROM adaptive_profile').get().payload).skills.addition.seen,11);
    assert.throws(() => sessionRecord('bad',[{...single[0],expected:-1}],first));
    assert.throws(() => sessionRecord('empty',[],first));
  } finally { db.close(); }
});
