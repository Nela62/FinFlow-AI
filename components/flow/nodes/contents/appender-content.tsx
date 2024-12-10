import React, { useEffect } from "react";
import type { SVGProps } from "react";

import type { Node, NodeProps } from "@xyflow/react";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { useMemo, useState } from "react";
import { NodeHeader } from "../components/node-header";
import { Button } from "@/components/ui/button";
import { useNodesStore } from "@/providers/nodesProvider";
import SortableList from "../components/sortableList";
import { NodeInput, NodeOutput, NodeType } from "@/types/node";
import { Separator } from "@/components/ui/separator";
import { res as summaryRes } from "../temp/summary";
import { md } from "../temp/dcf";
import { res as finAnalysisRes } from "../temp/fin-analysis";
import { res as reportRes } from "../temp/report";
import { DataCategory, FileFormat } from "@/types/dataFormat";
import { NodeData } from "@/types/react-flow";

// const textTypes = dataTypesList
//   .filter((item) => item.formats.includes("Text"))
//   ?.map((item) => item.name);

// TODO: Add support for TXT in the future
const inputs: NodeInput[] = [
  {
    label: "node-1",
    handle: {
      hasHandle: "true",
      dataCategory: DataCategory.Text,
      fileFormats: [FileFormat.MD],
      isList: false,
      dynamic: false,
    },
    value: "",
  },
  {
    label: "node-2",
    handle: {
      hasHandle: "true",
      dataCategory: DataCategory.Text,
      fileFormats: [FileFormat.MD],
      isList: false,
      dynamic: false,
    },
    value: "",
  },
];

const outputs: NodeOutput[] = [
  {
    label: "text",
    allowMultiple: false,
    supportedFileFormats: [
      { fileFormat: FileFormat.MD, value: { selected: true } },
      // { fileFormat: FileFormat.TXT, value: { selected: false } },
    ],
    isList: false,
  },
];

// FIXME: on edge delete, does not readjust the inputs

export const APPENDER_NODE_DEFAULT_DATA: NodeData = {
  title: "Appender",
  type: NodeType.APPENDER,
  inputs,
  outputs,
};

// FIXME: Outputs are broken and not updating
export const AppenderContent = React.memo(
  ({ id, data }: { id: string; data: NodeData }) => {
    const updateNodeInternals = useUpdateNodeInternals();
    const { updateNodeData } = useReactFlow();

    const { nodes, edges } = useNodesStore((state) => state);

    const inputConnections = useMemo(() => {
      return edges
        .filter((edge) => edge.target === id)
        .sort(
          (a, b) =>
            Number(a.targetHandle?.replace("handle-node-", "")) -
            Number(b.targetHandle?.replace("handle-node-", ""))
        );
    }, [edges]);

    const sourceNodes = useMemo(() => {
      return inputConnections.map((edge) => ({
        id: edge.source,
        target: edge.targetHandle?.replace("handle-", "") ?? "",
        data: nodes.find((node) => node.id === edge.source)?.data,
      }));
    }, [inputConnections]);

    const [inputs, setInputs] = useState(data.inputs);

    useEffect(() => {
      updateNodeData(id, { inputs });
      updateNodeInternals(id);
    }, [inputs]);

    return (
      <div className="space-y-4 px-2 py-1">
        <p className="text-sm font-semibold">Order</p>
        {/* TODO: Improve the ui of list items */}
        <SortableList
          items={sourceNodes.map((node) => ({
            id: node.id,
            title: node.data?.title ?? node.id,
          }))}
        />
        {/* TODO: add ability to remove inputs */}
        <Button
          variant="outline"
          onClick={() => {
            setInputs([
              ...inputs,
              {
                label: `input-${inputs.length + 1}`,
                handle: {
                  hasHandle: "true",
                  dataCategory: DataCategory.Text,
                  fileFormats: [FileFormat.MD],
                  isList: false,
                  dynamic: false,
                },
                value: "",
              },
            ]);
            updateNodeInternals(id);
          }}
        >
          Add Input
        </Button>
      </div>
    );
  }
);
