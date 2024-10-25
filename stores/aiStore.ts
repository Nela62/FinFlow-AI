import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";

export type AIContext = {
  panelId: string;
  widgetId?: string;
  widgetType?: string;
  widgetData?: Record<string, any>;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export type AIState = {
  context: AIContext | null;
  messages: Message[];
  isTyping: boolean;
};

export type AIActions = {
  setContext: (context: AIContext) => void;
  addMessage: (message: Message) => void;
  setIsTyping: (isTyping: boolean) => void;
  clearMessages: () => void;
};

export type AIStore = AIState & AIActions;

const defaultInitState: AIState = {
  context: null,
  messages: [],
  isTyping: false,
};

export const createAIStore = (initState: AIState = defaultInitState) => {
  return createStore<AIStore>()(
    devtools((set) => ({
      ...initState,
      setContext: (context) => set({ context }),
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      setIsTyping: (isTyping) => set({ isTyping }),
      clearMessages: () => set({ messages: [] }),
    }))
  );
};
