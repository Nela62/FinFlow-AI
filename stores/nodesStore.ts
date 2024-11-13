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
  type SecFilingNodeType,
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
import {
  DcfModelNode,
  DcfModelNodeType,
} from "@/components/flow/nodes/dcf-model";
import {
  AppenderNode,
  AppenderNodeType,
} from "@/components/flow/nodes/appender";
import {
  DocumentCompilerNode,
  DocumentCompilerNodeType,
} from "@/components/flow/nodes/document-compiler";
import {
  EmailSenderNode,
  EmailSenderNodeType,
} from "@/components/flow/nodes/email-sender";

export const edgeTypes = {
  "button-edge": ButtonEdge,
} satisfies EdgeTypes;

export type CustomEdgeType = BuiltInEdge | ButtonEdgeType;

export const nodeTypes = {
  "sec-filing": SecFilingNode,
  "api-connector": ApiConnectorNode,
  summarizer: SummarizerNode,
  switch: SwitchNode,
  "dcf-model": DcfModelNode,
  appender: AppenderNode,
  "document-compiler": DocumentCompilerNode,
  "email-sender": EmailSenderNode,
} satisfies NodeTypes;

export type AppNode =
  | BuiltInNode
  | SecFilingNodeType
  | ApiConnectorNodeType
  | SwitchNodeType
  | SummarizerNodeType
  | DcfModelNodeType
  | AppenderNodeType
  | DocumentCompilerNodeType
  | EmailSenderNodeType;

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
    position: { x: 500, y: 0 },
    data: { label: "SEC Filing" },
  },
  {
    id: "b",
    type: "api-connector",
    position: { x: 0, y: 0 },
    data: { label: "API Connector" },
  },
  {
    id: "c",
    type: "switch",
    position: { x: 200, y: 750 },
    data: { label: "Switch" },
  },
  {
    id: "d",
    type: "summarizer",
    position: { x: 900, y: 700 },
    data: { label: "Summarizer" },
  },
  {
    id: "e",
    type: "dcf-model",
    position: { x: 0, y: 1000 },
    data: { label: "DCF Model" },
  },
  {
    id: "f",
    type: "appender",
    position: { x: 400, y: 1600 },
    data: { label: "Appender" },
  },
  {
    id: "g",
    type: "document-compiler",
    position: { x: 400, y: 2000 },
    data: { label: "Document Compiler" },
  },
  {
    id: "h",
    type: "email-sender",
    position: { x: 400, y: 2600 },
    data: { label: "Email Sender" },
  },
];
const defaultEdges: Edge[] = [
  {
    id: "a->c",
    source: "a",
    target: "c",
    targetHandle: "handle-1",
    type: "button-edge",
  },
  {
    id: "b->c",
    source: "b",
    target: "c",
    targetHandle: "handle-0",
    type: "button-edge",
  },
  {
    id: "a->d",
    source: "a",
    target: "d",
    type: "button-edge",
  },
  {
    id: "d->f",
    source: "d",
    target: "f",
    type: "button-edge",
    targetHandle: "handle-1",
  },
  {
    id: "c->e",
    source: "c",
    target: "e",
    type: "button-edge",
  },
  {
    id: "e->f",
    source: "e",
    target: "f",
    type: "button-edge",
    targetHandle: "handle-0",
  },
  {
    id: "f->g",
    source: "f",
    target: "g",
    type: "button-edge",
  },
  {
    id: "g->h",
    source: "g",
    target: "h",
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
        if (Array.isArray(nodes)) {
          set({ nodes });
        } else {
          console.log("nodes ", nodes);
        }
      },
      setEdges: (edges) => {
        set({ edges });
      },
    }))
  );
};
