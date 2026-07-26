import { create } from "zustand";
import React from "react";

export interface ModalAction {
  label: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  icon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export interface ActiveModal {
  id: string;
  title: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";

  component: React.ComponentType<{ data: Record<string, unknown> }>;
  data: Record<string, unknown>;
  actions: ModalAction[];
}

interface ModalStore {
  modal: ActiveModal | null;
  open: (config: Omit<ActiveModal, "id">) => void;
  close: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modal: null,
  open: (config) => set({ modal: { ...config, id: crypto.randomUUID() } }),
  close: () => set({ modal: null }),
}));
