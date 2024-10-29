"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { createSidebarStore, SidebarStore } from "@/stores/sidebarStore";

export type SidebarStoreApi = ReturnType<typeof createSidebarStore>;

export const SidebarStoreContext = createContext<SidebarStoreApi | undefined>(
  undefined
);

export interface SidebarStoreProviderProps {
  children: ReactNode;
}

export const SidebarStoreProvider = ({
  children,
}: SidebarStoreProviderProps) => {
  const storeRef = useRef<SidebarStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createSidebarStore();
  }

  return (
    <SidebarStoreContext.Provider value={storeRef.current}>
      {children}
    </SidebarStoreContext.Provider>
  );
};

export const useSidebarStore = <T,>(
  selector: (store: SidebarStore) => T
): T => {
  const sidebarStoreContext = useContext(SidebarStoreContext);

  if (!sidebarStoreContext) {
    throw new Error(`usePanelStore must be used within PanelStoreProvider`);
  }

  return useStore(sidebarStoreContext, selector);
};
