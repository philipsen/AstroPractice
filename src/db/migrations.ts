
import * as SQLite from 'expo-sqlite';

type DB = SQLite.SQLiteDatabase;

type Migration = (db: DB) => Promise<void>;

/**
 * Define your migrations here: version -> async migration function.
 * Increase the highest version when you add new migrations.
 */
export const MIGRATIONS: Record<number, Migration> = {
  1: async (db) => {
    // Initial schema
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        created INTEGER NOT NULL,
        description TEXT NOT NULL DEFAULT ''
      );

      CREATE TABLE IF NOT EXISTS observations (
        id INTEGER PRIMARY KEY,
        groupId INTEGER NOT NULL,
        created INTEGER NOT NULL,
        angle REAL NOT NULL,
        delay REAL NOT NULL,
        indexError REAL NOT NULL,
        observerAltitude REAL NOT NULL,
        limbType INTEGER NOT NULL,
        horizon INTEGER NOT NULL,
        object TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        FOREIGN KEY (groupId) REFERENCES groups(id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      );

      CREATE INDEX IF NOT EXISTS idx_observations_group ON observations(groupId);
      CREATE INDEX IF NOT EXISTS idx_observations_created ON observations(created);
    `);
  },
  // Example for future changes:
  // 2: async (db) => {
  //   await db.execAsync(`ALTER TABLE observations ADD COLUMN notes TEXT;`);
  // },
};

async function getCurrentVersion(db: DB): Promise<number> {
  await db.execAsync(`CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);`);
  const row = await db.getFirstAsync<{ value: string }>(`SELECT value FROM meta WHERE key='db_version'`);
  return row ? Number(row.value) || 0 : 0;
}

async function setVersion(db: DB, v: number): Promise<void> {
  await db.runAsync(
    `INSERT INTO meta (key, value) VALUES ('db_version', ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`,
    [String(v)]
  );
}

export async function runMigrations(db: DB): Promise<void> {
  const versions = Object.keys(MIGRATIONS).map(Number).sort((a, b) => a - b);
  if (versions.length === 0) return;

  let current = await getCurrentVersion(db);
  for (const v of versions) {
    if (v > current) {
      await db.withTransactionAsync(async () => {
        await MIGRATIONS[v](db);
        await setVersion(db, v);
      });
      current = v;
    }
  }
}
