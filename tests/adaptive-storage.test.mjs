import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { adaptiveSchema } from '../src/database/schema.ts';
import { emptyProfile } from '../src/engine/adaptive/profile.ts';

test('schema is repeatable and completion IDs cannot be recorded twice', () => {
  const db = new DatabaseSync(':memory:');
  try {
    db.exec(adaptiveSchema);
    db.exec(adaptiveSchema);
    const claim = db.prepare('INSERT OR IGNORE INTO adaptive_completed(id) VALUES (?)');
    const write = db.prepare('INSERT INTO adaptive_profile(id,payload) VALUES (1,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload');
    db.exec('BEGIN');
    assert.equal(Number(claim.run('session-1').changes), 1);
    write.run(JSON.stringify(emptyProfile()));
    db.exec('COMMIT');
    assert.equal(Number(claim.run('session-1').changes), 0);
    db.exec('BEGIN');
    assert.equal(Number(claim.run('session-2').changes), 1);
    db.exec('ROLLBACK');
    assert.equal(Number(claim.run('session-2').changes), 1);
    assert.deepEqual(JSON.parse(db.prepare('SELECT payload FROM adaptive_profile WHERE id=1').get().payload), emptyProfile());
  } finally { db.close(); }
});
