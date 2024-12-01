import React from "react";
import { SVGProps, useEffect, useState } from "react";
import type { Node, NodeProps } from "@xyflow/react";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NodeHeader } from "./components/node-header";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dataTypesList, NodeInput, NodeOutput } from "@/types/node";
import { useDebouncedCallback } from "use-debounce";
import { NodeWrapper } from "./components/node-wrapper";
import { Outputs } from "./components/outputs-selection";
import { res } from "./temp/api";
import { csv, md } from "./temp/dcf";

function MaterialSymbolsTableOutline(props: SVGProps<SVGSVGElement>) {
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
        d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm6-6H5v4h6zm2 0v4h6v-4zm-2-2V9H5v4zm2 0h6V9h-6zM5 7h14V5H5z"
      ></path>
    </svg>
  );
}

// TODO: Improve this - json or tabular or both?
const inputs: NodeInput[] = [
  {
    label: "financial-data",
    acceptedFormat: "Tabular",
    acceptedTypes: dataTypesList
      .filter((item) => item.formats.includes("Tabular"))
      ?.map((item) => item.name),
  },
];

type Params = {
  discountRate: number;
  timeHorizon: number;
  terminalValue: "exit-multiple" | "gordon-growth-model";
  growthRate: number;
  intrinsicValue: number;
};

const defaultParams: Params = {
  discountRate: 0,
  timeHorizon: 0,
  terminalValue: "exit-multiple",
  growthRate: 0,
  intrinsicValue: 0,
};

const outputs: NodeOutput[] = [
  { label: "DCF Model", dataType: "MD" },
  { label: "DCF Model", dataType: "JSON" },
  { label: "DCF Model", dataType: "CSV" },
  { label: "DCF Model", dataType: "XLSX" },
];

const runFn = async (params: Record<string, any>) => {
  return { inputData: res, params, outputData: { csv: csv, md: md } };
};

export type DCFModelNodeData = {
  label: string;
  params: Params;
  inputs: NodeInput[];
  outputs: NodeOutput[];
  runFn: (params: Record<string, any>) => Promise<Record<string, any>>;
};

export const defaultData: DCFModelNodeData = {
  label: "DCF Model",
  params: defaultParams,
  inputs,
  outputs: [{ label: "DCF Model", dataType: "MD" }],
  runFn,
};

export type DcfModelNodeType = Node<DCFModelNodeData>;

function DcfModelNodeComponent({ id, data }: NodeProps<DcfModelNodeType>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const [params, setParams] = useState<Record<string, any>>(data.params);
  const setParamsDebounced = useDebouncedCallback(
    (params: Record<string, any>) => {
      setParams(params);
    },
    1000
  );
  const { updateNodeData } = useReactFlow();

  const [selectedOutputs, setSelectedOutputs] = useState<NodeOutput[]>(
    data.outputs
  );

  useEffect(() => {
    updateNodeData(id, { params });
  }, [params]);

  useEffect(() => {
    updateNodeInternals(id);
    updateNodeData(id, { outputs: selectedOutputs });
  }, [selectedOutputs]);

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <NodeWrapper
      nodeId={id}
      width="w-[360px]"
      inputs={inputs}
      outputs={selectedOutputs}
    >
      <NodeHeader
        title="DCF Model"
        bgColor="bg-green-200"
        textColor="text-green-900"
        iconFn={MaterialSymbolsTableOutline}
        iconBgColor="bg-green-500"
      />

      {/* TODO: Update params */}
      <div className="space-y-2 px-2">
        <div className="space-y-4 nodrag">
          <p className="text-sm font-semibold">Parameters & Assumptions</p>
          <div className="flex gap-4">
            <div className="space-y-1">
              <p className="text-xs">Discount Rate (%)</p>
              <Input
                type="number"
                value={params.discountRate}
                onChange={(e) =>
                  setParams({ ...params, discountRate: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs">Time Horizon (Years)</p>
              <Input
                type="number"
                value={params.timeHorizon}
                onChange={(e) =>
                  setParams({ ...params, timeHorizon: e.target.value })
                }
              />
            </div>
          </div>
          <p className="text-sm font-semibold">Terminal Value</p>
          <Tabs
            className="w-full"
            value={params.terminalValue}
            onValueChange={(value) =>
              setParams({ ...params, terminalValue: value })
            }
          >
            <TabsList className="w-full">
              <TabsTrigger value="exit-multiple" className="w-1/2 text-xs">
                Exit Multiple
              </TabsTrigger>
              <TabsTrigger
                value="gordon-growth-model"
                className="w-1/2 text-xs"
              >
                Gordon Growth Model
              </TabsTrigger>
            </TabsList>
            <TabsContent value="exit-multiple">
              <div className="flex gap-4">
                <div className="space-y-1">
                  <p className="text-xs">Growth Rate (%)</p>
                  <Input
                    type="number"
                    value={params.growthRate}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        growthRate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs">Exit Multiple</p>
                  <Input
                    type="number"
                    value={params.intrinsicValue}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        intrinsicValue: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="gordon-growth-model">
              <div className="flex gap-4">
                <div className="space-y-1">
                  <p className="text-xs">Growth Rate (%)</p>
                  <Input
                    type="number"
                    value={params.growthRate}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        growthRate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs">Average FCF ($)</p>
                  <Input
                    type="number"
                    value={params.intrinsicValue}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        intrinsicValue: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <Separator orientation="horizontal" />
        <Outputs
          nodeId={id}
          outputs={outputs}
          selectedOutputs={selectedOutputs}
          setSelectedOutputs={setSelectedOutputs}
        />
        <Separator orientation="horizontal" />
        <div className="flex justify-between">
          <p className="text-xs">Cache output</p>
          <div className="flex items-center space-x-2">
            <Switch defaultChecked={false} id="cache-output" className="" />
            <Label htmlFor="cache-output" className="text-xs">
              Yes
            </Label>
          </div>
        </div>
      </div>
    </NodeWrapper>
  );
}

export const DcfModelNode = React.memo(DcfModelNodeComponent);
