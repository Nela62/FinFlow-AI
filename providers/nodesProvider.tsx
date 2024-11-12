"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { createNodesStore, NodesStore } from "@/stores/nodesStore";

export type NodesStoreApi = ReturnType<typeof createNodesStore>;

export const NodesStoreContext = createContext<NodesStoreApi | undefined>(
  undefined
);

export interface NodesStoreProviderProps {
  children: ReactNode;
}

export const NodesStoreProvider = ({ children }: NodesStoreProviderProps) => {
  const storeRef = useRef<NodesStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createNodesStore();
  }

  return (
    <NodesStoreContext.Provider value={storeRef.current}>
      {children}
    </NodesStoreContext.Provider>
  );
};

export const useNodesStore = <T,>(selector: (store: NodesStore) => T): T => {
  const nodesStoreContext = useContext(NodesStoreContext);

  if (!nodesStoreContext) {
    throw new Error(`useNodesStore must be used within NodesStoreProvider`);
  }

  return useStore(nodesStoreContext, selector);
};
