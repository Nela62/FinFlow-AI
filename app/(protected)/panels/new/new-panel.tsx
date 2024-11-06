"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { StockPicker } from "@/components/widgets/utils/stock-picker";
import { fetchStockById } from "@/lib/queries";
import {
  useInsertMutation,
  useQuery,
} from "@supabase-cache-helpers/postgrest-react-query";
import { createClient } from "@/lib/supabase/client";
import { AddWidgetComponent } from "@/components/widgets/utils/add-widget";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSidebarStore } from "@/providers/sidebarStoreProvider";
import { widgetsList } from "@/components/widgets/utils/widgets-list";
import { useRouter } from "next/navigation";

// Apple stock id
const defaultStockId = "16240d72-51ea-4f30-8e78-592e490ce0fa";

// TODO: This stock id, symbol identifier is not ideal
// TODO: Change this to a form
export const NewPanelComponent = ({ userId }: { userId: string }) => {
  const [stockId, setStockId] = useState<string>(defaultStockId);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [panelName, setPanelName] = useState<string>("");
  const { workspaceId } = useSidebarStore((state) => state);

  const supabase = createClient();

  const router = useRouter();

  const { data: stock } = useQuery(fetchStockById(supabase, stockId));
  const { mutateAsync: createPanels } = useInsertMutation(
    supabase.from("panels"),
    ["id"],
    "id"
  );
  const { mutateAsync: createWidgetGroups } = useInsertMutation(
    supabase.from("widget_groups"),
    ["id"],
    "id"
  );
  const { mutateAsync: createWidgets } = useInsertMutation(
    supabase.from("widgets"),
    ["id"],
    "id"
  );

  const handleComplete = async () => {
    if (!workspaceId) {
      console.error("No workspace id");
      return;
    }

    const panelUrl = nanoid(10);

    const panel = await createPanels([
      {
        name: panelName.length > 0 ? panelName : "New Panel",
        url: panelUrl,
        workspace_id: workspaceId,
        user_id: userId,
      },
    ]);

    if (!panel) {
      console.error("Failed to create panel");
      return;
    }

    const widgetGroups = await createWidgetGroups([
      {
        name: "Blue",
        panel_id: panel[0].id,
        user_id: userId,
        ticker_id: stockId,
      },
    ]);

    if (!widgetGroups) {
      console.error("Failed to create widget groups");
      return;
    }

    let curPosition = { x: 0, y: 0 };

    const newWidgets = widgetsList
      .filter((widget) => selectedWidgets.includes(widget.id))
      .map((widget) => {
        const widgetPosition = {
          ...curPosition,
          w: widget.width,
          h: widget.height,
        };

        if (curPosition.x + widget.width > 60) {
          widgetPosition.x = 0;
          curPosition.x = widget.width;
          widgetPosition.y += widget.height;
          curPosition.y += widget.height;
        } else {
          widgetPosition.x = curPosition.x;
          curPosition.x += widget.width;
        }

        return {
          panel_id: panel[0].id,
          user_id: userId,
          type: widget.id,
          group_id: widgetGroups[0].id,
          data: {},
          config: widget.defaultConfig,
          position: widgetPosition,
        };
      });

    await createWidgets(newWidgets);

    router.push(`/panels/${panelUrl}`);
  };

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
};
