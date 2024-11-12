import type { BuiltInNode, Node, NodeTypes } from "@xyflow/react";
import PositionLoggerNode, {
  type PositionLoggerNode as PositionLoggerNodeType,
} from "./position-logger-node";
import {
  SecFilingNode,
  type SecFilingNode as SecFilingNodeType,
} from "./sec-filing";
import {
  ApiConnectorNode,
  type ApiConnectorNode as ApiConnectorNodeType,
} from "./api-connector";
import { SwitchNode, type SwitchNode as SwitchNodeType } from "./switch";

export const initialNodes = [
  {
    id: "a",
    type: "sec-filing",
    position: { x: 0, y: 0 },
    data: { label: "wire" },
  },
  {
    id: "b",
    type: "api-connector",
    position: { x: -100, y: 100 },
    data: { label: "drag me!" },
  },
  {
    id: "c",
    type: "switch",
    position: { x: 100, y: 100 },
    data: { label: "your ideas" },
  },
  // {
  //   id: "d",
  //   type: "output",
  //   position: { x: 0, y: 200 },
  //   data: { label: "with React Flow" },
  // },
] satisfies Node[];

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  "sec-filing": SecFilingNode,
  "api-connector": ApiConnectorNode,
  switch: SwitchNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;

// Append the types of you custom edges to the BuiltInNode type
export type CustomNodeType =
  | BuiltInNode
  | PositionLoggerNodeType
  | SecFilingNodeType
  | ApiConnectorNodeType
  | SwitchNodeType;
