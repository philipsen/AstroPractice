// import { SQLiteDatabase } from "expo-sqlite";

// async function migrateDbIfNeeded(db: SQLiteDatabase) {
//   const DATABASE_VERSION = 1;
//   // await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);

//   // if (DATABASE_VERSION === 99) {
//   //   console.log("Force recreate");
//   //   await db.execAsync(`
//   //   DROP TABLE IF EXISTS observations;
//   //   DROP TABLE IF EXISTS groups;
//   //   PRAGMA user_version = 0;
//   //   `);
//   // }
//   const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
//   let currentDbVersion = result?.user_version ?? 0;
//   console.log('Current DB version:', currentDbVersion);
//   console.log('Target DB version:', DATABASE_VERSION);
//   // // If the current version is already up to date, return early
//   if (currentDbVersion >= DATABASE_VERSION) {
//     return;
//   }
//   if (currentDbVersion === 0) {
//     console.log("Creating initial database schema");
//   await db.execAsync(`
// PRAGMA journal_mode = 'wal';
// CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY NOT NULL, created DATE, name TEXT, description TEXT);
// CREATE TABLE IF NOT EXISTS observations (id INTEGER PRIMARY KEY NOT NULL,
//   groupId INTEGER, created DATE,
//   angle REAL, indexError REAL, observerAltitude REAL, limbType INTEGER, horizon INTEGER,
//   object TEXT, latitude REAL, longitude REAL, delay INTEGER,
//   FOREIGN KEY(groupId) REFERENCES groups(id) ON DELETE CASCADE);
// `);
//       currentDbVersion = 1;
//     }
//   // if (currentDbVersion === 1) {
//   //   console.log("Migrating database from version 1 to 2");
//   //   const result = await db.execAsync(`
//   // ALTER TABLE observations ADD COLUMN delay INTEGER angle REAL indexError REAL observerAltitude REAL limbType INTEGER horizon
//   // INTEGER object TEXT latitude REAL longitude REAL;
//   // `);
//   //   console.log("Migration result:", result);
//   //   currentDbVersion = 2;
//   // }
//   await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
// }
// export { migrateDbIfNeeded };
