import { createStore } from "zustand/vanilla";
import { devtools } from "zustand/middleware";

import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeTypes,
  BuiltInNode,
  BuiltInEdge,
  EdgeTypes,
} from "@xyflow/react";
import {
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from "@xyflow/react";
import PositionLoggerNode, {
  type PositionLoggerNode as PositionLoggerNodeType,
} from "@/components/flow/nodes/position-logger-node";
import {
  SecFilingNode,
  type SecFilingNode as SecFilingNodeType,
} from "@/components/flow/nodes/sec-filing";
import {
  ApiConnectorNode,
  type ApiConnectorNode as ApiConnectorNodeType,
} from "@/components/flow/nodes/api-connector";
import {
  SwitchNode,
  type SwitchNode as SwitchNodeType,
} from "@/components/flow/nodes/switch";
import ButtonEdge, {
  type ButtonEdge as ButtonEdgeType,
} from "@/components/flow/edges/button-edge";
import {
  SummarizerNode,
  type SummarizerNode as SummarizerNodeType,
} from "@/components/flow/nodes/summarizer";

export const edgeTypes = {
  "button-edge": ButtonEdge,
} satisfies EdgeTypes;

export type CustomEdgeType = BuiltInEdge | ButtonEdgeType;

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  "sec-filing": SecFilingNode,
  "api-connector": ApiConnectorNode,
  summarizer: SummarizerNode,
  switch: SwitchNode,
} satisfies NodeTypes;

export type AppNode =
  | BuiltInNode
  | SecFilingNodeType
  | ApiConnectorNodeType
  | SwitchNodeType
  | SummarizerNodeType;

export type NodesState = {
  nodes: AppNode[];
  edges: Edge[];
};

export type NodesActions = {
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
};

export type NodesStore = NodesState & NodesActions;

const defaultNodes: AppNode[] = [
  {
    id: "a",
    type: "sec-filing",
    position: { x: 0, y: 0 },
    data: { label: "SEC Filing" },
  },
  {
    id: "b",
    type: "api-connector",
    position: { x: -100, y: 100 },
    data: { label: "API Connector" },
  },
  {
    id: "c",
    type: "switch",
    position: { x: 100, y: 100 },
    data: { label: "Switch" },
  },
  {
    id: "d",
    type: "summarizer",
    position: { x: 200, y: 100 },
    data: { label: "Summarizer" },
  },
];
const defaultEdges: Edge[] = [
  {
    id: "a->c",
    source: "a",
    target: "c",
    targetHandle: "handle-0",
    type: "button-edge",
  },
  {
    id: "b->c",
    source: "b",
    target: "c",
    targetHandle: "handle-1",
    type: "button-edge",
  },
];

const defaultInitState: NodesState = {
  nodes: defaultNodes,
  edges: defaultEdges,
};

export const createNodesStore = (initState: NodesState = defaultInitState) => {
  return createStore<NodesStore>()(
    devtools((set) => ({
      ...initState,
      onNodesChange: (changes) => {
        set((state) => ({
          nodes: applyNodeChanges(changes, state.nodes),
        }));
      },
      onEdgesChange: (changes) => {
        set((state) => ({
          edges: applyEdgeChanges(changes, state.edges),
        }));
      },
      onConnect: (connection) => {
        set((state) => ({
          edges: addEdge(connection, state.edges),
        }));
      },
      setNodes: (nodes) => {
        set({ nodes });
      },
      setEdges: (edges) => {
        set({ edges });
      },
    }))
  );
};
