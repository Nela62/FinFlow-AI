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
