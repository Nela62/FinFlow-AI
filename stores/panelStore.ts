import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";
import { Panel, Widget } from "@/types/panel";

export type PanelState = {
  currentPanel: Panel | null;
  selectedWidget: string | null;
};

export type PanelActions = {
  setCurrentPanel: (panel: Panel) => void;
  addWidget: (widget: Widget) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  selectWidget: (id: string | null) => void;
};

export type PanelStore = PanelState & PanelActions;

const defaultInitState: PanelState = {
  currentPanel: null,
  selectedWidget: null,
};

export const createPanelStore = (initState: PanelState = defaultInitState) => {
  return createStore<PanelStore>()(
    devtools((set) => ({
      ...initState,
      setCurrentPanel: (panel) => set({ currentPanel: panel }),
      addWidget: (widget) =>
        set((state) => ({
          currentPanel: state.currentPanel
            ? {
                ...state.currentPanel,
                widgets: [...state.currentPanel.widgets, widget],
              }
            : null,
        })),
      updateWidget: (id, updates) =>
        set((state) => ({
          currentPanel: state.currentPanel
            ? {
                ...state.currentPanel,
                widgets: state.currentPanel.widgets.map((w) =>
                  w.id === id ? { ...w, ...updates } : w
                ),
              }
            : null,
        })),
      selectWidget: (id) => set({ selectedWidget: id }),
    }))
  );
};
