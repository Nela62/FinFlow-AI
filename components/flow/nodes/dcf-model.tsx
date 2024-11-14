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
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu } from "./utils/menu";

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
export type DCFModelNodeData = { label: string };

export type DcfModelNodeType = Node<DCFModelNodeData>;

const outputFormats = [
  // { type: ".json", image: "/output/json_logo.png" },
  { type: ".csv", image: "/output/csv_logo.png" },
  { type: ".xlsx", image: "/output/excel_logo.png" },
  // { type: ".txt", image: "/output/txt_logo.png" },
];

function DcfModelNodeComponent({ id, data }: NodeProps<DcfModelNodeType>) {
  // const [discountRate, setDiscountRate] = useState<number>(0.1);
  // const [timeHorizon, setTimeHorizon] = useState<number>(10);
  const [selectedOutputFormat, setSelectedOutputFormat] =
    useState<string>(".csv");

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="group relative rounded-md bg-background p-1 pb-2 border w-[320px] space-y-2 shadow-md">
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
        title="DCF Model"
        bgColor="bg-green-200"
        textColor="text-green-900"
        iconFn={MaterialSymbolsTableOutline}
        iconBgColor="bg-green-500"
      />

      <div className="space-y-2 px-2">
        <div className="space-y-4 nodrag">
          <p className="text-sm font-semibold">Parameters & Assumptions</p>
          <div className="flex gap-4">
            <div className="space-y-1">
              <p className="text-xs">Discount Rate (%)</p>
              <Input type="number" />
            </div>
            <div className="space-y-1">
              <p className="text-xs">Time Horizon (Years)</p>
              <Input type="number" />
            </div>
          </div>
          <p className="text-sm font-semibold">Terminal Value</p>
          <Tabs defaultValue="exit-multiple" className="w-full">
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
          </Tabs>
          <div className="flex gap-4">
            <div className="space-y-1">
              <p className="text-xs">Growth Rate (%)</p>
              <Input type="number" />
            </div>
            <div className="space-y-1">
              <p className="text-xs">Discount Rate (%)</p>
              <Input type="number" />
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

export const DcfModelNode = React.memo(DcfModelNodeComponent);
