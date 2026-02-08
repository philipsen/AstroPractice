import * as SQLite from "expo-sqlite";
import { runMigrations } from "./migrations";

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDb() {
  if (_db) return _db;

  _db = await SQLite.openDatabaseAsync("db.db");
  await _db.execAsync(`PRAGMA journal_mode = wal;`);
  await _db.execAsync(`PRAGMA foreign_keys = ON;`);

  // Run schema migrations (idempotent)
  await runMigrations(_db);

  // Ensure a default group exists (id=1)
  const row = await _db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM groups WHERE id = 1`,
  );
  const count = row ? (row as any).count : 0;
  if (!count) {
    const now = Date.now();
    await _db.runAsync(
      `INSERT INTO groups (id, name, created, description) VALUES (1, ?, ?, ?)`,
      ["Default", now, ""],
    );
  }

  return _db;
}
