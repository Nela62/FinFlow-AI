"use client";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "@/styles/react-grid-layout.css";

import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Widget } from "@/types/panel";
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

export const Panel = ({ widgets }: { widgets: Widget[] }) => {
  const { isAddWidgetOpen, setIsAddWidgetOpen } = useSidebarStore(
    (state) => state
  );
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
        className="layout"
        layouts={{
          lg: generateLayout(widgets),
          md: generateLayout(widgets),
          sm: generateLayout(widgets),
        }}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 48, md: 40, sm: 31 }}
        rowHeight={40}
        margin={[8, 8]}
        onDrop={() => {
          setIsAddWidgetOpen(true);
        }}
        containerPadding={[8, 8]}
        // onLayoutChange={handleLayoutChange}
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
                <div className="h-full w-full">{widget.content}</div>
              </CardContent>
            </Card>
          </div>
        ))}
      </ResponsiveGridLayout>
    </Sheet>
  );
};
