"use client";

import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { SortableWidget, SortableWidgetProps } from "./sortable-widget";
import { Fragment, useState } from "react";
import { Direction } from "react-resizable-panels/dist/declarations/src/types";
import { Widget } from "@/types/panel";

export type DraggablePanelProps = {
  widgets: Widget[];
  className?: string;
  handlePanelResize: (sizes: any) => void;
  direction?: Direction;
};

export const DraggablePanel = ({
  widgets,
  className,
  handlePanelResize,
  direction = "horizontal",
}: DraggablePanelProps) => {
  const [items, setItems] = useState(widgets);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className={cn("w-full h-full bg-slate-900 p-4", className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={horizontalListSortingStrategy}>
          <ResizablePanelGroup
            direction={direction as Direction}
            className="w-full rounded-lg border border-slate-700"
            onLayout={handlePanelResize}
          >
            {items.map((widget, index) => (
              <Fragment key={widget.id}>
                <ResizablePanel
                  defaultSize={widget.defaultSize || 100 / items.length}
                >
                  <SortableWidget
                    id={widget.id}
                    defaultHeight={widget.defaultHeight}
                    className={widget.className}
                  >
                    {widget.content}
                  </SortableWidget>
                </ResizablePanel>
                {index < items.length - 1 && (
                  <ResizableHandle className="bg-slate-700 hover:bg-slate-600 transition-colors" />
                )}
              </Fragment>
            ))}
          </ResizablePanelGroup>
        </SortableContext>
      </DndContext>
    </div>
  );
};
