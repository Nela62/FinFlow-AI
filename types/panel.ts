export type Widget = {
  id: string;
  title: string;
  content: React.ReactNode;
  position: { x: number; y: number; w: number; h: number };
};

export type Panel = {
  id: string;
  name: string;
  widgets: Widget[];
  layout: any; // react-grid-layout configuration
};

export type WidgetConfig = {
  id: string;
  user_id: string;
  last_updated: string;
  data: any;
};

export type FinancialsConfig = WidgetConfig & {
  ticker: string;
  selected_tab: "income" | "balance" | "cash" | "metrics";
  period: "annual" | "quarterly";
};
