import Image from "next/image";
import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { StockPicker } from "@/components/widgets/utils/stock-picker";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type SecFilingNodeData = {};

export type SecFilingNode = Node<SecFilingNodeData>;

const filingTypes = [
  { type: "10-Q", description: "Quarterly Report" },
  { type: "10-K", description: "Annual Report" },
  { type: "8-K", description: "Current Report" },
  { type: "DEF 14A", description: "Proxy Statement" },
];

export default function SecFilingNode({ data }: NodeProps<SecFilingNode>) {
  const [selectedStockTicker, setSelectedStockTicker] =
    useState<string>("AAPL");
  const [selectedFilingTypes, setSelectedFilingTypes] = useState<string[]>([]);
  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="rounded-md bg-background p-1 border max-w-[370px] space-y-2">
      <div className="flex items-center gap-4 bg-steel-blue-200 rounded-md p-1.5">
        <Image
          src="/nodes/sec-filing.png"
          alt="SEC Filing"
          className="rounded-md"
          width={50}
          height={50}
        />
        <p className="text-steel-blue-900">SEC Filing Parser</p>
      </div>
      <div className="space-y-2 px-2">
        <p className="text-sm font-semibold">Company</p>
        <StockPicker
          currentStockTicker={selectedStockTicker}
          onStockClick={(stockId) => {
            setSelectedStockTicker(stockId);
          }}
        />
        <p className="text-sm font-semibold">Filing Type</p>
        <div className="flex gap-2">
          {filingTypes.map((filingType) => (
            <div
              key={filingType.type}
              className={cn(
                "rounded-md p-1 space-y-1 border-2",
                selectedFilingTypes.includes(filingType.type)
                  ? "bg-steel-blue-200 border-steel-blue-300"
                  : "bg-muted border-transparent"
              )}
              onClick={() => {
                setSelectedFilingTypes((prev) =>
                  prev.includes(filingType.type)
                    ? prev.filter((type) => type !== filingType.type)
                    : [...prev, filingType.type]
                );
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
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
