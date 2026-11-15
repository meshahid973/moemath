export const adaptiveSchema = `
CREATE TABLE IF NOT EXISTS adaptive_profile (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  payload TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS adaptive_completed (
  id TEXT PRIMARY KEY NOT NULL
);
`;
