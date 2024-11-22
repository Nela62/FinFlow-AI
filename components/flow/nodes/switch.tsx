import React, { useCallback, useEffect } from "react";
import type { SVGProps } from "react";

import type { Connection, Edge, Node, NodeProps } from "@xyflow/react";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNodesStore } from "@/providers/nodesProvider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NodeHeader } from "./utils/header";
import { Label } from "@/components/ui/label";
import { dataTypesList, NodeInput, NodeOutput } from "@/types/node";
import { NodeWrapper } from "./utils/node-wrapper";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";

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

type Params = {
  selectedInput: string;
};

const defaultParams: Params = {
  selectedInput: "handle-node-1",
};

const outputs: NodeOutput[] = [{ label: "node", dataType: "ANY" }];

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
  outputs: [{ label: "node-1", dataType: "JSON" }],
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

// FIXME: on delete, readjust the node ids
function SwitchNodeComponent({ id, data }: NodeProps<SwitchNode>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const { updateNodeData } = useReactFlow();

  const { nodes, edges, deleteEdge } = useNodesStore((state) => state);

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

  // FIXME: the output is different and should change according to the original node selected
  const [selectedOutput, setSelectedOutput] = useState<NodeOutput>({
    label: sourceNodes?.[0]?.target ?? "node-1",
    dataType: sourceNodes?.[0]?.data?.outputs?.[0]?.dataType ?? "JSON",
  });

  useEffect(() => {
    updateNodeData(id, { inputs });
    updateNodeInternals(id);
  }, [inputs]);

  useEffect(() => {
    updateNodeData(id, { outputs: [selectedOutput] });
    updateNodeInternals(id);
  }, [selectedOutput]);

  const deleteInput = useCallback((conn: Edge) => {
    setInputs(
      inputs.filter(
        (input) => input.label !== conn.targetHandle?.replace("handle-", "")
      )
    );
    deleteEdge(conn.id);
    updateNodeInternals(id);
  }, []);

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
      <div className="space-y-4 px-2">
        <RadioGroup
          value={selectedOutput.label}
          onValueChange={(value) => {
            // FIXME: the output doesn't change
            setSelectedOutput({
              label: value,
              dataType:
                sourceNodes?.find((node) => node.target === value)?.data
                  ?.outputs?.[0]?.dataType ?? "JSON",
            });
            updateNodeInternals(id);
          }}
          className="px-2 py-2 space-y-2"
        >
          {sourceNodes?.map((node, i) => (
            <div className="flex items-center space-x-2" key={node.id}>
              <RadioGroupItem value={node.target} id={node.id} />
              <div className="flex gap-1 items-center">
                <Badge variant="outline">{node.target}</Badge>
                <Label htmlFor={node.id}>{node.data?.label}</Label>
              </div>
            </div>
          ))}
        </RadioGroup>
        <div className="flex gap-2">
          {inputConnections.map((conn) => (
            <Button
              variant="outline"
              size="sm"
              key={conn.id}
              className="flex items-center gap-1"
              onClick={() => {
                deleteInput(conn);
              }}
            >
              {conn.targetHandle?.replace("handle-", "")}
              <XIcon className="w-4 h-4" />
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className=""
          onClick={() => {
            setInputs([
              ...inputs,
              {
                label: `node-${inputs.length + 1}`,
                acceptedFormat: "Any",
                acceptedTypes: dataTypesList.map((item) => item.name),
              },
            ]);
            updateNodeInternals(id);
          }}
        >
          Add Input
        </Button>
      </div>
    </NodeWrapper>
  );
}

export const SwitchNode = React.memo(SwitchNodeComponent);
