"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { createPanelStore, PanelStore } from "@/stores/panelStore";

export type PanelStoreApi = ReturnType<typeof createPanelStore>;

export const PanelStoreContext = createContext<PanelStoreApi | undefined>(
  undefined
);

export interface PanelStoreProviderProps {
  children: ReactNode;
}

export const PanelStoreProvider = ({ children }: PanelStoreProviderProps) => {
  const storeRef = useRef<PanelStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createPanelStore();
  }

  return (
    <PanelStoreContext.Provider value={storeRef.current}>
      {children}
    </PanelStoreContext.Provider>
  );
};

export const usePanelStore = <T,>(selector: (store: PanelStore) => T): T => {
  const panelStoreContext = useContext(PanelStoreContext);

  if (!panelStoreContext) {
    throw new Error(`usePanelStore must be used within PanelStoreProvider`);
  }

  return useStore(panelStoreContext, selector);
};
