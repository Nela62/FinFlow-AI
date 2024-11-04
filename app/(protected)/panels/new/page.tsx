"use client";

import { useState } from "react";
import { StockPicker } from "@/components/widgets/stock-picker";
import { fetchStockById } from "@/lib/queries";
import {
  useInsertMutation,
  useQuery,
} from "@supabase-cache-helpers/postgrest-react-query";
import { createClient } from "@/lib/supabase/client";
import { AddWidgetComponent } from "@/components/widgets/add-widget";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

// Apple stock id
const defaultStockId = "16240d72-51ea-4f30-8e78-592e490ce0fa";

// TODO: This stock id, symbol identifier is not ideal
// TODO: Change this to a form
export default function NewPanelPage() {
  const [stockId, setStockId] = useState<string>(defaultStockId);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [panelName, setPanelName] = useState<string>("");
  const supabase = createClient();

  const { data: stock } = useQuery(fetchStockById(supabase, stockId));
  const { mutateAsync: createPanel } = useInsertMutation(
    supabase.from("panels"),
    ["id"],
    "id"
  );

  const handleComplete = async () => {};

  return (
    <div className="flex w-full justify-center items-center">
      <div className="space-y-4 max-w-5xl pt-2 pb-4">
        <Input
          placeholder="Panel Name"
          value={panelName}
          onChange={(e) => setPanelName(e.target.value)}
          className="text-2xl font-semibold"
        />
        <StockPicker
          currentStockTicker={stock?.symbol ?? "AAPL"}
          onStockClick={(stockId) => setStockId(stockId)}
        />
        <AddWidgetComponent
          selectedWidgets={selectedWidgets}
          setSelectedWidgets={setSelectedWidgets}
        />
        <div className="w-full flex justify-end absolute bottom-0 right-0 left-0 py-3 px-6">
          <Button onClick={handleComplete}>
            Create Panel <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
