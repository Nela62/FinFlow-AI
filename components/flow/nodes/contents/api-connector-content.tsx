import React, { memo, useEffect } from "react";
import type { SVGProps } from "react";

import type { Node, NodeProps } from "@xyflow/react";
import {
  Handle,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from "@xyflow/react";
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
import { NodeHeader } from "../components/node-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NodeInput, NodeOutput, NodeType } from "@/types/node";
import { useDebouncedCallback } from "use-debounce";
import { res } from "../temp/api";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { fetchStockById } from "@/lib/queries";
import { DataCategory, FileFormat } from "@/types/dataFormat";
import { NodeData } from "@/types/react-flow";
import { useInputValue } from "@/hooks/use-input-value";
import { createUpdateConfigValue } from "@/lib/update-config-value";

const inputs: NodeInput[] = [
  {
    label: "ticker",
    handle: {
      hasHandle: "true",
      dataCategory: DataCategory.Text,
      fileFormats: [FileFormat.TXT],
      dynamic: false,
      isList: false,
    },
    value: "AAPL",
  },
  {
    label: "api_provider",
    value: "yfinance",
    handle: { hasHandle: "false" },
  },
  {
    label: "endpoints",
    value: ["income", "balance", "cashflow"],
    handle: { hasHandle: "false" },
  },
];

const outputs: NodeOutput[] = [
  {
    label: "data",
    allowMultiple: false,
    supportedFileFormats: [
      { fileFormat: FileFormat.JSON, value: { selected: true } },
    ],
    isList: false,
  },
];

export const API_CONNECTOR_NODE_DEFAULT_DATA: NodeData = {
  title: "API Connector",
  type: NodeType.API_CONNECTOR,
  inputs,
  outputs,
};

const API_PROVIDERS = [
  { id: "benzinga", name: "Benzinga" },
  { id: "bls", name: "Bureau of Labor Statistics" },
  { id: "cftc", name: "Commodity Futures Trading Commission" },
  { id: "econdb", name: "EconDB" },
  { id: "imf", name: "IMF" },
  { id: "fmp", name: "FMP" },
  { id: "fred", name: "FRED" },
  { id: "intrinio", name: "Intrinio" },
  { id: "oecd", name: "OECD" },
  { id: "polygon", name: "Polygon" },
  { id: "sec", name: "SEC" },
  { id: "tiingo", name: "Tiingo" },
  { id: "tradingeconomics", name: "TradingEconomics" },
  { id: "yfinance", name: "Yahoo Finance" },
  { id: "alpha-vantage", name: "Alpha Vantage" },
  { id: "biztoc", name: "Biztoc" },
  { id: "cboe", name: "Cboe" },
  { id: "ecb", name: "ECB" },
  { id: "federal-reserve", name: "Federal Reserve" },
  { id: "finra", name: "FINRA" },
  { id: "finviz", name: "Finviz" },
  { id: "government-us", name: "US Government" },
  { id: "nasdaq", name: "Nasdaq" },
  { id: "seeking-alpha", name: "Seeking Alpha" },
  { id: "stockgrid", name: "Stockgrid" },
  { id: "tmx", name: "TMX" },
  { id: "tradier", name: "Tradier" },
  { id: "wsj", name: "WSJ" },
];

const sections = [
  {
    name: "Equity",
    subSections: [
      { name: "Fundamental", endpoints: ["income", "balance", "cashflow"] },
    ],
  },
];

export const ApiConnectorContent = memo(
  ({ id, data }: { id: string; data: NodeData }) => {
    // TODO: Check if there is an input and adjust the ticker param
    const [config, setConfig] = useState<NodeInput[]>(data.inputs);
    const [stockId, setStockId] = useState<string | null>(null);

    const updateConfigValue = createUpdateConfigValue(setConfig);

    const selectedTicker = useInputValue(config, "ticker");
    const selectedApiProvider = useInputValue(config, "api_provider");
    const selectedEndpoints = useInputValue(config, "endpoints");

    // const setParamsDebounced = useDebouncedCallback(
    //   (params: Record<string, any>) => {
    //     setParams(params);
    //   },
    //   1000
    // );
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
        updateConfigValue("ticker", stock.symbol);
      }
    }, [stock]);

    // useEffect(() => {
    //   2;
    //   updateNodeInternals(id);
    //   updateNodeData(id, { outputs: selectedOutputs });
    // }, [selectedOutputs]);

    useEffect(() => {
      updateNodeData(id, { inputs: config });
    }, [config]);

    const apiProvider = useMemo(() => {
      return (
        API_PROVIDERS.find(
          (apiProvider) => apiProvider.id === selectedApiProvider
        ) ?? { id: "yfinance", name: "Yahoo Finance" }
      );
    }, [selectedApiProvider]);

    return (
      <div className="space-y-4 py-1 px-2">
        <p className="text-sm font-semibold">Company</p>
        <StockPicker
          currentStockTicker={selectedTicker}
          onStockClick={(stockId) => {
            setStockId(stockId);
          }}
        />
        <Separator orientation="horizontal" />
        <p className="text-sm font-semibold">Data Source</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between">
              {apiProvider.name}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <ScrollArea className="h-[200px]">
              {API_PROVIDERS.sort((a, b) => a.name.localeCompare(b.name)).map(
                (apiProvider) => (
                  <DropdownMenuItem
                    key={apiProvider.id}
                    onClick={() => {
                      updateConfigValue("api_provider", apiProvider.id);
                    }}
                  >
                    {apiProvider.name}
                  </DropdownMenuItem>
                )
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="horizontal" />
        <div className="space-y-2">
          <p className="text-sm font-semibold">Endpoints</p>
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
                  <div key={subSection.name}>
                    <p className="text-sm font-semibold mb-1">
                      {subSection.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {subSection.endpoints.map((endpoint) => (
                        <Badge
                          key={endpoint}
                          className={cn(
                            "cursor-pointer",
                            // TODO: Get the right colors
                            selectedEndpoints.includes(endpoint)
                              ? "bg-steel-blue-200 hover:bg-steel-blue-200"
                              : "hover:bg-muted"
                          )}
                          variant="secondary"
                          onClick={() => {
                            if (selectedEndpoints.includes(endpoint)) {
                              updateConfigValue("endpoints", [
                                ...selectedEndpoints.filter(
                                  (e: string) => e !== endpoint
                                ),
                              ]);
                            } else {
                              updateConfigValue("endpoints", [
                                ...selectedEndpoints,
                                endpoint,
                              ]);
                            }
                          }}
                        >
                          {endpoint}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </NodeTabsContent>
            ))}
          </NodeTabs>
        </div>
        <Separator orientation="horizontal" />
        <div className="flex justify-around py-2">
          <div className="flex items-center space-x-2">
            <Switch />

            <p className="text-xs">Split-Adjusted</p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch />
            <p className="text-xs">Inflation-Adjusted</p>
          </div>
        </div>
        {/* <Separator orientation="horizontal" />
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
        </div> */}
      </div>
    );
  }
);
