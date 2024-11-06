import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";
import { Panel, Widget } from "@/types/panel";

export type SidebarState = {
  isChatOpen: boolean;
  workspaceId: string | null;
};

export type SidebarActions = {
  setIsChatOpen: (isChatOpen: boolean) => void;
  setWorkspaceId: (workspaceId: string) => void;
};

export type SidebarStore = SidebarState & SidebarActions;

const defaultInitState: SidebarState = {
  isChatOpen: false,
  workspaceId: null,
};

export const createSidebarStore = (
  initState: SidebarState = defaultInitState
) => {
  return createStore<SidebarStore>()(
    devtools((set) => ({
      ...initState,
      setIsChatOpen: (isChatOpen) => set({ isChatOpen }),
      setWorkspaceId: (workspaceId) => set({ workspaceId }),
    }))
  );
};
