
import { getDb } from "./db";
import type { ObservationEntity } from "../types/ObservationEntity";

function rowToEntity(row: any): ObservationEntity {
  return {
    id: row.id,
    groupId: row.groupId,
    created: new Date(row.created),
    angle: row.angle,
    delay: row.delay,
    indexError: row.indexError,
    observerAltitude: row.observerAltitude,
    limbType: row.limbType,
    horizon: row.horizon,
    object: row.object,
    latitude: row.latitude,
    longitude: row.longitude,
  };
}

export function defaultObservation(id: number, groupId = 1): ObservationEntity {
  return {
    id,
    groupId,
    created: new Date(),
    angle: 0,
    delay: 0,
    indexError: 0,
    observerAltitude: 0,
    limbType: 0,
    horizon: 0,
    object: "Sun",
    latitude: 0,
    longitude: 0,
  };
}

export async function getObservation(id: number): Promise<ObservationEntity | null> {
  const db = await getDb();
  const row = await db.getFirstAsync(`SELECT * FROM observations WHERE id = ?`, [id]);
  return row ? rowToEntity(row) : null;
}

export async function getObservationsByGroup(groupId: number): Promise<ObservationEntity[]> {
  const db = await getDb();
  const rows = await db.getAllAsync(
    `SELECT * FROM observations WHERE groupId = ? ORDER BY created DESC`,
    [groupId]
  );
  return rows.map(rowToEntity);
}

export async function getOrCreateObservation(id: number, groupId = 1): Promise<ObservationEntity> {
  const existing = await getObservation(id);
  if (existing) return existing;
  const entity = defaultObservation(id, groupId);
  await upsertObservation(entity);
  return entity;
}

export async function upsertObservation(entity: ObservationEntity): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `
    INSERT INTO observations (
      id, groupId, created, angle, delay, indexError, observerAltitude,
      limbType, horizon, object, latitude, longitude
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      groupId = excluded.groupId,
      created = excluded.created,
      angle = excluded.angle,
      delay = excluded.delay,
      indexError = excluded.indexError,
      observerAltitude = excluded.observerAltitude,
      limbType = excluded.limbType,
      horizon = excluded.horizon,
      object = excluded.object,
      latitude = excluded.latitude,
      longitude = excluded.longitude
  `,
    [
      entity.id,
      entity.groupId,
      entity.created.getTime(),
      entity.angle,
      entity.delay,
      entity.indexError,
      entity.observerAltitude,
      entity.limbType,
      entity.horizon,
      entity.object,
      entity.latitude,
      entity.longitude,
    ]
  );
}
