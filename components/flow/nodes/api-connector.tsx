import React from "react";
import type { SVGProps } from "react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NodeSection } from "@/types/node-section";
export type ApiConnectorNodeData = {};

export type ApiConnectorNode = Node<ApiConnectorNodeData>;

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

const outputFormats = [
  { type: ".json", image: "/output/json_logo.png" },
  // TODO: change the logo
  { type: ".xml", image: "/output/txt_logo.png" },
  { type: ".csv", image: "/output/csv_logo.png" },
  { type: ".xlsx", image: "/output/excel_logo.png" },
];

export function ApiConnectorNode({ data }: NodeProps<ApiConnectorNode>) {
  const [selectedStockTicker, setSelectedStockTicker] =
    useState<string>("AAPL");
  const [selectedApiProvider, setSelectedApiProvider] =
    useState<string>("yfinance");
  const [selectedEndpoints, setSelectedEndpoints] = useState<string[]>([]);
  const [selectedOutputFormat, setSelectedOutputFormat] =
    useState<string>(".json");

  const apiProvider = useMemo(() => {
    return (
      apiProviders.find(
        (apiProvider) => apiProvider.id === selectedApiProvider
      ) ?? { id: "yfinance", name: "Yahoo Finance" }
    );
  }, [selectedApiProvider]);

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="rounded-md bg-background p-1 pb-2 border max-w-[370px] space-y-2">
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
          currentStockTicker={selectedStockTicker}
          onStockClick={(stockId) => {
            setSelectedStockTicker(stockId);
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
                      setSelectedApiProvider(apiProvider.id);
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
                            selectedEndpoints.includes(endpoint)
                              ? "bg-steel-blue-200 hover:bg-steel-blue-200"
                              : "hover:bg-muted"
                          )}
                          onClick={() => {
                            if (selectedEndpoints.includes(endpoint)) {
                              setSelectedEndpoints((prev) =>
                                prev.filter((e) => e !== endpoint)
                              );
                            } else {
                              setSelectedEndpoints((prev) => [
                                ...prev,
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
