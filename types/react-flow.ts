import { BuiltInEdge, EdgeTypes } from "@xyflow/react";

import { AppNode, type AppNodeType } from "@/components/flow/nodes/app-node";
import { NodeInput, NodeOutput, NodeType } from "./node";
import { NodeTypes } from "@xyflow/react";
import ButtonEdge, {
  type ButtonEdge as ButtonEdgeType,
} from "@/components/flow/edges/button-edge";

export type NodeData = {
  title: string;
  type: NodeType;
  inputs: NodeInput[];
  outputs: NodeOutput[];
};

export const nodeTypes = {
  "app-node": AppNode,
} satisfies NodeTypes;

export type AppNode = AppNodeType;

export const edgeTypes = {
  "button-edge": ButtonEdge,
} satisfies EdgeTypes;

export type CustomEdgeType = BuiltInEdge | ButtonEdgeType;
