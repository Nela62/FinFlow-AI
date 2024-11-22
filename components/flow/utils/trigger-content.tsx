import { v4 as uuidv4 } from "uuid";
import Select from "react-tailwindcss-select";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trigger } from "../toolbar";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { SecFilingTypeSelector } from "./sec-filing-type";
import { StockPicker } from "@/components/widgets/utils/stock-picker";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { fetchStockById } from "@/lib/queries";

export const TriggerContent = ({
  addTrigger,
}: {
  addTrigger: (trigger: Trigger) => void;
}) => {
  const [stockSymbol, setStockSymbol] = useState<string>("AAPL");
  const [stockId, setStockId] = useState<string | null>(null);
  const [tab, setTab] = useState<string>("sec-filing");

  const supabase = createClient();
  const { data: stock } = useQuery(fetchStockById(supabase, stockId ?? ""), {
    enabled: !!stockId,
  });

  useEffect(() => {
    if (stock) {
      setStockSymbol(stock.symbol);
    }
  }, [stock]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Trigger</DialogTitle>
      </DialogHeader>
      <Tabs defaultValue="sec-filing" value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="sec-filing">SEC Filing</TabsTrigger>
          <TabsTrigger value="earnings-call">Earnings Call</TabsTrigger>
          <TabsTrigger value="news-alert">News Alert</TabsTrigger>
          <TabsTrigger value="by-metric">By Metric</TabsTrigger>
        </TabsList>
        <TabsContent value="sec-filing">
          <div className="space-y-4 py-4">
            <SecFilingTypeSelector />
            <div className="flex flex-col gap-2 w-fit">
              <Label className="text-sm font-semibold">Company</Label>
              <StockPicker
                currentStockTicker={stockSymbol}
                onStockClick={(stockId) => {
                  setStockId(stockId);
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <DialogFooter>
        <Button>Create</Button>
      </DialogFooter>
    </DialogContent>
  );
};
