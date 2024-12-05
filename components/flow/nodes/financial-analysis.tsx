import type { Node, NodeProps } from "@xyflow/react";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { SVGProps, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NodeHeader } from "./components/node-header";
import { Slider as DoubleSlider } from "@/components/ui/double-slider";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { NodeInput, NodeOutput } from "@/types/node";
import { useDebouncedCallback } from "use-debounce";
import { csv } from "./temp/dcf";
import { res } from "./temp/fin-analysis";
import { useNodesStore } from "@/providers/nodesProvider";

function MdiChartFinance(props: SVGProps<SVGSVGElement>) {
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
        d="m6 16.5l-3 2.94V11h3m5 3.66l-1.57-1.34L8 14.64V7h3m5 6l-3 3V3h3m2.81 9.81L17 11h5v5l-1.79-1.79L13 21.36l-3.47-3.02L5.75 22H3l6.47-6.34L13 18.64"
      ></path>
    </svg>
  );
}

// TODO: Add financial data and maybe other inputs -- Altan
const inputs: NodeInput[] = [
  // {
  //   label: "financial-data",
  //   acceptedFormat: "Tabular",
  //   acceptedTypes: ["CSV", "XLSX"],
  // },
];

type Params = {
  analysisType: string;
  wordCount: [number, number];
  includeCharts: boolean;
  includeTables: boolean;
};

const defaultParams: Params = {
  analysisType: "Growth Investing Perspective",
  wordCount: [300, 600],
  includeCharts: false,
  includeTables: false,
};

const outputs: NodeOutput[] = [
  // { label: "analysis", dataType: "TXT" },
  // { label: "analysis", dataType: "MD" },
  // { label: "analysis", dataType: "PDF" },
  // { label: "analysis", dataType: "DOCX" },
];

const runFn = async (params: Record<string, any>) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return {
    inputData: csv,
    params,
    outputData: res,
  };
};

export type FinancialAnalysisNodeData = {
  label: string;
  params: Params;
  inputs: NodeInput[];
  outputs: NodeOutput[];
  runFn: (params: Record<string, any>) => Promise<Record<string, any>>;
};

export const defaultData: FinancialAnalysisNodeData = {
  label: "Financial Analysis",
  params: defaultParams,
  inputs,
  outputs: [],
  // outputs: [{ label: "analysis", dataType: "MD" }],
  runFn,
};

export type FinancialAnalysisNodeType = Node<FinancialAnalysisNodeData>;

const analysisTypes = [
  "Growth Investing Perspective",
  "Value Investing Perspective",
  "Risk Assessment",
  "Income Investing",
];

function FinancialAnalysisNodeComponent({
  id,
  data,
}: NodeProps<FinancialAnalysisNodeType>) {
  // const { getInputNodes } = useNodesStore((state) => state);
  // const updateNodeInternals = useUpdateNodeInternals();
  // const [params, setParams] = useState<Record<string, any>>(data.params);
  // const setParamsDebounced = useDebouncedCallback(
  //   (params: Record<string, any>) => {
  //     setParams(params);
  //   },
  //   1000
  // );
  // const { updateNodeData } = useReactFlow();

  // const [selectedOutputs, setSelectedOutputs] = useState<NodeOutput[]>(
  //   data.outputs
  // );

  // const inputNodes = getInputNodes(id);
  // console.log(inputNodes);
  // const isDCFModel = inputNodes.some((node) => node.type === "dcf-model");

  // useEffect(() => {
  //   updateNodeData(id, { params });
  // }, [params]);

  // useEffect(() => {
  //   updateNodeInternals(id);
  //   updateNodeData(id, { outputs: selectedOutputs });
  // }, [selectedOutputs]);

  return (
    <div></div>
    // We add this class to use the same styles as React Flow's default nodes.
    // <NodeWrapper
    //   nodeId={id}
    //   width="w-[370px]"
    //   inputs={inputs}
    //   outputs={selectedOutputs}
    // >
    //   <NodeHeader
    //     title="Financial Analysis"
    //     bgColor="bg-sky-200"
    //     textColor="text-sky-900"
    //     iconFn={MdiChartFinance}
    //     iconBgColor="bg-sky-500"
    //   />

    //   <div className="space-y-2 px-2">
    //     <div className="space-y-4 nodrag">
    //       {isDCFModel && (
    //         <>
    //           <p className="text-sm font-semibold">Inputs from DCF model</p>
    //           <div className="grid grid-cols-2 gap-2">
    //             <div className="flex items-center space-x-2">
    //               <Checkbox id="intrinsic-value-per-share" defaultChecked />
    //               <Label
    //                 htmlFor="intrinsic-value-per-share"
    //                 className="text-xs"
    //               >
    //                 Intrinsic Value per Share
    //               </Label>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //               <Checkbox id="discount-rate" defaultChecked />
    //               <Label htmlFor="discount-rate" className="text-xs">
    //                 Discount Rate (WACC)
    //               </Label>
    //             </div>
    //             <div className="flex items-center space-x-2">
    //               <Checkbox id="terminal-growth-rate" defaultChecked />
    //               <Label htmlFor="terminal-growth-rate" className="text-xs">
    //                 Terminal Growth Rate
    //               </Label>
    //             </div>

    //             <div className="flex items-center space-x-2">
    //               <Checkbox id="projected-free-cash-flows" defaultChecked />
    //               <Label
    //                 htmlFor="projected-free-cash-flows"
    //                 className="text-xs"
    //               >
    //                 Projected Free Cash Flows
    //               </Label>
    //             </div>
    //           </div>
    //           <Separator orientation="horizontal" />
    //         </>
    //       )}
    //       <div className="space-y-3">
    //         <p className="text-sm font-semibold">Analysis Type</p>
    //         <DropdownMenu>
    //           <DropdownMenuTrigger asChild>
    //             <Button variant="outline" className="w-full justify-between">
    //               {params.analysisType}
    //               <ChevronDown />
    //             </Button>
    //           </DropdownMenuTrigger>
    //           <DropdownMenuContent>
    //             {analysisTypes.map((type) => (
    //               <DropdownMenuItem
    //                 key={type}
    //                 onClick={() =>
    //                   setParamsDebounced({ ...params, analysisType: type })
    //                 }
    //               >
    //                 {type}
    //               </DropdownMenuItem>
    //             ))}
    //           </DropdownMenuContent>
    //         </DropdownMenu>
    //       </div>
    //       <Separator orientation="horizontal" />
    //       <div className="space-y-2 nodrag">
    //         <p className="text-sm font-semibold">Word Count</p>
    //         <DoubleSlider
    //           min={100}
    //           max={1000}
    //           step={50}
    //           defaultValue={params.wordCount}
    //           onValueChange={(vals) => {
    //             setParamsDebounced({
    //               ...params,
    //               wordCount: vals as [number, number],
    //             });
    //           }}
    //           className=""
    //         />
    //         <div className="flex justify-between mt-2 text-sm text-muted-foreground">
    //           <span>{params.wordCount[0]} </span>
    //           <span>{params.wordCount[1]} </span>
    //         </div>
    //         <div className="flex justify-around">
    //           <div className="flex items-center space-x-2">
    //             <Checkbox id="include-charts" defaultChecked />
    //             <Label htmlFor="include-charts" className="text-xs">
    //               Include Charts
    //             </Label>
    //           </div>
    //           <div className="flex items-center space-x-2">
    //             <Checkbox id="include-tables" defaultChecked />
    //             <Label htmlFor="include-tables" className="text-xs">
    //               Include Tables
    //             </Label>
    //           </div>
    //         </div>
    //       </div>
    //       <Separator orientation="horizontal" />
    //       <Outputs
    //         nodeId={id}
    //         outputs={outputs}
    //         selectedOutputs={selectedOutputs}
    //         setSelectedOutputs={setSelectedOutputs}
    //       />
    //       <Separator orientation="horizontal" />
    //       <div className="flex justify-between">
    //         <p className="text-xs">Cache output</p>
    //         <div className="flex items-center space-x-2">
    //           <Switch defaultChecked={false} id="cache-output" className="" />
    //           <Label htmlFor="cache-output" className="text-xs">
    //             Yes
    //           </Label>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </NodeWrapper>
  );
}

export const FinancialAnalysisNode = React.memo(FinancialAnalysisNodeComponent);
