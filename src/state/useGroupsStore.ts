import { create } from "zustand";
import {
  createGroup,
  deleteAllGroupsAsync,
  deleteGroupAsync,
  getGroup,
  getGroups,
  updateGroup
} from "../db/group.repo";
import type { GroupEntity } from "../types/GroupEntity";

type GroupsState = {
  groups: GroupEntity[];
  selectedGroupId: number;
  loading: boolean;

  hydrate: () => Promise<void>;
  select: (id: number) => Promise<void>;
  add: (name: string, description: string) => Promise<GroupEntity>;
  getById: (id: number) => GroupEntity | undefined;
  update: (id: number, name: string, description: string) => void;
  delete: (id: number) => Promise<void>;
  deleteAll: () => Promise<void>;
};

export const useGroupsStore = create<GroupsState>((set, get) => ({
  groups: [],
  selectedGroupId: 1,
  loading: false,

  hydrate: async () => {
    console.log("Hydrating groups store");
    set({ loading: true });
    const list = await getGroups();
    const selected = get().selectedGroupId;
    const exists = list.some((g) => g.id === selected);
    set({
      groups: list,
      selectedGroupId: exists ? selected : 1,
      loading: false,
    });
  },

  select: async (id: number) => {
    console.log("Selecting group", id);
    const g = await getGroup(id);
    if (!g) return;
    set({ selectedGroupId: id });
  },

  add: async (name: string, description: string) => {
    console.log("Adding group", name, description);
    const g = await createGroup(name, description);
    set({ groups: [g, ...get().groups] });
    return g;
  },

  getById: (id) => get().groups.find((g) => g.id === id),

  update: (id: number, name: string, description: string) => {
    console.log("Updating group", id, name, description);
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === id ? { ...g, name, description } : g,
      ),
    }));
    updateGroup(id, { name, description });
  },

  delete: async (id: number) => {
    console.log("Deleting group", id);
    await deleteGroupAsync(id);
    set({ groups: get().groups.filter((g) => g.id !== id) });
  },

  deleteAll: async () => {
    console.log("Deleting all groups");
    await deleteAllGroupsAsync();
    set({ groups: [] });
  },
}));
