import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";
import { Panel, Widget } from "@/types/panel";

export type SidebarState = {
  isChatOpen: boolean;
  isAddWidgetOpen: boolean;
};

export type SidebarActions = {
  setIsChatOpen: (isChatOpen: boolean) => void;
  setIsAddWidgetOpen: (isAddWidgetOpen: boolean) => void;
};

export type SidebarStore = SidebarState & SidebarActions;

const defaultInitState: SidebarState = {
  isChatOpen: false,
  isAddWidgetOpen: false,
};

export const createSidebarStore = (
  initState: SidebarState = defaultInitState
) => {
  return createStore<SidebarStore>()(
    devtools((set) => ({
      ...initState,
      setIsChatOpen: (isChatOpen) => set({ isChatOpen }),
      setIsAddWidgetOpen: (isAddWidgetOpen) => set({ isAddWidgetOpen }),
    }))
  );
};
