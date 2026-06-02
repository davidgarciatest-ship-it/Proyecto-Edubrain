import { getDb, saveDb } from '../init';

export function prepare<T>(sql: string, params: (string | number | null | Uint8Array)[] = []): T[] {
  const db = getDb();
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params as never);
  const rows: T[] = [];
  while (stmt.step()) rows.push(stmt.getAsObject() as T);
  stmt.free();
  return rows;
}

export function run(sql: string, params: (string | number | null | Uint8Array)[] = []): { changes: number; lastInsertRowid: number } {
  const db = getDb();
  db.run(sql, params);
  saveDb();
  const result = db.exec('SELECT last_insert_rowid() as id, changes() as changes');
  const row = result[0]?.values[0];
  return { lastInsertRowid: row ? Number(row[0]) : 0, changes: row ? Number(row[1]) : 0 };
}

export function getOne<T>(sql: string, params: (string | number | null | Uint8Array)[] = []): T | undefined {
  const rows = prepare<T>(sql, params);
  return rows.length > 0 ? rows[0] : undefined;
}
