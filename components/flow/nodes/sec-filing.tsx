import Image from "next/image";
import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { StockPicker } from "@/components/widgets/utils/stock-picker";
import { useMemo, useState } from "react";
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

export type SecFilingNodeData = { label: string };

export type SecFilingNode = Node<SecFilingNodeData>;

type FilingType = {
  type: string;
  description: string;
  sections: NodeSection[];
};

const filingTypes = [
  {
    type: "10-K",
    description: "Annual Report",
    sections: [
      {
        name: "Part I",
        subSections: [
          "Item 1. Business",
          "Item 1A. Risk Factors",
          "Mine Safety Disclosures",
          "Unresolved Staff Comments",
          "Legal Proceedings",
        ],
      },
      {
        name: "Part II",
        subSections: [
          "Item 1. Business",
          "Item 1A. Risk Factors",
          "Mine Safety Disclosures",
          "Unresolved Staff Comments",
          "Legal Proceedings",
        ],
      },
    ],
  },
  {
    type: "10-Q",
    description: "Quarterly Report",
    sections: [],
  },
  { type: "8-K", description: "Current Report", sections: [] },
  { type: "DEF 14A", description: "Proxy Statement", sections: [] },
];

const outputFormats = [
  { type: ".json", image: "/output/json_logo.png" },
  { type: ".csv", image: "/output/csv_logo.png" },
  { type: ".xlsx", image: "/output/excel_logo.png" },
  { type: ".txt", image: "/output/txt_logo.png" },
];

export function SecFilingNode({ data }: NodeProps<SecFilingNode>) {
  const [selectedStockTicker, setSelectedStockTicker] =
    useState<string>("AAPL");
  const [selectedFilingType, setSelectedFilingType] = useState<string>("10-K");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedOutputFormat, setSelectedOutputFormat] =
    useState<string>(".json");

  const sections = useMemo(() => {
    return (
      filingTypes.find((filingType) => filingType.type === selectedFilingType)
        ?.sections ?? []
    );
  }, [selectedFilingType]);

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="rounded-md bg-background p-1 pb-2 border max-w-[370px] space-y-2">
      <NodeHeader
        title="SEC Filing Parser"
        bgColor="bg-steel-blue-200"
        textColor="text-steel-blue-900"
        image="/nodes/sec-filing.png"
      />

      <div className="space-y-2 px-2">
        <p className="text-sm font-semibold">Company</p>
        <StockPicker
          currentStockTicker={selectedStockTicker}
          onStockClick={(stockId) => {
            setSelectedStockTicker(stockId);
          }}
        />
        <Separator orientation="horizontal" />
        <p className="text-sm font-semibold">Filing Type</p>
        <div className="flex gap-2">
          {filingTypes.map((filingType) => (
            <div
              key={filingType.type}
              className={cn(
                "rounded-md p-1 space-y-1 border-2 cursor-pointer",
                selectedFilingType === filingType.type
                  ? "bg-steel-blue-200 border-steel-blue-500"
                  : "bg-muted border-transparent"
              )}
              onClick={() => {
                setSelectedFilingType(filingType.type);
              }}
            >
              <div className="flex items-center justify-center bg-background rounded-md p-1">
                <p>{filingType.type}</p>
              </div>
              <p className="text-xs px-1">{filingType.description}</p>
            </div>
          ))}
        </div>
        <Separator orientation="horizontal" />
        <div className="space-y-2">
          <p className="text-sm font-semibold">Sections</p>
          <NodeTabs defaultValue={sections[0]?.name}>
            <NodeTabsList>
              {sections.map((section) => (
                <NodeTabsTrigger key={section.name} value={section.name}>
                  {section.name}
                </NodeTabsTrigger>
              ))}
            </NodeTabsList>
            {sections.map((section) => (
              <NodeTabsContent
                key={section.name}
                value={section.name}
                className="flex flex-wrap gap-2"
              >
                {section.subSections.map((subSection) => (
                  <Badge
                    key={subSection}
                    className={cn(
                      "cursor-pointer",
                      selectedSections.includes(subSection)
                        ? "bg-steel-blue-200 hover:bg-steel-blue-200"
                        : "hover:bg-muted"
                    )}
                    variant="secondary"
                    onClick={() => {
                      if (selectedSections.includes(subSection)) {
                        setSelectedSections((prev) =>
                          prev.filter((s) => s !== subSection)
                        );
                      } else {
                        setSelectedSections((prev) => [...prev, subSection]);
                      }
                    }}
                  >
                    {subSection}
                  </Badge>
                ))}
              </NodeTabsContent>
            ))}
          </NodeTabs>
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
