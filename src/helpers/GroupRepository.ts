import { GroupEntity } from "@/src/models/GroupEntity";
import { SQLiteDatabase } from "expo-sqlite";

async function addGroupAsync(
  db: SQLiteDatabase,
  text: string,
  description: string,
): Promise<void> {
  if (text !== "") {
    await db.runAsync(
      "INSERT INTO groups (name, description, created) VALUES (?, ?, datetime('now'));",
      text,
      description,
    );
  }
}

async function updateGroup(
  group: GroupEntity,
  db: SQLiteDatabase,
): Promise<void> {
  const res = await db.runAsync(
    "UPDATE groups SET name = ?, description = ? WHERE id = ?",
    [group.name, group.description || null, group.id],
  );
}

async function deleteGroupAsync(db: SQLiteDatabase, id: number): Promise<void> {
  await db.withExclusiveTransactionAsync(async () => {
    await db.runAsync("DELETE FROM groups WHERE id = ?;", [id]);
    await db.runAsync("DELETE FROM observations WHERE groupId = ?;", [id]);
  });
}

export { addGroupAsync, deleteGroupAsync, updateGroup };
