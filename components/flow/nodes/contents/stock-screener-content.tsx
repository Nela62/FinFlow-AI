import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DataCategory, FileFormat } from "@/types/dataFormat";
import { NodeInput, NodeOutput, NodeType } from "@/types/node";
import { NodeData } from "@/types/react-flow";
import { Pen, Pencil, Plus } from "lucide-react";
import { memo } from "react";
import { StockScreenerModal } from "./components/stock-screener-modal";

const inputs: NodeInput[] = [
  {
    label: "stock_data",
    handle: {
      hasHandle: "true",
      dataCategory: DataCategory.Json,
      fileFormats: [FileFormat.JSON],
      dynamic: false,
      isList: true,
    },
    value: {},
  },
];

const outputs: NodeOutput[] = [
  {
    label: "tickers",
    allowMultiple: false,
    supportedFileFormats: [
      { fileFormat: FileFormat.TXT, value: { selected: true } },
    ],
    isList: true,
  },
];

export const STOCK_SCREENER_NODE_DEFAULT_DATA: NodeData = {
  title: "Stock Screener",
  type: NodeType.STOCK_SCREENER,
  inputs,
  outputs,
};

type Rule = {
  field: string;
  operator: string;
  value: string | number | null;
};

type Group = {
  logic: "AND" | "OR";
  rules: (Rule | Group)[];
};

const initialConfig: Group = {
  logic: "AND",
  rules: [
    { field: "industry", operator: "is", value: "Oil & Gas" },
    {
      logic: "AND",
      rules: [
        { field: "pe_ratio", operator: "less", value: 15 },
        {
          logic: "OR",
          rules: [
            { field: "dividend_yield", operator: "greater", value: 4 },
            { field: "revenue_growth_yoy", operator: "greater", value: 10 },
          ],
        },
        {
          logic: "OR",
          rules: [
            { field: "debt_to_equity", operator: "less", value: 0.5 },
            { field: "current_ratio", operator: "greater", value: 1.5 },
          ],
        },
      ],
    },
  ],
};

const LogicTree = ({ group }: { group: Group }) => {
  return (
    <div className="ml-4 border-l border-gray-300 pl-4">
      <div className="mb-2 font-bold text-gray-600">{group.logic}</div>
      <ul className="space-y-2">
        {group.rules.map((rule, index) =>
          "logic" in rule ? (
            <li key={index}>
              <LogicTree group={rule} />
            </li>
          ) : (
            <li key={index} className="flex items-center space-x-2">
              <span className="text-gray-700">{rule.field}</span>
              <span className="text-blue-600">{rule.operator}</span>
              <span className="text-green-600">{rule.value}</span>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export const StockScreenerContent = memo(
  ({ id, data }: { id: string; data: NodeData }) => {
    return (
      <div className="space-y-4 px-2 py-1">
        <LogicTree group={initialConfig} />
        <Dialog>
          <DialogTrigger asChild>
            <div className="w-full flex justify-end mt-2">
              <Button variant="outline" className="gap-2 flex">
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </Button>
            </div>
          </DialogTrigger>
          <StockScreenerModal />
        </Dialog>
      </div>
    );
  }
);
