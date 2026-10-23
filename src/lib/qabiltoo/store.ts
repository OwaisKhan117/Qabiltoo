"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile } from "./types";

interface AuthState {
  user: Profile | null;
  setUser: (user: Profile | null) => void;
  logout: () => void;
  /** Profile ids saved via "Save for Later" hearts */
  savedIds: string[];
  toggleSaved: (id: string) => void;
  /** Ids of profiles this user has sent a proposal to (optimistic) */
  proposedIds: string[];
  markProposed: (id: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      savedIds: [],
      toggleSaved: (id) =>
        set((s) => ({
          savedIds: s.savedIds.includes(id)
            ? s.savedIds.filter((x) => x !== id)
            : [...s.savedIds, id],
        })),
      proposedIds: [],
      markProposed: (id) =>
        set((s) => ({
          proposedIds: s.proposedIds.includes(id) ? s.proposedIds : [...s.proposedIds, id],
        })),
    }),
    { name: "qabiltoo-auth" }
  )
);
