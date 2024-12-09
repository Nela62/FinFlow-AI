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
import { createUpdateConfigValue } from "@/lib/update-config-value";
import { useInputValue } from "@/hooks/use-input-value";

// TODO: Add word count to ATHINA AI
const inputs: NodeInput[] = [
  {
    label: "context",
    handle: {
      hasHandle: "true",
      dataCategory: DataCategory.Text,
      fileFormats: [FileFormat.TXT],
      dynamic: true,
      isList: false,
    },
    value: "",
  },
  {
    label: "word_count",
    handle: { hasHandle: "false" },
    value: [200, 500],
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
    allowMultiple: false,
    supportedFileFormats: [
      { fileFormat: FileFormat.MD, value: { selected: true } },
    ],
    isList: false,
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
    const [config, setConfig] = useState<NodeInput[]>(data.inputs);
    const [keywordsInput, setKeywordsInput] = useState<string>("");

    const wordCount = useInputValue(config, "word_count");
    const keywords = useInputValue(config, "keywords");
    const relevanceThreshold = useInputValue(config, "relevance_threshold");
    const customInstructions = useInputValue(config, "custom_instructions");

    const { updateNodeData } = useReactFlow();

    const updateConfigValue = createUpdateConfigValue(setConfig);

    useEffect(() => {
      updateNodeData(id, { inputs: config });
    }, [config]);

    return (
      <div className="space-y-4 px-2 py-1">
        {/* Word Count */}
        <div className="space-y-2 nodrag">
          <p className="text-sm font-semibold">Word Count</p>
          <DoubleSlider
            min={50}
            max={1000}
            step={50}
            defaultValue={wordCount}
            onValueChange={(vals) => {
              updateConfigValue("word_count", vals);
            }}
          />

          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{wordCount[0]} </span>
            <span>{wordCount[1]} </span>
          </div>
        </div>
        <Separator orientation="horizontal" />

        {/* Semantic Keyword Focus */}
        <div className="space-y-4">
          <p className="text-sm font-semibold">Semantic Keyword Focus</p>
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword: string) => (
                <Badge key={keyword} className="flex gap-1 w-fit">
                  {keyword}
                  <button
                    onClick={() => {
                      updateConfigValue(
                        "keywords",
                        keywords.filter((k: string) => k !== keyword)
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
              value={keywordsInput}
              onChange={(e) => {
                setKeywordsInput(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const newKeywords = keywordsInput
                    .split(",")
                    .map((k) => k.trim())
                    .filter((k) => k.length > 0);
                  updateConfigValue(
                    "keywords",
                    Array.from(new Set([...keywords, ...newKeywords]))
                  );
                  e.currentTarget.value = "";
                }
              }}
            />
            <Button
              variant="outline"
              className="px-3"
              onClick={() => {
                const newKeywords = keywordsInput
                  .split(",")
                  .map((k) => k.trim())
                  .filter((k) => k.length > 0);
                updateConfigValue(
                  "keywords",
                  Array.from(new Set([...keywords, ...newKeywords]))
                );
                setKeywordsInput("");
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
              defaultValue={[relevanceThreshold]}
              onValueChange={(vals) => {
                updateConfigValue("relevance_threshold", vals[0]);
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

        {/* Custom Instructions */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">Custom Instructions</p>
          <Textarea
            placeholder="Enter custom instructions"
            value={customInstructions}
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
