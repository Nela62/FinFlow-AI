import { createStore } from "zustand/vanilla";

export type NodesState = {
  selectedRunId: string | null;
  selectedTab: "logs" | "outputs";
};

export type NodesActions = {
  setSelectedRunId: (runId: string) => void;
  setSelectedTab: (tab: "logs" | "outputs") => void;
  resetSelectedRunId: () => void;
};

export type NodesStore = NodesState & NodesActions;

// const defaultNodes: AppNode[] = [
//   {
//     id: "a",
//     type: "api-connector",
//     position: { x: 0, y: 0 },
//     data: apiConnectorDefaultData,
//   },
//   {
//     id: "b",
//     type: "sec-filing",
//     position: { x: 500, y: 0 },
//     data: secFilingDefaultData,
//   },
//   {
//     id: "c",
//     type: "switch",
//     position: { x: 200, y: 750 },
//     data: switchDefaultData,
//   },
//   {
//     id: "d",
//     type: "summarizer",
//     position: { x: 900, y: 700 },
//     data: summarizerDefaultData,
//   },
//   {
//     id: "e",
//     type: "dcf-model",
//     position: { x: 0, y: 1050 },
//     data: {
//       ...dcfModelDefaultData,
//       outputs: [
//         { label: "DCF Model", dataType: "MD" },
//         { label: "DCF Model", dataType: "CSV" },
//       ],
//     },
//   },
//   {
//     id: "f",
//     type: "appender",
//     position: { x: 350, y: 1900 },
//     data: {
//       ...appenderDefaultData,
//       inputs: [
//         {
//           label: "node-1",
//           acceptedFormat: "Text",
//           acceptedTypes: textTypes,
//         },
//         {
//           label: "node-2",
//           acceptedFormat: "Text",
//           acceptedTypes: textTypes,
//         },
//         {
//           label: "node-3",
//           acceptedFormat: "Text",
//           acceptedTypes: textTypes,
//         },
//       ],
//       outputs: [{ label: "text", dataType: "MD" }],
//     },
//   },
//   {
//     id: "g",
//     type: "document-compiler",
//     position: { x: 350, y: 2500 },
//     data: documentCompilerDefaultData,
//   },
//   {
//     id: "h",
//     type: "email-sender",
//     position: { x: 350, y: 3100 },
//     data: emailSenderDefaultData,
//   },
//   {
//     id: "i",
//     type: "financial-analysis",
//     position: { x: 400, y: 1100 },
//     data: financialAnalysisDefaultData,
//   },
// ];

// const defaultEdges: Edge[] = [
//   {
//     id: "a->c",
//     source: "a",
//     target: "c",
//     targetHandle: "handle-node-1",
//     sourceHandle: "handle-JSON",
//     type: "button-edge",
//     animated: true,
//   },
//   {
//     id: "b->c",
//     source: "b",
//     target: "c",
//     targetHandle: "handle-node-2",
//     type: "button-edge",
//     animated: true,
//   },
//   {
//     id: "b->d",
//     source: "b",
//     target: "d",
//     type: "button-edge",
//     animated: true,
//     targetHandle: "handle-text",
//   },
//   {
//     id: "d->f",
//     source: "d",
//     target: "f",
//     type: "button-edge",
//     sourceHandle: "handle-MD",
//     targetHandle: "handle-node-3",
//     animated: true,
//   },
//   {
//     id: "c->e",
//     source: "c",
//     target: "e",
//     type: "button-edge",
//     targetHandle: "handle-financial-data",
//     animated: true,
//   },
//   {
//     id: "e->f",
//     source: "e",
//     target: "f",
//     type: "button-edge",
//     sourceHandle: "handle-MD",
//     targetHandle: "handle-node-1",
//     animated: true,
//   },
//   {
//     id: "f->g",
//     source: "f",
//     target: "g",
//     type: "button-edge",
//     animated: true,
//     sourceHandle: "handle-MD",
//   },
//   {
//     id: "g->h",
//     source: "g",
//     target: "h",
//     type: "button-edge",
//     animated: true,
//   },
//   {
//     id: "e->i",
//     source: "e",
//     target: "i",
//     type: "button-edge",
//     sourceHandle: "handle-CSV",
//     animated: true,
//   },
//   {
//     id: "i->f",
//     source: "i",
//     target: "f",
//     type: "button-edge",
//     targetHandle: "handle-node-2",
//     animated: true,
//   },
// ];

const defaultInitState: NodesState = {
  selectedRunId: null,
  selectedTab: "logs",
};

export const createNodesStore = (initState: NodesState = defaultInitState) => {
  return createStore<NodesStore>()((set, get) => ({
    ...initState,
    setSelectedRunId: (runId) => set({ selectedRunId: runId }),
    resetSelectedRunId: () => set({ selectedRunId: null }),
    setSelectedTab: (tab) => set({ selectedTab: tab }),
    // onNodesChange: (changes) => {
    //   set((state) => ({
    //     nodes: applyNodeChanges(changes, state.nodes),
    //   }));
    // },
    // onEdgesChange: (changes) => {
    //   set((state) => ({
    //     edges: applyEdgeChanges(changes, state.edges),
    //   }));
    // },
    // onConnect: (connection) => {
    //   set((state) => ({
    //     edges: addEdge(
    //       { ...connection, type: "button-edge", animated: true },
    //       state.edges
    //     ),
    //   }));
    // },
    // addNode: (node) => {
    //   set((state) => ({
    //     nodes: [...state.nodes, node],
    //   }));
    // },
    // setNodes: (nodes) => {
    //   if (Array.isArray(nodes)) {
    //     set({ nodes });
    //   } else {
    //     console.log("nodes ", nodes);
    //   }
    // },
    // setEdges: (edges) => {
    //   set({ edges });
    // },
    // deleteNode: (nodeId) => {
    //   set((state) => ({
    //     nodes: state.nodes?.filter((node) => node.id !== nodeId),
    //     edges: state.edges?.filter(
    //       (edge) => edge.source !== nodeId && edge.target !== nodeId
    //     ),
    //   }));
    // },
    // deleteEdge: (edgeId) => {
    //   set((state) => ({
    //     edges: state.edges?.filter((edge) => edge.id !== edgeId),
    //   }));
    // },
    // addRunResult: (runResult) => {
    //   set((state) => ({
    //     runResults: [...state.runResults, runResult],
    //   }));
    // },
    // clearRunResults: () => {
    //   set({ runResults: [] });
    // },
    // getInputNodes: (nodeId: string) => {
    //   const edges = get().edges;
    //   const nodes = get().nodes;
    //   const inputEdges = edges.filter((edge) => edge.target === nodeId);
    //   const inputNodes = inputEdges.map((edge) =>
    //     nodes.find((node) => node.id === edge.source)
    //   );
    //   return inputNodes.filter((node) => node !== undefined) as AppNode[];
    // },
  }));
};
