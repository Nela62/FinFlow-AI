import React, { useEffect } from "react";
import type { SVGProps } from "react";

import type { Node, NodeProps } from "@xyflow/react";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { useMemo, useState } from "react";
import { NodeHeader } from "./components/node-header";
import { Button } from "@/components/ui/button";
import { useNodesStore } from "@/providers/nodesProvider";
import SortableList from "./components/sortableList";
import { NodeInput, NodeOutput } from "@/types/node";
import { Separator } from "@/components/ui/separator";
import { res as summaryRes } from "./temp/summary";
import { md } from "./temp/dcf";
import { res as finAnalysisRes } from "./temp/fin-analysis";
import { res as reportRes } from "./temp/report";

// const textTypes = dataTypesList
//   .filter((item) => item.formats.includes("Text"))
//   ?.map((item) => item.name);

const inputs: NodeInput[] = [
  // {
  //   label: "node-1",
  //   acceptedFormat: "Text",
  //   acceptedTypes: textTypes,
  // },
  // {
  //   label: "node-2",
  //   acceptedFormat: "Text",
  //   acceptedTypes: textTypes,
  // },
];

type Params = {};

const defaultParams: Params = {};

const outputs: NodeOutput[] = [
  // { label: "text", dataType: "TXT" },
  // { label: "text", dataType: "MD" },
];

// FIXME: on edge delete, does not readjust the inputs
const runFn = async (params: Record<string, any>) => {
  return {
    inputData: { "node-1": summaryRes, "node-2": md, "node-3": finAnalysisRes },
    params,
    outputData: reportRes,
  };
};

export type AppenderNodeData = {
  label: string;
  params: Params;
  inputs: NodeInput[];
  outputs: NodeOutput[];
  runFn: (params: Record<string, any>) => Promise<Record<string, any>>;
};

export const defaultData: AppenderNodeData = {
  label: "Appender",
  params: defaultParams,
  inputs,
  outputs: [],
  // outputs: [{ label: "text", dataType: "MD" }],
  runFn,
};

export type AppenderNodeType = Node<AppenderNodeData>;

function FluentMerge16Filled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        d="M2 4.25a.75.75 0 0 1 .75-.75h1.789c.835 0 1.625.38 2.147 1.032l1.499 1.874a2.25 2.25 0 0 0 1.757.844h1.785l-1.572-2.043a.75.75 0 0 1 1.19-.914l2.5 3.25a.75.75 0 0 1 0 .914l-2.5 3.25a.75.75 0 0 1-1.19-.914l1.572-2.043H9.71c-.38 0-.739.173-.976.47l-1.499 1.873A3.75 3.75 0 0 1 4.308 12.5H2.75a.75.75 0 0 1 0-1.5h1.558c.684 0 1.33-.31 1.757-.844l1.499-1.874a3 3 0 0 1 .203-.227a3.8 3.8 0 0 1-.753-.712l-1.5-1.874A1.25 1.25 0 0 0 4.54 5H2.75A.75.75 0 0 1 2 4.25"
      ></path>
    </svg>
  );
}

// FIXME: Outputs are broken and not updating
function AppenderNodeComponent({ id, data }: NodeProps<AppenderNodeType>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const { updateNodeData } = useReactFlow();

  // const { nodes, edges } = useNodesStore((state) => state);

  // const inputConnections = useMemo(() => {
  //   return edges
  //     .filter((edge) => edge.target === id)
  //     .sort(
  //       (a, b) =>
  //         Number(a.targetHandle?.replace("handle-node-", "")) -
  //         Number(b.targetHandle?.replace("handle-node-", ""))
  //     );
  // }, [edges]);

  // const sourceNodes = useMemo(() => {
  //   return inputConnections.map((edge) => ({
  //     id: edge.source,
  //     target: edge.targetHandle?.replace("handle-", "") ?? "",
  //     data: nodes.find((node) => node.id === edge.source)?.data,
  //   }));
  // }, [inputConnections]);

  // const [inputs, setInputs] = useState(data.inputs);

  // const [selectedOutputs, setSelectedOutputs] = useState<NodeOutput[]>(
  //   data.outputs
  // );

  // useEffect(() => {
  //   updateNodeData(id, { inputs });
  //   updateNodeInternals(id);
  // }, [inputs]);

  // useEffect(() => {
  //   updateNodeData(id, { outputs: selectedOutputs });
  //   updateNodeInternals(id);
  // }, [selectedOutputs]);

  return (
    <div></div>
    // <NodeWrapper
    //   nodeId={id}
    //   width="w-[360px]"
    //   inputs={inputs}
    //   outputs={selectedOutputs}
    // >
    //   <NodeHeader
    //     title="Appender"
    //     bgColor="bg-gray-200"
    //     iconBgColor="bg-gray-400"
    //     textColor="text-gray-900"
    //     iconFn={FluentMerge16Filled}
    //   />
    //   <div className="space-y-4 px-2 pt-2">
    //     <p className="text-sm font-semibold">Order</p>
    //     {/* TODO: Improve the ui of list items */}
    //     <SortableList
    //       items={sourceNodes.map((node) => ({
    //         id: node.id,
    //         title: node?.data?.label ?? node.id,
    //       }))}
    //     />
    //     {/* TODO: add ability to remove inputs */}
    //     <Button
    //       variant="outline"
    //       onClick={() => {
    //         setInputs([
    //           ...inputs,
    //           {
    //             label: `input-${inputs.length + 1}`,
    //             acceptedFormat: "Text",
    //             acceptedTypes: textTypes,
    //           },
    //         ]);
    //         updateNodeInternals(id);
    //       }}
    //     >
    //       Add Input
    //     </Button>
    //     <Separator orientation="horizontal" />
    //     <Outputs
    //       nodeId={id}
    //       outputs={outputs}
    //       selectedOutputs={selectedOutputs}
    //       setSelectedOutputs={setSelectedOutputs}
    //     />
    //   </div>
    // </NodeWrapper>
  );
}

export const AppenderNode = React.memo(AppenderNodeComponent);
