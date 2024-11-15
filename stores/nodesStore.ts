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
import {
  SecFilingNode,
  type SecFilingNodeType,
} from "@/components/flow/nodes/sec-filing";
import {
  ApiConnectorNode,
  type ApiConnectorNode as ApiConnectorNodeType,
  defaultData as apiConnectorDefaultData,
} from "@/components/flow/nodes/api-connector";
import {
  SwitchNode,
  type SwitchNode as SwitchNodeType,
} from "@/components/flow/nodes/switch";
import ButtonEdge, {
  type ButtonEdge as ButtonEdgeType,
} from "@/components/flow/edges/button-edge";
import {
  defaultData as summarizerDefaultData,
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
import {
  FinancialAnalysisNode,
  FinancialAnalysisNodeType,
} from "@/components/flow/nodes/financial-analysis";

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
  "financial-analysis": FinancialAnalysisNode,
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
  | EmailSenderNodeType
  | FinancialAnalysisNodeType;

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
  deleteNode: (nodeId: string) => void;
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
    data: apiConnectorDefaultData,
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
    data: summarizerDefaultData,
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
    position: { x: 468, y: 1800 },
    data: { label: "Appender" },
  },
  {
    id: "g",
    type: "document-compiler",
    position: { x: 450, y: 2200 },
    data: { label: "Document Compiler" },
  },
  {
    id: "h",
    type: "email-sender",
    position: { x: 450, y: 2800 },
    data: { label: "Email Sender" },
  },
  {
    id: "i",
    type: "financial-analysis",
    position: { x: 400, y: 1100 },
    data: { label: "Financial Analysis" },
  },
];

const defaultEdges: Edge[] = [
  {
    id: "a->c",
    source: "a",
    target: "c",
    targetHandle: "handle-1",
    type: "button-edge",
    animated: true,
  },
  {
    id: "b->c",
    source: "b",
    target: "c",
    sourceHandle: "handle-JSON",
    targetHandle: "handle-0",
    type: "button-edge",
    animated: true,
  },
  {
    id: "a->d",
    source: "a",
    target: "d",
    type: "button-edge",
    animated: true,
    targetHandle: "handle-text",
  },
  {
    id: "d->f",
    source: "d",
    target: "f",
    type: "button-edge",
    sourceHandle: "handle-MD",
    targetHandle: "handle-2",
    animated: true,
  },
  {
    id: "c->e",
    source: "c",
    target: "e",
    type: "button-edge",
    animated: true,
  },
  {
    id: "e->f",
    source: "e",
    target: "f",
    type: "button-edge",
    targetHandle: "handle-0",
    animated: true,
  },
  {
    id: "f->g",
    source: "f",
    target: "g",
    type: "button-edge",
    animated: true,
  },
  {
    id: "g->h",
    source: "g",
    target: "h",
    type: "button-edge",
    animated: true,
  },
  {
    id: "e->i",
    source: "e",
    target: "i",
    type: "button-edge",
    animated: true,
  },
  {
    id: "i->f",
    source: "i",
    target: "f",
    type: "button-edge",
    targetHandle: "handle-1",
    animated: true,
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
          edges: addEdge(
            { ...connection, type: "button-edge", animated: true },
            state.edges
          ),
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
      deleteNode: (nodeId) => {
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== nodeId),
        }));
      },
    }))
  );
};
