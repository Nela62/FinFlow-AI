import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DataCategory, FileFormat } from "@/types/dataFormat";
import { NodeInput, NodeOutput, NodeType } from "@/types/node";
import { NodeData } from "@/types/react-flow";
import { Plus } from "lucide-react";
import { memo } from "react";
import { StockScreenerModal } from "./components/stock-screener-modal";

const inputs: NodeInput[] = [
  {
    label: "stock",
    handle: {
      hasHandle: "true",
      dataCategory: DataCategory.Text,
      fileFormats: [FileFormat.TXT],
      dynamic: false,
      isList: true,
    },
    value: "AAPL",
  },
];

const outputs: NodeOutput[] = [
  {
    label: "ticker",
    allowMultiple: false,
    supportedFileFormats: [
      { fileFormat: FileFormat.MD, value: { selected: true } },
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

export const StockScreenerContent = memo(
  ({ id, data }: { id: string; data: NodeData }) => {
    return (
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus />
            </Button>
          </DialogTrigger>
          <StockScreenerModal />
        </Dialog>
      </div>
    );
  }
);
