import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";
import { Panel, Widget } from "@/types/panel";

export type SidebarState = {
  isChatOpen: boolean;
  isAddWidgetOpen: boolean;
  draggedWidgetType: string | null;
};

export type SidebarActions = {
  setIsChatOpen: (isChatOpen: boolean) => void;
  setIsAddWidgetOpen: (isAddWidgetOpen: boolean) => void;
  setDraggedWidgetType: (draggedWidgetType: string | null) => void;
};

export type SidebarStore = SidebarState & SidebarActions;

const defaultInitState: SidebarState = {
  isChatOpen: false,
  isAddWidgetOpen: false,
  draggedWidgetType: null,
};

export const createSidebarStore = (
  initState: SidebarState = defaultInitState
) => {
  return createStore<SidebarStore>()(
    devtools((set) => ({
      ...initState,
      setIsChatOpen: (isChatOpen) => set({ isChatOpen }),
      setIsAddWidgetOpen: (isAddWidgetOpen) => set({ isAddWidgetOpen }),
      setDraggedWidgetType: (draggedWidgetType) => set({ draggedWidgetType }),
    }))
  );
};
