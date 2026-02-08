import type { GroupEntity } from "../types/GroupEntity";
import { getDb } from "./db";

function rowToGroup(r: any): GroupEntity {
  return {
    id: r.id,
    name: r.name,
    created: new Date(r.created),
    description: r.description ?? "",
  };
}

export async function getGroup(id: number): Promise<GroupEntity | null> {
  const db = await getDb();
  const row = await db.getFirstAsync(`SELECT * FROM groups WHERE id = ?`, [id]);
  return row ? rowToGroup(row) : null;
}

export async function getGroups(): Promise<GroupEntity[]> {
  const db = await getDb();
  const rows = await db.getAllAsync(
    `SELECT * FROM groups ORDER BY created DESC`,
  );
  return rows.map(rowToGroup);
}

export async function upsertGroup(g: GroupEntity): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `
      INSERT INTO groups (id, name, created, description)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        created = excluded.created,
        description = excluded.description
    `,
    [g.id, g.name, g.created.getTime(), g.description ?? ""],
  );
}

export async function createGroup(
  name: string,
  description = "",
): Promise<GroupEntity> {
  const db = await getDb();
  const created = Date.now();
  const res = await db.runAsync(
    `INSERT INTO groups (name, created, description) VALUES (?, ?, ?)`,
    [name, created, description],
  );
  const id = (res.lastInsertRowId as number) ?? 0;
  return { id, name, created: new Date(created), description };
}

export async function deleteGroupAsync(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM groups WHERE id = ?`, [id]);
}

export async function deleteAllGroupsAsync(): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM groups`);
}

export async function updateGroup(
  id: number,
  patch: Partial<Pick<GroupEntity, "name" | "description">>,
): Promise<void> {
  const db = await getDb();
  const g = await getGroup(id);
  if (!g) return;
  await upsertGroup({
    ...g,
    ...patch,
  });
}

export async function deleteGroup(id: number): Promise<boolean> {
  const db = await getDb();
  try {
    await db.runAsync(`DELETE FROM groups WHERE id = ?`, [id]);
    return true;
  } catch (e) {
    console.warn("Delete group failed:", e);
    return false;
  }
}
