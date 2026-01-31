import { GroupEntity } from "@/models/GroupEntity";
import { ObservationEntity } from "@/models/ObservationEntity";
import { LocationObject } from "expo-location";
import { SQLiteDatabase, SQLiteRunResult } from "expo-sqlite";

export function getGroup(db: SQLiteDatabase, groupId: number): GroupEntity {
  const result = db.getFirstSync<GroupEntity>(
    "SELECT * FROM groups WHERE id = ?;",
    [groupId],
  );
  if (!result) {
    throw new Error(`Group with id ${groupId} not found`);
  }
  return result;
}

export function getObservation(
  db: SQLiteDatabase,
  id: number,
): ObservationEntity {
  const result = db.getFirstSync<ObservationEntity>(
    "SELECT * FROM observations WHERE id = ?;",
    [id],
  );
  if (!result) {
    throw new Error(`Observation with id ${id} not found`);
  }
  return result;
}

export async function deleteObservation(db: SQLiteDatabase, id: number) {
  console.log("Delete observation", id);
  await db.withExclusiveTransactionAsync(async () => {
    const result = await db.runAsync("DELETE FROM observations WHERE id = ?;", [
      id,
    ]);
    console.log("Deleted observation with id:", result);
  });
}

export async function newObservation(
  db: SQLiteDatabase,
  groupId: number,
  lastObservation: ObservationEntity | null,
) {
  return await db.runAsync(
    `INSERT INTO observations (groupId, created, 
            angle, indexError, observerAltitude, limbType, horizon, 
            object, latitude, longitude, delay            
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      groupId,
      new Date().toISOString(),
      lastObservation?.angle ?? null,
      lastObservation?.indexError ?? null,
      lastObservation?.observerAltitude ?? null,
      lastObservation?.limbType ?? null,
      lastObservation?.horizon ?? null,
      lastObservation?.object ?? null,
      lastObservation?.latitude ?? null,
      lastObservation?.longitude ?? null,
      lastObservation?.delay ?? null,
    ],
  );
}

export async function getLatestObservation(
  db: SQLiteDatabase,
  groupId: number,
): Promise<ObservationEntity | null> {
  const r = await db.getFirstAsync<ObservationEntity>(
    "SELECT * FROM observations WHERE groupId = ? ORDER BY created DESC LIMIT 1;",
    [groupId],
  );
  return r;
}

export async function updateLocation(
  db: SQLiteDatabase,
  location: LocationObject,
  result: SQLiteRunResult,
) {
  await db.runAsync(
    `UPDATE observations SET
                    latitude = ?,
                    longitude = ?
                WHERE id = ?;`,
    [
      location.coords.latitude,
      location.coords.longitude,
      result.lastInsertRowId,
    ],
  );
}
