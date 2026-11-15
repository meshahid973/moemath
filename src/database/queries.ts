export const historyColumns = 'id, completed_at AS completedAt, total, correct, elapsed_ms AS elapsedMs';
export const dailyTotalsSql = 'SELECT day, COUNT(*) AS sessions, SUM(total) AS total, SUM(correct) AS correct, SUM(elapsed_ms) AS elapsedMs FROM practice_sessions WHERE day BETWEEN ? AND ? GROUP BY day ORDER BY day';
export const firstPageSql = 'SELECT ' + historyColumns + ' FROM practice_sessions ORDER BY completed_at DESC, id DESC LIMIT ?';
export const nextPageSql = 'SELECT ' + historyColumns + ' FROM practice_sessions WHERE (completed_at, id) < (?, ?) ORDER BY completed_at DESC, id DESC LIMIT ?';
export const claimSql = 'INSERT OR IGNORE INTO adaptive_completed(id) VALUES (?)';
export const saveProfileSql = 'INSERT INTO adaptive_profile(id, payload) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload';
export const insertSessionSql = 'INSERT INTO practice_sessions(id, completed_at, day, total, correct, elapsed_ms, attempts) VALUES (?, ?, ?, ?, ?, ?, ?)';
export const resetSql = 'DELETE FROM practice_sessions; DELETE FROM adaptive_completed; DELETE FROM adaptive_profile;';
