import { EdgeTypes, BuiltInEdge, NodeTypes } from "@xyflow/react";
import ButtonEdge, {
  type ButtonEdge as ButtonEdgeType,
} from "@/components/flow/edges/button-edge";
import {
  SecFilingNode,
  type SecFilingNodeType,
} from "@/components/flow/nodes/sec-filing";
import {
  SummarizerNode,
  type SummarizerNodeType,
} from "@/components/flow/nodes/summarizer";
import { DataCategoryEnum, FileFormat } from "./dataFormat";

export type NodeInput = {
  label: string;
  acceptedDataCategory: DataCategoryEnum;
  acceptedFileFormats: FileFormat[];
};

export type NodeOutput = {
  label: string;
  dataType: FileFormat;
};

export const nodeTypes = {
  "sec-filing": SecFilingNode,
  summarizer: SummarizerNode,
} satisfies NodeTypes;

export type AppNode = SecFilingNodeType | SummarizerNodeType;

export const edgeTypes = {
  "button-edge": ButtonEdge,
} satisfies EdgeTypes;

export type CustomEdgeType = BuiltInEdge | ButtonEdgeType;
