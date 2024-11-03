"use client";

import { useState } from "react";
import { StockPicker } from "@/components/widgets/stock-picker";
import { fetchStockById } from "@/lib/queries";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { createClient } from "@/lib/supabase/client";
import { AddWidgetComponent } from "@/components/widgets/add-widget";
import { Button } from "@/components/ui/button";

// Apple stock id
const defaultStockId = "16240d72-51ea-4f30-8e78-592e490ce0fa";

// TODO: This stock id, symbol identifier is not ideal

export default function NewPanelPage() {
  const [stockId, setStockId] = useState<string>(defaultStockId);
  const supabase = createClient();

  const { data: stock } = useQuery(fetchStockById(supabase, stockId));

  return (
    <div className="flex w-full justify-center items-center">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">New Panel</h2>
        <StockPicker
          currentStockTicker={stock?.symbol ?? "AAPL"}
          onStockClick={(stockId) => setStockId(stockId)}
        />
        <AddWidgetComponent onComplete={async () => {}} />
        <div className="w-full flex justify-end">
          <Button>Create</Button>
        </div>
      </div>
    </div>
  );
}
