"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { createAIStore, AIStore } from "@/stores/aiStore";

export type AIStoreApi = ReturnType<typeof createAIStore>;

export const AIStoreContext = createContext<AIStoreApi | undefined>(undefined);

export interface AIStoreProviderProps {
  children: ReactNode;
}

export const AIStoreProvider = ({ children }: AIStoreProviderProps) => {
  const storeRef = useRef<AIStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createAIStore();
  }

  return (
    <AIStoreContext.Provider value={storeRef.current}>
      {children}
    </AIStoreContext.Provider>
  );
};

export const useAIStore = <T,>(selector: (store: AIStore) => T): T => {
  const aiStoreContext = useContext(AIStoreContext);

  if (!aiStoreContext) {
    throw new Error(`useAIStore must be used within AIStoreProvider`);
  }

  return useStore(aiStoreContext, selector);
};
