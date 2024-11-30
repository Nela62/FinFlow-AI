import React, { useEffect } from "react";

import type { Node, NodeProps } from "@xyflow/react";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { SVGProps, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider as DoubleSlider } from "@/components/ui/double-slider";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  DataCategoryEnum,
  dataTypesList,
  FileFormat,
  NodeInput,
  NodeOutput,
} from "@/types/node";
import { NodeWrapper } from "./utils/node-wrapper";
import { useDebouncedCallback } from "use-debounce";
import { Outputs } from "./utils/outputs";

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

const inputs: NodeInput[] = [
  {
    label: "text",
    acceptedDataCategory: DataCategoryEnum.Text,
    acceptedFileFormats: dataTypesList
      .filter((item) => item.dataCategory === DataCategoryEnum.Text)
      ?.map((item) => item.type),
  },
];

type Config = {
  wordCount: [number, number];
  keywords: string[];
  relevanceThreshold: number;
};

const outputs: NodeOutput[] = [
  { label: "summary", dataType: FileFormat.MD },
  { label: "summary", dataType: FileFormat.TXT },
];

export type SummarizerNodeData = {
  label: string;
  config: Config;
  inputs: NodeInput[];
  outputs: NodeOutput[];
};

export type SummarizerNodeType = Node<SummarizerNodeData>;

const defaultConfig: Config = {
  wordCount: [100, 500],
  keywords: [],
  relevanceThreshold: 0.3,
};

export const SUMMARIZER_NODE_DEFAULT_DATA: SummarizerNodeData = {
  label: "Summarizer",
  config: defaultConfig,
  inputs,
  outputs: [{ label: "summary", dataType: FileFormat.MD }],
};

function SummarizerNodeComponent({ id, data }: NodeProps<SummarizerNodeType>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const [params, setParams] = useState<Record<string, any>>(data.config);
  const setParamsDebounced = useDebouncedCallback(
    (params: Record<string, any>) => {
      setParams(params);
    },
    1000
  );
  const { updateNodeData } = useReactFlow();

  const [inputKeywords, setInputKeywords] = useState<string>("");
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
    <NodeWrapper
      nodeId={id}
      width="w-[360px]"
      inputs={inputs}
      outputs={selectedOutputs}
      headerProps={{
        title: data.label,
        bgColor: "bg-orange-200",
        textColor: "text-orange-900",
        iconFn: Fa6SolidArrowDownWideShort,
        iconBgColor: "bg-orange-500",
      }}
    >
      <div className="space-y-4 px-2 py-1">
        {/* Word Count */}
        <div className="space-y-2 nodrag">
          <p className="text-sm font-semibold">Word Count</p>
          <DoubleSlider
            min={100}
            max={1000}
            step={50}
            defaultValue={params.wordCount}
            onValueChange={(vals) => {
              setParamsDebounced({
                ...params,
                wordCount: vals as [number, number],
              });
            }}
          />

          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{params.wordCount[0]} </span>
            <span>{params.wordCount[1]} </span>
          </div>
        </div>
        <Separator orientation="horizontal" />

        {/* Semantic Keyword Focus */}
        <div className="space-y-4">
          <p className="text-sm font-semibold">Semantic Keyword Focus</p>
          {params.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {params.keywords.map((keyword: string) => (
                <Badge key={keyword} className="flex gap-1 w-fit">
                  {keyword}
                  <button
                    onClick={() => {
                      setParamsDebounced({
                        ...params,
                        keywords: params.keywords.filter(
                          (k: string) => k !== keyword
                        ),
                      });
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
                  setParamsDebounced({
                    ...params,
                    keywords: Array.from(
                      new Set([...params.keywords, ...newKeywords])
                    ),
                  });
                  e.currentTarget.value = "";
                }
              }}
            />
            <Button
              variant="outline"
              className="px-3"
              onClick={() => {
                const newKeywords = inputKeywords
                  .split(",")
                  .map((k) => k.trim())
                  .filter((k) => k.length > 0);
                setParamsDebounced({
                  ...params,
                  keywords: Array.from(
                    new Set([...params.keywords, ...newKeywords])
                  ),
                });
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
              value={[params.relevanceThreshold]}
              onValueChange={(vals) => {
                setParamsDebounced({
                  ...params,
                  relevanceThreshold: vals[0],
                });
              }}
            />
            <p
              className="absolute top-4 text-muted-foreground text-xs"
              style={{ left: `${params.relevanceThreshold * 100}%` }}
            >
              {params.relevanceThreshold}
            </p>
          </div>
        </div>
        <Separator orientation="horizontal" />

        {/* Custom Instructions */}
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

export const SummarizerNode = React.memo(SummarizerNodeComponent);
