import { create } from "zustand";

export type ModerationTab =
  | "flagged"
  | "hide_requests"
  | "suspended"
  | "banned";

interface ModerationStore {
  activeTab: ModerationTab;
  setActiveTab: (tab: ModerationTab) => void;
}

export const useModerationStore = create<ModerationStore>((set) => ({
  activeTab: "flagged",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
