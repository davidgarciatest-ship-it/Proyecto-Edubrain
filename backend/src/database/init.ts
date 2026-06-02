import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../data/edubrain.db');

let db: SqlJsDatabase;

export async function initDb(): Promise<SqlJsDatabase> {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT (datetime('now'))
    )
  `);
  db.run(
    'CREATE INDEX IF NOT EXISTS idx_session_id ON chat_messages(session_id)'
  );

  db.run(`
    CREATE TABLE IF NOT EXISTS habit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      habit_type TEXT NOT NULL CHECK(habit_type IN ('meal', 'study')),
      description TEXT NOT NULL,
      subject TEXT,
      duration_minutes INTEGER,
      meal_type TEXT,
      foods TEXT,
      registered_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  db.run('CREATE INDEX IF NOT EXISTS idx_habit_log_session ON habit_log(session_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_habit_log_date ON habit_log(registered_at)');
  db.run('CREATE INDEX IF NOT EXISTS idx_habit_log_type ON habit_log(habit_type)');

  db.run(`
    CREATE TABLE IF NOT EXISTS user_profile (
      session_id TEXT PRIMARY KEY,
      academic_level TEXT NOT NULL CHECK(academic_level IN ('primaria', 'secundaria', 'universidad')),
      school TEXT,
      subjects TEXT,
      goals TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      title TEXT NOT NULL,
      reminder_type TEXT NOT NULL CHECK(reminder_type IN ('study', 'meal', 'goal')),
      scheduled_time TEXT NOT NULL,
      repeat_days TEXT,
      enabled INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  db.run('CREATE INDEX IF NOT EXISTS idx_reminders_session ON reminders(session_id)');

  saveDb();
  return db;
}

export function getDb(): SqlJsDatabase {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
}

export function saveDb(): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}
