import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  mealIds: string[];
  toggle: (mealId: string) => void;
  isFavorite: (mealId: string) => boolean;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      mealIds: [],
      toggle: (mealId) =>
        set((s) => ({
          mealIds: s.mealIds.includes(mealId)
            ? s.mealIds.filter((id) => id !== mealId)
            : [...s.mealIds, mealId],
        })),
      isFavorite: (mealId) => get().mealIds.includes(mealId),
      clear: () => set({ mealIds: [] }),
    }),
    { name: "foodhub-favorites" }
  )
);
