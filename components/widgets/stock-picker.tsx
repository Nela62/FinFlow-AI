import { createClient } from "@/lib/supabase/client";
import {
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Stock } from "@/types/panel";
import { Loader2, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import InfiniteScroll from "../ui/infinite-scroll";
import { TypedSupabaseClient } from "@/types/supabase";
import { fetchAllWidgets, fetchWidgetById } from "@/lib/queries";

export const StockPicker = ({
  widgetId,
  currentStock,
}: {
  widgetId: string;
  currentStock: Stock;
}) => {
  const client = createClient();
  const queryClient = useQueryClient();

  const { data: widget } = useQuery(fetchWidgetById(client, widgetId));

  const { mutateAsync: updateWidgetGroup } = useUpdateMutation(
    client.from("widget_groups"),
    ["id"],
    "id"
  );

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("equity");

  // const [page, setPage] = useState(0);
  // const [hasMore, setHasMore] = useState(true);

  const fetchTickers = (
    client: TypedSupabaseClient,
    search: string,
    tab: string
  ) => {
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
  };

  const { data: stocks, isLoading } = useQuery(
    fetchTickers(client, search, tab)
  );

  const widgetGroupId = widget?.widget_groups?.id;

  if (!widgetGroupId) return null;

  return (
    <Dialog>
      <DialogTrigger>{currentStock.ticker}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[80vh]">
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
                  updateWidgetGroup({
                    id: widgetGroupId,
                    ticker_id: stock.id,
                  });

                  queryClient.invalidateQueries({
                    queryKey: ["widgets"],
                    refetchType: "all",
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["widget_groups"],
                    refetchType: "all",
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["panels"],
                    refetchType: "all",
                  });

                  // Force refetch the specific queries used in Panel component
                  // await queryClient.refetchQueries({
                  //   queryKey: ["widgets", panelUrl],
                  //   exact: true,
                  // });
                  // await queryClient.refetchQueries({
                  //   queryKey: ["widget_groups", panelData?.id],
                  //   exact: true,
                  // });
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
