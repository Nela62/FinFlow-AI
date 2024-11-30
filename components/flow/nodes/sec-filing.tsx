import type { Node, NodeProps } from "@xyflow/react";
import { useReactFlow, useUpdateNodeInternals } from "@xyflow/react";
import { StockPicker } from "@/components/widgets/utils/stock-picker";
import { useEffect, useMemo, useState } from "react";
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
import React from "react";
import { Outputs } from "./utils/outputs";
import { NodeWrapper } from "./utils/node-wrapper";
import { createClient } from "@/lib/supabase/client";
import { fetchStockById } from "@/lib/queries";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { SEC_FILING_TYPES } from "@/lib/sec-filings";
import { DataCategoryEnum, FileFormat } from "@/types/dataFormat";
import { NodeInput, NodeOutput } from "@/types/node";

// TODO: Add time period
// TODO: Add selection of sections
// TODO: Add support for multiple inputs
// TODO: Bring back debounced setConfig

const inputs: NodeInput[] = [
  {
    label: "ticker",
    acceptedDataCategory: DataCategoryEnum.Text,
    acceptedFileFormats: [FileFormat.TXT],
  },
  {
    label: "filingType",
    acceptedDataCategory: DataCategoryEnum.Text,
    acceptedFileFormats: [FileFormat.TXT],
  },
  // add time period
];

type Config = {
  ticker: string;
  filing_type: string;
  // sections: string[];
};

const outputs: NodeOutput[] = [
  { label: "filing", dataType: FileFormat.JSON },
  { label: "filing", dataType: FileFormat.MD },
  // { label: "tables", dataType: FileFormat.CSV },
  // { label: "tables", dataType: FileFormat.XLSX },
];

export type SecFilingNodeData = {
  label: string;
  config: Config;
  inputs: NodeInput[];
  outputs: NodeOutput[];
};

export type SecFilingNodeType = Node<SecFilingNodeData, "sec-filing">;

const defaultConfig: Config = {
  ticker: "AAPL",
  filing_type: "10-K",

  // sections:
  //   SEC_FILING_TYPES.find((f) => f.type === "10-K")?.sections.flatMap((s) =>
  //     s.subSections.map((ss) => ss.name)
  //   ) || [],
};

export const SEC_FILING_NODE_DEFAULT_DATA: SecFilingNodeData = {
  label: "SEC Filing Parser",
  config: defaultConfig,
  inputs,
  outputs: [{ label: "filing", dataType: FileFormat.MD }],
};

function SecFilingNodeComponent({ id, data }: NodeProps<SecFilingNodeType>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const [config, setConfig] = useState<Record<string, any>>(data.config);
  const [stockId, setStockId] = useState<string | null>(null);

  console.log(config.filing_type);

  const { updateNodeData } = useReactFlow();

  const [selectedOutputs, setSelectedOutputs] = useState<NodeOutput[]>(
    data.outputs
  );

  const supabase = createClient();
  const { data: stock } = useQuery(fetchStockById(supabase, stockId ?? ""), {
    enabled: !!stockId,
  });

  useEffect(() => {
    if (stock) {
      setConfig({ ...config, ticker: stock.symbol });
    }
  }, [stock]);

  useEffect(() => {
    updateNodeData(id, { config });
  }, [config]);

  useEffect(() => {
    updateNodeInternals(id);
    updateNodeData(id, { outputs: selectedOutputs });
  }, [selectedOutputs]);

  const sections = useMemo(() => {
    return (
      SEC_FILING_TYPES.find(
        (filingType) => filingType.type === config.filing_type
      )?.sections ?? []
    );
  }, [config.filing_type]);

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <NodeWrapper
      nodeId={id}
      width="w-[450px]"
      inputs={inputs}
      outputs={selectedOutputs}
      headerProps={{
        title: "SEC Filing Parser",
        bgColor: "bg-steel-blue-200",
        textColor: "text-steel-blue-900",
        image: "/nodes/sec-filing.png",
      }}
    >
      <div className="space-y-2 px-2">
        <p className="text-sm font-semibold">Company</p>
        <StockPicker
          currentStockTicker={config.ticker}
          onStockClick={(stockId) => {
            setStockId(stockId);
          }}
        />
        <Separator orientation="horizontal" />
        <p className="text-sm font-semibold">Filing Type</p>
        <div className="flex gap-2">
          {SEC_FILING_TYPES.map((filingType) => (
            <div
              key={filingType.type}
              className={cn(
                "rounded-md p-1 space-y-1 border-2 cursor-pointer",
                config.filing_type === filingType.type
                  ? "bg-steel-blue-200 border-steel-blue-500"
                  : "bg-muted border-transparent"
              )}
              onClick={() => {
                setConfig({ ...config, filing_type: filingType.type });
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
        {/* <div className="space-y-2">
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
                    key={subSection.name}
                    className={cn(
                      "cursor-pointer",
                      config.sections.includes(subSection.name)
                        ? "bg-steel-blue-200 hover:bg-steel-blue-200"
                        : "hover:bg-muted"
                    )}
                    variant="secondary"
                    onClick={() => {
                      if (config.sections.includes(subSection.name)) {
                        setConfig({
                          ...config,
                          sections: config.sections.filter(
                            (s: string) => s !== subSection.name
                          ),
                        });
                      } else {
                        setConfig({
                          ...config,
                          sections: [...config.sections, subSection.name],
                        });
                      }
                    }}
                  >
                    {subSection.name} {subSection.description}
                  </Badge>
                ))}
              </NodeTabsContent>
            ))}
          </NodeTabs>
        </div>
        <Separator orientation="horizontal" /> */}
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

export const SecFilingNode = React.memo(SecFilingNodeComponent);
