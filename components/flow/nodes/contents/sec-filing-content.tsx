import { memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Separator } from "@/components/ui/separator";
import { StockPicker } from "@/components/widgets/utils/stock-picker";
import { createClient } from "@/lib/supabase/client";
import { fetchStockById } from "@/lib/queries";
import { SEC_FILING_TYPES } from "@/lib/sec-filings";
import { cn } from "@/lib/utils";
import { NodeData, NodeInput, NodeOutput, NodeType } from "@/types/node";
import { DataCategory, FileFormat } from "@/types/dataFormat";

// TODO: Add selection of sections
// TODO: Add support for multiple inputs
// TODO: Bring back debounced setConfig

const inputs: NodeInput[] = [
  {
    label: "ticker",
    handle: {
      hasHandle: "true",
      dataCategory: DataCategory.Text,
      fileFormats: [FileFormat.TXT],
      dynamic: false,
    },
    value: "AAPL",
  },
  {
    label: "filing_type",
    handle: {
      hasHandle: "true",
      dataCategory: DataCategory.Text,
      fileFormats: [FileFormat.TXT],
      dynamic: false,
    },
    value: "10-K",
  },
  // TODO: add time period
];

const outputs: NodeOutput[] = [
  {
    label: "filing",
    definition: { fileFormats: [FileFormat.MD] },
    value: { selected: true },
  },
];

export const SEC_FILING_NODE_DEFAULT_DATA: NodeData = {
  title: "SEC Filing Parser",
  type: NodeType.SEC_FILING,
  inputs,
  outputs,
};

export const SecFilingContent = memo(
  ({ id, data }: { id: string; data: NodeData }) => {
    const [config, setConfig] = useState<Record<string, any>>(data.inputs);
    const [stockId, setStockId] = useState<string | null>(null);

    const { updateNodeData } = useReactFlow();

    const supabase = createClient();
    const { data: stock } = useQuery(fetchStockById(supabase, stockId ?? ""), {
      enabled: !!stockId,
    });

    useEffect(() => {
      if (stock) {
        setConfig({
          ...config,
          ticker: { ...config.ticker, value: stock.symbol },
        });
      }
    }, [stock]);

    useEffect(() => {
      updateNodeData(id, { config });
    }, [config]);

    return (
      <div>
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
                  setConfig({
                    ...config,
                    filing_type: {
                      ...config.filing_type,
                      value: filingType.type,
                    },
                  });
                }}
              >
                <div className="flex items-center justify-center bg-background rounded-md p-1">
                  <p>{filingType.type}</p>
                </div>
                <p className="text-xs px-1">{filingType.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
