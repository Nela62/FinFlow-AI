"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "@/styles/react-grid-layout.css";

import _ from "lodash";
import React, { useCallback, useMemo } from "react";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import { Widget } from "@/types/panel";
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
import { FundamentalDataWidget } from "@/components/widgets/fundamental-data";
import { StockPicker } from "@/components/widgets/utils/stock-picker";
import StockScreenerWidget from "@/components/widgets/stock-screener";
import TechnicalAnalysisWidget from "@/components/widgets/technical-analysis";
import { widgetsList } from "@/components/widgets/utils/widgets-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GripVertical,
  Maximize2,
  MoreHorizontal,
  RefreshCw,
  X,
} from "lucide-react";

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
  const client = createClient();
  console.log("rendering panel", panelUrl);

  const { data: panelData, error: panelError } = useQuery(
    fetchPanelByUrl(client, panelUrl)
  );

  const panelId = panelData?.id;
  const { data: widgetGroupsData, error: widgetGroupsError } = useQuery(
    fetchAllWidgetGroups(client, panelId ?? ""),
    { enabled: !!panelId }
  );
  const { data: widgetsData, error: widgetsError } = useQuery(
    fetchAllWidgets(client, panelId ?? ""),
    { enabled: !!panelId }
  );

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

  const { mutateAsync: updateWidgetGroup } = useUpdateMutation(
    client.from("widget_groups"),
    ["id"],
    "id"
  );
  // FIX: make sure that it doesn't keep updating when the element is being dragged
  const handleLayoutChange = useCallback(
    async (layout: Layout[]) => {
      try {
        console.log("LAYOUT ", layout);

        const newData = [];

        for (const item of layout) {
          const newPosition = {
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
          };

          const curPosition = widgetsData?.find(
            (widget) => widget.id === item.i
          )?.position;

          if (
            !_.isEqual(curPosition, newPosition) &&
            item.i !== "__dropping-elem__"
          ) {
            console.log(
              "updating widget ",
              item.i,
              "from ",
              curPosition,
              "to ",
              newPosition
            );

            const res = await updateWidget({
              id: item.i,
              position: newPosition,
            });

            console.log("update widget res ", res);
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    [widgetsData, updateWidget]
  );

  const groupStockMap = useMemo(() => {
    return widgetGroupsData?.reduce(
      (acc, group) => {
        acc[group.id] = {
          id: group.tickers!.id,
          name: group.tickers!.name,
          ticker: group.tickers!.symbol,
          exchange: group.tickers!.exchange,
          assetType: group.tickers!.asset_type,
        };
        return acc;
      },
      {} as Record<
        string,
        {
          id: string;
          name: string;
          ticker: string;
          exchange: string;
          assetType: string;
        }
      >
    );
  }, [widgetGroupsData]);

  const widgets = useMemo(() => {
    return widgetsData?.map((widget) => {
      const group = widgetGroupsData?.find(
        (group) => group.id === widget.widget_groups!.id
      );

      const widgetInfo = widgetsList.find((w) => w.id === widget.type);

      if (!widgetInfo) {
        throw new Error(`Widget info not found for widget type ${widget.type}`);
      }

      const onStockClick = (stockId: string) =>
        updateWidgetGroup({
          id: widget.widget_groups?.id ?? "",
          ticker_id: stockId,
        });

      return {
        id: widget.id,
        title: widgetInfo.name,
        content: (
          <widgetInfo.component currentStock={groupStockMap?.[group!.id]} />
        ),
        group: { id: group?.id, name: group?.name },
        currentStock: groupStockMap?.[group!.id],
        position: widget.position as {
          x: number;
          y: number;
          w: number;
          h: number;
        },
        onStockClick,
      };
    });
  }, [widgetsData, widgetGroupsData, groupStockMap, updateWidgetGroup]);

  if (
    !widgetsData ||
    !panelData ||
    !widgetGroupsData ||
    !widgets ||
    !groupStockMap
  ) {
    return <div>Loading...</div>;
  }

  return (
    <ResponsiveGridLayout
      className="layout min-h-screen w-full"
      layouts={{
        lg: generateLayout(widgets),
      }}
      breakpoints={{ lg: 1200, md: 996, sm: 768 }}
      cols={{ lg: 60, md: 60, sm: 60 }}
      rowHeight={30}
      margin={[8, 8]}
      // onDrop={async (layoutItem) => {
      //   setIsAddWidgetOpen(true);
      //   console.log("LAYOUT ITEM", layoutItem);

      //   if (draggedWidgetType) {
      //     switch (draggedWidgetType) {
      //       case "metrics":
      //         const annualData = await fetch("/api/metrics", {
      //           method: "POST",
      //           body: JSON.stringify({ symbol: "AAPL", income: true }),
      //         })
      //           .then((res) => res.json())
      //           .catch((err) => {
      //             console.log(err);
      //           });

      //         if (!widgetGroupsData?.[0].id) return;

      //         insertWidget([
      //           {
      //             panel_id: panelData.id,
      //             user_id: userId,
      //             type: draggedWidgetType,
      //             group_id: widgetGroupsData?.[0].id,
      //             config: { selectedTab: "income", period: "annual" },
      //             data: { annual: annualData },
      //             position: {
      //               x: layoutItem[0].x,
      //               y: layoutItem[0].y,
      //               w: 24,
      //               h: 10,
      //             },
      //           },
      //         ]);

      //         setDraggedWidgetType(null);
      //         break;
      //       case "technical_analysis":
      //       case "stock_screener":
      //         if (!widgetGroupsData?.[0].id) return;

      //         insertWidget([
      //           {
      //             panel_id: panelData.id,
      //             user_id: userId,
      //             type: draggedWidgetType,
      //             group_id: widgetGroupsData?.[0].id,
      //             data: {},
      //             config: {},
      //             position: {
      //               x: layoutItem[0].x,
      //               y: layoutItem[0].y,
      //               w: 24,
      //               h: 10,
      //             },
      //           },
      //         ]);

      //         setDraggedWidgetType(null);
      //         break;
      //     }
      //   }
      // }}
      containerPadding={[8, 8]}
      onLayoutChange={handleLayoutChange}
      isResizable={true}
      // isDraggable={true}
      useCSSTransforms={true}
      resizeHandles={["se"]}
      // compactType=
      draggableHandle=".drag-handle"
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
                    currentStockTicker={widget.currentStock?.ticker ?? "AAPL"}
                    onStockClick={widget.onStockClick}
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
  );
};
