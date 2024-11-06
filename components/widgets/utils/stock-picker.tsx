import { createClient } from "@/lib/supabase/client";
import {
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Stock } from "@/types/panel";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useCallback, useState } from "react";
import { TypedSupabaseClient } from "@/types/supabase";
import { fetchStockByTicker, fetchWidgetById } from "@/lib/queries";

export const StockPicker = ({
  widgetId,
  currentStockTicker,
  onStockClick,
}: {
  widgetId?: string;
  currentStockTicker: string;
  onStockClick: (stockId: string) => void;
}) => {
  const client = createClient();

  const { data: widget } = useQuery(fetchWidgetById(client, widgetId ?? ""), {
    enabled: !!widgetId,
  });
  const { data: currentStock } = useQuery(
    fetchStockByTicker(client, currentStockTicker)
  );

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("equity");

  // const [page, setPage] = useState(0);
  // const [hasMore, setHasMore] = useState(true);

  const fetchTickers = useCallback(
    (client: TypedSupabaseClient, search: string, tab: string) => {
      const query = client
        .from("tickers")
        .select("id, symbol, name, exchange, asset_type, status")
        .eq("status", "Active")
        .in(
          "asset_type",
          tab === "all"
            ? ["ETF", "Stock"]
            : tab === "equity"
              ? ["Stock"]
              : ["ETF"]
        )
        .limit(10)
        .throwOnError();

      if (search) return query.ilike("display_name", `%${search}%`);

      return query;
    },
    [client, search, tab] // Dependencies for useCallback
  );

  // TODO: Add a dialog title

  const { data: stocks, isLoading } = useQuery(
    fetchTickers(client, search, tab)
  );

  const widgetGroupId = widget?.widget_groups?.id;

  if (!currentStock) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        setSearch("");
      }}
    >
      <DialogTrigger className="bg-accent-foreground/10 hover:bg-accent-foreground/20 py-1 px-2 rounded-full ml-2">
        <p className="text-xs text-accent-foreground">
          {currentStock.symbol} • {currentStock.exchange}
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[562px] ">
        <VisuallyHidden.Root>
          <DialogTitle>Select a stock</DialogTitle>
        </VisuallyHidden.Root>
        <div className="space-y-4">
          <div className="relative mr-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Symbol or company"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Tabs value={tab} onValueChange={setTab} className="w-[300px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="equity">Equity</TabsTrigger>
                <TabsTrigger value="funds">Funds</TabsTrigger>
              </TabsList>
            </Tabs>
            {/* <Button variant="outline" size="sm">
              Sources
            </Button> */}
          </div>
          {/* <ScrollArea className="h-[500px]"> */}
          <div>
            {stocks?.map((stock) => (
              <div
                key={stock.symbol}
                className="flex justify-between p-2 hover:bg-muted/100 items-center cursor-pointer"
                onClick={() => {
                  onStockClick(stock.id);
                  setIsOpen(false);
                  setSearch("");
                }}
              >
                <div className="flex gap-2 items-center">
                  <p className="font-semibold">{stock.symbol}</p>
                  <p className="text-muted-foreground text-sm">
                    {stock.name.length > 30
                      ? stock.name.slice(0, 30) + "..."
                      : stock.name}
                  </p>
                </div>
                <p className="text-muted-foreground">
                  {stock.exchange} • {stock.asset_type}
                </p>
              </div>
            ))}
          </div>
          {/* <InfiniteScroll isLoading={isLoading} hasMore={true} next={next}>
              {<Loader2 className="my-4 h-8 w-8 animate-spin" />}
            </InfiniteScroll> */}
          {/* </ScrollArea> */}

          {/* {stocks?.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <img
                    alt={`${stock.name} logo`}
                    className="h-10 w-10 rounded-full"
                    src={stock.logo}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{stock.symbol}</span>
                      <span className="text-sm text-muted-foreground">
                        {stock.name}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      US • NASDAQ • Common stocks
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    $ {stock.price.toFixed(2)}
                  </div>
                  <div
                    className={
                      stock.change >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)} • {stock.changePercent.toFixed(2)}
                    %
                  </div>
                </div>
              </div>
            ))} */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
