import { create } from "zustand";
import type { AssociationStatsType, AssociationType } from "@/services/graphql/association";

interface AssociationAdminState {
  association: AssociationType | null;
  stats: AssociationStatsType | null;
  pendingRequestsCount: number;
  pendingReportsCount: number;
  setAssociation: (association: AssociationType | null) => void;
  setStats: (stats: AssociationStatsType | null) => void;
  setPendingRequestsCount: (count: number) => void;
  setPendingReportsCount: (count: number) => void;
  clear: () => void;
}

export const useAssociationAdminStore = create<AssociationAdminState>((set) => ({
  association: null,
  stats: null,
  pendingRequestsCount: 0,
  pendingReportsCount: 0,
  setAssociation: (association) => set({ association }),
  setStats: (stats) => set({ stats }),
  setPendingRequestsCount: (pendingRequestsCount) => set({ pendingRequestsCount }),
  setPendingReportsCount: (pendingReportsCount) => set({ pendingReportsCount }),
  clear: () =>
    set({
      association: null,
      stats: null,
      pendingRequestsCount: 0,
      pendingReportsCount: 0,
    }),
}));
