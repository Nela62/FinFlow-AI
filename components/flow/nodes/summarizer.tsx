import Image from "next/image";
import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { StockPicker } from "@/components/widgets/utils/stock-picker";
import { SVGProps, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  NodeTabs,
  NodeTabsContent,
  NodeTabsList,
  NodeTabsTrigger,
} from "@/components/ui/node-tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NodeHeader } from "./utils/header";
import { NodeSection } from "@/types/node-section";
import { Slider as DoubleSlider } from "@/components/ui/double-slider";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

function Fa6SolidArrowDownWideShort(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.13em"
      height="1em"
      viewBox="0 0 576 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M151.6 469.6C145.5 476.2 137 480 128 480s-17.5-3.8-23.6-10.4l-88-96c-11.9-13-11.1-33.3 2-45.2s33.3-11.1 45.2 2L96 365.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32v301.7l32.4-35.4c11.9-13 32.2-13.9 45.2-2s13.9 32.2 2 45.2l-88 96zM320 480c-17.7 0-32-14.3-32-32s14.3-32 32-32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32h160c17.7 0 32 14.3 32 32s-14.3 32-32 32zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32h224c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
      ></path>
    </svg>
  );
}

export type SummarizerNodeData = { label: string };

export type SummarizerNode = Node<SummarizerNodeData>;

const outputFormats = [
  { type: ".json", image: "/output/json_logo.png" },
  { type: ".csv", image: "/output/csv_logo.png" },
  { type: ".xlsx", image: "/output/excel_logo.png" },
  { type: ".txt", image: "/output/txt_logo.png" },
];

export function SummarizerNode({ data }: NodeProps<SummarizerNode>) {
  const [wordCount, setWordCount] = useState<[number, number]>([100, 500]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputKeywords, setInputKeywords] = useState<string>("");
  const [relevanceThreshold, setRelevanceThreshold] = useState<number>(0.3);
  const [selectedOutputFormat, setSelectedOutputFormat] =
    useState<string>(".json");

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="rounded-md bg-background p-1 pb-2 border w-[320px] space-y-2">
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
        title="Summarizer"
        bgColor="bg-orange-200"
        textColor="text-orange-900"
        iconFn={Fa6SolidArrowDownWideShort}
        iconBgColor="bg-orange-500"
      />

      <div className="space-y-2 px-2">
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
        </div>
        <Separator orientation="horizontal" />
        <div className="space-y-4">
          <p className="text-sm font-semibold">Keywords</p>
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <Badge key={keyword} className="flex gap-1 w-fit">
                  {keyword}
                  <button
                    onClick={() => {
                      setKeywords((prev) => prev.filter((k) => k !== keyword));
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <div className="flex gap-1 items-center">
            <Input
              placeholder="Enter keywords separated by commas"
              className="placeholder:text-xs"
              value={inputKeywords}
              onChange={(e) => {
                setInputKeywords(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const newKeywords = inputKeywords
                    .split(",")
                    .map((k) => k.trim())
                    .filter((k) => k.length > 0);
                  setKeywords((prev) =>
                    Array.from(new Set([...prev, ...newKeywords]))
                  );
                  e.currentTarget.value = "";
                }
              }}
            />
            <Button
              variant="outline"
              className="px-1"
              onClick={() => {
                const newKeywords = inputKeywords
                  .split(",")
                  .map((k) => k.trim())
                  .filter((k) => k.length > 0);
                setKeywords((prev) =>
                  Array.from(new Set([...prev, ...newKeywords]))
                );
                setInputKeywords("");
              }}
            >
              + Add
            </Button>
          </div>
          <p className="text-sm font-semibold">Relevance Threshold</p>
          <div className="space-y-1 relative">
            <Slider
              className="pb-6"
              max={1}
              step={0.1}
              value={[relevanceThreshold]}
              onValueChange={(vals) => {
                setRelevanceThreshold(vals[0]);
              }}
            />
            <p
              className="absolute top-4 text-muted-foreground text-xs"
              style={{ left: `${relevanceThreshold * 100}%` }}
            >
              {relevanceThreshold}
            </p>
          </div>
        </div>
        <Separator orientation="horizontal" />
        <div className="space-y-2">
          <p className="text-sm font-semibold">Custom Instructions</p>
          <Textarea placeholder="Enter custom instructions" />
          <div className="flex gap-2">
            <Switch
              defaultChecked={false}
              id="generate-section-titles"
              className=""
            />
            <Label htmlFor="generate-section-titles" className="text-xs">
              Generate section titles
            </Label>
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
