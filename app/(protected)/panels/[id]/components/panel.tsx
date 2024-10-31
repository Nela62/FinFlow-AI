"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "@/styles/react-grid-layout.css";

import React, { useState } from "react";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { Stock, Widget } from "@/types/panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GripHorizontal,
  GripVertical,
  Maximize2,
  MoreHorizontal,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AddWidgetDrawer } from "@/components/widgets/add-widget-sidebar";
import { useSidebarStore } from "@/providers/sidebarStoreProvider";
import {
  useInsertMutation,
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";
import { createClient } from "@/lib/supabase/client";
import {
  fetchAllWidgetGroups,
  fetchAllWidgets,
  fetchPanelByUrl,
} from "@/lib/queries";
import { FinancialsWidget } from "@/components/widgets/financials";
import { StockPicker } from "@/components/widgets/stock-picker";

const ResponsiveGridLayout = WidthProvider(Responsive);

const generateLayout = (widgets: Widget[]) => {
  return widgets.map((widget) => ({
    i: widget.id,
    x: widget.position.x,
    y: widget.position.y,
    w: widget.position.w,
    h: widget.position.h,
    minW: 3,
    minH: 2,
  }));
};

export const Panel = ({
  panelUrl,
  userId,
}: {
  panelUrl: string;
  userId: string;
}) => {
  const {
    isAddWidgetOpen,
    setIsAddWidgetOpen,
    draggedWidgetType,
    setDraggedWidgetType,
  } = useSidebarStore((state) => state);

  const client = createClient();

  const { data: panelData } = useQuery(fetchPanelByUrl(client, panelUrl));
  const { data: widgetGroupsData } = useQuery(
    fetchAllWidgetGroups(client, panelUrl)
  );
  const { data: widgetsData } = useQuery(fetchAllWidgets(client, panelUrl));

  const { mutateAsync: insertWidget } = useInsertMutation(
    client.from("widgets"),
    ["id"],
    "id"
  );

  const { mutateAsync: updateWidget } = useUpdateMutation(
    client.from("widgets"),
    ["id"],
    "id"
  );

  if (!widgetsData || !panelData) return null;

  const handleLayoutChange = (layout: Layout[]) => {
    console.log(layout);
    layout.forEach((item) => {
      const curLayout = {
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
      };

      if (
        JSON.stringify(
          widgetsData.find((widget) => widget.id === item.i)?.position
        ) !== JSON.stringify(curLayout)
      ) {
        updateWidget({
          id: item.i,
          position: curLayout,
        });
      }
    });
  };

  console.log(widgetGroupsData);

  const widgets = widgetsData.map((widget) => {
    const group = widgetGroupsData?.find(
      (group) => group.id === widget.widget_groups!.id
    );

    return {
      id: widget.id,
      title: "Financials",
      content: <FinancialsWidget id={widget.id} />,
      group: { id: group?.id, name: group?.name },
      currentStock: {
        id: group?.tickers!.id,
        name: group?.tickers!.name,
        ticker: group?.tickers!.symbol,
        exchange: group?.tickers!.exchange,
        assetType: group?.tickers!.asset_type,
      },
      position: (widget.position as {
        x: number;
        y: number;
        w: number;
        h: number;
      }) || { x: 0, y: 0, w: 1, h: 1 },
    };
  });

  return (
    <Sheet open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-2 right-2 z-10"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <AddWidgetDrawer />
      <ResponsiveGridLayout
        className="layout min-h-screen w-full"
        layouts={{
          lg: generateLayout(widgets),
          md: generateLayout(widgets),
          sm: generateLayout(widgets),
        }}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 48, md: 40, sm: 31 }}
        rowHeight={40}
        margin={[8, 8]}
        onDrop={async (layoutItem) => {
          setIsAddWidgetOpen(true);
          console.log(layoutItem);
          console.log(draggedWidgetType);
          if (draggedWidgetType) {
            switch (draggedWidgetType) {
              case "metrics":
                const annualData = await fetch("/api/metrics", {
                  method: "POST",
                  body: JSON.stringify({ symbol: "AAPL" }),
                })
                  .then((res) => res.json())
                  .catch((err) => {
                    console.log(err);
                  });

                insertWidget({
                  panel_id: panelData.id,
                  user_id: userId,
                  type: "metrics",
                  group_id: widgetGroupsData?.[0].id,
                  config: { selectedTab: "income", period: "annual" },
                  data: { annual: annualData },
                  position: {
                    x: layoutItem[0].x,
                    y: layoutItem[0].y,
                    w: 24,
                    h: 10,
                  },
                });

                setDraggedWidgetType(null);
            }
          }
        }}
        containerPadding={[8, 8]}
        onLayoutChange={handleLayoutChange}
        isResizable={true}
        // isDraggable={true}
        useCSSTransforms={true}
        resizeHandles={["se"]}
        compactType="vertical"
        draggableHandle=".drag-handle"
        isDroppable={true}
      >
        {/* {...widgets.map((item: any) => <div key={item.id}>{item.content}</div>)} */}
        {widgets.map((widget) => (
          <div key={widget.id} className="relative">
            <Card className="h-full overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/90 shadow-lg">
              <CardHeader className="p-2 border-b dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 items-center justify-start">
                    <div className="cursor-move drag-handle">
                      <GripVertical className="text-zinc-400 h-4" />
                    </div>
                    <CardTitle className="text-sm font-medium dark:text-zinc-200">
                      {widget.title}
                    </CardTitle>
                    <StockPicker
                      widgetId={widget.id}
                      currentStock={widget.currentStock}
                    />
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 rounded-sm dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">
                      <RefreshCw size={14} />
                    </button>
                    <button className="p-1 rounded-sm dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">
                      <Maximize2 size={14} />
                    </button>
                    <button className="p-1 rounded-sm dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">
                      <MoreHorizontal size={14} />
                    </button>
                    <button className="p-1 rounded-sm dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-full">
                <div className="h-full w-full pb-2">{widget.content}</div>
              </CardContent>
            </Card>
          </div>
        ))}
      </ResponsiveGridLayout>
    </Sheet>
  );
};
