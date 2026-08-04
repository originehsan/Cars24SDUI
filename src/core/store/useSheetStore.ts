import { create } from 'zustand';

interface SheetStore {
  isEligibilitySheetOpen: boolean;
  openEligibilitySheet: () => void;
  closeEligibilitySheet: () => void;
}

/** Local UI state only — which bottom sheet (if any) is open.
 * Kept separate from TanStack Query (server state) per AGENTS.md. */
export const useSheetStore = create<SheetStore>((set) => ({
  isEligibilitySheetOpen: false,
  openEligibilitySheet: () => set({ isEligibilitySheetOpen: true }),
  closeEligibilitySheet: () => set({ isEligibilitySheetOpen: false }),
}));