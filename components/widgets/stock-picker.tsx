import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Stock } from "@/types/panel";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import InfiniteScroll from "../ui/infinite-scroll";

export const StockPicker = ({ currentStock }: { currentStock: Stock }) => {
  const client = createClient();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const [page, setPage] = useState(0);
  // const [hasMore, setHasMore] = useState(true);

  const fetchTickers = async () => {
    return client
      .from("tickers")
      .select("*")
      .eq("status", "active")
      .range(page * 20, page * 20 + 20)
      .throwOnError();
  };

  const { data: stocks, isLoading } = useQuery(fetchTickers(client), {
    placeholderData: keepPreviousData,
  });

  const next = async () => {
    setPage((prev) => prev + 1);
  };

  // TODO: implement hasMore
  return (
    <Dialog>
      <DialogTrigger>{currentStock.ticker}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Symbol or company"
              type="search"
            />
          </div>
          <div className="flex items-center justify-between">
            <Tabs defaultValue="equity" className="w-[300px]">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="equity">Equity</TabsTrigger>
                <TabsTrigger value="funds">Funds</TabsTrigger>
              </TabsList>
            </Tabs>
            {/* <Button variant="outline" size="sm">
              Sources
            </Button> */}
          </div>
          <div className="space-y-4">
            <InfiniteScroll isLoading={isLoading} hasMore={true} next={next}>
              {stocks?.map((stock) => (
                <div key={stock.symbol}>{stock.symbol}</div>
              ))}
            </InfiniteScroll>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
