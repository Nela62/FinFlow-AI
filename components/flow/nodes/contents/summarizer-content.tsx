import { memo, useCallback, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { X } from "lucide-react";

import { Slider as DoubleSlider } from "@/components/ui/double-slider";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { NodeInput, NodeOutput, NodeType } from "@/types/node";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DataCategory, FileFormat } from "@/types/dataFormat";
import { NodeData } from "@/types/react-flow";

const inputs: NodeInput[] = [
  {
    label: "context",
    handle: {
      hasHandle: "true",
      dataCategory: DataCategory.Text,
      fileFormats: [FileFormat.TXT],
      dynamic: true,
    },
    value: "",
  },
  {
    label: "word_count",
    handle: { hasHandle: "false" },
    value: [100, 500],
  },
  {
    label: "keywords",
    handle: { hasHandle: "false" },
    value: [
      "management",
      "risks",
      "revenue",
      "financials",
      "market trends",
      "compliance",
    ],
  },
  {
    label: "relevance_threshold",
    handle: { hasHandle: "false" },
    value: 0.8,
  },
  {
    label: "custom_instructions",
    handle: { hasHandle: "false" },
    value: "",
  },
];

const outputs: NodeOutput[] = [
  {
    label: "summary",
    definition: { fileFormats: [FileFormat.MD] },
    value: { selected: true },
  },
];

export const SUMMARIZER_NODE_DEFAULT_DATA: NodeData = {
  title: "Summarizer",
  type: NodeType.SUMMARIZER,
  inputs,
  outputs,
};

export const SummarizerContent = memo(
  ({ id, data }: { id: string; data: NodeData }) => {
    const [config, setConfig] = useState<Record<string, any>>(data.inputs);
    const [inputKeywords, setInputKeywords] = useState<string>("");

    const { updateNodeData } = useReactFlow();

    const updateConfigValue = useCallback(
      (key: string, value: any) => {
        setConfig({ ...config, [key]: { ...config[key], value } });
      },
      [config, setConfig]
    );

    useEffect(() => {
      updateNodeData(id, { inputs: config });
    }, [config]);

    return (
      <div className="space-y-4 px-2 py-1">
        {/* Word Count */}
        <div className="space-y-2 nodrag">
          <p className="text-sm font-semibold">Word Count</p>
          <DoubleSlider
            min={100}
            max={1000}
            step={50}
            defaultValue={config.wordCount}
            onValueChange={(vals) => {
              updateConfigValue("wordCount", vals);
            }}
          />

          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{config.wordCount[0]} </span>
            <span>{config.wordCount[1]} </span>
          </div>
        </div>
        <Separator orientation="horizontal" />

        {/* Semantic Keyword Focus */}
        <div className="space-y-4">
          <p className="text-sm font-semibold">Semantic Keyword Focus</p>
          {config.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {config.keywords.map((keyword: string) => (
                <Badge key={keyword} className="flex gap-1 w-fit">
                  {keyword}
                  <button
                    onClick={() => {
                      updateConfigValue(
                        "keywords",
                        config.keywords.filter((k: string) => k !== keyword)
                      );
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
                  updateConfigValue(
                    "keywords",
                    Array.from(new Set([...config.keywords, ...newKeywords]))
                  );
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
                updateConfigValue(
                  "keywords",
                  Array.from(new Set([...config.keywords, ...newKeywords]))
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
              value={[config.relevanceThreshold]}
              onValueChange={(vals) => {
                updateConfigValue("relevanceThreshold", vals[0]);
              }}
            />
            <p
              className="absolute top-4 text-muted-foreground text-xs"
              style={{ left: `${config.relevanceThreshold * 100}%` }}
            >
              {config.relevanceThreshold}
            </p>
          </div>
        </div>
        <Separator orientation="horizontal" />

        {/* Custom Instructions */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">Custom Instructions</p>
          <Textarea
            placeholder="Enter custom instructions"
            value={config.customInstructions}
            onChange={(e) => {
              updateConfigValue("customInstructions", e.target.value);
            }}
          />
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
        {/* <Separator orientation="horizontal" />
        <div className="flex justify-between">
          <p className="text-xs">Cache output</p>
          <div className="flex items-center space-x-2">
            <Switch defaultChecked={false} id="cache-output" className="" />
            <Label htmlFor="cache-output" className="text-xs">
              Yes
            </Label>
          </div>
        </div> */}
      </div>
    );
  }
);
