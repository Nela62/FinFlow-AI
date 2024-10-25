// export type Widget = {
//   id: string;
//   type: string;
//   props: Record<string, any>;
//   position: { x: number; y: number; w: number; h: number };
// };

export type Widget = {
  id: string;
  content: React.ReactNode;
  defaultHeight: number;
  defaultSize: number;
  className: string;
};

export type Panel = {
  id: string;
  name: string;
  widgets: Widget[];
  layout: any; // react-grid-layout configuration
};
