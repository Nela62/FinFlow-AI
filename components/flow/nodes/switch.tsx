import React, { useEffect } from "react";
import type { SVGProps } from "react";

import type { Node, NodeProps } from "@xyflow/react";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNodesStore } from "@/providers/nodesProvider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NodeHeader } from "./utils/header";
import { Label } from "@/components/ui/label";
import { dataTypesList, NodeInput, NodeOutput } from "@/types/node";
import { NodeWrapper } from "./utils/node-wrapper";

const inputs: NodeInput[] = [
  {
    label: "node-1",
    acceptedFormat: "Any",
    acceptedTypes: dataTypesList.map((item) => item.name),
  },
  {
    label: "node-2",
    acceptedFormat: "Any",
    acceptedTypes: dataTypesList.map((item) => item.name),
  },
];

type Params = {};

const defaultParams: Params = {};

const outputs: NodeOutput[] = [{ label: "node-1", dataType: "ANY" }];

const runFn = async (params: Record<string, any>) => {
  return {};
};

export type SwitchNodeData = {
  label: string;
  params: Params;
  inputs: NodeInput[];
  outputs: NodeOutput[];
  runFn: (params: Record<string, any>) => Promise<Record<string, any>>;
};

export const defaultData: SwitchNodeData = {
  label: "Switch",
  params: defaultParams,
  inputs,
  outputs: [{ label: "node-1", dataType: "ANY" }],
  runFn,
};

export type SwitchNode = Node<SwitchNodeData>;

function MdiSwitch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M13 18h1a1 1 0 0 1 1 1h7v2h-7a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1H2v-2h7a1 1 0 0 1 1-1h1v-2H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-3zm0-12h1V4h-1zM9 4v2h2V4zm0 4v2h2V8zm0 4v2h2v-2z"
      ></path>
    </svg>
  );
}

function SwitchNodeComponent({ id, data }: NodeProps<SwitchNode>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const { updateNodeData } = useReactFlow();

  const { nodes, edges } = useNodesStore((state) => state);

  const switchEdges = useMemo(() => {
    return edges.filter((edge) => edge.target === id);
  }, [edges]);

  const sourceNodes = useMemo(() => {
    return switchEdges.map((edge) => edge.source);
  }, [switchEdges]);

  const switchNodes = useMemo(() => {
    return Array.isArray(nodes)
      ? nodes?.filter((node) => sourceNodes.includes(node.id))
      : [];
  }, [nodes, sourceNodes]);

  const [inputs, setInputs] = useState(data.inputs);

  // TODO: the output is different and should change according to the original node selected
  const [selectedOutputs, setSelectedOutputs] = useState<NodeOutput[]>(
    data.outputs
  );

  useEffect(() => {
    updateNodeData(id, { inputs });
    updateNodeInternals(id);
  }, [inputs]);

  useEffect(() => {
    updateNodeData(id, { outputs: selectedOutputs });
    updateNodeInternals(id);
  }, [selectedOutputs]);

  return (
    <NodeWrapper
      nodeId={id}
      width="w-[370px]"
      inputs={inputs}
      outputs={outputs}
    >
      <NodeHeader
        title="Switch"
        bgColor="bg-gray-200"
        iconBgColor="bg-gray-400"
        textColor="text-gray-900"
        iconFn={MdiSwitch}
      />
      <RadioGroup
        defaultValue={switchNodes?.[0]?.id ?? ""}
        className="px-2 py-2 space-y-2"
      >
        {switchNodes?.map((node, i) => (
          <div className="flex items-center space-x-2" key={node.id}>
            <RadioGroupItem value={node.id} id={node.id} />
            <Label htmlFor={node.id}>
              {/* @ts-ignore */}
              Input {i + 1}: {node.data.label ?? node.type}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {/* FIX: Edges don't rerender on new edge */}
      <Button
        variant="outline"
        onClick={() => {
          setInputs([
            ...inputs,
            {
              label: `input-${inputs.length + 1}`,
              acceptedFormat: "Any",
              acceptedTypes: dataTypesList.map((item) => item.name),
            },
          ]);
          updateNodeInternals(id);
        }}
      >
        Add Input
      </Button>
    </NodeWrapper>
  );
}

export const SwitchNode = React.memo(SwitchNodeComponent);
