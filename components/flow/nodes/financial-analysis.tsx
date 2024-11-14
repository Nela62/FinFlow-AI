import Image from "next/image";
import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { SVGProps, useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NodeHeader } from "./utils/header";
import { Slider as DoubleSlider } from "@/components/ui/double-slider";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, FolderOpen, Pencil, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Menu } from "./utils/menu";

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

export type FinancialAnalysisNodeData = { label: string };

export type FinancialAnalysisNodeType = Node<FinancialAnalysisNodeData>;

const analysisTypes = [
  "Growth Investing Perspective",
  "Value Investing Perspective",
  "Risk Assessment",
  "Income Investing",
];

const outputFormats = [
  { type: ".html", image: "/output/json_logo.png" },
  { type: ".pdf", image: "/output/csv_logo.png" },
  { type: ".md", image: "/output/excel_logo.png" },
  { type: ".docx", image: "/output/excel_logo.png" },
];

function FinancialAnalysisNodeComponent({
  id,
  data,
}: NodeProps<FinancialAnalysisNodeType>) {
  const [analysisType, setAnalysisType] = useState<string>(
    "Growth Investing Perspective"
  );
  const [wordCount, setWordCount] = useState<[number, number]>([100, 500]);

  // const [timeHorizon, setTimeHorizon] = useState<number>(10);
  const [selectedOutputFormat, setSelectedOutputFormat] =
    useState<string>(".csv");

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="group relative rounded-md bg-background p-1 pb-2 border w-fit space-y-2 shadow-md">
      <Menu nodeId={id} />
      <Handle
        style={{
          height: "12px",
          width: "12px",
          backgroundColor: "white",
          border: "1px solid #6b7280",
        }}
        type="target"
        position={Position.Top}
      />
      <NodeHeader
        title="Financial Analysis"
        bgColor="bg-sky-200"
        textColor="text-sky-900"
        iconFn={MdiChartFinance}
        iconBgColor="bg-sky-500"
      />

      <div className="space-y-2 px-2">
        <div className="space-y-4 nodrag">
          <p className="text-sm font-semibold">Inputs from DCF model</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="intrinsic-value-per-share" />
              <Label htmlFor="intrinsic-value-per-share" className="text-xs">
                Intrinsic Value per Share
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="discount-rate" />
              <Label htmlFor="discount-rate" className="text-xs">
                Discount Rate (WACC)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terminal-growth-rate" />
              <Label htmlFor="terminal-growth-rate" className="text-xs">
                Terminal Growth Rate
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="projected-free-cash-flows" />
              <Label htmlFor="projected-free-cash-flows" className="text-xs">
                Projected Free Cash Flows
              </Label>
            </div>
          </div>
          <Separator orientation="horizontal" />
          <div className="space-y-3">
            <p className="text-sm font-semibold">Analysis Type</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {analysisType}
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {analysisTypes.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => setAnalysisType(type)}
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator orientation="horizontal" />
          <div className="space-y-2 nodrag">
            <p className="text-sm font-semibold">Word Count</p>
            <DoubleSlider
              min={100}
              max={1000}
              step={50}
              defaultValue={wordCount}
              onValueChange={(vals) => {
                setWordCount(vals as [number, number]);
              }}
              className=""
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{wordCount[0]} </span>
              <span>{wordCount[1]} </span>
            </div>
            <div className="flex justify-around">
              <div className="flex items-center space-x-2">
                <Checkbox id="include-charts" />
                <Label htmlFor="include-charts" className="text-xs">
                  Include Charts
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="include-tables" />
                <Label htmlFor="include-tables" className="text-xs">
                  Include Tables
                </Label>
              </div>
            </div>
          </div>
          <Separator orientation="horizontal" />
          <div className="space-y-2">
            <p className="text-sm font-semibold">Output</p>
            <div className="flex gap-4">
              {outputFormats.map((outputFormat) => (
                <div
                  key={outputFormat.type}
                  className={cn(
                    "rounded-md p-1 space-y-1 border-2 cursor-pointer ",
                    selectedOutputFormat === outputFormat.type
                      ? "bg-steel-blue-200 border-steel-blue-500"
                      : "bg-muted border-transparent"
                  )}
                  onClick={() => {
                    setSelectedOutputFormat(outputFormat.type);
                  }}
                >
                  <div className="flex items-center justify-center bg-background rounded-md p-1">
                    <Image
                      src={outputFormat.image}
                      alt={outputFormat.type}
                      width={40}
                      height={40}
                    />
                  </div>
                  <p className="text-xs px-1">{outputFormat.type}</p>
                </div>
              ))}
            </div>
          </div>
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
      </div>
      <Handle
        style={{
          height: "12px",
          width: "12px",
          backgroundColor: "white",
          border: "1px solid #6b7280",
        }}
        type="source"
        position={Position.Bottom}
      />
    </div>
  );
}

export const FinancialAnalysisNode = React.memo(FinancialAnalysisNodeComponent);
