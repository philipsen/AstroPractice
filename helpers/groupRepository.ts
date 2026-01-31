import { SQLiteDatabase } from "expo-sqlite";

async function addGroupAsync(
  db: SQLiteDatabase,
  text: string,
  description: string
): Promise<void> {
  if (text !== "") {
    await db.runAsync(
      "INSERT INTO groups (name, description, created) VALUES (?, ?, datetime('now'));",
      text,
      description
    );
  }
}

async function deleteGroupAsync(db: SQLiteDatabase, id: number): Promise<void> {
  await db.withExclusiveTransactionAsync(async () => {
    await db.runAsync("DELETE FROM groups WHERE id = ?;", [id]);
    await db.runAsync("DELETE FROM observations WHERE groupId = ?;", [id]);
  });
}

export { addGroupAsync, deleteGroupAsync };
