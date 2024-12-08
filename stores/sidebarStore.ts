import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";

export type TabType = "workflows";

export type SidebarState = {
  selectedTab: TabType;
  // isChatOpen: boolean;
  // workspaceId: string | null;
};

export type SidebarActions = {
  setSelectedTab: (selectedTab: TabType) => void;
  // setIsChatOpen: (isChatOpen: boolean) => void;
  // setWorkspaceId: (workspaceId: string) => void;
};

export type SidebarStore = SidebarState & SidebarActions;

const defaultInitState: SidebarState = {
  selectedTab: "workflows",
  // isChatOpen: false,
  // workspaceId: null,
};

export const createSidebarStore = (
  initState: SidebarState = defaultInitState
) => {
  return createStore<SidebarStore>()(
    devtools((set) => ({
      ...initState,
      setSelectedTab: (selectedTab) => set({ selectedTab }),
      // setIsChatOpen: (isChatOpen) => set({ isChatOpen }),
      // setWorkspaceId: (workspaceId) => set({ workspaceId }),
    }))
  );
};
