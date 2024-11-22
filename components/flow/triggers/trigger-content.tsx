import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trigger } from "../toolbar";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SecFilingTypeSelector } from "./sec-filing-type";
import { StockPicker } from "@/components/widgets/utils/stock-picker";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { fetchStockById } from "@/lib/queries";
import { EarningsCallTypeSelector } from "./earnings-call";
import { NewsAlertCategoriesSelector } from "./news-alert-categories";
import { ByMetricSelector } from "./by-metric";

export const TriggerContent = ({
  addTrigger,
}: {
  addTrigger: (trigger: Trigger) => void;
}) => {
  const [stockSymbol, setStockSymbol] = useState<string>("AAPL");
  const [stockId, setStockId] = useState<string | null>(null);
  const [tab, setTab] = useState<string>("sec-filing");
  const [trigger, setTrigger] = useState<Trigger | null>(null);

  const supabase = createClient();
  const { data: stock } = useQuery(fetchStockById(supabase, stockId ?? ""), {
    enabled: !!stockId,
  });

  useEffect(() => {
    if (stock) {
      setStockSymbol(stock.symbol);
      setTrigger((state) =>
        state
          ? {
              ...state,
              config: { ...state?.config, stockSymbol: stock.symbol },
            }
          : null
      );
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
            <div className="flex flex-col gap-2 w-fit">
              <Label className="text-sm font-semibold">Company</Label>
              <StockPicker
                currentStockTicker={stockSymbol}
                onStockClick={(stockId) => {
                  setStockId(stockId);
                }}
              />
            </div>
            <SecFilingTypeSelector setTrigger={setTrigger} />
          </div>
        </TabsContent>
        <TabsContent value="earnings-call">
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2 w-fit">
              <Label className="text-sm font-semibold">Company</Label>
              <StockPicker
                currentStockTicker={stockSymbol}
                onStockClick={(stockId) => {
                  setStockId(stockId);
                }}
              />
            </div>
            <EarningsCallTypeSelector setTrigger={setTrigger} />
          </div>
        </TabsContent>
        <TabsContent value="news-alert">
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2 w-fit">
              <Label className="text-sm font-semibold">Company</Label>
              <StockPicker
                currentStockTicker={stockSymbol}
                onStockClick={(stockId) => {
                  setStockId(stockId);
                }}
              />
            </div>
            <NewsAlertCategoriesSelector setTrigger={setTrigger} />
          </div>
        </TabsContent>
        <TabsContent value="by-metric">
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2 w-fit">
              <Label className="text-sm font-semibold">Company</Label>
              <StockPicker
                currentStockTicker={stockSymbol}
                onStockClick={(stockId) => {
                  setStockId(stockId);
                }}
              />
            </div>
            <ByMetricSelector setTrigger={setTrigger} />
          </div>
        </TabsContent>
      </Tabs>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            onClick={() =>
              trigger &&
              addTrigger({
                ...trigger,
                config: { ...trigger.config, symbol: stockSymbol },
              })
            }
          >
            Create
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};
