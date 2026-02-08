import { create } from "zustand";
import {
  getOrCreateObservation,
  upsertObservation,
} from "../db/observation.repo";
import type { ObservationEntity } from "../types/ObservationEntity";

const DEFAULT_OBS_ID = 1;

type ObsState = {
  observationId: number | null;
  observation: ObservationEntity | null;
  loading: boolean;

  init: (id?: number, groupId?: number) => Promise<void>;
  updateField: <K extends keyof ObservationEntity>(
    key: K,
    value: ObservationEntity[K],
  ) => Promise<void>;
  updateMany: (partial: Partial<ObservationEntity>) => Promise<void>;
};

export const useObservationStore = create<ObsState>((set, get) => ({
  observationId: null,
  observation: null,
  loading: false,

  init: async (id = DEFAULT_OBS_ID, groupId = 1) => {
    set({ loading: true });
    const entity = await getOrCreateObservation(id, groupId);
    set({ observationId: id, observation: entity, loading: false });
  },

  updateField: async (key, value) => {
    console.log("Updating observation field", key, " to ", value);
    const current = get().observation;
    if (!current) return;
    const updated: ObservationEntity = {
      ...current,
      [key]: value,
    } as ObservationEntity;
    set({ observation: updated });
    await upsertObservation(updated);
  },

  updateMany: async (partial) => {
    const current = get().observation;
    if (!current) return;
    const updated: ObservationEntity = { ...current, ...partial };
    set({ observation: updated });
    await upsertObservation(updated);
  },
}));
