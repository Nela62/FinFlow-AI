"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "@/styles/react-grid-layout.css";

import _ from "lodash";
import React, { useState } from "react";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import GridLayout from "react-grid-layout";
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
  useUpsertMutation,
} from "@supabase-cache-helpers/postgrest-react-query";
import { createClient } from "@/lib/supabase/client";
import {
  fetchAllWidgetGroups,
  fetchAllWidgets,
  fetchPanelByUrl,
} from "@/lib/queries";
import { FinancialsWidget } from "@/components/widgets/financials";
import { StockPicker } from "@/components/widgets/stock-picker";
import TechnicalAnalysisWidget from "@/components/widgets/technical-analysis";
import StockScreenerWidget from "@/components/widgets/stock-screener";

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

const getWidgetInfo = (type: string, props: any) => {
  switch (type) {
    default:
    case "metrics":
      return { title: "Financials", content: <FinancialsWidget {...props} /> };
    case "technical_analysis":
      return {
        title: "Technical Analysis",
        content: <TechnicalAnalysisWidget {...props} />,
      };
    case "stock_screener":
      return {
        title: "Stock Screener",
        content: <StockScreenerWidget {...props} />,
      };
  }
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

  // FIX: make sure that it doesn't keep updating when the element is being dragged
  const handleLayoutChange = async (layout: Layout[]) => {
    console.log(layout);

    const newData = [];

    for (const item of layout) {
      const newPosition = {
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
      };

      const curPosition = widgetsData.find(
        (widget) => widget.id === item.i
      )?.position;

      if (!_.isEqual(curPosition, newPosition)) {
        console.log(
          "updating widget ",
          item.i,
          "from ",
          curPosition,
          "to ",
          newPosition
        );

        await updateWidget({
          id: item.i,
          position: newPosition,
        });
      }
    }
  };

  if (!widgetGroupsData) return null;

  const widgets = widgetsData.map((widget) => {
    const group = widgetGroupsData.find(
      (group) => group.id === widget.widget_groups!.id
    );

    const currentStock = {
      id: group!.tickers!.id,
      name: group!.tickers!.name,
      ticker: group!.tickers!.symbol,
      exchange: group!.tickers!.exchange,
      assetType: group!.tickers!.asset_type,
    };

    const widgetInfo = getWidgetInfo(widget.type, {
      id: widget.id,
      currentStock,
    });

    return {
      id: widget.id,
      title: widgetInfo.title,
      content: widgetInfo.content,
      group: { id: group?.id, name: group?.name },
      currentStock,
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
      <GridLayout
        className="layout min-h-screen w-full"
        layout={generateLayout(widgets)}
        // breakpoints={{ md: 996, sm: 768 }}
        cols={50}
        rowHeight={40}
        margin={[8, 8]}
        onDrop={async (layoutItem) => {
          setIsAddWidgetOpen(true);
          console.log("LAYOUT ITEM", layoutItem);

          if (draggedWidgetType) {
            switch (draggedWidgetType) {
              case "metrics":
                const annualData = await fetch("/api/metrics", {
                  method: "POST",
                  body: JSON.stringify({ symbol: "AAPL", income: true }),
                })
                  .then((res) => res.json())
                  .catch((err) => {
                    console.log(err);
                  });

                if (!widgetGroupsData?.[0].id) return;

                insertWidget([
                  {
                    panel_id: panelData.id,
                    user_id: userId,
                    type: draggedWidgetType,
                    group_id: widgetGroupsData?.[0].id,
                    config: { selectedTab: "income", period: "annual" },
                    data: { annual: annualData },
                    position: {
                      x: layoutItem[0].x,
                      y: layoutItem[0].y,
                      w: 24,
                      h: 10,
                    },
                  },
                ]);

                setDraggedWidgetType(null);
                break;
              case "technical_analysis":
              case "stock_screener":
                if (!widgetGroupsData?.[0].id) return;

                insertWidget([
                  {
                    panel_id: panelData.id,
                    user_id: userId,
                    type: draggedWidgetType,
                    group_id: widgetGroupsData?.[0].id,
                    data: {},
                    config: {},
                    position: {
                      x: layoutItem[0].x,
                      y: layoutItem[0].y,
                      w: 24,
                      h: 10,
                    },
                  },
                ]);

                setDraggedWidgetType(null);
                break;
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
        {widgets.map((widget) => (
          <div key={widget.id} className="relative">
            <Card className="h-full overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/90 shadow-sm">
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
      </GridLayout>
    </Sheet>
  );
};
