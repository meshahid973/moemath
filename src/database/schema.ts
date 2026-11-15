export const adaptiveSchema = `
CREATE TABLE IF NOT EXISTS adaptive_profile (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  payload TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS adaptive_completed (
  id TEXT PRIMARY KEY NOT NULL
);
`;

export const progressSchema = `
CREATE TABLE IF NOT EXISTS preferences (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS practice_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  completed_at INTEGER NOT NULL,
  day TEXT NOT NULL,
  total INTEGER NOT NULL CHECK(total > 0),
  correct INTEGER NOT NULL CHECK(correct BETWEEN 0 AND total),
  elapsed_ms REAL NOT NULL CHECK(elapsed_ms >= 0),
  attempts TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS practice_sessions_date ON practice_sessions(completed_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS practice_sessions_day ON practice_sessions(day);
`;
