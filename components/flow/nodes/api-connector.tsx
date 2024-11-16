import React, { useEffect } from "react";
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
import { NodeHeader } from "./utils/header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NodeInput, NodeOutput } from "@/types/node";
import { useDebouncedCallback } from "use-debounce";
import { NodeWrapper } from "./utils/node-wrapper";
import { Outputs } from "./utils/outputs";
import { res } from "./temp/api";

function MajesticonsDataLine(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 7c0 2.21-4.03 4-9 4S3 9.21 3 7m18 0c0-2.21-4.03-4-9-4S3 4.79 3 7m18 0v5M3 7v5m18 0c0 2.21-4.03 4-9 4s-9-1.79-9-4m18 0v5c0 2.21-4.03 4-9 4s-9-1.79-9-4v-5"
      ></path>
    </svg>
  );
}

const inputs: NodeInput[] = [
  {
    label: "ticker",
    acceptedFormat: "Text",
    acceptedTypes: ["TXT"],
  },
];

type Params = {
  ticker: string;
  apiProvider: string;
  endpoints: string[];
};

const defaultParams: Params = {
  ticker: "AAPL",
  apiProvider: "yfinance",
  endpoints: ["income", "balance", "cashflow"],
};

const outputs: NodeOutput[] = [
  { label: "data", dataType: "JSON" },
  { label: "data", dataType: "XML" },
  { label: "tables", dataType: "CSV" },
  { label: "tables", dataType: "XLSX" },
];

const runFn = async (params: Record<string, any>) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    inputData: params.ticker,
    params: params,
    outputData: res,
  };
};

// TODO: This can be abstracted to a generic node type + params type
export type ApiConnectorNodeData = {
  label: string;
  params: Params;
  inputs: NodeInput[];
  outputs: NodeOutput[];
  runFn: (params: Record<string, any>) => Promise<Record<string, any>>;
};

export const defaultData: ApiConnectorNodeData = {
  label: "API Connector",
  params: defaultParams,
  inputs,
  outputs: [{ label: "data", dataType: "JSON" }],
  runFn,
};

export type ApiConnectorNode = Node<ApiConnectorNodeData>;

const apiProviders = [
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

function ApiConnectorNodeComponent({ id, data }: NodeProps<ApiConnectorNode>) {
  // TODO: Check if there is an input and adjust the ticker param
  const updateNodeInternals = useUpdateNodeInternals();
  const [params, setParams] = useState<Record<string, any>>(data.params);
  const setParamsDebounced = useDebouncedCallback(
    (params: Record<string, any>) => {
      setParams(params);
    },
    1000
  );
  const { updateNodeData } = useReactFlow();

  const [selectedOutputs, setSelectedOutputs] = useState<NodeOutput[]>(
    data.outputs
  );

  useEffect(() => {
    updateNodeInternals(id);
    updateNodeData(id, { outputs: selectedOutputs });
  }, [selectedOutputs]);

  useEffect(() => {
    updateNodeData(id, { params });
  }, [params]);

  const apiProvider = useMemo(() => {
    return (
      apiProviders.find(
        (apiProvider) => apiProvider.id === params.apiProvider
      ) ?? { id: "yfinance", name: "Yahoo Finance" }
    );
  }, [params.apiProvider]);

  return (
    <NodeWrapper
      nodeId={id}
      width="w-[360px]"
      inputs={inputs}
      outputs={selectedOutputs}
    >
      <NodeHeader
        title="API Connector"
        bgColor="bg-purple-200"
        iconBgColor="bg-purple-400"
        textColor="text-purple-900"
        iconFn={MajesticonsDataLine}
      />

      <div className="space-y-2 px-2">
        <p className="text-sm font-semibold">Company</p>
        <StockPicker
          currentStockTicker={params.ticker}
          onStockClick={(stockId) => {
            setParamsDebounced({ ...params, ticker: stockId });
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
              {apiProviders
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((apiProvider) => (
                  <DropdownMenuItem
                    key={apiProvider.id}
                    onClick={() => {
                      setParamsDebounced({
                        ...params,
                        apiProvider: apiProvider.id,
                      });
                    }}
                  >
                    {apiProvider.name}
                  </DropdownMenuItem>
                ))}
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
                            params.endpoints.includes(endpoint)
                              ? "bg-steel-blue-200 hover:bg-steel-blue-200"
                              : "hover:bg-muted"
                          )}
                          variant="secondary"
                          onClick={() => {
                            if (params.endpoints.includes(endpoint)) {
                              setParamsDebounced({
                                ...params,
                                endpoints: params.endpoints.filter(
                                  (e: string) => e !== endpoint
                                ),
                              });
                            } else {
                              setParamsDebounced({
                                ...params,
                                endpoints: [...params.endpoints, endpoint],
                              });
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
        <div className="flex justify-around">
          <div className="flex items-center space-x-2">
            <Switch />
            <div className="space-y-1">
              <p className="text-xs">Price-Actual /</p>
              <p className="text-xs">Split-Adjusted</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch />
            <div className="space-y-1">
              <p className="text-xs">Inflation-Adjusted /</p>
              <p className="text-xs">Nominal</p>
            </div>
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

export const ApiConnectorNode = React.memo(ApiConnectorNodeComponent);
